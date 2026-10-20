import express, { Request, Response, NextFunction } from 'express';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth as getFirebaseAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore, FieldValue } from 'firebase-admin/firestore';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { lookupMM2Item, synthesizeMM2Item, MM2_ENCYCLOPEDIA, MM2ItemWithoutId } from './src/data/mm2Encyclopedia';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Admin API authentication is verified on the server. Never trust a client-side role.
const ADMIN_EMAILS = new Set(['mm2ultimatehub@gmail.com', 'huseynoveleddin87@gmail.com']);
function getAdminAuth() {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!rawServiceAccount) return null;
  try {
    const serviceAccount = JSON.parse(rawServiceAccount);
    const adminApp = getApps().find((candidate) => candidate.name === 'harikascript-admin')
      ?? initializeApp({ credential: cert(serviceAccount) }, 'harikascript-admin');
    return getFirebaseAdminAuth(adminApp);
  } catch (error) {
    console.error('Firebase Admin configuration is invalid:', error);
    return null;
  }
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminAuth = getAdminAuth();
  if (!adminAuth) {
    return res.status(503).json({ success: false, error: 'Sunucu yönetici kimlik doğrulaması yapılandırılmamış.' });
  }
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) return res.status(401).json({ success: false, error: 'Oturum doğrulaması gerekli.' });
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const email = (decoded.email || '').toLowerCase();
    const provider = (decoded.firebase as { sign_in_provider?: string } | undefined)?.sign_in_provider;
    if (!decoded.email_verified || !ADMIN_EMAILS.has(email) || provider !== 'google.com') {
      return res.status(403).json({ success: false, error: 'Bu işlem için doğrulanmış yönetici hesabı gerekli.' });
    }
    return next();
  } catch {
    return res.status(401).json({ success: false, error: 'Oturum geçersiz veya süresi dolmuş. Yeniden giriş yap.' });
  }
}

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// In-memory data store for server-authoritative state
let serverData = {
  verifiedDiscordMembers: new Set<string>(),
  verifiedYouTubeSubs: new Set<string>(),
  aiCache: new Map<string, { response: string, timestamp: number }>()
};

// API: Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'HarikaScript',
    timestamp: new Date().toISOString()
  });
});


// Authenticated user context for economy endpoints. Client-supplied UID, prices,
// rewards, balances and random outcomes are never trusted.
function getAdminApp() {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!rawServiceAccount) return null;
  try {
    const serviceAccount = JSON.parse(rawServiceAccount);
    return getApps().find((candidate) => candidate.name === 'harikascript-admin')
      ?? initializeApp({ credential: cert(serviceAccount) }, 'harikascript-admin');
  } catch (error) {
    console.error('Firebase Admin configuration is invalid:', error);
    return null;
  }
}

async function requireUser(req: Request, res: Response, next: NextFunction) {
  const adminApp = getAdminApp();
  if (!adminApp) return res.status(503).json({ success: false, error: 'Sunucu Firebase doğrulaması yapılandırılmamış.' });
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) return res.status(401).json({ success: false, error: 'Oturum doğrulaması gerekli.' });
  try {
    const decoded = await getFirebaseAdminAuth(adminApp).verifyIdToken(token);
    if (!decoded.email || decoded.email_verified !== true) {
      return res.status(403).json({ success: false, error: 'Doğrulanmış e-posta hesabı gerekli.' });
    }
    (req as Request & { verifiedUser?: { uid: string; email: string } }).verifiedUser = {
      uid: decoded.uid,
      email: decoded.email.toLowerCase()
    };
    return next();
  } catch {
    return res.status(401).json({ success: false, error: 'Oturum geçersiz veya süresi dolmuş.' });
  }
}

