import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  User,
  Shield,
  Volume2,
  VolumeX,
  Volume1,
  Bell,
  Palette,
  Flame,
  Database,
  Download,
  Upload,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  Sliders,
  Moon,
  Zap,
  HelpCircle,
  Gamepad2,
  ExternalLink,
  Sparkles,
  Layers,
  Monitor,
  Check,
  RotateCcw
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    setUser,
    showToast,
    exportFullBackup,
    restoreFromBackup,
    resetToDefaultData,
    setIsAuthModalOpen,
    isAuthorizedAdmin,
    setActiveTab
  } = useApp();

  // Active Category Section inside Settings
  const [activeSection, setActiveSection] = useState<'profile' | 'appearance' | 'mm2' | 'sound' | 'data'>(
    'profile'
  );

  // Local Form State for Profile
  const [username, setUsername] = useState(user.username || '');
  const [robloxUsername, setRobloxUsername] = useState(user.robloxUsername || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');

  // Sound Preferences
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('harikascript_sound_enabled') !== 'false';
  });
  const [soundVolume, setSoundVolume] = useState<number>(() => {
    const saved = localStorage.getItem('harikascript_sound_volume');
    return saved !== null ? parseInt(saved, 10) : 80;
  });
  const [chatSounds, setChatSounds] = useState<boolean>(() => {
    return localStorage.getItem('harikascript_chat_sounds') !== 'false';
  });

  // Notifications Preferences
  const [tradeNotifications, setTradeNotifications] = useState<boolean>(() => {
    return localStorage.getItem('harikascript_trade_notifs') !== 'false';
  });
  const [toastDuration, setToastDuration] = useState<number>(() => {
    const saved = localStorage.getItem('harikascript_toast_duration');
    return saved !== null ? parseInt(saved, 10) : 3;
  });

  // Appearance & Themes
  const [themeMode, setThemeMode] = useState<string>(() => {
    return localStorage.getItem('harikascript_theme_mode') || 'cyber';
  });
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('harikascript_animations') !== 'false';
  });
  const [glowIntensity, setGlowIntensity] = useState<string>(() => {
    return localStorage.getItem('harikascript_glow') || 'normal';
  });
  const [compactCards, setCompactCards] = useState<boolean>(() => {
    return localStorage.getItem('harikascript_compact_cards') === 'true';
  });

  // MM2 Trading Preferences
  const [tradeAcceptance, setTradeAcceptance] = useState<boolean>(() => {
    return localStorage.getItem('harikascript_allow_trades') !== 'false';
  });
  const [valueStandard, setValueStandard] = useState<string>(() => {
    return localStorage.getItem('harikascript_value_standard') || 'supreme';
  });
  const [numberFormat, setNumberFormat] = useState<string>(() => {
    return localStorage.getItem('harikascript_num_format') || 'formatted';
  });
  const [autoOpenWiki, setAutoOpenWiki] = useState<boolean>(() => {
    return localStorage.getItem('harikascript_auto_wiki') !== 'false';
  });

  // Privacy
  const [showOnlineStatus, setShowOnlineStatus] = useState<boolean>(() => {
    return localStorage.getItem('harikascript_show_online') !== 'false';
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = () => {
    if (!username.trim()) {
      showToast('Kullanıcı adı boş bırakılamaz!');
      return;
    }

    const updatedUser = {
      ...user,
      username: username.trim(),
      robloxUsername: robloxUsername.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim() || user.avatarUrl
    };

    setUser(updatedUser);
    localStorage.setItem('harikascript_user_profile_v1', JSON.stringify(updatedUser));
    setIsSaved(true);
    showToast('Profil ve Roblox ayarları kaydedildi! ✨');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSoundToggle = (val: boolean) => {
    setSoundEnabled(val);
    localStorage.setItem('harikascript_sound_enabled', String(val));
    showToast(val ? 'Ses efektleri aktifleştirildi 🔊' : 'Ses efektleri kapatıldı 🔇');
  };

  const handleVolumeChange = (val: number) => {
    setSoundVolume(val);
    localStorage.setItem('harikascript_sound_volume', String(val));
  };

  const handleThemeChange = (mode: string) => {
    setThemeMode(mode);
    localStorage.setItem('harikascript_theme_mode', mode);
    showToast(`Tema güncellendi: ${mode.toUpperCase()} ✨`);
  };

  const handleToggleAnimations = (val: boolean) => {
    setAnimationsEnabled(val);
    localStorage.setItem('harikascript_animations', String(val));
    showToast(val ? 'Akıcı animasyonlar açıldı.' : 'Performans modu: Animasyonlar kapatıldı.');
  };

  const handleToggleCompact = (val: boolean) => {
    setCompactCards(val);
    localStorage.setItem('harikascript_compact_cards', String(val));
    showToast(val ? 'Kompakt liste görünümü seçildi.' : 'Standart geniş kart görünümü seçildi.');
  };

  const handleClearCache = () => {
    showToast('Önbellek temizlendi ve veriler tazelendi! ⚡');
    setTimeout(() => window.location.reload(), 700);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Settings Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#140e2d] to-[#0a0717] border border-purple-600/40 shadow-xl flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40">
              <Settings className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">Sistem & Tercih Ayarları</h2>
          </div>
          <p className="text-xs text-slate-300">
            Profilinizi, MM2 takas tercihlerinizi, ses seviyelerini ve arayüz deneyimini özelleştirin.
          </p>
        </div>

        {isAuthorizedAdmin && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-1.5">
              <span>👑 Yönetici Profili</span>
            </span>
            <button
              onClick={() => setActiveTab('admin')}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-extrabold shadow-md transition-colors"
            >
              Admin Paneli
            </button>
          </div>
        )}
      </div>

      {/* Navigation Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'profile', label: 'Profil & Roblox', icon: User },
          { id: 'appearance', label: 'Görünüm & Tema', icon: Palette },
          { id: 'mm2', label: 'MM2 & Takas Sistemi', icon: Flame },
          { id: 'sound', label: 'Ses & Bildirimler', icon: Volume2 },
          { id: 'data', label: 'Veri & Güvenlik', icon: Database }
        ].map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveSection(cat.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                activeSection === cat.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/60 shadow-lg shadow-purple-900/30 font-extrabold'
                  : 'bg-[#0d091e] text-slate-400 hover:text-white border-purple-900/40 hover:bg-purple-950/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: PROFIL & ROBLOX */}
      {activeSection === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-8 p-6 rounded-3xl bg-[#0c0919] border border-purple-900/40 space-y-4 shadow-lg">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-purple-900/40 pb-3">
              <User className="w-4 h-4 text-purple-400" />
              <span>Kullanıcı & Topluluk Kimliği</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Topluluk Kullanıcı Adı:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınız..."
                  className="w-full bg-[#130f24] text-xs text-white p-3 rounded-xl border border-purple-800/40 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-400 block">
                    Roblox Kullanıcı Adı (MM2 Takasları İçin):
                  </label>
                  {robloxUsername && (
                    <a
                      href={`https://www.roblox.com/search/users?keyword=${encodeURIComponent(robloxUsername)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-purple-400 hover:text-pink-300 font-bold flex items-center gap-1"
                    >
                      <span>Roblox Profili</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Gamepad2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type="text"
                    value={robloxUsername}
                    onChange={(e) => setRobloxUsername(e.target.value)}
                    placeholder="Örn: Pro_RobloxPlayer2026"
                    className="w-full bg-[#130f24] text-xs text-white pl-9 pr-3 py-3 rounded-xl border border-purple-800/40 focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Roblox adınız, diğer oyuncular sizinle takas yapmak istediğinde oyunda bulmaları için kullanılır.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Profil Fotoğrafı URL:</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://... profil görseli bağlantısı"
                  className="w-full bg-[#130f24] text-xs text-white p-3 rounded-xl border border-purple-800/40 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Biyografi & Takas Notu:</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Koleksiyonunuz, takas hedefleriniz veya kendiniz hakkında birkaç cümle..."
                  className="w-full bg-[#130f24] text-xs text-white p-3 rounded-xl border border-purple-800/40 focus:border-purple-400 focus:outline-none resize-none"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                <span>{isSaved ? 'Değişiklikler Kaydedildi!' : 'Profil Ayarlarını Kaydet'}</span>
              </button>
            </div>
          </div>

          {/* Quick Profile Summary Card */}
          <div className="md:col-span-4 p-6 rounded-3xl bg-[#0c0919] border border-purple-900/40 space-y-4 shadow-lg text-center">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-purple-500/60 shadow-xl shadow-purple-900/40">
              <img
                src={avatarUrl || user.avatarUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80'}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-black text-white text-base">{username || user.username}</h4>
              <span className="text-xs text-purple-400 font-mono">
                {robloxUsername ? `@${robloxUsername}` : 'Roblox bağlı değil'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#140f28] border border-purple-900/40 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Bakiye:</span>
                <strong className="text-amber-300 font-black">{user.coins.toLocaleString()} Coin</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seviye:</span>
                <strong className="text-purple-300 font-bold">Lv. {user.level || 1}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Yetki:</span>
                <strong className="text-emerald-400 font-bold">{user.role === 'admin' ? 'Baş Yönetici' : 'Oyuncu'}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: GÖRÜNÜM & TEMA */}
      {activeSection === 'appearance' && (
        <div className="p-6 rounded-3xl bg-[#0c0919] border border-purple-900/40 space-y-6 shadow-lg">
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-purple-900/40 pb-3">
              <Palette className="w-4 h-4 text-pink-400" />
              <span>Arayüz & Tema Seçenekleri</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Sitenin genel renk şemasını ve performans modunu cihazınıza göre optimize edin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 'cyber', name: 'Siber Mor', desc: 'Klasik fütüristik mor siber uzay', gradient: 'from-purple-900 to-indigo-950 border-purple-500' },
              { id: 'neon', name: 'Neon Gece', desc: 'Canlı pembe ve neon parıltılar', gradient: 'from-pink-950 to-purple-950 border-pink-500' },
              { id: 'midnight', name: 'Saf OLED Siyah', desc: 'Derin siyah, minimum pil tüketimi', gradient: 'from-slate-950 to-black border-slate-700' },
              { id: 'crimson', name: 'Kızıl Alev', desc: 'Agresif MM2 kırmızı & turuncu tonlar', gradient: 'from-red-950 to-amber-950 border-red-500' },
              { id: 'emerald', name: 'Zümrüt Matris', desc: 'Hacker yeşili ve terminal ambiyansı', gradient: 'from-emerald-950 to-teal-950 border-emerald-500' }
            ].map(thm => (
              <button
                key={thm.id}
                onClick={() => handleThemeChange(thm.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  themeMode === thm.id
                    ? `bg-gradient-to-br ${thm.gradient} text-white shadow-xl scale-[1.02]`
                    : 'bg-[#130f24] border-purple-900/40 text-slate-400 hover:text-white hover:border-purple-600/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-white">{thm.name}</span>
                  {themeMode === thm.id && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <span className="text-[11px] text-slate-400 block">{thm.desc}</span>
              </button>
            ))}
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-3 border-t border-purple-900/40">
            {/* Animations Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#130f24] border border-purple-900/40">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Animasyon Efektleri & Geçişler</span>
                <span className="text-[10px] text-slate-400">Düşük FPS alıyorsanız kapatarak hızı iki katına çıkarabilirsiniz.</span>
              </div>
              <button
                onClick={() => handleToggleAnimations(!animationsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  animationsEnabled ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    animationsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Compact Cards Mode */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#130f24] border border-purple-900/40">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Kompakt Kart Görünümü</span>
                <span className="text-[10px] text-slate-400">Ekranda daha fazla script ve eşya görmek için sıkışık liste modu.</span>
              </div>
              <button
                onClick={() => handleToggleCompact(!compactCards)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  compactCards ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    compactCards ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: MM2 & TAKAS SİSTEMİ */}
      {activeSection === 'mm2' && (
        <div className="p-6 rounded-3xl bg-[#0c0919] border border-purple-900/40 space-y-6 shadow-lg">
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-purple-900/40 pb-3">
              <Flame className="w-4 h-4 text-red-400" />
              <span>MM2 Değer Listesi & Takas Ayarları</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Roblox Murder Mystery 2 eşyalarını incelerken ve takas yaparken tercih edeceğiniz kurallar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Value Standard Preference */}
            <div className="p-4 rounded-2xl bg-[#130f24] border border-purple-900/40 space-y-2">
              <label className="text-xs font-bold text-white block">Değer Listesi Standardı:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'supreme', label: 'Supreme Values (Resmi)' },
                  { id: 'mm2values', label: 'MM2Values Standart' }
                ].map(std => (
                  <button
                    key={std.id}
                    onClick={() => {
                      setValueStandard(std.id);
                      localStorage.setItem('harikascript_value_standard', std.id);
                      showToast(`Değer standardı: ${std.label}`);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      valueStandard === std.id
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-[#0a0717] border-purple-900/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    {std.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Value Format Preference */}
            <div className="p-4 rounded-2xl bg-[#130f24] border border-purple-900/40 space-y-2">
              <label className="text-xs font-bold text-white block">Sayı Gösterim Formatı:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'formatted', label: 'Tam Sayı (3,850)' },
                  { id: 'short', label: 'Kısaltılmış (3.8k)' }
                ].map(fmt => (
                  <button
                    key={fmt.id}
                    onClick={() => {
                      setNumberFormat(fmt.id);
                      localStorage.setItem('harikascript_num_format', fmt.id);
                      showToast(`Sayı formatı: ${fmt.label}`);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      numberFormat === fmt.id
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-[#0a0717] border-purple-900/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Auto Open Wiki Modal on item click */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#130f24] border border-purple-900/40">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Fandom Wiki Sayfası Aç</span>
                <span className="text-[10px] text-slate-400">
                  Eşyaya tıklandığında 7 görselli detaylı Fandom sayfası açılsın.
                </span>
              </div>
              <button
                onClick={() => {
                  const next = !autoOpenWiki;
                  setAutoOpenWiki(next);
                  localStorage.setItem('harikascript_auto_wiki', String(next));
                  showToast(next ? 'Eşya detay sayfası aktif.' : 'Detay sayfası kapalı.');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  autoOpenWiki ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    autoOpenWiki ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Accept Trades Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#130f24] border border-purple-900/40">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Takas Tekliflerini Kabul Et</span>
                <span className="text-[10px] text-slate-400">
                  Diğer topluluk üyeleri sizin ilanlarınıza Roblox üzerinden teklif verebilsin.
                </span>
              </div>
              <button
                onClick={() => {
                  const next = !tradeAcceptance;
                  setTradeAcceptance(next);
                  localStorage.setItem('harikascript_allow_trades', String(next));
                  showToast(next ? 'Takas teklifleri açık.' : 'Takas teklifleri kapatıldı.');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  tradeAcceptance ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    tradeAcceptance ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SES & BİLDİRİMLER */}
      {activeSection === 'sound' && (
        <div className="p-6 rounded-3xl bg-[#0c0919] border border-purple-900/40 space-y-6 shadow-lg">
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-purple-900/40 pb-3">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Ses Düzeyi & Bildirim Yönetimi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Tıklama sesleri, sandık açılış animasyon sesleri ve canlı sohbet uyarılarını özelleştirin.
            </p>
          </div>

          <div className="space-y-4">
            {/* Master Sound Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#130f24] border border-purple-900/40">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block flex items-center gap-1.5">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  Ana Ses Efektleri
                </span>
                <span className="text-[10px] text-slate-400">Kutu açılışı, çark ve buton tıklama sesleri</span>
              </div>
              <button
                onClick={() => handleSoundToggle(!soundEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  soundEnabled ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Volume Slider */}
            {soundEnabled && (
              <div className="p-4 rounded-2xl bg-[#130f24] border border-purple-900/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Volume1 className="w-4 h-4 text-purple-400" />
                    Ses Seviyesi
                  </span>
                  <span className="text-purple-300 font-mono font-bold">%{soundVolume}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            )}

            {/* Chat Sounds */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#130f24] border border-purple-900/40">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Sohbet Bildirim Sesi</span>
                <span className="text-[10px] text-slate-400">Canlı sohbete yeni mesaj geldiğinde hafif bip sesi çal</span>
              </div>
              <button
                onClick={() => {
                  const next = !chatSounds;
                  setChatSounds(next);
                  localStorage.setItem('harikascript_chat_sounds', String(next));
                  showToast(next ? 'Sohbet sesleri açık.' : 'Sohbet sesleri kapatıldı.');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  chatSounds ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    chatSounds ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toast Notification Duration */}
            <div className="p-4 rounded-2xl bg-[#130f24] border border-purple-900/40 space-y-2">
              <label className="text-xs font-bold text-white block">Bildirim Balonu Ekranda Kalma Süresi:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { sec: 2, label: '2 Saniye (Hızlı)' },
                  { sec: 3, label: '3 Saniye (Standart)' },
                  { sec: 5, label: '5 Saniye (Uzun)' }
                ].map(opt => (
                  <button
                    key={opt.sec}
                    onClick={() => {
                      setToastDuration(opt.sec);
                      localStorage.setItem('harikascript_toast_duration', String(opt.sec));
                      showToast(`Bildirim süresi: ${opt.label}`);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      toastDuration === opt.sec
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-[#0a0717] border-purple-900/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: VERİ & HESAP GÜVENLİĞİ */}
      {activeSection === 'data' && (
        <div className="p-6 rounded-3xl bg-[#0c0919] border border-purple-900/40 space-y-6 shadow-lg">
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-purple-900/40 pb-3">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Veri Yedekleme, Önbellek & Güvenlik</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Hesap verilerinizi yedekleyin, önbelleği sıfırlayın veya oturumunuzu güvenle yönetin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleClearCache}
              className="p-4 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 text-left transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-purple-400 group-hover:rotate-180 transition-transform duration-500" />
                  Önbelleği Temizle & Yenile
                </span>
                <span className="text-[10px] text-slate-400 block">Sayfa takılırsa anında tazeleyin</span>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-lg bg-purple-900/60 text-purple-300 font-bold">
                Yenile ⚡
              </span>
            </button>

            <button
              onClick={exportFullBackup}
              className="p-4 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-800/40 text-left transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
                  Tam Sistem Yedeği İndir
                </span>
                <span className="text-[10px] text-slate-400 block">Scriptler, MM2 ve kullanıcı verileri</span>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-900/60 text-emerald-300 font-mono font-bold">
                .JSON
              </span>
            </button>

            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const json = JSON.parse(event.target?.result as string);
                        restoreFromBackup(json);
                      } catch {
                        showToast('Geçersiz JSON yedek dosyası!');
                      }
                    };
                    reader.readAsText(file);
                  }
                };
                input.click();
              }}
              className="p-4 rounded-2xl bg-indigo-950/30 hover:bg-indigo-900/40 border border-indigo-800/40 text-left transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-400 group-hover:-translate-y-0.5 transition-transform" />
                  Yedekten Geri Yükle
                </span>
                <span className="text-[10px] text-slate-400 block">Kaydettiğiniz bir yedeği yükleyin</span>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-lg bg-indigo-900/60 text-indigo-300 font-bold">
                Seç 📂
              </span>
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-4 rounded-2xl bg-pink-950/30 hover:bg-pink-900/40 border border-pink-800/40 text-left transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                  Giriş Yap / Hesap Değiştir
                </span>
                <span className="text-[10px] text-slate-400 block">Google veya e-posta ile giriş</span>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-lg bg-pink-900/60 text-pink-300 font-bold">
                Hesap 👤
              </span>
            </button>
          </div>

          {/* Danger Zone for Authorized Admin */}
          {isAuthorizedAdmin && (
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40 space-y-3 pt-3">
              <span className="font-bold text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Yönetici Tehlikeli Bölgesi (Danger Zone)
              </span>
              <p className="text-[11px] text-slate-400">
                Tüm veritabanı ayarlarını ve verilerini ilk varsayılan haline sıfırlar. Bu işlem geri alınamaz.
              </p>
              <button
                onClick={resetToDefaultData}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Varsayılan Veritabanına Sıfırla</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
