import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AvatarDisplay } from './AvatarDisplay';
import { PWAInstallButton } from './PWAInstallButton';
import { CoinIcon } from './CoinIcon';
import { APP_LOGO_URL } from '../constants/branding';
import {
  Coins,
  Bell,
  Sparkles,
  Menu,
  X,
  Shield,
  CheckCircle2,
  Trash2,
  PlusCircle,
  ExternalLink,
  Crown,
  LogIn,
  Zap,
  User,
  Gift,
  Volume2,
  VolumeX,
  Trophy
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar, isMobileSidebarOpen }) => {
  const {
    user,
    notifications,
    markNotificationsAsRead,
    clearNotifications,
    setIsProfileModalOpen,
    setIsTasksModalOpen,
    setIsAuthModalOpen,
    setIsLuckyWheelOpen,
    setIsRedeemModalOpen,
    setIsCaseModalOpen,
    soundEnabled,
    toggleSound,
    setActiveTab,
    activeTab,
    enableSystemNotifications,
    notificationPermission,
    addNotification,
    isAuthorizedAdmin
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0814]/95 backdrop-blur-md border-b border-purple-900/40 px-2.5 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl bg-purple-950/60 text-purple-300 hover:text-white hover:bg-purple-900/80 border border-purple-800/40 focus:outline-none transition-colors"
            aria-label="Menüyü Aç"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* HarikaScript & MM2 Ultimate Hub Brand Logo */}
          <div
            onClick={() => setActiveTab('scripts')}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group select-none shrink"
          >
            <div className="relative w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 p-0.5 shadow-[0_0_20px_rgba(236,72,153,0.6)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.9)] transition-all shrink-0">
              <div className="w-full h-full bg-[#0e0a1c] rounded-[10px] sm:rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <img
                  src={APP_LOGO_URL}
                  alt="HarikaScript Logo"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 absolute top-0.5 right-0.5 animate-pulse drop-shadow-[0_0_4px_#f59e0b]" />
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-black text-sm xs:text-base sm:text-xl tracking-tight text-white drop-shadow-[0_2px_10px_rgba(236,72,153,0.5)] truncate">
                  MM2<span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent ml-0.5">HUB</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-md shadow-md border border-pink-400/40">
                  ULTIMATE
                </span>
              </div>
              <span className="text-[9px] sm:text-[11px] text-purple-300 font-bold tracking-wide flex items-center gap-1 truncate">
                <span>HarikaScript</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              </span>
            </div>
          </div>
        </div>

        {/* Center: Quick Navigation Pills (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-purple-950/40 border border-purple-900/50 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('scripts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'scripts'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            📜 Scriptler
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'games'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            🎮 Oyunlar
          </button>
          <button
            onClick={() => setActiveTab('executors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'executors'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            ⚡ Executorlar
          </button>
          <button
            onClick={() => setActiveTab('mm2_values')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'mm2_values'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/40 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            🔥 MM2 Değerleri
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            ⚙️ Ayarlar
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`hidden lg:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/40 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            🏆 Sıralama
          </button>
          <button
            onClick={() => setActiveTab('boombox')}
            className={`hidden xl:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'boombox'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/40 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            🎵 Müzik ID
          </button>
        </nav>

        {/* Right Section: APK Install, Coins, Notifications, Login & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* App / PWA Install Button */}
          <PWAInstallButton variant="navbar" />

          {/* Coin Balance Pill with Direct Task Click */}
          <div
            onClick={() => setIsTasksModalOpen(true)}
            className="flex items-center bg-gradient-to-r from-amber-500/10 via-purple-950/40 to-purple-900/20 border border-amber-500/40 rounded-xl px-2 py-1 sm:py-1.5 shadow-sm group cursor-pointer hover:border-amber-400/80 transition-colors shrink-0"
            title="Görev Yap & Bedava Coin Kazan"
          >
            <CoinIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 mr-1 sm:mr-1.5 shrink-0" animate={true} />
            <span className="font-black text-xs sm:text-sm text-amber-300 tracking-wide tabular-nums">
              {user.coins.toLocaleString('tr-TR')}
            </span>

            {/* Coin Artırma / Görevler Butonu */}
            <span className="hidden sm:inline-flex ml-1.5 px-1.5 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-md items-center gap-0.5 shadow-sm">
              <PlusCircle className="w-3 h-3" />
              <span>Kazan</span>
            </span>
          </div>

          {/* Level & XP Progress Indicator */}
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-800/40 cursor-pointer transition-all select-none"
            title={`Seviye ${user.level || 1} • ${(user.xp || 0)} / ${(user.level || 1) * 150} XP`}
          >
            <div className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-black text-amber-300">Lv.{user.level || 1}</span>
            </div>
            <div className="w-14 h-2 bg-purple-950 rounded-full overflow-hidden border border-purple-800/50">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-pink-500 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(10, ((user.xp || 0) / ((user.level || 1) * 150)) * 100))}%`
                }}
              />
            </div>
          </div>


          {/* Lucky Wheel Spin Button */}
          <button
            onClick={() => setIsLuckyWheelOpen(true)}
            className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-r from-pink-600/30 to-purple-600/30 hover:from-pink-600/50 hover:to-purple-600/50 text-pink-300 hover:text-white border border-pink-500/40 transition-all focus:outline-none shrink-0 group shadow-sm"
            title="Şans Çarkını Çevir & Hediye Kazan"
            aria-label="Şans Çarkı"
          >
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
          </button>

          {/* Sound Mute/Unmute Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-slate-300 hover:text-white border border-purple-800/40 transition-colors shrink-0"
            title={soundEnabled ? 'Ses Efektlerini Kapat' : 'Ses Efektlerini Aç'}
            aria-label="Ses Ayarı"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-purple-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Promo Code Redeem Button - desktop & tablet */}
          <button
            onClick={() => setIsRedeemModalOpen(true)}
            className="hidden sm:flex px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-600/20 via-pink-600/20 to-purple-600/20 hover:from-amber-600/40 hover:to-pink-600/40 text-amber-300 hover:text-white border border-amber-500/40 transition-all focus:outline-none shrink-0 group shadow-sm items-center gap-1.5 active:scale-95"
            title="Hediye & Promosyon Kodu Kullan"
            aria-label="Kupon Kodu"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black">Kupon</span>
          </button>

          {/* Notifications Dropdown Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (!isNotifOpen && unreadCount > 0) {
                  markNotificationsAsRead();
                }
              }}
              className="relative p-1.5 sm:p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-slate-300 hover:text-white border border-purple-800/40 transition-colors focus:outline-none"
              aria-label="Bildirimler"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#0a0814] animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Panel */}
            {isNotifOpen && (
              <div className="fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-14 sm:top-auto sm:mt-2 sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-[#0f0c1e] border border-purple-500/40 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-900/40">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                    <Bell className="w-4 h-4 text-purple-400" />
                    <span>Bildirimler</span>
                    <span className="text-xs text-purple-300 font-normal">({notifications.length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                      title="Tümünü Temizle"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Temizle</span>
                    </button>
                    <button
                      onClick={() => setIsNotifOpen(false)}
                      className="text-slate-400 hover:text-white text-xs p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* System / APK Push Notification Permission Banner */}
                <div className="mb-2 p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Cihaz / APK Bildirimleri</span>
                    </span>
                    {notificationPermission === 'granted' ? (
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Açık</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">Kapalı</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    Yeni Roblox scriptleri, executor güncellemeleri veya hediyeler geldiğinde cihazınıza anlık bildirim gelsin.
                  </p>
                  <div className="flex items-center gap-2 pt-0.5">
                    {notificationPermission !== 'granted' ? (
                      <button
                        onClick={async () => {
                          await enableSystemNotifications();
                        }}
                        className="w-full py-1.5 px-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-[11px] rounded-lg shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Bell className="w-3 h-3 text-purple-200" />
                        <span>Bildirimlere İzin Ver</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          addNotification('Deneme Bildirimi 🔔', 'HarikaScript bildirim sistemi başarıyla çalışıyor! Yeni scriptler anında burada olacak.');
                        }}
                        className="text-[10px] text-purple-300 hover:text-white underline font-medium"
                      >
                        Test Bildirimi Gönder
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      Henüz bildiriminiz bulunmuyor.
                    </div>
                  ) : (
                    notifications.map((n, index) => (
                      <div
                        key={`${n.id || 'notif'}_${index}`}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          n.read
                            ? 'bg-purple-950/20 border-purple-900/20 text-slate-300'
                            : 'bg-purple-900/30 border-purple-700/40 text-white font-medium'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="font-semibold text-purple-300">{n.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Prominent Giriş / Profil Butonu */}
          {isAuthorizedAdmin || (user.email && user.email !== 'player@harikascript.com') ? (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-600/50 hover:border-purple-400 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
              title="Profilini Görüntüle"
            >
              <User className="w-3.5 h-3.5 text-purple-300" />
              <span className="text-xs font-black hidden sm:inline truncate max-w-[80px]">{user.username}</span>
              <span className="text-xs font-bold sm:hidden">Profil</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-md shadow-purple-950/50 border border-purple-400/40 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
              title="Hesabınıza Giriş Yapın"
            >
              <LogIn className="w-3.5 h-3.5 text-purple-200" />
              <span>Giriş</span>
            </button>
          )}

          {/* User Profile / Avatar Area with Active Frame */}
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="hidden xs:flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 cursor-pointer transition-all hover:border-purple-500/60 group select-none shrink-0"
            title="Profilini Özelleştir"
          >
            <AvatarDisplay size="sm" isInteractive={false} />
            <div className="hidden md:flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xs text-slate-200 group-hover:text-purple-300 transition-colors max-w-[100px] truncate">
                  {user.username}
                </span>
                {isAuthorizedAdmin ? (
                  <span title="Yönetici (Admin)"><Crown className="w-3.5 h-3.5 text-amber-400" /></span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