// Server-authoritative economy operations. Firestore transactions prevent
// double-claims and concurrent purchases from spending the same balance twice.
app.post('/api/economy/transaction', requireUser, async (req: Request, res: Response) => {
  const verified = (req as Request & { verifiedUser?: { uid: string; email: string } }).verifiedUser;
  if (!verified) return res.status(401).json({ success: false, error: 'Oturum doğrulanamadı.' });
  const { action, itemId } = req.body ?? {};
  if (!['daily_claim', 'buy_cosmetic', 'unlock_script'].includes(action)) {
    return res.status(400).json({ success: false, error: 'Desteklenmeyen veya güvenli şekilde doğrulanamayan işlem.' });
  }
  const adminApp = getAdminApp();
  if (!adminApp) return res.status(503).json({ success: false, error: 'Ekonomi servisi yapılandırılmamış.' });
  const db = getAdminFirestore(adminApp);
  const userRef = db.collection('users').doc(verified.uid);
  try {
    const result = await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);
      if (!userSnap.exists) throw new Error('USER_PROFILE_NOT_FOUND');
      const user = userSnap.data()!;
      if (user.email?.toLowerCase() !== verified.email || user.isBanned === true) {
        throw new Error('ACCOUNT_NOT_ELIGIBLE');
      }
      const coins = Number.isSafeInteger(user.coins) && user.coins >= 0 ? user.coins : 0;
      const completedTaskIds: string[] = Array.isArray(user.completedTaskIds) ? user.completedTaskIds : [];
      const inventory: string[] = Array.isArray(user.inventory) ? user.inventory : [];
      const unlockedScriptIds: string[] = Array.isArray(user.unlockedScriptIds) ? user.unlockedScriptIds : [];
      if (action === 'daily_claim') {
        const today = new Date().toISOString().slice(0, 10);
        if (user.lastDailyClaim === today) throw new Error('DAILY_ALREADY_CLAIMED');
        tx.update(userRef, { coins: coins + 100, lastDailyClaim: today, updatedAt: FieldValue.serverTimestamp() });
        return { coins: coins + 100, reward: 100, lastDailyClaim: today };
      }
      if (typeof itemId !== 'string' || !/^[a-zA-Z0-9_-]{1,120}$/.test(itemId)) throw new Error('INVALID_ITEM_ID');
      const collectionName = action === 'buy_cosmetic' ? 'cosmetics' : 'scripts';
      const itemRef = db.collection(collectionName).doc(itemId);
      const itemSnap = await tx.get(itemRef);
      if (!itemSnap.exists) throw new Error('ITEM_NOT_FOUND');
      const item = itemSnap.data()!;
      const price = item.price;
      if (!Number.isSafeInteger(price) || price < 0 || price > 100000000) throw new Error('INVALID_CATALOG_PRICE');
      if (action === 'buy_cosmetic') {
        if (inventory.includes(itemId)) throw new Error('ITEM_ALREADY_OWNED');
        if (coins < price) throw new Error('INSUFFICIENT_COINS');
        const patch: Record<string, unknown> = { coins: coins - price, inventory: [...inventory, itemId], updatedAt: FieldValue.serverTimestamp() };
        if (item.type === 'frame' && !user.equippedFrameId) patch.equippedFrameId = itemId;
        if (item.type === 'effect' && !user.equippedEffectId) patch.equippedEffectId = itemId;
        tx.update(userRef, patch);
        return { coins: coins - price, inventory: patch.inventory, purchasedItemId: itemId };
      }
      if (unlockedScriptIds.includes(itemId) || price === 0) return { coins, unlockedScriptIds, alreadyUnlocked: true };
      if (coins < price) throw new Error('INSUFFICIENT_COINS');
      tx.update(userRef, { coins: coins - price, unlockedScriptIds: [...unlockedScriptIds, itemId], updatedAt: FieldValue.serverTimestamp() });
      return { coins: coins - price, unlockedScriptIds: [...unlockedScriptIds, itemId], unlockedItemId: itemId };
    });
    return res.json({ success: true, result });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'ECONOMY_TRANSACTION_FAILED';
    const status = ['USER_PROFILE_NOT_FOUND'].includes(code) ? 404 :
      ['DAILY_ALREADY_CLAIMED', 'ITEM_ALREADY_OWNED', 'INSUFFICIENT_COINS'].includes(code) ? 409 :
      ['ACCOUNT_NOT_ELIGIBLE'].includes(code) ? 403 :
      ['INVALID_ITEM_ID', 'INVALID_CATALOG_PRICE', 'ITEM_NOT_FOUND'].includes(code) ? 400 : 500;
    if (status === 500) console.error('Economy transaction failed:', error);
    return res.status(status).json({ success: false, error: ({
      USER_PROFILE_NOT_FOUND: 'Kullanıcı profili bulunamadı.',
      ACCOUNT_NOT_ELIGIBLE: 'Bu hesap işlem yapamaz.',
      DAILY_ALREADY_CLAIMED: 'Günlük ödül bugün zaten alındı.',
      ITEM_ALREADY_OWNED: 'Bu kozmetik zaten envanterinizde.',
      INSUFFICIENT_COINS: 'Yetersiz Coin bakiyesi.',
      INVALID_ITEM_ID: 'Geçersiz ürün kimliği.',
      INVALID_CATALOG_PRICE: 'Katalog fiyatı geçersiz.',
      ITEM_NOT_FOUND: 'Ürün sunucu kataloğunda bulunamadı.'
    } as Record<string, string>)[code] || 'Ekonomi işlemi tamamlanamadı.' });
  }
});

