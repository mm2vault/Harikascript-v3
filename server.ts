import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { lookupMM2Item, synthesizeMM2Item, MM2_ENCYCLOPEDIA, MM2ItemWithoutId } from './src/data/mm2Encyclopedia';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

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
  adminEmail: 'mm2ultimatehub@gmail.com',
  verifiedDiscordMembers: new Set<string>(),
  verifiedYouTubeSubs: new Set<string>(),
  aiCache: new Map<string, { response: string, timestamp: number }>()
};

// API: Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'HarikaScript',
    admin: serverData.adminEmail,
    timestamp: new Date().toISOString()
  });
});

// API: Verify Task (Backend verification for Discord & YouTube as required)
app.post('/api/verify-task', async (req: Request, res: Response) => {
  try {
    const { taskId, userId, taskType } = req.body;

    if (!taskId || !userId) {
      return res.status(400).json({ success: false, error: 'taskId ve userId gereklidir' });
    }

    // Verification must be performed by real provider integrations.
    // Do not award coins merely because the client called this endpoint.
    if (taskType === 'discord' || taskType === 'youtube' || taskType === 'tiktok') {
      return res.status(501).json({
        success: false,
        verified: false,
        error: `${taskType} doğrulaması henüz gerçek API entegrasyonuna bağlanmadı.`
      });
    }

    return res.json({
        success: true,
        verified: true,
        message: 'Discord sunucu üyeliği başarıyla doğrulandı!',
        rewardCoins: 250
      });
    }

    if (taskType === 'youtube') {
      // Simulate YouTube Data API Subscription check
      serverData.verifiedYouTubeSubs.add(userId);
      return res.json({
        success: true,
        verified: true,
        message: 'YouTube kanal aboneliği onaylandı!',
        rewardCoins: 300
      });
    }

    if (taskType === 'tiktok') {
      return res.json({
        success: true,
        verified: true,
        message: 'TikTok profili ziyaret edildi ve onaylandı!',
        rewardCoins: 150
      });
    }

    return res.json({
      success: true,
      verified: true,
      message: 'Görev başarıyla tamamlandı!'
    });
  } catch (error: any) {
    console.error('Verify task error:', error);
    res.status(500).json({ success: false, error: error.message || 'Doğrulama hatası' });
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
app.post('/api/ai-frame', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Lütfen bir çerçeve promptu girin' });
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

    const primaryColor = parsed.glowColor || '#a855f7';
    const secondaryColor = parsed.secondaryColor || '#ec4899';
    const svgCode = generateSvgFrame(prompt, primaryColor, secondaryColor);

    const newFrame = {
      id: 'frame_ai_' + Date.now(),
      name: parsed.name || `${prompt.slice(0, 20)} Çerçevesi`,
      type: 'frame',
      price: parsed.price || 350,
      rarity: parsed.rarity || 'legendary',
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
app.post('/api/admin-ai', async (req: Request, res: Response) => {
  try {
    const { prompt, siteStats } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt gereklidir' });
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
app.post('/api/research-item', async (req: Request, res: Response) => {
  try {
    const { itemName } = req.body;
    if (!itemName || typeof itemName !== 'string' || !itemName.trim()) {
      return res.status(400).json({ success: false, error: 'Lütfen bir eşya adı girin.' });
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
