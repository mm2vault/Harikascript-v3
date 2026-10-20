import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScriptItem, RobloxGame, CosmeticItem, TaskItem, ExecutorItem, UserProfile, MysteryCase, CaseReward, RarityType, MM2Item } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import { CoinIcon } from './CoinIcon';
import {
  ShieldAlert,
  Coins,
  FileCode2,
  Gamepad2,
  Sparkles,
  Bell,
  CheckSquare,
  Trash2,
  Edit2,
  PlusCircle,
  Plus,
  Crown,
  Save,
  Search,
  Users,
  Terminal,
  X,
  XCircle,
  Zap,
  CheckCircle2,
  UserCheck,
  Flame,
  Sword,
  Crosshair,
  Upload,
  Gift,
  Radio,
  ArrowRightLeft,
  Music,
  Key,
  LogIn,
  BarChart3,
  Database,
  Sliders,
  Download,
  FileText,
  Ban,
  AlertTriangle,
  Check,
  RefreshCw,
  Activity,
  FileUp,
  Settings,
  ShieldCheck,
  ExternalLink,
  Layers
} from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';
import { auth } from '../firebase';
import { apiFetch } from '../utils/api';

export const AdminPanel: React.FC = () => {
  const {
    user,
    allUsers,
    scripts,
    games,
    cosmetics,
    executors,
    tasks,
    mm2Items,
    promoCodes,
    addPromoCode,
    deletePromoCode,
    generateBatchPromoCodes,
    songs,
    addSong,
    deleteSong,
    tradePosts,
    deleteTradePost,
    updateUserCoins,
    adminGiveUserCoins,
    addScript,
    deleteScript,
    addGame,
    deleteGame,
    addMM2Item,
    updateMM2Item,
    deleteMM2Item,
    addBloxFruit,
    updateBloxFruit,
    deleteBloxFruit,
    addCosmetic,
    updateCosmetic,
    deleteCosmetic,
    addExecutor,
    updateExecutor,
    addTask,
    updateTask,
    deleteTask,
    addValueCategory,
    updateValueCategory,
    deleteValueCategory,
    valueCategories,
    addValueItem,
    updateValueItem,
    deleteValueItem,
    valueItems,
    sendNotification,
    showToast,
    isAuthorizedAdmin,
    setActiveTab,
    setIsAuthModalOpen,
    setEditingScript,
    setEditingGame,
    setEditingMM2Item,
    setEditingBloxFruit,
    setIsAddScriptModalOpen,
    setIsAddGameModalOpen,
    setIsAddMM2ItemModalOpen,
    setIsAddBloxFruitModalOpen,
    requestDeleteScript,
    requestDeleteGame,
    requestDeleteCosmetic,
    requestDeleteTask,
    requestDeleteExecutor,
    requestDeleteMM2Item,
    requestDeleteBloxFruit,
    systemAnnouncement,
    updateSystemAnnouncement,
    isAnnouncementVisible,
    setIsAnnouncementVisible,
    systemConfig,
    updateSystemConfig,
    auditLogs,
    addAuditLog,
    clearAuditLogs,
    toggleUserBan,
    exportFullBackup,
    restoreFromBackup,
    resetToDefaultData,
    mysteryCases,
    addMysteryCase,
    updateMysteryCase,
    deleteMysteryCase,
    requestDeleteMysteryCase,
    requestDeleteUser,
    requestDeleteValueCategory,
    requestDeleteValueItem,
    setSelectedMM2Item,
    setSelectedBloxFruit,
    bloxItems
  } = useApp();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<
    | 'analytics'
    | 'users'
    | 'settings'
    | 'backup'
    | 'logs'
    | 'scripts'
    | 'games'
    | 'mm2_items'
    | 'blox_fruits'
    | 'ai_assistant'
    | 'executors'
    | 'promo_codes'
    | 'songs'
    | 'trades'
    | 'tasks'
    | 'mystery_cases'
    | 'ai_auto_add'
    | 'coins'
    | 'notifications'
    | 'value_management'
  >('analytics');

  // MM2 Admin Filter & Search States
  const [adminMM2Search, setAdminMM2Search] = useState('');
  const [adminMM2Category, setAdminMM2Category] = useState<string>('all');
  const [adminMM2Rarity, setAdminMM2Rarity] = useState<string>('all');
  const [adminMM2Sort, setAdminMM2Sort] = useState<'value_desc' | 'value_asc' | 'name_asc'>('value_desc');

  const filteredMM2 = mm2Items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(adminMM2Search.toLowerCase());
    const matchesCategory = adminMM2Category === 'all' || item.category === adminMM2Category;
    const matchesRarity = adminMM2Rarity === 'all' || item.type === adminMM2Rarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  // User Search State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUserCustomCoin, setSelectedUserCustomCoin] = useState<Record<string, number>>({});

  // Quick Coin & Reset State for Self
  const [targetCoinAmount, setTargetCoinAmount] = useState<number>(user.coins);
  const [coinAddAmount, setCoinAddAmount] = useState<number>(1000);

  // Broadcast Notification & Announcement State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [adminAnnouncementText, setAdminAnnouncementText] = useState(systemAnnouncement);

  // Cosmetic Form & Edit State
  const [editingCosmetic, setEditingCosmetic] = useState<CosmeticItem | null>(null);
  const [cosmeticName, setCosmeticName] = useState('');
  const [cosmeticType, setCosmeticType] = useState<'frame' | 'avatar' | 'effect' | 'badge'>('frame');
  const [cosmeticPrice, setCosmeticPrice] = useState<number>(350);
  const [cosmeticRarity, setCosmeticRarity] = useState<'common' | 'rare' | 'epic' | 'legendary' | 'mythic'>('legendary');
  const [cosmeticImage, setCosmeticImage] = useState('');
  const [cosmeticGlow, setCosmeticGlow] = useState('#ec4899');
  const [cosmeticAnimated, setCosmeticAnimated] = useState(true);

  // Task Form & Edit State
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPlatform, setTaskPlatform] = useState<'discord' | 'youtube' | 'tiktok' | 'daily'>('discord');
  const [taskReward, setTaskReward] = useState<number>(200);
  const [taskActionUrl, setTaskActionUrl] = useState('');

  // Executor Form & Edit State
  const [editingExecutor, setEditingExecutor] = useState<ExecutorItem | null>(null);
  const [execName, setExecName] = useState('');
  const [execVersion, setExecVersion] = useState('v1.0');
  const [execPlatforms, setExecPlatforms] = useState<('Windows' | 'Android' | 'iOS' | 'macOS')[]>(['Windows', 'Android']);
  const [execUnc, setExecUnc] = useState('100% UNC');
  const [execKeyless, setExecKeyless] = useState(true);
  const [execLevel, setExecLevel] = useState('Level 8');
  const [execStatus, setExecStatus] = useState<'Aktif' | 'Güncellemede' | 'İncelemede'>('Aktif');
  const [execDownloadUrl, setExecDownloadUrl] = useState('');
  const [execImage, setExecImage] = useState('');
  const [execDescription, setExecDescription] = useState('');

  // Promo Code Form State
  const [adminPromoCode, setAdminPromoCode] = useState('');
  const [adminPromoCoins, setAdminPromoCoins] = useState(300);
  const [adminPromoDesc, setAdminPromoDesc] = useState('');
  const [batchPrefix, setBatchPrefix] = useState('HARIKA');
  const [batchCount, setBatchCount] = useState(5);
  const [batchCoins, setBatchCoins] = useState(400);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  // AI Auto-Add State
  const [searchItemName, setSearchItemName] = useState('');
  const [isAutoAdding, setIsAutoAdding] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<MM2Item | null>(null);
  const [isBulkSyncing, setIsBulkSyncing] = useState(false);

  const handleAutoAddItem = async (nameOverride?: string) => {
    const targetName = (nameOverride || searchItemName).trim();
    if (!targetName) {
      showToast('Lütfen bir eşya adı girin!');
      return;
    }

    setIsAutoAdding(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Yönetici oturumu doğrulanamadı. Yeniden giriş yap.');
      const res = await apiFetch('/api/research-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ itemName: targetName })
      });
      const data = await res.json();
      if (data.success && data.item) {
        await addMM2Item(data.item);
        setLastAddedItem(data.item);
        showToast(data.message || `${data.item.name} başarıyla eklendi!`);
        if (!nameOverride) setSearchItemName('');
      } else {
        showToast(data.error || 'Eşya bulunamadı veya bir hata oluştu.');
      }
    } catch (e: any) {
      console.error('Auto add error:', e);
      showToast(e instanceof Error ? e.message : 'Eşya araştırma API sunucusuna ulaşılamadı.');
    } finally {
      setIsAutoAdding(false);
    }
  };

  const handleBulkSyncPopularItems = async () => {
    setIsBulkSyncing(true);
    try {
      const res = await apiFetch('/api/research-popular');
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        const existingNames = new Set(mm2Items.map(item => item.name.toLowerCase().trim()));
        const toAdd = data.items.filter((item: any) => !existingNames.has(item.name.toLowerCase().trim()));

        if (toAdd.length === 0) {
          showToast('Tüm popüler MM2 eşyaları zaten sitenizde mevcut!');
        } else {
          for (const item of toAdd) {
            await addMM2Item(item);
          }
          showToast(`${toAdd.length} adet popüler MM2 eşyası otomatik olarak siteye entegre edildi!`);
        }
      } else {
        showToast('Popüler eşyalar yüklenemedi.');
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Toplu entegrasyon API sunucusuna ulaşılamadı.');
    } finally {
      setIsBulkSyncing(false);
    }
  };
  const [adminSongTitle, setAdminSongTitle] = useState('');
  const [adminSongArtist, setAdminSongArtist] = useState('');
  const [adminSongAudioId, setAdminSongAudioId] = useState('');
  const [adminSongCategory, setAdminSongCategory] = useState<'Phonk' | 'Türkçe' | 'Gaming' | 'Meme' | 'Pop/Trap'>('Phonk');

  // Mystery Case Form State
  const [editingMysteryCase, setEditingMysteryCase] = useState<MysteryCase | null>(null);
  const [caseName, setCaseName] = useState('');
  const [casePrice, setCasePrice] = useState<number>(250);
  const [caseDesc, setCaseDesc] = useState('');
  const [caseImage, setCaseImage] = useState('');
  const [caseColor, setCaseColor] = useState('#a855f7');
  const [caseTag, setCaseTag] = useState('Popüler');
  const [caseRewards, setCaseRewards] = useState<CaseReward[]>([]);

  // Reward Builder State
  const [rewName, setRewName] = useState('');
  const [rewType, setRewType] = useState<'coins' | 'cosmetic' | 'badge' | 'frame'>('coins');
  const [rewValue, setRewValue] = useState<number>(100);
  const [rewRarity, setRewRarity] = useState<RarityType>('legendary');
  const [rewImage, setRewImage] = useState('');
  const [rewDesc, setRewDesc] = useState('');

  const handleAddRewardToCase = () => {
    if (!rewName.trim()) {
      showToast('Ödül adını girin!');
      return;
    }
    const newRew: CaseReward = {
      id: `rew_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: rewName,
      type: rewType,
      value: Number(rewValue) || 100,
      rarity: rewRarity,
      imageUrl: rewImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
      description: rewDesc || rewName
    };
    setCaseRewards([...caseRewards, newRew]);
    setRewName('');
    setRewDesc('');
    setRewImage('');
  };

  const handleRemoveReward = (id: string) => {
    setCaseRewards(caseRewards.filter(r => r.id !== id));
  };

  const handleSaveMysteryCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseName.trim()) {
      showToast('Kutunun adını girin!');
      return;
    }
    if (editingMysteryCase) {
      updateMysteryCase(editingMysteryCase.id, {
        name: caseName,
        price: Number(casePrice) || 250,
        description: caseDesc,
        imageUrl: caseImage || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200&auto=format&fit=crop&q=80',
        color: caseColor,
        tag: caseTag,
        rewards: caseRewards.length > 0 ? caseRewards : editingMysteryCase.rewards
      });
      setEditingMysteryCase(null);
    } else {
      addMysteryCase({
        name: caseName,
        price: Number(casePrice) || 250,
        description: caseDesc,
        imageUrl: caseImage || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200&auto=format&fit=crop&q=80',
        color: caseColor,
        tag: caseTag,
        rewards: caseRewards.length > 0 ? caseRewards : [
          { id: 'def_1', name: '100 Coin', type: 'coins', value: 100, rarity: 'common', imageUrl: '', description: '100 Coin Ödülü' }
        ]
      });
    }
    setCaseName('');
    setCasePrice(250);
    setCaseDesc('');
    setCaseImage('');
    setCaseRewards([]);
  };

  const handleEditMysteryCase = (c: MysteryCase) => {
    setEditingMysteryCase(c);
    setCaseName(c.name);
    setCasePrice(c.price);
    setCaseDesc(c.description);
    setCaseImage(c.imageUrl);
    setCaseColor(c.color);
    setCaseTag(c.tag);
    setCaseRewards(c.rewards || []);
    const el = document.getElementById('mystery-case-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`'${c.name}' düzenleme moduna alındı. ✏️`);
  };

  // System Settings State
  const [adminMaintenanceMode, setAdminMaintenanceMode] = useState<boolean>(systemConfig.maintenanceMode);
  const [adminMaintenanceMsg, setAdminMaintenanceMsg] = useState<string>(systemConfig.maintenanceMessage);
  const [adminAllowReg, setAdminAllowReg] = useState<boolean>(systemConfig.allowNewRegistrations);
  const [adminAllowTrades, setAdminAllowTrades] = useState<boolean>(systemConfig.allowTradeCreation);
  const [adminCooldown, setAdminCooldown] = useState<number>(systemConfig.scriptCopyCooldownSeconds);
  const [adminAutoApprove, setAdminAutoApprove] = useState<boolean>(systemConfig.autoApproveScripts);
  const [adminAntiSpam, setAdminAntiSpam] = useState<boolean>(systemConfig.antiSpamEnabled);
  const [adminMaxSpins, setAdminMaxSpins] = useState<number>(systemConfig.maxDailyLuckySpins || 3);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // Backup & Restore State
  const [backupJsonInput, setBackupJsonInput] = useState<string>('');
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [restoreFeedback, setRestoreFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  // Audit Logs State
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [selectedLogCategory, setSelectedLogCategory] = useState<'all' | 'economy' | 'content' | 'users' | 'system' | 'security'>('all');

  // Admin AI Assistant Chat State
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    { role: 'assistant', text: 'Merhaba Admin! Ben HarikaScript AI Yönetim Asistanıyım. Site istatistiklerinizi analiz etmek, script önerileri sunmak, MM2 değerleri hakkında bilgi vermek veya site yönetimiyle ilgili her konuda size yardımcı olmak için buradayım. Nasıl yardımcı olabilirim?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSendAiPrompt = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = customText || aiPromptInput;
    if (!query.trim() || isAiLoading) return;

    const userMsg = { role: 'user' as const, text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setAiChatMessages(prev => [...prev, userMsg]);
    if (!customText) setAiPromptInput('');
    setIsAiLoading(true);

    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Yönetici oturumu doğrulanamadı. Yeniden giriş yap.');
      const res = await apiFetch('/api/admin-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
          prompt: query,
          siteStats: {
            usersCount: allUsers.length,
            scriptsCount: scripts.length,
            gamesCount: games.length,
            mm2ItemsCount: mm2Items.length,
            executorsCount: executors.length,
            tasksCount: tasks.length,
            tradePostsCount: tradePosts.length
          }
        })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setAiChatMessages(prev => [...prev, { role: 'assistant', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } else {
        setAiChatMessages(prev => [...prev, { role: 'assistant', text: 'AI yanıt verirken hata oluştu: ' + (data.error || 'Bilinmeyen hata'), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }
    } catch (err: any) {
      setAiChatMessages(prev => [...prev, { role: 'assistant', text: 'Bağlantı hatası: ' + (err.message || 'Sunucuya ulaşılamadı'), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Ban Modal & State
  const [banTargetUser, setBanTargetUser] = useState<UserProfile | null>(null);
  const [banReasonText, setBanReasonText] = useState<string>('Topluluk kurallarını ihlal');

  // Navigation Group State ('all' | 'games_values' | 'content' | 'community' | 'system')
  const [adminNavGroup, setAdminNavGroup] = useState<'all' | 'games_values' | 'content' | 'community' | 'system'>('all');

  // Value Management Admin States (Değerler & Oyun Hub - Pet Sim 99, vb.)
  const [selectedValCatId, setSelectedValCatId] = useState<string>('');
  const [valItemSearch, setValItemSearch] = useState<string>('');

  // Category Modal State
  const [isValCatModalOpen, setIsValCatModalOpen] = useState(false);
  const [editingValCat, setEditingValCat] = useState<any>(null);
  const [valCatName, setValCatName] = useState('');
  const [valCatDesc, setValCatDesc] = useState('');
  const [valCatImage, setCatValImage] = useState('');
  const [isValCatUploading, setIsValCatUploading] = useState(false);
  const [valCatPreviewFailed, setValCatPreviewFailed] = useState(false);

  // Item Modal State
  const [isValItemModalOpen, setIsValItemModalOpen] = useState(false);
  const [editingValItem, setEditingValItem] = useState<any>(null);
  const [valItemName, setValItemName] = useState('');
  const [valItemType, setValItemType] = useState('Huge');
  const [valItemValue, setValItemValue] = useState('15000000');
  const [valItemDemand, setValItemDemand] = useState('Çok Yüksek');
  const [valItemStability, setValItemStability] = useState<'Yükseliyor' | 'Sabit' | 'Düşüyor'>('Sabit');
  const [valItemRarity, setValItemRarity] = useState('Huge');
  const [valItemImage, setValItemImage] = useState('');
  const [valItemDesc, setValItemDesc] = useState('');
  const [isValItemUploading, setIsValItemUploading] = useState(false);
  const [valItemPreviewFailed, setValItemPreviewFailed] = useState(false);

  // Filter users by search
  const filteredUsers = allUsers.filter(
    u =>
      u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.uid.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Strict password & email gate: only mm2ultimatehub@gmail.com and huseynoveleddin87@gmail.com
  if (!isAuthorizedAdmin) {
    return (
      <div className="p-8 max-w-lg mx-auto rounded-3xl bg-[#0e0a1c] border border-amber-500/40 text-center space-y-4 shadow-2xl my-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-white">Yönetici Paneli (Yetkisiz Erişim)</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Bu bölüme sadece HarikaScript yetkili admin hesabı (<span className="text-amber-400 font-bold">mm2ultimatehub@gmail.com</span> veya <span className="text-amber-400 font-bold">huseynoveleddin87@gmail.com</span>) ile Google Girişi veya Yönetici Doğrulaması yapıldığında erişilebilir.
        </p>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-purple-200" />
            <span>Yetkili Yönetici Girişi Yap</span>
          </button>

          <button
            onClick={() => setActiveTab('scripts')}
            className="w-full py-2.5 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40 text-slate-400 hover:text-white text-xs font-semibold rounded-xl transition-all"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  // Handle Send Global Notification
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;
    sendNotification(notifTitle, notifMessage);
    showToast('Tüm kullanıcılara duyuru gönderildi! 📢');
    setNotifTitle('');
    setNotifMessage('');
  };

  // Handle Create Promo Code
  const handleCreatePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPromoCode.trim()) return;
    addPromoCode({
      code: adminPromoCode.trim().toUpperCase(),
      rewardCoins: Number(adminPromoCoins) || 100,
      description: adminPromoDesc || `${adminPromoCoins} Coin Bonusu`
    });
    setAdminPromoCode('');
    setAdminPromoCoins(300);
    setAdminPromoDesc('');
    showToast('Yeni promosyon kodu başarıyla yayınlandı! 🎁');
  };

  // Handle Create Song ID
  const handleCreateSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSongTitle.trim() || !adminSongAudioId.trim()) return;
    addSong({
      title: adminSongTitle.trim(),
      artist: adminSongArtist.trim() || 'Bilinmiyor',
      audioId: adminSongAudioId.trim().replace(/\D/g, '') || adminSongAudioId.trim(),
      category: adminSongCategory
    });
    setAdminSongTitle('');
    setAdminSongArtist('');
    setAdminSongAudioId('');
    showToast('Şarkı müzik ID kütüphanesine eklendi! 🎵');
  };

  // Handle Create / Edit Cosmetic Item
  const handleSaveCosmetic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cosmeticName.trim()) return;

    if (editingCosmetic) {
      updateCosmetic(editingCosmetic.id, {
        name: cosmeticName,
        type: cosmeticType,
        price: cosmeticPrice,
        rarity: cosmeticRarity,
        imageUrl: cosmeticImage || editingCosmetic.imageUrl,
        glowColor: cosmeticGlow,
        isAnimated: cosmeticAnimated,
        description: `HarikaScript özel ${cosmeticType} tasarımı.`
      });
      showToast(`'${cosmeticName}' kozmetiği başarıyla güncellendi! ✨`);
      setEditingCosmetic(null);
    } else {
      const newItem: Omit<CosmeticItem, 'id'> = {
        name: cosmeticName,
        type: cosmeticType,
        price: cosmeticPrice,
        rarity: cosmeticRarity,
        imageUrl: cosmeticImage || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&auto=format&fit=crop&q=80',
        description: `HarikaScript özel ${cosmeticType} tasarımı.`,
        isAnimated: cosmeticAnimated,
        glowColor: cosmeticGlow,
        tag: 'Admin Özel'
      };
      addCosmetic(newItem);
    }

    setCosmeticName('');
    setCosmeticImage('');
  };

  // Populate Cosmetic Form for Edit
  const startEditCosmetic = (cosm: CosmeticItem) => {
    setEditingCosmetic(cosm);
    setCosmeticName(cosm.name);
    setCosmeticType(cosm.type);
    setCosmeticPrice(cosm.price);
    setCosmeticRarity(cosm.rarity);
    setCosmeticImage(cosm.imageUrl);
    setCosmeticGlow(cosm.glowColor || '#ec4899');
    setCosmeticAnimated(cosm.isAnimated ?? true);
  };

  // Handle Create / Edit Task
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: taskTitle,
        description: taskDescription || editingTask.description,
        rewardCoins: taskReward,
        platform: taskPlatform,
        actionUrl: taskActionUrl,
        link: taskActionUrl
      });
      showToast(`'${taskTitle}' görevi güncellendi!`);
      setEditingTask(null);
    } else {
      const newTask: TaskItem = {
        id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title: taskTitle,
        description: taskDescription || 'HarikaScript topluluk görevi.',
        rewardCoins: taskReward,
        type: taskPlatform,
        platform: taskPlatform,
        link: taskActionUrl,
        actionUrl: taskActionUrl,
        actionText: 'Görevi Tamamla'
      };
      addTask(newTask);
    }

    setTaskTitle('');
    setTaskDescription('');
    setTaskActionUrl('');
  };

  // Populate Task Form for Edit
  const startEditTask = (t: TaskItem) => {
    setEditingTask(t);
    setTaskTitle(t.title);
    setTaskDescription(t.description || '');
    setTaskReward(t.rewardCoins);
    setTaskPlatform((t.platform as any) || 'discord');
    setTaskActionUrl(t.actionUrl || t.link || '');
  };

  // Handle Create / Edit Executor
  const handleSaveExecutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!execName.trim()) return;

    if (editingExecutor) {
      updateExecutor(editingExecutor.id, {
        name: execName,
        version: execVersion,
        platforms: execPlatforms,
        uncPercent: execUnc,
        isKeyless: execKeyless,
        level: execLevel,
        status: execStatus,
        downloadUrl: execDownloadUrl || editingExecutor.downloadUrl,
        imageUrl: execImage || editingExecutor.imageUrl,
        description: execDescription || editingExecutor.description
      });
      setEditingExecutor(null);
    } else {
      const newExec: Omit<ExecutorItem, 'id'> = {
        name: execName,
        version: execVersion,
        platforms: execPlatforms,
        uncPercent: execUnc,
        isKeyless: execKeyless,
        level: execLevel,
        status: execStatus,
        downloadUrl: execDownloadUrl || 'https://harikascript.com',
        imageUrl: execImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=160&auto=format&fit=crop&q=80',
        description: execDescription || 'Güncel ve güvenilir Roblox Lua executor motoru.'
      };
      addExecutor(newExec);
    }

    setExecName('');
    setExecDownloadUrl('');
    setExecImage('');
    setExecDescription('');
  };

  const startEditExecutor = (ex: ExecutorItem) => {
    setEditingExecutor(ex);
    setExecName(ex.name);
    setExecVersion(ex.version);
    setExecPlatforms(ex.platforms);
    setExecUnc(ex.uncPercent);
    setExecKeyless(ex.isKeyless);
    setExecLevel(ex.level);
    setExecStatus(ex.status);
    setExecDownloadUrl(ex.downloadUrl);
    setExecImage(ex.imageUrl);
    setExecDescription(ex.description);
  };

  return (
    <div className="space-y-6">

      {/* Admin Panel Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/90 via-[#180e2d] to-[#0c081c] border border-amber-500/50 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>HarikaScript Baş Yönetici Merkezi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            Site İçerik & <span className="text-amber-400">Yönetim Paneli</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Giriş yapan tüm kullanıcılara coin aktarma, kullanıcı arama, script, oyun, çerçeve, executor ve görevleri anında düzenleme veya silme kontrolü.
          </p>
        </div>

        {/* Admin Status Pill */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/50 border border-amber-500/40">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Crown className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left text-xs">
            <span className="font-extrabold text-white block">{user.username} (Admin)</span>
            <span className="text-amber-400 font-semibold text-[11px]">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Live Platform Quick Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-2xl bg-[#0c0919] border border-purple-900/40 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Kullanıcılar</span>
          <span className="text-lg font-black text-white">{allUsers.length}</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#0c0919] border border-purple-900/40 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-purple-400 block">Scriptler</span>
          <span className="text-lg font-black text-purple-300">{scripts.length}</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#0c0919] border border-purple-900/40 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-red-400 block">MM2 Eşyaları</span>
          <span className="text-lg font-black text-red-300">{mm2Items.length}</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#0c0919] border border-purple-900/40 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Executorlar</span>
          <span className="text-lg font-black text-emerald-300">{executors.length}</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#0c0919] border border-purple-900/40 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400 block">Kupon Kodları</span>
          <span className="text-lg font-black text-amber-300">{promoCodes.length}</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#0c0919] border border-purple-900/40 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-pink-400 block">Müzik ID</span>
          <span className="text-lg font-black text-pink-300">{songs.length}</span>
        </div>
      </div>

      {/* Category Group Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0a0718] border border-purple-900/40 overflow-x-auto scrollbar-none max-w-full">
        {[
          { id: 'all', label: '🌐 Tüm Menü', count: 20 },
          { id: 'games_values', label: '🎮 Oyun & Değerler', count: 5 },
          { id: 'content', label: '📜 Script & Araçlar', count: 4 },
          { id: 'community', label: '👥 Topluluk & Ekonomi', count: 5 },
          { id: 'system', label: '⚙️ Sistem & Ayarlar', count: 6 }
        ].map(g => (
          <button
            key={g.id}
            onClick={() => setAdminNavGroup(g.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              adminNavGroup === g.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-purple-950/40 border border-transparent'
            }`}
          >
            <span>{g.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-purple-300 font-mono">
              {g.count}
            </span>
          </button>
        ))}
      </div>

      {/* Subtab Navigation Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full touch-pan-x">
        {[
          // Oyun & Değerler
          { id: 'value_management', group: 'games_values', label: `Değerler & Oyun Hub (${valueCategories.length})`, icon: Layers },
          { id: 'mm2_items', group: 'games_values', label: `MM2 Eşyaları (${mm2Items.length})`, icon: Flame },
          { id: 'blox_fruits', group: 'games_values', label: `Blox Fruits (${bloxItems.length})`, icon: Sparkles },
          { id: 'games', group: 'games_values', label: `Roblox Oyunları (${games.length})`, icon: Gamepad2 },
          { id: 'ai_auto_add', group: 'games_values', label: 'AI Eşya Ekle', icon: Sparkles },

          // Script & Araçlar
          { id: 'scripts', group: 'content', label: `Scriptler (${scripts.length})`, icon: FileCode2 },
          { id: 'executors', group: 'content', label: `Executorlar (${executors.length})`, icon: Terminal },
          { id: 'mystery_cases', group: 'content', label: `Kutular (${mysteryCases.length})`, icon: Gift },
          { id: 'songs', group: 'content', label: `Müzik ID (${songs.length})`, icon: Radio },

          // Topluluk & Ekonomi
          { id: 'users', group: 'community', label: `Kullanıcılar (${allUsers.length})`, icon: Users },
          { id: 'trades', group: 'community', label: `Takas İlanları (${tradePosts.length})`, icon: ArrowRightLeft },
          { id: 'tasks', group: 'community', label: `Görevler (${tasks.length})`, icon: CheckSquare },
          { id: 'promo_codes', group: 'community', label: `Kupon Kodları (${promoCodes.length})`, icon: Gift },
          { id: 'coins', group: 'community', label: 'Kendi Bakiyen', icon: Coins },

          // Sistem & Ayarlar
          { id: 'analytics', group: 'system', label: 'Analitik & Raporlar', icon: BarChart3 },
          { id: 'notifications', group: 'system', label: 'Duyuru Gönder', icon: Bell },
          { id: 'settings', group: 'system', label: `Sistem & Bakım ${adminMaintenanceMode ? '⚠️' : ''}`, icon: Sliders },
          { id: 'backup', group: 'system', label: 'Yedekleme & Geri Yükle', icon: Database },
          { id: 'logs', group: 'system', label: `İşlem Günlüğü (${auditLogs.length})`, icon: FileText },
          { id: 'ai_assistant', group: 'system', label: 'Admin AI Asistanı 🤖', icon: Sparkles }
        ]
          .filter(tab => adminNavGroup === 'all' || tab.group === adminNavGroup)
          .map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  activeAdminSubTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/30 ring-1 ring-amber-400'
                    : 'bg-[#0e0b1f] text-slate-300 hover:text-white border border-purple-900/40 hover:border-purple-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
      </div>

      {/* Subtab 1: KULLANICILAR & COIN DAĞITIMI (Sitedeki İnsanlara İstediğin Kadar Coin Ver & Arama Yap) */}
      {activeAdminSubTab === 'users' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-[#0c0919] border border-amber-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Kullanıcı Arama & Özel Coin Tanımlama</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  Sitede kayıtlı veya giriş yapmış kullanıcıları arayın ve istediklerinize dilediğiniz miktarda Coin aktarın.
                </p>
              </div>

              {/* User Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  placeholder="Kullanıcı adı veya e-posta ara..."
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  className="w-full bg-[#130f28] text-xs text-white placeholder-slate-500 pl-9 pr-3 py-2 rounded-xl border border-purple-800/40 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Users List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
              {filteredUsers.length === 0 ? (
                <div className="col-span-full py-8 text-center text-xs text-slate-400">
                  Aramanızla eşleşen kullanıcı bulunamadı.
                </div>
              ) : (
                filteredUsers.map(usr => {
                  const customAmt = selectedUserCustomCoin[usr.uid] ?? 1000;

                  return (
                    <div
                      key={usr.uid}
                      className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                        usr.role === 'admin'
                          ? 'bg-[#150e2a] border-amber-500/40'
                          : 'bg-[#0a0817] border-purple-900/40 hover:border-purple-600/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <AvatarDisplay size="sm" avatarUrl={usr.avatarUrl} isInteractive={false} />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-sm text-white">{usr.username}</span>
                              {usr.role === 'admin' && (
                                <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-bold">
                                  Admin 👑
                                </span>
                              )}
                              {usr.isBanned && (
                                <span className="px-1.5 py-0.5 text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/50 rounded font-bold">
                                  Yasaklı ⛔
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block truncate max-w-[170px]">
                              {usr.email}
                            </span>
                          </div>
                        </div>

                        {/* Coin Balance Badge */}
                        <div className="text-right">
                          <span className="text-xs font-black text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-1 rounded-lg flex items-center gap-1.5">
                            <CoinIcon className="w-3.5 h-3.5" />
                            <span>{usr.coins.toLocaleString('tr-TR')}</span>
                          </span>
                        </div>
                      </div>

                      {/* Quick Add Coins Buttons */}
                      <div className="space-y-2 pt-2 border-t border-purple-900/30">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Hızlı Coin Gönder:
                        </span>

                        <div className="grid grid-cols-2 xs:grid-cols-4 gap-1.5">
                          {[500, 1000, 5000, 10000].map(amt => (
                            <button
                              key={amt}
                              onClick={() => adminGiveUserCoins(usr.uid, amt, true)}
                              className="py-1 px-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-800/40 text-[11px] font-bold text-amber-300 transition-colors"
                            >
                              +{amt.toLocaleString()}
                            </button>
                          ))}
                        </div>

                        {/* Custom Coin Input for this user */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="number"
                            value={customAmt}
                            onChange={e =>
                              setSelectedUserCustomCoin(prev => ({
                                ...prev,
                                [usr.uid]: Number(e.target.value)
                              }))
                            }
                            placeholder="Miktar..."
                            className="w-full bg-[#120e24] text-xs text-white p-2 rounded-xl border border-purple-800/40 focus:border-amber-500 focus:outline-none"
                          />

                          <button
                            onClick={() => adminGiveUserCoins(usr.uid, customAmt, true)}
                            className="shrink-0 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
                          >
                            Gönder
                          </button>
                        </div>

                        {/* Moderation Actions (Ban / Unban & Delete) */}
                        {usr.role !== 'admin' && (
                          <div className="pt-2 border-t border-purple-900/30 flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (usr.isBanned) {
                                  toggleUserBan(usr.uid);
                                } else {
                                  setBanTargetUser(usr);
                                }
                              }}
                              className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                                usr.isBanned
                                  ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/60'
                                  : 'bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/40'
                              }`}
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>{usr.isBanned ? 'Yasağı Kaldır' : 'Yasakla (Ban)'}</span>
                            </button>
                            <button
                              onClick={() => requestDeleteUser(usr)}
                              className="py-1.5 px-2.5 rounded-xl text-[11px] font-bold bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-900/50 transition-all flex items-center justify-center gap-1 shrink-0"
                              title="Kullanıcıyı ve verilerini sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Sil</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Ban User Modal */}
          {banTargetUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="max-w-md w-full rounded-2xl bg-[#0f0c22] border border-rose-500/40 p-6 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Kullanıcıyı Yasakla (Ban)</h3>
                    <p className="text-xs text-slate-400">{banTargetUser.username} ({banTargetUser.email})</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Yasaklama Sebebi:</label>
                  <input
                    type="text"
                    value={banReasonText}
                    onChange={(e) => setBanReasonText(e.target.value)}
                    placeholder="Örn: Topluluk kurallarını ihlal, hileli takas..."
                    className="w-full bg-[#140f2b] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      toggleUserBan(banTargetUser.uid, banReasonText);
                      setBanTargetUser(null);
                    }}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                  >
                    Yasaklamayı Onayla
                  </button>
                  <button
                    onClick={() => setBanTargetUser(null)}
                    className="py-2.5 px-4 bg-purple-950/60 hover:bg-purple-900 border border-purple-800/40 text-slate-300 text-xs font-semibold rounded-xl transition-all"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: KENDİ BAKİYEN */}
      {activeAdminSubTab === 'coins' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quick Add Coins */}
          <div className="p-5 rounded-2xl bg-[#0c0919] border border-amber-500/30 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Coins className="w-4 h-4" />
              <span>Kendi Hesabına Anında Coin Yükle</span>
            </div>
            <p className="text-xs text-slate-400">
              Mevcut Bakiyeniz: <strong className="text-amber-300 font-extrabold">{user.coins.toLocaleString('tr-TR')} Coin</strong>
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[500, 1000, 5000, 10000, 50000, 100000].map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    updateUserCoins(amount);
                    showToast(`+${amount.toLocaleString()} Coin hesabınıza eklendi! 💰`);
                  }}
                  className="py-2 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/40 text-xs font-extrabold text-amber-300 transition-colors"
                >
                  +{amount.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-purple-900/30 flex items-center gap-2">
              <input
                type="number"
                value={coinAddAmount}
                onChange={e => setCoinAddAmount(Number(e.target.value))}
                placeholder="Özel miktar..."
                className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  updateUserCoins(coinAddAmount);
                  showToast(`+${coinAddAmount} Coin hesabınıza başarıyla tanımlandı!`);
                }}
                className="shrink-0 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                Coin Ekle
              </button>
            </div>
          </div>

          {/* Reset / Set exact balance */}
          <div className="p-5 rounded-2xl bg-[#0c0919] border border-purple-900/40 space-y-4">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <Edit2 className="w-4 h-4 text-purple-400" />
              <span>Net Bakiye Belirle</span>
            </div>
            <p className="text-xs text-slate-400">
              Hesabınızın toplam coin miktarını doğrudan belirli bir sayıya eşitleyin.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Yeni Net Bakiye:</label>
                <input
                  type="number"
                  value={targetCoinAmount}
                  onChange={e => setTargetCoinAmount(Number(e.target.value))}
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  const diff = targetCoinAmount - user.coins;
                  updateUserCoins(diff);
                  showToast(`Bakiye başarıyla ${targetCoinAmount} Coin olarak güncellendi!`);
                }}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Bakiyeyi Sabitle</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: SCRIPT YÖNETİMİ (Ekle, Düzenle, Sil) */}
      {activeAdminSubTab === 'scripts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white">Yayındaki Scriptler ({scripts.length})</h3>
            <button
              onClick={() => {
                setEditingScript(null);
                setIsAddScriptModalOpen(true);
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Yeni Script Ekle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scripts.map(script => (
              <div
                key={script.id}
                className="p-4 rounded-2xl bg-[#0c0919] border border-purple-900/40 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{script.title}</span>
                    <span className="text-[10px] bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded">
                      {script.game}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{script.description}</p>
                  <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-2">
                    <span>Fiyat: {script.price === 0 ? 'ÜCRETSİZ' : `${script.price} Coin`}</span>
                    <span>• {script.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingScript(script);
                      setIsAddScriptModalOpen(true);
                    }}
                    className="p-2 text-purple-300 hover:text-white rounded-xl hover:bg-purple-900/40 transition-colors"
                    title="Scripti Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      requestDeleteScript(script);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-950/30 transition-colors"
                    title="Scripti Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: OYUN YÖNETİMİ (Ekle, Düzenle, Sil) */}
      {activeAdminSubTab === 'games' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white">Yayındaki Roblox Oyunları ({games.length})</h3>
            <button
              onClick={() => {
                setEditingGame(null);
                setIsAddGameModalOpen(true);
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Yeni Oyun Ekle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map(game => (
              <div
                key={game.id}
                className="p-3.5 rounded-2xl bg-[#0c0919] border border-purple-900/40 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{game.name}</h4>
                    <span className="text-[11px] text-purple-300">{game.genre}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingGame(game);
                      setIsAddGameModalOpen(true);
                    }}
                    className="p-2 text-indigo-300 hover:text-white rounded-xl hover:bg-indigo-900/40 transition-colors"
                    title="Oyunu Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      requestDeleteGame(game);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-950/30 transition-colors"
                    title="Oyunu Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab: DEĞERLER & OYUN HUB YÖNETİMİ (Pet Simulator 99, vb.) */}
      {activeAdminSubTab === 'value_management' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0c0919] p-4 sm:p-5 rounded-2xl border border-amber-500/40 shadow-xl">
            <div>
              <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>Değerler & Oyun Hub Yönetimi</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/50">
                  {valueCategories.length} Oyun / Kategori
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pet Simulator 99 veya dilediğiniz Roblox oyununu ekleyin, görsellerini cihazınızdan yükleyin ve tüm eşya/pet değerlerini yönetin.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingValCat(null);
                setValCatName('');
                setValCatDesc('');
                setCatValImage('');
                setValCatPreviewFailed(false);
                setIsValCatModalOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Yeni Oyun / Kategori Ekle</span>
            </button>
          </div>

          {/* Categories Grid */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>Kayıtlı Oyun Kategorileri ({valueCategories.length})</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {valueCategories.map(cat => {
                const count = valueItems.filter(i => i.categoryId === cat.id).length;
                const isSelected = (selectedValCatId || valueCategories[0]?.id) === cat.id;

                return (
                  <div
                    key={cat.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-[#150e28] border-amber-500/60 shadow-lg shadow-amber-950/30'
                        : 'bg-[#0c0919] border-purple-900/40 hover:border-purple-600/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/60 border border-purple-700/40 p-0.5 shrink-0 flex items-center justify-center">
                        <img
                          src={cat.imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80'}
                          alt={cat.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80';
                          }}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-extrabold text-sm text-white truncate">{cat.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/50">
                            {count} Eşya
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {cat.description || 'Özel oyun değerleri ve rehberi.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-purple-900/30">
                      <button
                        onClick={() => setSelectedValCatId(cat.id)}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-purple-950/60 hover:bg-purple-900 text-purple-200'
                        }`}
                      >
                        {isSelected ? '✓ Seçili Oyun' : 'Eşyalarını Yönet'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingValCat(cat);
                          setValCatName(cat.name);
                          setValCatDesc(cat.description || '');
                          setCatValImage(cat.imageUrl || '');
                          setValCatPreviewFailed(false);
                          setIsValCatModalOpen(true);
                        }}
                        className="p-1.5 text-purple-300 hover:text-white rounded-xl bg-purple-900/40 hover:bg-purple-800 transition-colors"
                        title="Kategoriyi ve Resmi Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => requestDeleteValueCategory(cat)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 transition-colors"
                        title="Kategoriyi Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Category Items Management */}
          {(() => {
            const currentCatId = selectedValCatId || valueCategories[0]?.id;
            const currentCat = valueCategories.find(c => c.id === currentCatId);
            const currentCatItems = valueItems.filter(i => i.categoryId === currentCatId);
            const filteredValItems = currentCatItems.filter(i =>
              i.name.toLowerCase().includes(valItemSearch.toLowerCase()) ||
              (i.type && i.type.toLowerCase().includes(valItemSearch.toLowerCase()))
            );

            if (!currentCat) {
              return (
                <div className="p-6 text-center text-xs text-slate-400 bg-[#0c0919] rounded-2xl border border-purple-900/40">
                  Lütfen yukarıdan bir oyun kategorisi seçin veya yeni kategori oluşturun.
                </div>
              );
            }

            return (
              <div className="p-5 rounded-2xl bg-[#0c0919] border border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{currentCat.name} Eşyaları & Petleri ({currentCatItems.length})</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Bu kategoriye yeni petler ekleyin, değerlerini ve resimlerini güncelleyin.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingValItem(null);
                      setValItemName('');
                      setValItemType('Huge');
                      setValItemValue('15000000');
                      setValItemDemand('Çok Yüksek');
                      setValItemStability('Sabit');
                      setValItemRarity('Huge');
                      setValItemImage('');
                      setValItemDesc('');
                      setValItemPreviewFailed(false);
                      setIsValItemModalOpen(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Bu Oyuna Eşya Ekle</span>
                  </button>
                </div>

                {/* Items Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type="text"
                    value={valItemSearch}
                    onChange={e => setValItemSearch(e.target.value)}
                    placeholder={`${currentCat.name} içinde eşya ara (örn: Huge, Titanic, Rock)...`}
                    className="w-full bg-[#130f24] text-xs text-white placeholder-slate-500 pl-9 pr-3 py-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Items Grid */}
                {filteredValItems.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 bg-[#120e24] rounded-xl border border-purple-900/30">
                    Aramanızla eşleşen eşya bulunamadı.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredValItems.map(item => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-[#120e24] border border-purple-800/40 hover:border-amber-500/40 flex items-center justify-between gap-3 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/60 border border-purple-700/40 p-1 shrink-0 flex items-center justify-center">
                            <img
                              src={item.imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80'}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80';
                              }}
                              className="max-h-full max-w-full object-contain rounded-lg"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 truncate">
                              <h5 className="font-extrabold text-xs text-white truncate">{item.name}</h5>
                              <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded border border-amber-800/40 font-bold shrink-0">
                                {item.type}
                              </span>
                            </div>
                            <span className="text-xs text-amber-400 font-black block mt-0.5">
                              {typeof item.value === 'number' ? item.value.toLocaleString('tr-TR') : item.value} Değer
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              Talep: {item.demand} • {item.stability}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingValItem(item);
                              setValItemName(item.name);
                              setValItemType(item.type || 'Huge');
                              setValItemValue(String(item.value));
                              setValItemDemand(item.demand || 'Normal');
                              setValItemStability((item.stability as any) || 'Sabit');
                              setValItemRarity(item.rarity || 'Huge');
                              setValItemImage(item.imageUrl || '');
                              setValItemDesc(item.description || '');
                              setValItemPreviewFailed(false);
                              setIsValItemModalOpen(true);
                            }}
                            className="p-1.5 text-purple-300 hover:text-white rounded-lg hover:bg-purple-900/40 transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => requestDeleteValueItem(item)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Admin Category Add/Edit Modal */}
          {isValCatModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
              <div className="bg-[#120c24] border border-amber-500/40 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <span>{editingValCat ? 'Kategoriyi Düzenle' : 'Yeni Oyun Kategorisi Ekle'}</span>
                  </h3>
                  <button onClick={() => setIsValCatModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    if (!valCatName.trim()) return;

                    const finalImg = valCatImage.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80';

                    if (editingValCat) {
                      await updateValueCategory(editingValCat.id, {
                        name: valCatName.trim(),
                        description: valCatDesc.trim() || 'Roblox özel eşya değerleri ve takas rehberi',
                        imageUrl: finalImg
                      });
                      showToast(`'${valCatName}' kategorisi güncellendi! ✅`);
                    } else {
                      await addValueCategory({
                        name: valCatName.trim(),
                        description: valCatDesc.trim() || 'Roblox özel eşya değerleri ve takas rehberi',
                        imageUrl: finalImg
                      });
                      showToast(`'${valCatName}' yeni kategori olarak eklendi! 🎉`);
                    }

                    setIsValCatModalOpen(false);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Oyun / Kategori Adı *</label>
                    <input
                      type="text"
                      required
                      value={valCatName}
                      onChange={e => setValCatName(e.target.value)}
                      placeholder="Örn: Pet Simulator 99, Blade Ball"
                      className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Açıklama</label>
                    <input
                      type="text"
                      value={valCatDesc}
                      onChange={e => setValCatDesc(e.target.value)}
                      placeholder="Kısa açıklama..."
                      className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">Kategori Görseli (URL veya Cihazdan Yükle)</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={valCatImage}
                        onChange={e => {
                          setCatValImage(e.target.value);
                          setValCatPreviewFailed(false);
                        }}
                        placeholder="https://..."
                        className="flex-1 bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                      <label className="cursor-pointer px-3 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-600/40 text-xs font-bold text-purple-200 flex items-center gap-1.5 shrink-0 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isValCatUploading ? '...' : 'Cihazdan'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsValCatUploading(true);
                            try {
                              const compressed = await compressImageFile(file, 640, 400, 0.8);
                              setCatValImage(compressed);
                              setValCatPreviewFailed(false);
                              showToast('Kategori görseli cihazdan yüklendi! 🖼️');
                            } catch {
                              showToast('Resim yüklenemedi.');
                            } finally {
                              setIsValCatUploading(false);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Preview */}
                    {valCatImage && (
                      <div className="p-2 rounded-xl bg-[#140f2b] border border-purple-800/40 flex items-center gap-2 mt-1">
                        <img
                          src={valCatImage}
                          alt="Önizleme"
                          referrerPolicy="no-referrer"
                          onError={() => setValCatPreviewFailed(true)}
                          className="w-12 h-10 object-cover rounded-lg border border-purple-700/50"
                        />
                        <span className="text-[10px] text-slate-300">
                          {valCatPreviewFailed ? 'Görsel yüklenemedi, varsayılan kullanılacak.' : 'Önizleme hazır'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-900/40">
                    <button
                      type="button"
                      onClick={() => setIsValCatModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-purple-950/40 text-slate-300 text-xs font-semibold"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg"
                    >
                      {editingValCat ? 'Değişiklikleri Kaydet' : 'Kategoriyi Ekle'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Admin Item Add/Edit Modal */}
          {isValItemModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in zoom-in-95 duration-200">
              <div className="bg-[#120c24] border border-purple-500/40 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>{editingValItem ? 'Eşyayı / Peti Düzenle' : 'Yeni Eşya / Pet Ekle'}</span>
                  </h3>
                  <button onClick={() => setIsValItemModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    if (!valItemName.trim()) return;

                    const catId = selectedValCatId || valueCategories[0]?.id;
                    const parsedVal = isNaN(Number(valItemValue)) ? valItemValue : Number(valItemValue);
                    const finalImg = valItemImage.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80';

                    if (editingValItem) {
                      await updateValueItem(editingValItem.id, {
                        name: valItemName.trim(),
                        type: valItemType.trim(),
                        value: parsedVal,
                        demand: valItemDemand,
                        stability: valItemStability,
                        rarity: valItemRarity,
                        imageUrl: finalImg,
                        description: valItemDesc.trim() || 'Özel oyun eşyası'
                      });
                      showToast(`'${valItemName}' güncellendi! ✅`);
                    } else {
                      await addValueItem({
                        categoryId: catId,
                        name: valItemName.trim(),
                        type: valItemType.trim(),
                        value: parsedVal,
                        demand: valItemDemand,
                        stability: valItemStability,
                        rarity: valItemRarity,
                        imageUrl: finalImg,
                        description: valItemDesc.trim() || 'Özel oyun eşyası'
                      });
                      showToast(`'${valItemName}' başarıyla eklendi! ✨`);
                    }

                    setIsValItemModalOpen(false);
                  }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Eşya Adı *</label>
                      <input
                        type="text"
                        required
                        value={valItemName}
                        onChange={e => setValItemName(e.target.value)}
                        placeholder="Örn: Huge Happy Rock"
                        className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Eşya Tipi / Sınıfı *</label>
                      <input
                        type="text"
                        required
                        value={valItemType}
                        onChange={e => setValItemType(e.target.value)}
                        placeholder="Örn: Huge, Titanic, Rare"
                        className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Değer (Puan) *</label>
                      <input
                        type="text"
                        required
                        value={valItemValue}
                        onChange={e => setValItemValue(e.target.value)}
                        placeholder="15000000"
                        className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Talep</label>
                      <select
                        value={valItemDemand}
                        onChange={e => setValItemDemand(e.target.value)}
                        className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Çok Yüksek">Çok Yüksek 🔥</option>
                        <option value="Yüksek">Yüksek 📈</option>
                        <option value="Normal">Normal ⚖️</option>
                        <option value="Düşük">Düşük 📉</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Stabilite</label>
                      <select
                        value={valItemStability}
                        onChange={e => setValItemStability(e.target.value as any)}
                        className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Yükseliyor">Yükseliyor 🚀</option>
                        <option value="Sabit">Sabit ⚖️</option>
                        <option value="Düşüyor">Düşüyor 🔻</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Input & Device Upload */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">Görsel (URL veya Cihazdan Yükle)</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={valItemImage}
                        onChange={e => {
                          setValItemImage(e.target.value);
                          setValItemPreviewFailed(false);
                        }}
                        placeholder="https://... görsel bağlantısı"
                        className="flex-1 bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <label className="cursor-pointer px-3 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-600/40 text-xs font-bold text-purple-200 flex items-center gap-1.5 shrink-0 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isValItemUploading ? '...' : 'Cihazdan'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsValItemUploading(true);
                            try {
                              const compressed = await compressImageFile(file, 400, 400, 0.75);
                              setValItemImage(compressed);
                              setValItemPreviewFailed(false);
                              showToast('Eşya resmi yüklendi! 📸');
                            } catch {
                              showToast('Görsel işlenemedi.');
                            } finally {
                              setIsValItemUploading(false);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Preview Box */}
                    {valItemImage && (
                      <div className="p-2.5 rounded-xl bg-[#140f2b] border border-purple-800/40 flex items-center gap-3 mt-1">
                        <div className="w-14 h-14 rounded-lg bg-black/60 border border-purple-700/50 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={valItemImage}
                            alt="Önizleme"
                            referrerPolicy="no-referrer"
                            onError={() => setValItemPreviewFailed(true)}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="text-xs">
                          <span className="font-extrabold text-white block truncate">{valItemName || 'Eşya Adı'}</span>
                          <span className="text-amber-400 font-bold block">{valItemValue || '0'} Değer</span>
                          {valItemPreviewFailed && (
                            <span className="text-[10px] text-rose-400">Görsel açılamadı, varsayılan atanacak</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Açıklama</label>
                    <input
                      type="text"
                      value={valItemDesc}
                      onChange={e => setValItemDesc(e.target.value)}
                      placeholder="Eşya hakkında notlar..."
                      className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-900/40">
                    <button
                      type="button"
                      onClick={() => setIsValItemModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-purple-950/40 text-slate-300 text-xs font-semibold"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg"
                    >
                      {editingValItem ? 'Güncelle' : 'Ekle'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab: MM2 DEĞERLERİ YÖNETİMİ */}
      {activeAdminSubTab === 'mm2_items' && (
        <div className="space-y-4">
          {/* Header & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0c0919] p-4 sm:p-5 rounded-2xl border border-red-950/60 shadow-xl">
            <div>
              <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                <span>MM2 Değer Listesi & Eşya Kontrol Merkezi</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-700/50">
                  {filteredMM2.length} / {mm2Items.length} Eşya
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Eşyaların 7 görselli Fandom sayfalarını test edin, değerlerini güncelleyin veya yeni eşya ekleyin.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveAdminSubTab('ai_auto_add')}
                className="px-3.5 py-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 text-purple-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>AI ile Otomatik Ekle</span>
              </button>

              <button
                onClick={() => {
                  setEditingMM2Item(null);
                  setIsAddMM2ItemModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Manuel Eşya Ekle</span>
              </button>
            </div>
          </div>

          {/* Search and Filters Strip */}
          <div className="p-3.5 rounded-2xl bg-[#0c0919] border border-purple-900/40 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={adminMM2Search}
                  onChange={(e) => setAdminMM2Search(e.target.value)}
                  placeholder="Eşya adı veya tipi ara (Örn: Harvester, Bat, Chroma, Luger)..."
                  className="w-full bg-[#130f24] text-xs text-white placeholder-slate-500 pl-9 pr-3 py-2.5 rounded-xl border border-purple-800/40 focus:border-red-500 focus:outline-none"
                />
                {adminMM2Search && (
                  <button
                    onClick={() => setAdminMM2Search('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Sırala:</span>
                <select
                  value={adminMM2Sort}
                  onChange={(e) => setAdminMM2Sort(e.target.value as any)}
                  className="bg-[#130f24] text-xs text-white p-2 rounded-xl border border-purple-800/40 focus:outline-none"
                >
                  <option value="value_desc">En Yüksek Değer (Supreme)</option>
                  <option value="value_asc">En Düşük Değer</option>
                  <option value="name_asc">İsim (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Category & Rarity Filter Badges */}
            <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-purple-900/30 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold text-slate-500">Kategori:</span>
                {['all', 'Knife', 'Gun', 'Pet'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setAdminMM2Category(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      adminMM2Category === cat
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-[#130f24] text-slate-400 hover:text-white border border-purple-900/30'
                    }`}
                  >
                    {cat === 'all' ? 'Tümü' : cat === 'Knife' ? '🗡️ Bıçak' : cat === 'Gun' ? '🔫 Silah' : '🐾 Pet'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold text-slate-500">Tier / Sınıf:</span>
                {['all', 'Ancient', 'Godly', 'Chroma', 'Vintage', 'Unique'].map(rar => (
                  <button
                    key={rar}
                    onClick={() => setAdminMM2Rarity(rar)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      adminMM2Rarity === rar
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-[#130f24] text-slate-400 hover:text-white border border-purple-900/30'
                    }`}
                  >
                    {rar === 'all' ? 'Tümü' : rar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MM2 Items Grid */}
          {filteredMM2.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 bg-[#0c0919] rounded-2xl border border-purple-900/30">
              Aramanıza uygun MM2 eşyası bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredMM2.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[#0d0a1b] border border-purple-900/40 hover:border-red-500/50 flex items-center justify-between gap-3 transition-all hover:bg-[#110d24]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      onClick={() => setSelectedMM2Item(item)}
                      className="w-13 h-13 rounded-xl overflow-hidden bg-black/60 border border-purple-700/40 p-0.5 shrink-0 cursor-pointer group relative"
                      title="Fandom Sayfasını Aç"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform"
                      />
                      <span className="absolute bottom-0 right-0 p-0.5 bg-black/80 rounded text-[9px] text-pink-300">
                        Wiki ↗
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <h4
                          onClick={() => setSelectedMM2Item(item)}
                          className="font-extrabold text-xs sm:text-sm text-white truncate cursor-pointer hover:text-pink-300 transition-colors"
                          title="Detaylı Fandom Sayfasını Aç"
                        >
                          {item.name}
                        </h4>
                        <span className="text-[9px] bg-red-950 text-red-300 px-1.5 py-0.2 rounded border border-red-800/40 font-bold shrink-0">
                          {item.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-amber-400 font-bold block">
                        {item.value.toLocaleString()} Değer • {item.category === 'Knife' ? '🗡️ Bıçak' : item.category === 'Gun' ? '🔫 Silah' : '🐾 Pet'}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        Talep: {item.demand} • Stabilite: {item.stability || 'Durgun'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setSelectedMM2Item(item)}
                      className="p-2 text-pink-300 hover:text-white rounded-lg hover:bg-pink-900/40 transition-colors"
                      title="Fandom Wiki Sayfasını ve 7 Görseli Gör"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingMM2Item(item);
                        setIsAddMM2ItemModalOpen(true);
                      }}
                      className="p-2 text-purple-300 hover:text-white rounded-lg hover:bg-purple-900/40 transition-colors"
                      title="Resim ve Değeri Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        requestDeleteMM2Item(item);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                      title="Eşyayı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subtab: BLOX FRUITS YÖNETİMİ */}
      {activeAdminSubTab === 'blox_fruits' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0c0919] p-4 sm:p-5 rounded-2xl border border-amber-500/40 shadow-xl">
            <div>
              <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <span>Blox Fruits Değer Listesi & Borsa Yönetimi</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/50">
                  {bloxItems.length} Meyve
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kitsune, Dragon, Leopard ve diğer meyvelerin takas değerlerini, satıcı fiyatlarını ve uyanış durumlarını yönetin.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingBloxFruit(null);
                  setIsAddBloxFruitModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Yeni Blox Fruit Ekle</span>
              </button>
            </div>
          </div>

          {/* Fruit Admin List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bloxItems.map((fruit) => (
              <div
                key={fruit.id}
                className="p-4 rounded-2xl bg-[#0e0a1f] border border-purple-800/40 hover:border-amber-500/40 transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-black/40 border border-purple-700/40 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={fruit.imageUrl}
                      alt={fruit.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-white truncate">{fruit.name}</h4>
                      {fruit.awakening && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                          V2
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-purple-300 mt-0.5">{fruit.rarity} • {fruit.type}</div>
                    <div className="text-xs font-black text-emerald-400 mt-1">
                      Değer: {(fruit.value / 1000000).toFixed(1)}M Beli
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 bg-purple-950/20 p-2 rounded-xl">
                  <div>Beli: <span className="text-slate-200 font-bold">{fruit.beliPrice > 0 ? `$${fruit.beliPrice.toLocaleString()}` : 'Gamepass'}</span></div>
                  <div>Robux: <span className="text-amber-300 font-bold">{fruit.robuxPrice > 0 ? `${fruit.robuxPrice} R$` : 'N/A'}</span></div>
                  <div>Talep: <span className="text-amber-400 font-bold">{fruit.demand}</span></div>
                  <div>Stabilite: <span className="text-purple-300 font-bold">{fruit.stability}</span></div>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-purple-900/30">
                  <button
                    onClick={() => setSelectedBloxFruit(fruit)}
                    className="flex-1 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-200 text-[10px] font-bold text-center"
                  >
                    Önizle
                  </button>
                  <button
                    onClick={() => {
                      setEditingBloxFruit(fruit);
                      setIsAddBloxFruitModalOpen(true);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-500/30 text-[10px] font-bold text-center flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => requestDeleteBloxFruit(fruit)}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[10px] font-bold"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAdminSubTab === 'ai_assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Chat Area */}
          <div className="lg:col-span-8 p-5 rounded-3xl bg-gradient-to-br from-[#0e0a1c] via-[#120c24] to-[#090614] border border-purple-500/40 shadow-2xl flex flex-col h-[600px]">
            <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">HarikaScript AI Asistanı</h3>
                  <p className="text-xs text-purple-300">Google Gemini destekli yapay zeka yönetici danışmanı</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Aktif & Hazır</span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2 scrollbar-thin scrollbar-thumb-purple-900">
              {aiChatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
                      : 'bg-[#15102b] border border-purple-800/40 text-slate-200 rounded-bl-none'
                  }`}>
                    <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75">
                      <span className="font-bold">{msg.role === 'user' ? 'Yönetici (Siz)' : 'HarikaScript AI'}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="p-4 rounded-2xl bg-[#15102b] border border-purple-800/40 text-purple-300 text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-pink-400" />
                    <span>AI yanıt düşünüyor ve analiz ediyor...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={e => handleSendAiPrompt(e)} className="pt-3 border-t border-purple-900/40 flex items-center gap-2">
              <input
                type="text"
                value={aiPromptInput}
                onChange={e => setAiPromptInput(e.target.value)}
                placeholder="AI asistana bir şey sor veya komut ver (örn: 'En popüler script kategorisi nedir?')"
                className="flex-1 bg-[#130f24] text-xs sm:text-sm text-white px-4 py-3 rounded-xl border border-purple-800/50 focus:outline-none focus:border-purple-500 shadow-inner"
              />
              <button
                type="submit"
                disabled={isAiLoading || !aiPromptInput.trim()}
                className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
              >
                <span>Gönder</span>
              </button>
            </form>
          </div>

          {/* AI Quick Prompts & Site Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-[#0c0919] border border-purple-900/40 space-y-4 shadow-xl">
              <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Hızlı AI Komutları</span>
              </h4>
              <div className="space-y-2">
                {[
                  'Script hub için en popüler oyun önerileri neler?',
                  'Site coin ekonomisini nasıl dengede tutabilirim?',
                  'MM2 bıçak değerlerini güncellerken nelere dikkat etmeliyim?',
                  'Topluluk katılımını artırmak için ne tür görevler eklemeliyim?',
                  'Roblox executorlar için güvenlik ve UNC ipuçları ver'
                ].map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendAiPrompt(undefined, promptText)}
                    disabled={isAiLoading}
                    className="w-full text-left p-2.5 rounded-xl bg-[#130f24] hover:bg-purple-900/30 border border-purple-800/30 text-xs text-purple-200 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span className="line-clamp-1">{promptText}</span>
                    <Sparkles className="w-3.5 h-3.5 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Site Health Stats Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 to-[#0c0919] border border-purple-900/40 space-y-3 shadow-xl">
              <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Anlık Site Durumu</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 border border-purple-900/30">
                  <span className="text-slate-400 block text-[10px]">Toplam Kullanıcı</span>
                  <span className="font-bold text-white text-sm">{allUsers.length}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-purple-900/30">
                  <span className="text-slate-400 block text-[10px]">Aktif Scriptler</span>
                  <span className="font-bold text-purple-300 text-sm">{scripts.length}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-purple-900/30">
                  <span className="text-slate-400 block text-[10px]">MM2 Eşyaları</span>
                  <span className="font-bold text-red-300 text-sm">{mm2Items.length}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-purple-900/30">
                  <span className="text-slate-400 block text-[10px]">Bakım Modu</span>
                  <span className={`font-bold text-sm ${systemConfig.maintenanceMode ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {systemConfig.maintenanceMode ? 'Aktif ⚠️' : 'Normal ✓'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab: AI AUTO ADD */}
      {activeAdminSubTab === 'ai_auto_add' && (
        <div className="space-y-6">
          {/* Top Banner / Hero */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-[#0c0919] border border-purple-500/40 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="p-2 rounded-xl bg-purple-600/30 border border-purple-500/50 text-purple-300">
                    <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
                  </span>
                  <h3 className="font-black text-lg text-white">Akıllı MM2 Eşya Araştırma & Entegrasyon</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Sıfır Hata Garantisi ✓
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  İstediğiniz Murder Mystery 2 eşyasının adını yazın. Sistemimiz resmi MM2 veritabanı, yapay zeka ve akıllı sentezleyiciyi kullanarak eşyanın <strong>görselini, değerini, nadirliğini ve kategorisini</strong> anında çıkarır ve sitenize entegre eder!
                </p>
              </div>

              {/* Bulk sync button */}
              <button
                onClick={handleBulkSyncPopularItems}
                disabled={isBulkSyncing}
                className="shrink-0 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-xl transition-all flex items-center gap-2 transform active:scale-95 disabled:opacity-50"
              >
                <Flame className={`w-4 h-4 text-slate-950 ${isBulkSyncing ? 'animate-spin' : ''}`} />
                <span>{isBulkSyncing ? 'Entegre Ediliyor...' : 'Günün Trend Eşyalarını Toplu Ekle'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Search and Add Form */}
            <div className="lg:col-span-7 space-y-4 p-6 rounded-3xl bg-[#0c0919] border border-purple-900/50 shadow-xl">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-400" />
                <span>Eşya İsmiyle Araştır & Ekle</span>
              </h4>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAutoAddItem();
                }}
                className="space-y-3"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchItemName}
                    onChange={(e) => setSearchItemName(e.target.value)}
                    placeholder="Örn: Harvester, Bat, Corrupt, Chroma Luger, Darksword..."
                    className="w-full bg-[#130f24] p-3.5 pr-24 rounded-2xl border border-purple-800/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 text-xs text-white placeholder-slate-500 transition-all focus:outline-none"
                  />
                  {searchItemName && (
                    <button
                      type="button"
                      onClick={() => setSearchItemName('')}
                      className="absolute right-20 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isAutoAdding || !searchItemName.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md"
                  >
                    {isAutoAdding ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Aranıyor...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Ekle</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Quick suggestions pills */}
              <div className="space-y-2 pt-2 border-t border-purple-950/60">
                <span className="text-[11px] font-bold text-slate-400 block">
                  ⚡ Tek Tıkla Popüler Eşya Araştır & Ekle:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Harvester',
                    'Bat',
                    'Corrupt',
                    'Icepiercer',
                    "Traveler's Axe",
                    'Darksword',
                    'Gingerscythe',
                    'Candy',
                    'Sugar',
                    'Heartblade',
                    'Chroma Luger',
                    'Chroma Candleflame',
                    'Sakura',
                    'Ocean'
                  ].map((popName) => {
                    const alreadyExists = mm2Items.some(
                      (i) => i.name.toLowerCase() === popName.toLowerCase()
                    );
                    return (
                      <button
                        key={popName}
                        onClick={() => handleAutoAddItem(popName)}
                        disabled={isAutoAdding}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 border ${
                          alreadyExists
                            ? 'bg-purple-950/30 border-purple-900/30 text-slate-400 hover:text-purple-300'
                            : 'bg-purple-900/40 hover:bg-purple-700/60 border-purple-700/50 text-purple-200 hover:border-purple-400'
                        }`}
                      >
                        <span>{popName}</span>
                        {alreadyExists ? (
                          <span className="text-emerald-400 text-[10px]">✓</span>
                        ) : (
                          <Plus className="w-3 h-3 text-purple-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Last Researched Card / Preview */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0c0919] border border-purple-900/50 shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Son Araştırılan Eşya Önizlemesi</span>
                </h4>

                {lastAddedItem ? (
                  <div className="p-4 rounded-2xl bg-[#130f24] border border-purple-800/40 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={lastAddedItem.imageUrl}
                        alt={lastAddedItem.name}
                        className="w-16 h-16 rounded-xl object-cover border border-purple-700/50 bg-black/40"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=400&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-900/70 text-purple-300 border border-purple-700/40">
                            {lastAddedItem.type}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300">
                            {lastAddedItem.category}
                          </span>
                        </div>
                        <h5 className="font-black text-white text-base leading-tight">
                          {lastAddedItem.name}
                        </h5>
                        <p className="text-[11px] text-amber-400 font-extrabold">
                          Değer: {lastAddedItem.value.toLocaleString()} Coin
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-purple-900/30">
                      <div className="p-2 rounded-xl bg-black/30">
                        <span className="text-slate-400 block text-[9px]">Talep (Demand):</span>
                        <span className="font-bold text-white">{lastAddedItem.demand}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/30">
                        <span className="text-slate-400 block text-[9px]">Stabilite:</span>
                        <span className="font-bold text-emerald-400">{lastAddedItem.stability}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-[#130f24]/50 border border-dashed border-purple-900/40 text-center space-y-2">
                    <Sparkles className="w-8 h-8 text-purple-400/50 mx-auto" />
                    <p className="text-xs text-slate-400">
                      Henüz bir eşya araştırmadınız. Yukarıdaki kutuya bir eşya adı yazın veya tek tıkla popüler eşyalardan birini seçin!
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-purple-950 flex items-center justify-between text-xs text-slate-400">
                <span>Sitedeki Toplam MM2 Eşyası:</span>
                <strong className="text-purple-300 font-black">{mm2Items.length} Eşya</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab: MYSTERY CASES (Kutular) */}
      {activeAdminSubTab === 'mystery_cases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Mystery Case Form & Reward Builder */}
          <div id="mystery-case-form" className="lg:col-span-6 p-5 rounded-2xl bg-[#0c0919] border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>{editingMysteryCase ? 'Gizemli Kutuyu Düzenle' : 'Yeni Gizemli Kutu Ekle'}</span>
              </h3>
              {editingMysteryCase && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingMysteryCase(null);
                    setCaseName('');
                    setCasePrice(250);
                    setCaseDesc('');
                    setCaseImage('');
                    setCaseRewards([]);
                  }}
                  className="px-2.5 py-1 text-xs text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 rounded-lg flex items-center gap-1 font-bold"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Düzenlemeyi İptal Et</span>
                </button>
              )}
            </div>

            {editingMysteryCase && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between">
                <span>Şu anda <strong>"{editingMysteryCase.name}"</strong> kutusunu düzenliyorsunuz. Değişiklikleri yaptıktan sonra aşağıdaki butona tıklayın.</span>
              </div>
            )}

            <form onSubmit={handleSaveMysteryCase} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Kutu Adı:</label>
                <input
                  type="text"
                  required
                  value={caseName}
                  onChange={e => setCaseName(e.target.value)}
                  placeholder="Örn: Efsanevi Siber Kutu"
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Açılış Ücreti (Coin):</label>
                  <input
                    type="number"
                    required
                    value={casePrice}
                    onChange={e => setCasePrice(Number(e.target.value))}
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Etiket (Tag):</label>
                  <input
                    type="text"
                    value={caseTag}
                    onChange={e => setCaseTag(e.target.value)}
                    placeholder="Örn: Popüler / Yeni"
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Kutu Rengi (Glow):</label>
                  <input
                    type="color"
                    value={caseColor}
                    onChange={e => setCaseColor(e.target.value)}
                    className="w-full h-10 bg-[#130f24] rounded-xl border border-purple-800/40 cursor-pointer p-1"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-400 block">Kutu Görseli:</label>
                    <label className="text-[10px] text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1 font-semibold">
                      <Upload className="w-3 h-3" />
                      <span>Cihazdan Yükle</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const compressed = await compressImageFile(file, 400, 400, 0.8);
                            setCaseImage(compressed);
                            showToast('Kutu görseli yüklendi! 🖼️');
                          } catch (err) {
                            showToast('Görsel işlenirken hata oluştu.');
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={caseImage}
                    onChange={e => setCaseImage(e.target.value)}
                    placeholder="https://... veya resim yükleyin"
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Açıklama:</label>
                <textarea
                  rows={2}
                  value={caseDesc}
                  onChange={e => setCaseDesc(e.target.value)}
                  placeholder="Kutunun içeriği veya nadir ödüller hakkında bilgi..."
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Rewards Builder Section */}
              <div className="pt-2 border-t border-purple-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">Kutu Ödülleri ({caseRewards.length})</span>
                </div>

                <div className="p-3 rounded-xl bg-[#100c21] border border-purple-900/50 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={rewName}
                      onChange={e => setRewName(e.target.value)}
                      placeholder="Ödül Adı (Örn: 1000 Coin)"
                      className="bg-[#130f24] text-xs text-white p-2 rounded-lg border border-purple-800/40 focus:outline-none"
                    />
                    <select
                      value={rewType}
                      onChange={e => setRewType(e.target.value as any)}
                      className="bg-[#130f24] text-xs text-white p-2 rounded-lg border border-purple-800/40 focus:outline-none"
                    >
                      <option value="coins">Coin</option>
                      <option value="frame">Çerçeve (Frame)</option>
                      <option value="badge">Rozet</option>
                      <option value="cosmetic">Kozmetik</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={rewValue}
                      onChange={e => setRewValue(Number(e.target.value))}
                      placeholder="Değer/Miktar"
                      className="bg-[#130f24] text-xs text-white p-2 rounded-lg border border-purple-800/40 focus:outline-none"
                    />
                    <select
                      value={rewRarity}
                      onChange={e => setRewRarity(e.target.value as any)}
                      className="bg-[#130f24] text-xs text-white p-2 rounded-lg border border-purple-800/40 focus:outline-none"
                    >
                      <option value="common">Yaygın</option>
                      <option value="rare">Nadir</option>
                      <option value="epic">Epik</option>
                      <option value="legendary">Efsanevi</option>
                      <option value="mythic">Mistisizm</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddRewardToCase}
                      className="py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Ödül Ekle
                    </button>
                  </div>
                </div>

                {/* Rewards List */}
                {caseRewards.length > 0 && (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {caseRewards.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-2 rounded-xl bg-[#130f24] border border-purple-900/30 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 text-[10px] font-bold uppercase">{r.type}</span>
                          <span className="font-bold text-white">{r.name}</span>
                          <span className="text-[10px] text-amber-400">({r.value})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveReward(r.id)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingMysteryCase ? 'Kutuyu Güncelle' : 'Kutuyu Sisteme Ekle'}</span>
              </button>
            </form>
          </div>

          {/* Mystery Cases List */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0c0919] border border-amber-500/30 space-y-4">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-400" />
              <span>Mevcut Gizemli Kutular ({mysteryCases.length})</span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {mysteryCases.map(c => (
                <div key={c.id} className="p-4 rounded-2xl bg-[#130f24] border border-purple-900/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shrink-0 overflow-hidden"
                      style={{ backgroundColor: c.color || '#a855f7' }}
                    >
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        '🎁'
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{c.name}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold">{c.tag}</span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{c.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-purple-300 font-medium">
                        <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                          <CoinIcon className="w-3.5 h-3.5" /> {c.price} Coin
                        </span>
                        <span>•</span>
                        <span>{c.rewards?.length || 0} Ödül Seçeneği</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditMysteryCase(c)}
                      className="p-2 text-purple-300 hover:text-white rounded-xl bg-purple-900/30 hover:bg-purple-900/60 transition-colors"
                      title="Kutuyu Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDeleteMysteryCase(c)}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-xl bg-rose-950/20 hover:bg-rose-950/50 transition-colors"
                      title="Kutuyu Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 6: EXECUTORLAR (Ekle, Düzenle, Sil) */}
      {activeAdminSubTab === 'executors' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Executor Form */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0c0919] border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>{editingExecutor ? 'Executor Düzenle' : 'Yeni Executor Ekle'}</span>
              </h3>
              {editingExecutor && (
                <button
                  onClick={() => {
                    setEditingExecutor(null);
                    setExecName('');
                    setExecDownloadUrl('');
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>İptal</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveExecutor} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Executor Adı:</label>
                <input
                  type="text"
                  required
                  value={execName}
                  onChange={e => setExecName(e.target.value)}
                  placeholder="Örn: Solara, Wave, Delta..."
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Versiyon:</label>
                  <input
                    type="text"
                    value={execVersion}
                    onChange={e => setExecVersion(e.target.value)}
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Seviye (Level):</label>
                  <input
                    type="text"
                    value={execLevel}
                    onChange={e => setExecLevel(e.target.value)}
                    placeholder="Level 8"
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">UNC Oranı:</label>
                  <input
                    type="text"
                    value={execUnc}
                    onChange={e => setExecUnc(e.target.value)}
                    placeholder="100% UNC"
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Durum:</label>
                  <select
                    value={execStatus}
                    onChange={e => setExecStatus(e.target.value as any)}
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Güncellemede">Güncellemede</option>
                    <option value="İncelemede">İncelemede</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">İndirme Linki (Resmi Site):</label>
                <input
                  type="url"
                  required
                  value={execDownloadUrl}
                  onChange={e => setExecDownloadUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Açıklama:</label>
                <input
                  type="text"
                  value={execDescription}
                  onChange={e => setExecDescription(e.target.value)}
                  placeholder="Kısa executor açıklaması..."
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                />
              </div>

              {/* Executor Image URL & Upload */}
              <div className="space-y-1.5 p-2.5 rounded-xl bg-[#130f24] border border-purple-800/40">
                <label className="text-[11px] text-emerald-400 font-bold block">Executor Logosu / Resmi:</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={execImage}
                    onChange={e => setExecImage(e.target.value)}
                    placeholder="https://... resim URL'si"
                    className="flex-1 bg-[#0c0919] text-xs text-white p-2 rounded-lg border border-purple-800/40 focus:outline-none"
                  />
                  <label className="px-2.5 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 hover:text-white cursor-pointer text-xs font-bold flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Yükle</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressed = await compressImageFile(file, 400, 400, 0.75);
                            setExecImage(compressed);
                            showToast('Executor resmi optimize edilip yüklendi! 🖼️');
                          } catch {
                            showToast('Resim işlenemedi.');
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                {execImage && (
                  <div className="flex items-center gap-2 pt-1">
                    <img src={execImage} alt="Önizleme" className="w-8 h-8 rounded-lg object-cover border border-emerald-500/40" />
                    <span className="text-[10px] text-slate-400">Resim seçildi</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                {editingExecutor ? 'Executorı ve Resmini Güncelle' : 'Executoru Markete Ekle'}
              </button>
            </form>
          </div>

          {/* Existing Executors List */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-extrabold text-base text-white">Yayındaki Executorlar ({executors.length})</h3>
            <div className="space-y-2">
              {executors.map(ex => (
                <div
                  key={ex.id}
                  className="p-3.5 rounded-xl bg-[#0c0919] border border-purple-900/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <span>{ex.name}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                        {ex.status}
                      </span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {ex.version} • {ex.uncPercent} • {ex.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEditExecutor(ex)}
                      className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-950/40"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => requestDeleteExecutor(ex)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 7: GÖREVLER & ÖDÜLLER (Ekle, Düzenle, Sil) */}
      {activeAdminSubTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0c0919] border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-400" />
                <span>{editingTask ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}</span>
              </h3>
              {editingTask && (
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setTaskTitle('');
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>İptal</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveTask} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Görev Başlığı:</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="Örn: Discord Sunucumuza Katıl"
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Platform / Tür:</label>
                  <select
                    value={taskPlatform}
                    onChange={e => setTaskPlatform(e.target.value as any)}
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                  >
                    <option value="discord">Discord</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="daily">Günlük</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Ödül (Coin):</label>
                  <input
                    type="number"
                    value={taskReward}
                    onChange={e => setTaskReward(Number(e.target.value))}
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Açıklama:</label>
                <input
                  type="text"
                  value={taskDescription}
                  onChange={e => setTaskDescription(e.target.value)}
                  placeholder="Görev açıklaması..."
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Yönlendirme Linki:</label>
                <input
                  type="url"
                  required
                  value={taskActionUrl}
                  onChange={e => setTaskActionUrl(e.target.value)}
                  placeholder="https://discord.gg/... veya YouTube linki"
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                {editingTask ? 'Görevi Güncelle' : 'Görevi Yayına Al'}
              </button>
            </form>
          </div>

          {/* Existing Tasks List */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-extrabold text-base text-white">Yayındaki Görevler ({tasks.length})</h3>
            <div className="space-y-2">
              {tasks.map(t => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-[#0c0919] border border-purple-900/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-white">{t.title}</h4>
                    <span className="text-[11px] text-amber-300 font-semibold">
                      +{t.rewardCoins} Coin • {(t.platform || t.type || 'GÖREV').toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEditTask(t)}
                      className="p-1.5 text-purple-300 hover:text-white rounded-lg hover:bg-purple-900/40"
                      title="Görevi Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        requestDeleteTask(t.id, t.title);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30"
                      title="Görevi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 8: DUYURU / BİLDİRİM GÖNDER */}
      {activeAdminSubTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Kayan Üst Duyuru Şeridi (AnnouncementBar) Yönetimi */}
          <div className="p-5 rounded-2xl bg-[#0c0919] border border-amber-500/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Üst Kayan Duyuru Şeridi (Announcement Bar)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAnnouncementVisible(!isAnnouncementVisible)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  isAnnouncementVisible
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                }`}
              >
                {isAnnouncementVisible ? '✓ Sitede Açık' : '✕ Gizlendi'}
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sitenin en üstünde tüm kullanıcılara canlı görünen duyuru şeridi metnini buradan anında güncelleyin veya gizleyin.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Duyuru Şeridi Metni:</label>
                <textarea
                  rows={3}
                  value={adminAnnouncementText}
                  onChange={e => setAdminAnnouncementText(e.target.value)}
                  placeholder="Duyuru metni..."
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Canlı Önizleme */}
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs">
                <span className="text-[10px] text-purple-300 font-bold block mb-1">Canlı Önizleme:</span>
                <span className="text-amber-300 font-bold mr-1.5">[DUYURU]</span>
                <span className="text-slate-200">{adminAnnouncementText || '(Duyuru metni boş)'}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (adminAnnouncementText.trim()) {
                    updateSystemAnnouncement(adminAnnouncementText.trim());
                  }
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Üst Duyuru Metnini Yayınla & Kaydet</span>
              </button>
            </div>
          </div>

          {/* Card 2: Tüm Kullanıcılara Çan Bildirimi Gönder */}
          <div className="p-5 rounded-2xl bg-[#0c0919] border border-purple-900/40 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <Bell className="w-4 h-4 text-purple-400" />
              <span>Çan Bildirimi Gönder (Tüm Oyuncular)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gönderilen duyuru tüm platform kullanıcılarının bildirim çanında kırmızı rozet ve anlık bildirimle belirir.
            </p>

            <form onSubmit={handleSendNotification} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Bildirim Başlığı:</label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={e => setNotifTitle(e.target.value)}
                  placeholder="Örn: 🎁 Hafta Sonu Özel 500 Coin Hediyesi!"
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Bildirim Mesajı:</label>
                <textarea
                  rows={3}
                  required
                  value={notifMessage}
                  onChange={e => setNotifMessage(e.target.value)}
                  placeholder="Bildirim detayını buraya yazın..."
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Çan Bildirimini Herkese Gönder</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Subtab 10: PROMOSYON & KUPON KODLARI YÖNETİMİ */}
      {activeAdminSubTab === 'promo_codes' && (
        <div className="space-y-6">
          {/* Create Code Form */}
          <div className="p-5 rounded-2xl bg-[#0c0919] border border-amber-500/40 space-y-4">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Yeni Hediye / Promosyon Kodu Oluştur</span>
            </div>
            <p className="text-xs text-slate-400">
              Oluşturulan kod tüm oyuncular tarafından sitedeki "Kupon" kutusuna girilerek 1 defalık bedava coin kazanılabilir.
            </p>

            <form onSubmit={handleCreatePromoCode} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Kupon Kodu (Otomatik Büyük Harf):</label>
                  <input
                    type="text"
                    required
                    value={adminPromoCode}
                    onChange={e => setAdminPromoCode(e.target.value.toUpperCase())}
                    placeholder="Örn: ULTRA2026"
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 font-mono font-bold tracking-wider focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Coin Ödülü:</label>
                  <input
                    type="number"
                    required
                    value={adminPromoCoins}
                    onChange={e => setAdminPromoCoins(Number(e.target.value))}
                    placeholder="300"
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Açıklama / Mesaj:</label>
                <input
                  type="text"
                  value={adminPromoDesc}
                  onChange={e => setAdminPromoDesc(e.target.value)}
                  placeholder="Örn: Hafta Sonu Özel Etkinlik Kuponu (+300 Coin)"
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-pink-600 hover:from-amber-500 hover:to-pink-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Kuponu Kaydet & Yayınla</span>
              </button>
            </form>
          </div>

          {/* Toplu Otomatik Kupon Üretici */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#150e2d] to-amber-950/40 border border-purple-500/40 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Tek Tıkla Toplu Kupon Üretici (Batch Generator)</span>
            </div>
            <p className="text-xs text-slate-400">
              Rastgele eklerle toplu halde promosyon kodları üretip anında Firestore veritabanına kaydeder.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Ön Ek (Prefix):</label>
                <input
                  type="text"
                  value={batchPrefix}
                  onChange={e => setBatchPrefix(e.target.value.toUpperCase())}
                  placeholder="HARIKA"
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Kaç Adet Kod Üretilsin?</label>
                <select
                  value={batchCount}
                  onChange={e => setBatchCount(Number(e.target.value))}
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40"
                >
                  <option value={3}>3 Adet</option>
                  <option value={5}>5 Adet</option>
                  <option value={10}>10 Adet</option>
                  <option value={20}>20 Adet</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Kod Başına Coin Miktarı:</label>
                <input
                  type="number"
                  value={batchCoins}
                  onChange={e => setBatchCoins(Number(e.target.value))}
                  placeholder="400"
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={isGeneratingBatch}
              onClick={async () => {
                setIsGeneratingBatch(true);
                await generateBatchPromoCodes(batchPrefix, batchCount, batchCoins);
                setIsGeneratingBatch(false);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{isGeneratingBatch ? 'Kuponlar Üretiliyor...' : `⚡ ${batchCount} Adet Kuponu Otomatik Üret & Kaydet`}</span>
            </button>
          </div>

          {/* Active Promo Codes List */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Gift className="w-4 h-4 text-pink-400" />
              <span>Sistemdeki Aktif Kupon Kodları ({promoCodes.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {promoCodes.map(promo => (
                <div
                  key={promo.code}
                  className="p-4 rounded-2xl bg-[#0d091b] border border-purple-800/40 hover:border-pink-500/50 flex flex-col justify-between space-y-2.5 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-pink-300">{promo.code}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 font-extrabold text-xs flex items-center gap-1.5">
                      <CoinIcon className="w-3.5 h-3.5" />
                      +{promo.rewardCoins}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate">{promo.description}</p>

                  <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-bold">✓ Aktif</span>
                    <button
                      onClick={() => deletePromoCode(promo.code)}
                      className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Sil</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 11: ROBLOX MÜZİK ID YÖNETİMİ */}
      {activeAdminSubTab === 'songs' && (
        <div className="space-y-6">
          {/* Add Song Form */}
          <div className="p-5 rounded-2xl bg-[#0c0919] border border-pink-500/40 space-y-4">
            <div className="flex items-center gap-2 text-pink-300 font-bold text-sm">
              <Radio className="w-4 h-4 text-pink-400" />
              <span>Yeni Roblox Ses / Müzik ID Tanımla</span>
            </div>

            <form onSubmit={handleCreateSong} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Şarkı Adı:</label>
                  <input
                    type="text"
                    required
                    value={adminSongTitle}
                    onChange={e => setAdminSongTitle(e.target.value)}
                    placeholder="Örn: Kordhell - Scopin"
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Sanatçı:</label>
                  <input
                    type="text"
                    value={adminSongArtist}
                    onChange={e => setAdminSongArtist(e.target.value)}
                    placeholder="Örn: Kordhell"
                    className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-emerald-400 font-bold block mb-1">Roblox Ses ID:</label>
                  <input
                    type="text"
                    required
                    value={adminSongAudioId}
                    onChange={e => setAdminSongAudioId(e.target.value)}
                    placeholder="Örn: 9114717145"
                    className="w-full bg-[#130f24] text-xs text-emerald-300 font-mono font-bold p-2.5 rounded-xl border border-emerald-500/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Kategori:</label>
                <select
                  value={adminSongCategory}
                  onChange={e => setAdminSongCategory(e.target.value as any)}
                  className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                >
                  <option value="Phonk">Phonk</option>
                  <option value="Türkçe">Türkçe</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Meme">Meme</option>
                  <option value="Pop/Trap">Pop/Trap</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Şarkıyı Arşive Ekle</span>
              </button>
            </form>
          </div>

          {/* Songs List */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-400" />
              <span>Arşivdeki Müzik Kodları ({songs.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {songs.map(song => (
                <div
                  key={song.id}
                  className="p-3.5 rounded-2xl bg-[#0d091b] border border-purple-800/40 flex items-center justify-between gap-3 shadow-lg"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-white block truncate">{song.title}</span>
                    <span className="text-[10px] text-slate-400 truncate">{song.artist} • {song.category}</span>
                    <span className="font-mono text-xs text-emerald-400 font-bold block mt-0.5">{song.audioId}</span>
                  </div>

                  <button
                    onClick={() => deleteSong(song.id)}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white transition-colors shrink-0"
                    title="Şarkıyı Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 12: MM2 TAKAS İLANLARI DENETİMİ */}
      {activeAdminSubTab === 'trades' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <span>Topluluk MM2 Takas İlanları Denetimi ({tradePosts.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Oyuncuların yayınladığı tüm takas ilanlarını inceleyin, uygunsuz veya sahte ilanları tek tıkla silin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tradePosts.map(post => (
              <div
                key={post.id}
                className="p-4 rounded-2xl bg-[#0d091b] border border-purple-800/40 space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{post.author}</span>
                    <span className="text-[10px] text-slate-500">({post.createdAt})</span>
                  </div>

                  <button
                    onClick={() => deleteTradePost(post.id)}
                    className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>İlanı Kaldır</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 font-bold block mb-1">Verilenler:</span>
                    <span className="text-white font-medium">{post.offering.join(', ')}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/30">
                    <span className="text-[10px] text-amber-400 font-bold block mb-1">Arananlar:</span>
                    <span className="text-white font-medium">{post.lookingFor.join(', ')}</span>
                  </div>
                </div>

                {post.notes && (
                  <p className="text-[11px] text-slate-300 bg-black/40 p-2 rounded-lg italic">
                    "{post.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 13: CANLI ANALİTİK & İSTATİSTİKLER */}
      {activeAdminSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0c0919] border border-amber-500/30 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Dolaşımdaki Toplam Coin</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-300">
                {allUsers.reduce((sum, u) => sum + (u.coins || 0), 0).toLocaleString('tr-TR')} 🪙
              </div>
              <p className="text-[11px] text-slate-400">
                Ortalama Bakiye: <span className="text-white font-bold">{allUsers.length > 0 ? Math.round(allUsers.reduce((sum, u) => sum + (u.coins || 0), 0) / allUsers.length).toLocaleString('tr-TR') : 0} Coin</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0919] border border-purple-500/30 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Toplam Script & Kütüphane</span>
                <FileCode2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-300">
                {scripts.length} Adet
              </div>
              <p className="text-[11px] text-slate-400">
                Toplam Beğeni: <span className="text-white font-bold">{scripts.reduce((sum, s) => sum + (s.likes || 0), 0)}</span> | Görüntüleme: <span className="text-white font-bold">{scripts.reduce((sum, s) => sum + (s.views || 0), 0)}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0919] border border-red-500/30 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">MM2 Değer Listesi & Eşyalar</span>
                <Flame className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-black text-red-300">
                {mm2Items.length} Eşya
              </div>
              <p className="text-[11px] text-slate-400">
                Toplam Değer Puanı: <span className="text-white font-bold">{mm2Items.reduce((sum, m) => sum + (m.value || 0), 0).toLocaleString('tr-TR')}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0919] border border-emerald-500/30 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Sistem & Güvenlik Durumu</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-black text-emerald-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>%100 Çevrimiçi</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Bakım Modu: <span className={systemConfig.maintenanceMode ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{systemConfig.maintenanceMode ? 'Aktif (Bakımda)' : 'Kapalı (Normal)'}</span>
              </p>
            </div>
          </div>

          {/* Script Categories Breakdown & MM2 Rarity Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Script Categories */}
            <div className="p-5 rounded-2xl bg-[#0c0919] border border-purple-900/40 space-y-4">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-purple-400" />
                <span>Script Kategorileri Dağılımı</span>
              </h4>

              <div className="space-y-3">
                {(['Auto Farm', 'Combat', 'Visual/ESP', 'Hub', 'Misc'] as const).map(cat => {
                  const count = scripts.filter(s => s.category === cat).length;
                  const pct = scripts.length > 0 ? Math.round((count / scripts.length) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-semibold">{cat}</span>
                        <span className="text-purple-300 font-mono font-bold">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-purple-950/60 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MM2 Rarity Breakdown */}
            <div className="p-5 rounded-2xl bg-[#0c0919] border border-red-900/40 space-y-4">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                <span>MM2 Nadirlik Sınıflandırması</span>
              </h4>

              <div className="space-y-3">
                {(['Godly', 'Ancient', 'Chroma', 'Vintage', 'Unique'] as const).map(rarity => {
                  const count = mm2Items.filter(m => m.type === rarity).length;
                  const pct = mm2Items.length > 0 ? Math.round((count / mm2Items.length) * 100) : 0;
                  return (
                    <div key={rarity} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-semibold">{rarity}</span>
                        <span className="text-red-300 font-mono font-bold">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-red-950/60 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top 5 Richest Users */}
          <div className="p-5 rounded-2xl bg-[#0c0919] border border-amber-500/30 space-y-4">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>En Yüksek Bakiyeli Oyuncular (Liderlik Tablosu)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[...allUsers]
                .sort((a, b) => (b.coins || 0) - (a.coins || 0))
                .slice(0, 5)
                .map((u, idx) => (
                  <div
                    key={u.uid}
                    className="p-3 rounded-xl bg-[#130e26] border border-amber-500/20 flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400">#{idx + 1}</span>
                      {u.role === 'admin' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                          Admin
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block truncate">{u.username}</span>
                      <span className="text-[10px] text-slate-400 truncate block">{u.email}</span>
                    </div>
                    <div className="text-xs font-extrabold text-amber-300 font-mono">
                      {u.coins.toLocaleString('tr-TR')} 🪙
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 14: SİSTEM AYARLARI & BAKIM MODU */}
      {activeAdminSubTab === 'settings' && (
        <div className="space-y-6">
          {/* Maintenance Mode Card */}
          <div className={`p-6 rounded-3xl border transition-all ${
            adminMaintenanceMode
              ? 'bg-amber-950/40 border-amber-500/60 shadow-amber-500/20 shadow-2xl'
              : 'bg-[#0c0919] border-purple-900/40'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${adminMaintenanceMode ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
                  <h3 className="font-black text-base text-white">Site Bakım Modu (Maintenance Mode)</h3>
                </div>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Bakım modu aktif edildiğinde normal ziyaretçilere şık bir bakım bildirimi gösterilir; takas ve içerik ekleme işlemleri kilitlenir. Yöneticiler siteyi kesintisiz kullanabilir.
                </p>
              </div>

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setAdminMaintenanceMode(!adminMaintenanceMode)}
                className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 shrink-0 ${
                  adminMaintenanceMode
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40 scale-105'
                    : 'bg-purple-950/80 hover:bg-purple-900 text-slate-300 border border-purple-800/40'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${adminMaintenanceMode ? 'bg-slate-950' : 'bg-slate-500'}`} />
                <span>{adminMaintenanceMode ? 'Bakım Modu: AÇIK ⚠️' : 'Bakım Modu: KAPALI ✅'}</span>
              </button>
            </div>

            {adminMaintenanceMode && (
              <div className="mt-4 pt-4 border-t border-amber-500/30 space-y-2 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-amber-300 block">Ziyaretçilere Gösterilecek Bakım Mesajı:</label>
                <input
                  type="text"
                  value={adminMaintenanceMsg}
                  onChange={e => setAdminMaintenanceMsg(e.target.value)}
                  placeholder="Bakım mesajını girin..."
                  className="w-full bg-[#140e2b] text-xs text-white p-3 rounded-xl border border-amber-500/40 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          {/* Site Feature Toggles */}
          <div className="p-6 rounded-3xl bg-[#0c0919] border border-purple-900/40 space-y-5">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Platform İzinleri & Güvenlik Ayarları</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Allow Trade Creation */}
              <div className="p-4 rounded-2xl bg-[#120e24] border border-purple-800/30 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-xs text-white block">Yeni Takas İlanı Oluşturma</span>
                  <span className="text-[11px] text-slate-400">Oyuncuların yeni MM2 takas ilanı yayınlamasına izin ver.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminAllowTrades(!adminAllowTrades)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    adminAllowTrades ? 'bg-emerald-600 text-white' : 'bg-rose-950 text-rose-300 border border-rose-900/40'
                  }`}
                >
                  {adminAllowTrades ? 'Açık' : 'Kapalı'}
                </button>
              </div>

              {/* Allow New Registrations */}
              <div className="p-4 rounded-2xl bg-[#120e24] border border-purple-800/30 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-xs text-white block">Yeni Kullanıcı Kaydı</span>
                  <span className="text-[11px] text-slate-400">Sisteme yeni kullanıcıların katılmasına izin ver.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminAllowReg(!adminAllowReg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    adminAllowReg ? 'bg-emerald-600 text-white' : 'bg-rose-950 text-rose-300 border border-rose-900/40'
                  }`}
                >
                  {adminAllowReg ? 'Açık' : 'Kapalı'}
                </button>
              </div>

              {/* Auto Approve Scripts */}
              <div className="p-4 rounded-2xl bg-[#120e24] border border-purple-800/30 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-xs text-white block">Otomatik Script Onayı</span>
                  <span className="text-[11px] text-slate-400">Yöneticiler veya onaylı geliştiriciler script eklediğinde anında yayınla.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminAutoApprove(!adminAutoApprove)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    adminAutoApprove ? 'bg-emerald-600 text-white' : 'bg-rose-950 text-rose-300 border border-rose-900/40'
                  }`}
                >
                  {adminAutoApprove ? 'Açık' : 'Kapalı'}
                </button>
              </div>

              {/* Anti Spam & Rate Limit */}
              <div className="p-4 rounded-2xl bg-[#120e24] border border-purple-800/30 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-xs text-white block">Anti-Spam & Kötüye Kullanım Koruması</span>
                  <span className="text-[11px] text-slate-400">Tekrarlanan kupon veya kopyalama işlemlerini filtreler.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminAntiSpam(!adminAntiSpam)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    adminAntiSpam ? 'bg-emerald-600 text-white' : 'bg-rose-950 text-rose-300 border border-rose-900/40'
                  }`}
                >
                  {adminAntiSpam ? 'Açık' : 'Kapalı'}
                </button>
              </div>
            </div>

            {/* Script Copy Cooldown & Lucky Spin Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#120e24] border border-purple-800/30 space-y-2">
                <label className="text-xs font-bold text-white block">Script Kopyalama Bekleme Süresi (Cooldown):</label>
                <select
                  value={adminCooldown}
                  onChange={e => setAdminCooldown(Number(e.target.value))}
                  className="w-full bg-[#181132] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                >
                  <option value={0}>Bekleme Yok (0 saniye)</option>
                  <option value={3}>3 Saniye</option>
                  <option value={5}>5 Saniye</option>
                  <option value={10}>10 Saniye</option>
                  <option value={30}>30 Saniye (Spam Koruması)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-[#120e24] border border-purple-800/30 space-y-2">
                <label className="text-xs font-bold text-white block">Günlük Çark Maksimum Çevirme Limiti:</label>
                <select
                  value={adminMaxSpins}
                  onChange={e => setAdminMaxSpins(Number(e.target.value))}
                  className="w-full bg-[#181132] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                >
                  <option value={1}>1 Çevirme / Gün</option>
                  <option value={2}>2 Çevirme / Gün</option>
                  <option value={3}>3 Çevirme / Gün (Varsayılan)</option>
                  <option value={5}>5 Çevirme / Gün</option>
                </select>
              </div>
            </div>

            {/* Save All Settings Button */}
            <div className="pt-3">
              <button
                type="button"
                disabled={isSavingSettings}
                onClick={async () => {
                  setIsSavingSettings(true);
                  await updateSystemConfig({
                    maintenanceMode: adminMaintenanceMode,
                    maintenanceMessage: adminMaintenanceMsg,
                    allowNewRegistrations: adminAllowReg,
                    allowTradeCreation: adminAllowTrades,
                    scriptCopyCooldownSeconds: adminCooldown,
                    autoApproveScripts: adminAutoApprove,
                    antiSpamEnabled: adminAntiSpam,
                    maxDailyLuckySpins: adminMaxSpins
                  });
                  setIsSavingSettings(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingSettings ? 'Ayarlar Kaydediliyor...' : 'Tüm Sistem Ayarlarını Kaydet & Senkronize Et'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 15: VERİ TABANI YEDEKLEME & GERİ YÜKLEME */}
      {activeAdminSubTab === 'backup' && (
        <div className="space-y-6">
          {/* Export Backup Card */}
          <div className="p-6 rounded-3xl bg-[#0c0919] border border-purple-900/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Tam Sistem Veri Tabanı Yedeği Al (JSON Export)</h3>
                <p className="text-xs text-slate-400">
                  Tüm scriptleri, oyunları, MM2 eşyalarını, executorları, kupon kodlarını, kozmetikleri ve görevleri tek tıkla bilgisayarınıza indirin.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const jsonStr = exportFullBackup();
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `harikascript-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('Veri tabanı yedeği başarıyla indirildi! 💾');
              }}
              className="py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Yedek Dosyasını (.json) İndir</span>
            </button>
          </div>

          {/* Import / Restore Backup Card */}
          <div className="p-6 rounded-3xl bg-[#0c0919] border border-purple-900/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Yedekten Geri Yükle (JSON Import)</h3>
                <p className="text-xs text-slate-400">
                  Daha önce indirdiğiniz HarikaScript .json yedeğini seçin veya JSON metnini yapıştırıp sisteme yükleyin.
                </p>
              </div>
            </div>

            {/* File Upload Selector */}
            <div className="p-4 rounded-2xl bg-[#120e24] border border-dashed border-purple-800/60 text-center space-y-2">
              <input
                type="file"
                accept=".json"
                id="backup-file-input"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = evt => {
                    const content = evt.target?.result as string;
                    if (content) setBackupJsonInput(content);
                  };
                  reader.readAsText(file);
                }}
              />
              <label
                htmlFor="backup-file-input"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/60 hover:bg-purple-800 text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Bilgisayardan .json Dosyası Seç</span>
              </label>
              <p className="text-[11px] text-slate-500">veya aşağıdaki alana doğrudan JSON metnini yapıştırabilirsiniz</p>
            </div>

            <textarea
              rows={4}
              value={backupJsonInput}
              onChange={e => setBackupJsonInput(e.target.value)}
              placeholder="Yedek JSON içeriğini buraya yapıştırın..."
              className="w-full bg-[#120e24] text-xs text-emerald-300 font-mono p-3 rounded-xl border border-purple-800/40 focus:outline-none focus:border-emerald-500"
            />

            {restoreFeedback && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                restoreFeedback.success ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
              }`}>
                {restoreFeedback.message}
              </div>
            )}

            <button
              type="button"
              disabled={!backupJsonInput.trim() || isRestoring}
              onClick={async () => {
                if (!backupJsonInput.trim()) return;
                setIsRestoring(true);
                const res = await restoreFromBackup(backupJsonInput);
                setRestoreFeedback(res);
                setIsRestoring(false);
              }}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
              <span>{isRestoring ? 'Yedek Yükleniyor...' : 'Yedeği Sisteme Yükle ve Senkronize Et'}</span>
            </button>
          </div>

          {/* Factory Reset Danger Zone */}
          <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Fabrika Ayarlarına Sıfırla (Reseed Initial Data)</h3>
                <p className="text-xs text-rose-300/80">
                  Verileriniz bozulduysa veya ilk sürüme dönmek isterseniz tüm script, oyun, MM2 eşyaları ve kuponları orijinal varsayılan başlangıç verileriyle yeniler.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="py-2.5 px-5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-600/50 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Varsayılan Verileri Geri Yükle</span>
            </button>

            {/* Confirm Reset Modal */}
            {showConfirmReset && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="max-w-md w-full rounded-2xl bg-[#0f0c22] border border-rose-500/40 p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-white">Emin misiniz?</h4>
                      <p className="text-xs text-slate-300">Tüm koleksiyonlar başlangıç fabrika verileriyle değiştirilecektir.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await resetToDefaultData();
                        setShowConfirmReset(false);
                      }}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                    >
                      Evet, Sıfırla
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmReset(false)}
                      className="py-2.5 px-4 bg-purple-950/60 hover:bg-purple-900 border border-purple-800/40 text-slate-300 text-xs font-semibold rounded-xl transition-all"
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtab 16: GÜVENLİK & İŞLEM GÜNLÜĞÜ (AUDIT LOGS) */}
      {activeAdminSubTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Yönetici Güvenlik & İşlem Günlüğü ({auditLogs.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Yöneticilerin gerçekleştirdiği tüm bakiye, içerik, moderasyon ve sistem ayar işlemleri otomatik loglanır.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const logText = auditLogs
                    .map(l => `[${l.timestamp}] [${l.category.toUpperCase()}] ${l.adminName} (${l.adminEmail}): ${l.action} -> ${l.details}`)
                    .join('\n');
                  const blob = new Blob([logText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `harikascript-audit-logs-${new Date().toISOString().split('T')[0]}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  showToast('İşlem günlüğü metin dosyası olarak indirildi! 📝');
                }}
                className="px-3 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-800/40 text-xs font-bold text-slate-300 hover:text-white rounded-xl transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>TXT İndir</span>
              </button>

              <button
                type="button"
                onClick={clearAuditLogs}
                className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-xs font-bold text-rose-300 hover:text-white rounded-xl transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Temizle</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['all', 'economy', 'content', 'users', 'system', 'security'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedLogCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedLogCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-extrabold'
                      : 'bg-[#120e24] text-slate-400 hover:text-white border border-purple-900/30'
                  }`}
                >
                  {cat === 'all' && 'Tümü'}
                  {cat === 'economy' && 'Ekonomi (Coin)'}
                  {cat === 'content' && 'İçerik'}
                  {cat === 'users' && 'Kullanıcılar'}
                  {cat === 'system' && 'Sistem'}
                  {cat === 'security' && 'Güvenlik'}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="İşlem veya detay ara..."
                value={logSearchQuery}
                onChange={e => setLogSearchQuery(e.target.value)}
                className="w-full bg-[#120e24] text-xs text-white placeholder-slate-500 pl-8 pr-3 py-1.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Logs List */}
          <div className="space-y-2">
            {auditLogs
              .filter(l => selectedLogCategory === 'all' || l.category === selectedLogCategory)
              .filter(l =>
                !logSearchQuery ||
                l.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                l.details.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                l.adminName.toLowerCase().includes(logSearchQuery.toLowerCase())
              ).length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-[#0c0919] rounded-2xl border border-purple-900/30">
                Seçilen filtrelere uygun işlem kaydı bulunamadı.
              </div>
            ) : (
              auditLogs
                .filter(l => selectedLogCategory === 'all' || l.category === selectedLogCategory)
                .filter(l =>
                  !logSearchQuery ||
                  l.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                  l.details.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                  l.adminName.toLowerCase().includes(logSearchQuery.toLowerCase())
                )
                .map(log => {
                  const badgeColor =
                    log.category === 'economy'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : log.category === 'content'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : log.category === 'users'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : log.category === 'security'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40';

                  return (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-[#0c0919] border border-purple-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                            {log.category.toUpperCase()}
                          </span>
                          <span className="font-extrabold text-xs text-white">{log.action}</span>
                          <span className="text-[10px] text-slate-500">({log.timestamp})</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                          {log.details}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[11px] font-bold text-amber-300 block">{log.adminName}</span>
                        <span className="text-[10px] text-slate-500">{log.adminEmail}</span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