// API: Verify Task
app.post('/api/verify-task', async (req: Request, res: Response) => {
  try {
    const { taskId, userId, taskType } = req.body ?? {};

    if (!taskId || !userId) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'taskId ve userId gereklidir'
      });
    }

    // Fail closed: this endpoint currently has no trusted provider verification.
    // Never return verified=true based only on a client-supplied task/user ID.
    return res.status(501).json({
      success: false,
      verified: false,
      error: 'Görev ödülü güvenli şekilde doğrulanamıyor; gerçek doğrulama entegrasyonu tamamlanana kadar ödül verilmedi.'
    });
  } catch (error: unknown) {
    console.error('Verify task error:', error);
    const message = error instanceof Error ? error.message : 'Doğrulama hatası';
    return res.status(500).json({ success: false, verified: false, error: message });
  }
});

// Helper: Generate custom procedural SVG frame for avatar overlay
function generateSvgFrame(promptText: string, primaryColor: string = '#a855f7', secondaryColor: string = '#ec4899'): string {
  const p = promptText.toLowerCase();

  if (p.includes('ejder') || p.includes('dragon') || p.includes('ateş') || p.includes('flame') || p.includes('alev')) {
    return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryColor}" />
          <stop offset="100%" stop-color="${secondaryColor}" />
        </linearGradient>
        <filter id="glowD" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="46" stroke="url(#dragonGrad)" stroke-width="4" stroke-dasharray="8 4" filter="url(#glowD)"/>
      <circle cx="50" cy="50" r="42" stroke="${primaryColor}" stroke-width="2" opacity="0.8"/>
      <path d="M50 2 L56 16 L44 16 Z" fill="${secondaryColor}" filter="url(#glowD)"/>
      <path d="M30 8 L38 20 L24 20 Z" fill="${primaryColor}"/>
      <path d="M70 8 L76 20 L62 20 Z" fill="${primaryColor}"/>
      <circle cx="50" cy="95" r="4" fill="${secondaryColor}"/>
      <circle cx="20" cy="80" r="3" fill="${primaryColor}"/>
      <circle cx="80" cy="80" r="3" fill="${primaryColor}"/>
    </svg>`;
  }

  if (p.includes('portal') || p.includes('kuantum') || p.includes('siber') || p.includes('cyber') || p.includes('matrix')) {
    return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryColor}" />
          <stop offset="50%" stop-color="${secondaryColor}" />
          <stop offset="100%" stop-color="${primaryColor}" />
        </linearGradient>
        <filter id="glowP" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="47" stroke="url(#portalGrad)" stroke-width="3" stroke-dasharray="12 6" filter="url(#glowP)"/>
      <circle cx="50" cy="50" r="43" stroke="${secondaryColor}" stroke-width="1.5" stroke-dasharray="6 3"/>
      <circle cx="50" cy="3" r="3.5" fill="${primaryColor}" filter="url(#glowP)"/>
      <circle cx="97" cy="50" r="3.5" fill="${secondaryColor}" filter="url(#glowP)"/>
      <circle cx="50" cy="97" r="3.5" fill="${primaryColor}" filter="url(#glowP)"/>
      <circle cx="3" cy="50" r="3.5" fill="${secondaryColor}" filter="url(#glowP)"/>
    </svg>`;
  }

  if (p.includes('kral') || p.includes('tac') || p.includes('altın') || p.includes('gold') || p.includes('crown')) {
    return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#facc15" />
          <stop offset="100%" stop-color="#eab308" />
        </linearGradient>
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="45" stroke="url(#goldGrad)" stroke-width="4" filter="url(#goldGlow)"/>
      <path d="M35 15 L42 2 L50 12 L58 2 L65 15 Z" fill="url(#goldGrad)" filter="url(#goldGlow)"/>
      <circle cx="50" cy="8" r="2.5" fill="#ef4444"/>
      <circle cx="42" cy="5" r="2" fill="#ef4444"/>
      <circle cx="58" cy="5" r="2" fill="#ef4444"/>
    </svg>`;
  }

  if (p.includes('buz') || p.includes('kristal') || p.includes('ice') || p.includes('freeze')) {
    return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="iceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>
        <filter id="iceGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="46" stroke="url(#iceGrad)" stroke-width="3.5" stroke-dasharray="14 4" filter="url(#iceGlow)"/>
      <polygon points="50,2 54,12 46,12" fill="#7dd3fc"/>
      <polygon points="98,50 88,54 88,46" fill="#7dd3fc"/>
      <polygon points="50,98 46,88 54,88" fill="#7dd3fc"/>
      <polygon points="2,50 12,46 12,54" fill="#7dd3fc"/>
    </svg>`;
  }

  // Default Nitro Aura SVG
  return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="univGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}" />
        <stop offset="100%" stop-color="${secondaryColor}" />
      </linearGradient>
      <filter id="univGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="46" stroke="url(#univGrad)" stroke-width="4" stroke-dasharray="10 5" filter="url(#univGlow)"/>
    <circle cx="50" cy="50" r="42" stroke="${primaryColor}" stroke-width="1.5" opacity="0.8"/>
    <circle cx="50" cy="4" r="3" fill="${secondaryColor}" filter="url(#univGlow)"/>
    <circle cx="96" cy="50" r="3" fill="${primaryColor}" filter="url(#univGlow)"/>
    <circle cx="50" cy="96" r="3" fill="${secondaryColor}" filter="url(#univGlow)"/>
    <circle cx="4" cy="50" r="3" fill="${primaryColor}" filter="url(#univGlow)"/>
  </svg>`;
}

// API: AI Frame Workshop (Gemini powered avatar frame creation)
app.post('/api/ai-frame', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body ?? {};
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 300) {
      return res.status(400).json({ success: false, error: 'Prompt boş olamaz ve en fazla 300 karakter olabilir.' });
    }

    const ai = getGenAI();
    let parsed: any = {};

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Kullanıcı Roblox ve Discord Nitro temalı oyun platformu için profil çerçevesi tasarlamak istiyor.
Prompt: "${prompt}"

Lütfen aşağıdaki JSON formatında geçerli bir Türkçe çerçeve tasarımı üret (SADECE JSON döndür, markdown veya başka metin ekleme):
{
  "name": "Çerçeve Adı (yaratıcı, Türkçe, örn: Kuantum Ejderha Aurası)",
  "rarity": "rare" | "epic" | "legendary" | "mythic",
  "price": number (200 ile 600 arasında),
  "description": "Etkileyici Türkçe kısa açıklama",
  "glowColor": "hex renk kodu örn #a855f7 veya #ec4899",
  "secondaryColor": "hex renk kodu örn #ec4899 veya #38bdf8",
  "tag": "AI Özel",
  "isAnimated": true
}`
        });

        const responseText = response.text || '';
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleanJson);
      } catch (e) {
        console.error('Gemini parse fallback:', e);
      }
    }

    const isHexColor = (value: unknown): value is string =>
      typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
    const primaryColor = isHexColor(parsed.glowColor) ? parsed.glowColor : '#a855f7';
    const secondaryColor = isHexColor(parsed.secondaryColor) ? parsed.secondaryColor : '#ec4899';
    const allowedRarities = ['rare', 'epic', 'legendary', 'mythic'];
    const rarity = allowedRarities.includes(parsed.rarity) ? parsed.rarity : 'legendary';
    const price = typeof parsed.price === 'number' && Number.isFinite(parsed.price)
      ? Math.max(200, Math.min(600, Math.round(parsed.price)))
      : 350;
    const svgCode = generateSvgFrame(prompt, primaryColor, secondaryColor);

    const newFrame = {
      id: 'frame_ai_' + Date.now(),
      name: parsed.name || `${prompt.slice(0, 20)} Çerçevesi`,
      type: 'frame',
      price,
      rarity,
      tag: parsed.tag || 'AI Atölye',
      isAnimated: true,
      description: parsed.description || `Yapay zeka atölyesinde tasarlandı: "${prompt}"`,
      glowColor: primaryColor,
      frameSvg: svgCode,
      effectClass: `ring-4 shadow-[0_0_25px_${primaryColor}] animate-pulse`
    };

    res.json({ success: true, frame: newFrame });
  } catch (error: any) {
    console.error('AI frame generation error:', error);
    res.status(500).json({ success: false, error: error.message || 'AI çerçeve üretilemedi' });
  }
});

// API: Admin AI Assistant (Gemini powered admin helper)
app.post('/api/admin-ai', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { prompt, siteStats } = req.body ?? {};
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 2000) {
      return res.status(400).json({ success: false, error: 'Prompt boş olamaz ve en fazla 2000 karakter olabilir.' });
    }

    // 1. Önbellek Kontrolü (Cache Check)
    const cacheKey = prompt.trim().toLowerCase();
    const cached = serverData.aiCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < 3600000) { // 1 saatlik cache
      return res.json({ success: true, reply: cached.response + ' (Önbellekten)' });
    }

    const ai = getGenAI();
    let reply = 'AI asistanı şu anda yapılandırılıyor.';

    if (ai) {
      let retries = 5;
      while (retries > 0) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `HarikaScript admin asistanı olarak yanıt ver. 
Site Durumu: ${JSON.stringify(siteStats || {})}

Admin: "${prompt}"

Yanıt (Kısa ve pratik):`
          });
          reply = response.text || 'Yanıt alınamadı.';
          
          // 2. Yanıtı Önbelleğe Kaydet
          serverData.aiCache.set(cacheKey, { response: reply, timestamp: Date.now() });
          
          break; // Success
        } catch (e: any) {
          console.error(`Admin AI error (retries left: ${retries - 1}):`, e);
          
          // Robust check for 503/Unavailable
          const errStr = e.toString() + (e.message || '') + JSON.stringify(e.error || e);
          const isUnavailable = errStr.includes('503') || 
                                errStr.includes('UNAVAILABLE') || 
                                errStr.includes('high demand') ||
                                e.status === 503 || 
                                e.code === 503;
          
          const isQuotaExceeded = errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED');

          if (isQuotaExceeded) {
             reply = 'Günlük AI kullanım limitine (kota) ulaşıldı. Lütfen yarın tekrar deneyin veya faturalandırma ayarlarını kontrol edin.';
             break; // Do not retry
          }

          if (isUnavailable && retries > 1) {
            retries--;
            const waitTime = (6 - retries) * 2000;
            console.log(`High demand detected. Retrying in ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          reply = 'AI yanıt üretirken hata oluştu: ' + (e.message || 'Geçici hata');
          break; // Failure
        }
      }
    } else {
      reply = 'GEMINI_API_KEY tanımlı değil. Lütfen API anahtarını kontrol edin.';
    }

    res.json({ success: true, reply });
  } catch (error: any) {
    console.error('Admin AI endpoint error:', error);
    res.status(500).json({ success: false, error: error.message || 'Sunucu hatası' });
  }
});

// API: Get popular MM2 trending items for one-click add
app.get('/api/research-popular', (req: Request, res: Response) => {
  res.json({
    success: true,
    items: MM2_ENCYCLOPEDIA.slice(0, 15)
  });
});

// API: Research Item (Multi-tier: Encyclopedia -> Gemini -> Intelligent Synthesizer)
app.post('/api/research-item', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { itemName } = req.body ?? {};
    if (typeof itemName !== 'string' || !itemName.trim() || itemName.length > 120) {
      return res.status(400).json({ success: false, error: 'Eşya adı boş olamaz ve en fazla 120 karakter olabilir.' });
    }

    const query = itemName.trim();

    // TIER 1: Check verified local MM2 Encyclopedia
    const catalogMatch = lookupMM2Item(query);
    if (catalogMatch) {
      console.log(`[MM2 Research] Encyclopedia match found for "${query}":`, catalogMatch.name);
      return res.json({
        success: true,
        source: 'catalog',
        message: 'Resmi MM2 Veritabanından bulundu! 🎯',
        item: catalogMatch
      });
    }

    // TIER 2: Try Gemini API if available
    const ai = getGenAI();
    let geminiItem: MM2ItemWithoutId | null = null;

    if (ai) {
      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: `Sen profesyonel bir Roblox Murder Mystery 2 (MM2) değer ve eşya uzmanısın.
Kullanıcı "${query}" eşyasını araştırmak istiyor.

Lütfen bu eşya için geçerli ve gerçekçi MM2 verileri içeren SADECE geçerli bir JSON döndür (başka metin veya markdown ekleme):
{
  "name": "${query}",
  "type": "Godly" | "Ancient" | "Chroma" | "Vintage" | "Unique",
  "category": "Knife" | "Gun" | "Pet",
  "value": number (örneğin 10 ile 5000 arası değer),
  "demand": "Çok Yüksek" | "Yüksek" | "Normal" | "Düşük",
  "rarity": "örneğin Godly Tier veya Ancient Godly",
  "imageUrl": "Geçerli bir https görsel bağlantısı",
  "stability": "Yükseliyor" | "Sabit" | "Düşüyor",
  "origin": "Eşyanın çıktığı kutu veya etkinlik (örneğin Halloween Event veya Mystery Box)"
}`
          });

          const responseText = response.text || '';
          const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);

          if (parsed && parsed.name) {
            geminiItem = {
              name: parsed.name,
              type: ['Godly', 'Ancient', 'Chroma', 'Vintage', 'Unique'].includes(parsed.type) ? parsed.type : 'Godly',
              category: ['Knife', 'Gun', 'Pet'].includes(parsed.category) ? parsed.category : 'Knife',
              value: typeof parsed.value === 'number' && !isNaN(parsed.value) ? parsed.value : 200,
              demand: ['Çok Yüksek', 'Yüksek', 'Normal', 'Düşük'].includes(parsed.demand) ? parsed.demand : 'Yüksek',
              rarity: parsed.rarity || 'Godly Tier',
              imageUrl: parsed.imageUrl && parsed.imageUrl.startsWith('http')
                ? parsed.imageUrl
                : (parsed.category === 'Gun'
                    ? 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=400&auto=format&fit=crop&q=80'),
              stability: ['Yükseliyor', 'Sabit', 'Düşüyor'].includes(parsed.stability) ? parsed.stability : 'Yükseliyor',
              origin: parsed.origin || 'MM2 Özel Etkinlik'
            };
            break;
          }
        } catch (e: any) {
          console.warn(`[MM2 Research] Gemini model ${modelName} error:`, e.message || e);
        }
      }
    }

    if (geminiItem) {
      console.log(`[MM2 Research] Gemini successfully researched "${query}":`, geminiItem.name);
      return res.json({
        success: true,
        source: 'gemini',
        message: 'Yapay Zeka tarafından araştırıldı ve oluşturuldu! 🤖',
        item: geminiItem
      });
    }

    // TIER 3: Fallback Intelligent Synthesizer (Zero-failure guarantee!)
    console.log(`[MM2 Research] Synthesizing custom MM2 item for "${query}"`);
    const synthesized = synthesizeMM2Item(query);
    return res.json({
      success: true,
      source: 'synthesizer',
      message: 'Akıllı MM2 sentezleyici ile başarıyla hazırlandı! ⚡',
      item: synthesized
    });
  } catch (error: any) {
    console.error('Research item unexpected error:', error);
    // Even on error, provide synthesized item so admin NEVER fails to add item!
    const fallback = synthesizeMM2Item(req.body?.itemName || 'Özel MM2 Eşyası');
    res.json({
      success: true,
      source: 'fallback',
      message: 'Eşya başarıyla oluşturuldu! ⚡',
      item: fallback
    });
  }
});

// Start server with Vite middleware in development
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HarikaScript server running at http://0.0.0.0:${PORT}`);
  });
}

start();
