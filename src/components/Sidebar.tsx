import React from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { AvatarDisplay } from './AvatarDisplay';
import { CoinIcon } from './CoinIcon';
import { APP_LOGO_URL } from '../constants/branding';
import {
  ShoppingBag,
  Sparkles,
  Layers,
  Smile,
  Zap,
  Award,
  Package,
  FileCode2,
  Gamepad2,
  Terminal,
  Cpu,
  ShieldAlert,
  Flame,
  Crown,
  Coins,
  User,
  ChevronRight,
  LogIn,
  Gift,
  Play,
  MessageSquare,
  Trophy,
  Radio,
  Key,
  Settings,
  ArrowRightLeft
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    user,
    scripts,
    bloxItems,
    valueCategories,
    valueItems,
    setIsProfileModalOpen,
    setIsTasksModalOpen,
    setIsAuthModalOpen,
    setIsLuckyWheelOpen,
    setIsRedeemModalOpen,
    setIsCaseModalOpen,
    isAuthorizedAdmin
  } = useApp();

  const handleSelect = (tab: string) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-0 md:top-14 left-0 z-50 md:z-30 h-screen md:h-[calc(100vh-3.5rem)] w-[82vw] max-w-[290px] md:w-64 bg-[#0a0815] md:bg-[#090714]/80 border-r border-purple-900/30 p-4 pb-12 md:pb-4 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 shadow-2xl shadow-black/90' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-5">

          {/* Mobile Header in Drawer */}
          <div className="flex md:hidden items-center justify-between pb-3 border-b border-purple-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-lg shadow-pink-500/30 overflow-hidden">
                <img src={APP_LOGO_URL} alt="HarikaScript Logo" className="w-full h-full object-cover rounded-[10px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-sm leading-tight">HarikaScript</span>
                <span className="text-[10px] text-purple-300 font-medium">MM2 & Roblox Hub</span>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Kapat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Profile Card in Hamburger Drawer */}
          <div className="md:hidden p-3 rounded-2xl bg-gradient-to-br from-purple-950/80 via-[#150f2e] to-[#0d091a] border border-purple-600/40 shadow-xl space-y-2.5">
            <div
              onClick={() => {
                setIsProfileModalOpen(true);
                onCloseMobile();
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Profilini Aç"
            >
              <AvatarDisplay size="md" isInteractive={false} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-black text-xs text-white truncate group-hover:text-pink-300 transition-colors">
                    {user.username}
                  </span>
                  {user.role === 'admin' ? (
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  )}
                </div>
                <span className="text-[10px] text-purple-300/80 block truncate">
                  {user.email || 'HarikaScript Oyuncusu'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>

            {/* Coin Balance & Quick Actions inside Mobile Drawer */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-900/50 gap-2">
              <button
                onClick={() => {
                  setIsTasksModalOpen(true);
                  onCloseMobile();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-300 font-bold text-[11px] hover:bg-amber-900/60 transition-colors"
                title="Görev Yap & Coin Kazan"
              >
                <CoinIcon className="w-3.5 h-3.5" animate={true} />
                <span>{user.coins.toLocaleString('tr-TR')}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    onCloseMobile();
                  }}
                  className="px-2 py-1 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-[10px] font-bold border border-purple-700/40 transition-colors"
                >
                  Profil
                </button>
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    onCloseMobile();
                  }}
                  className="px-2 py-1 rounded-lg bg-pink-900/50 hover:bg-pink-800 text-pink-200 text-[10px] font-bold border border-pink-700/40 transition-colors"
                >
                  Giriş
                </button>
              </div>
            </div>
          </div>

          {/* Section 1: PLATFORM & SCRIPTLER (Primary Hub Section) */}
          <div>
            <div className="flex items-center gap-2 px-3 mb-2 text-xs font-bold uppercase tracking-wider text-purple-400/90">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Platform</span>
              <span className="ml-auto text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-semibold">
                Hub
              </span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleSelect('scripts')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'scripts'
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md shadow-purple-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCode2 className="w-4 h-4 text-purple-400" />
                  <span>Scriptler</span>
                </div>
                <span className="text-[10px] text-purple-300/80 bg-purple-900/40 px-1.5 py-0.5 rounded">
                  {scripts.length}
                </span>
              </button>

              <button
                onClick={() => handleSelect('games')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'games'
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md shadow-purple-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Gamepad2 className="w-4 h-4 text-indigo-400" />
                  <span>Oyunlar</span>
                </div>
              </button>

              <button
                onClick={() => handleSelect('executors')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'executors'
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md shadow-purple-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Executorlar</span>
                </div>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-1.5 py-0.2 rounded font-semibold border border-emerald-800/40">
                  UNC 100%
                </span>
              </button>

              {/* Değerler Merkezi (Values Hub) */}
              <button
                onClick={() => handleSelect('values_hub')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'values_hub' || activeTab === 'mm2_values' || activeTab === 'blox_values' || activeTab.startsWith('value_cat_')
                    ? 'bg-gradient-to-r from-purple-700 via-pink-700 to-amber-600 text-white shadow-md shadow-purple-900/40 font-extrabold'
                    : 'text-slate-200 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Değerler & Oyun Hub</span>
                </div>
                <span className="text-[10px] bg-amber-950/80 text-amber-300 px-1.5 py-0.2 rounded font-extrabold border border-amber-500/40">
                  HUB
                </span>
              </button>

              {/* MM2 Değer Listesi & Takas Hub */}
              <button
                onClick={() => handleSelect('mm2_values')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'mm2_values'
                    ? 'bg-gradient-to-r from-red-700 via-pink-700 to-purple-800 text-white shadow-md shadow-red-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-red-950/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span>MM2 Değer Listesi</span>
                </div>
                <span className="text-[10px] bg-red-950/80 text-red-300 px-1.5 py-0.2 rounded font-bold border border-red-800/40">
                  TR/EN
                </span>
              </button>

              {/* Blox Fruits Değerleri */}
              <button
                onClick={() => handleSelect('blox_values')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'blox_values'
                    ? 'bg-gradient-to-r from-cyan-700 via-blue-700 to-purple-800 text-white shadow-md shadow-cyan-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-cyan-950/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Blox Fruits Değerleri</span>
                </div>
                <span className="text-[10px] bg-cyan-950/80 text-cyan-300 px-1.5 py-0.2 rounded font-bold border border-cyan-800/40">
                  FRUITS
                </span>
              </button>

              {/* Takas Hesap Makinesi (Trade Calculator) */}
              <button
                onClick={() => handleSelect('trade_calculator')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'trade_calculator'
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-800 text-white shadow-md shadow-emerald-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Takas Hesap Makinesi</span>
                </div>
                <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.2 rounded font-bold border border-emerald-800/40">
                  CALC
                </span>
              </button>

              {/* Değer Kategorileri (Custom Games added by Admin) */}
              {valueCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(`value_cat_${cat.id}`)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeTab === `value_cat_${cat.id}`
                      ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-purple-800 text-white shadow-md shadow-amber-900/40 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-amber-950/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>{cat.name} Değerleri</span>
                  </div>
                  <span className="text-[10px] bg-amber-950/80 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-800/40">
                    {valueItems.filter(i => i.categoryId === cat.id).length}
                  </span>
                </button>
              ))}

              {/* Script Playground / Sandbox */}
              <button
                onClick={() => handleSelect('script_playground')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'script_playground'
                    ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Script Playground</span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded font-bold border border-emerald-800/40">
                  LUA
                </span>
              </button>

              {/* Canlı Topluluk Sohbet Odası */}
              <button
                onClick={() => handleSelect('live_chat')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'live_chat'
                    ? 'bg-gradient-to-r from-pink-700 via-purple-700 to-indigo-700 text-white shadow-md shadow-pink-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-pink-950/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                  <span>Canlı Sohbet Odası</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              </button>

              {/* Günlük Şans Çarkı (Spin & Win) */}
              <button
                onClick={() => {
                  setIsLuckyWheelOpen(true);
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all bg-gradient-to-r from-amber-500/20 via-pink-500/15 to-purple-900/30 hover:from-amber-500/30 hover:via-pink-500/25 hover:to-purple-900/40 border border-amber-500/40 text-amber-200 group"
              >
                <div className="flex items-center gap-2.5">
                  <Gift className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span className="font-bold">Şans Çarkı</span>
                </div>
                <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded font-black inline-flex items-center gap-1 animate-pulse">
                  <span>SPIN</span>
                  <Gift className="w-2.5 h-2.5 text-amber-300" />
                </span>
              </button>

              {/* Liderlik Tablosu (Leaderboard) */}
              <button
                onClick={() => handleSelect('leaderboard')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'leaderboard'
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md shadow-amber-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-amber-950/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Liderlik Tablosu</span>
                </div>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-700/40">
                  TOP 10
                </span>
              </button>

              {/* Roblox Müzik ID (Boombox) */}
              <button
                onClick={() => handleSelect('boombox')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'boombox'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-pink-950/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Radio className="w-4 h-4 text-pink-400" />
                  <span>Roblox Müzik ID</span>
                </div>
                <span className="text-[10px] bg-pink-950 text-pink-300 px-1.5 py-0.2 rounded font-bold border border-pink-700/40">
                  SES ID
                </span>
              </button>

              {/* Hediye & Kupon Kodu Kullan Butonu */}
              <button
                onClick={() => {
                  setIsRedeemModalOpen(true);
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all bg-gradient-to-r from-purple-900/40 to-pink-900/40 hover:from-purple-800/50 hover:to-pink-800/50 border border-purple-500/40 text-purple-200 group"
              >
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-pink-400 group-hover:rotate-45 transition-transform" />
                  <span className="font-bold">Kupon Kodu Gir</span>
                </div>
                <span className="text-[10px] bg-pink-500/30 text-pink-300 px-1.5 py-0.2 rounded font-black inline-flex items-center gap-1">
                  <span>KOD AL</span>
                  <Key className="w-2.5 h-2.5 text-pink-300" />
                </span>
              </button>


              {/* Ayarlar (Settings) Butonu */}
              <button
                onClick={() => handleSelect('settings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-700 text-white shadow-md shadow-purple-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-purple-400" />
                  <span>Ayarlar</span>
                </div>
                <span className="text-[10px] text-purple-300/80 bg-purple-900/40 px-1.5 py-0.5 rounded">
                  Genel
                </span>
              </button>

              {/* Admin Paneli Butonu - SADECE mm2ultimatehub@gmail.com ve huseynoveleddin87@gmail.com GÖREBİLİR */}
              {isAuthorizedAdmin && (
                <button
                  onClick={() => handleSelect('admin')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                    activeTab === 'admin'
                      ? 'bg-gradient-to-r from-amber-600 to-purple-800 text-white border-amber-500/50 shadow-lg shadow-amber-900/30 font-semibold'
                      : 'text-amber-300/90 hover:text-amber-200 bg-amber-950/20 hover:bg-amber-900/30 border-amber-600/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Admin Paneli</span>
                  </div>
                  <Crown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Card: APK / PWA Download & Account Status */}
        <div className="mt-4 pt-3 border-t border-purple-900/30 space-y-2">
          {/* APK / App Install Button */}
          <PWAInstallButton variant="sidebar" />

          {/* User Account Quick Info */}
          <div
            onClick={() => {
              setIsProfileModalOpen(true);
              onCloseMobile();
            }}
            className="p-2.5 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-900/40 text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors"
            title="Profili Aç"
          >
            <div className="truncate min-w-0">
              <span className="block text-[10px] text-slate-400 font-medium">Oturum:</span>
              <span className="block text-xs font-bold text-purple-200 truncate">{user.username}</span>
              <div className="flex items-center gap-1 text-[11px] font-black text-amber-300 mt-0.5">
                <CoinIcon className="w-3 h-3" />
                <span>{user.coins.toLocaleString('tr-TR')} Coin</span>
              </div>
            </div>
            {isAuthorizedAdmin ? (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 inline-flex items-center gap-1">
                <span>ADMIN</span>
                <Crown className="w-3 h-3 text-amber-300" />
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-700/40 shrink-0 inline-flex items-center gap-1">
                <span>USER</span>
                <Sparkles className="w-3 h-3 text-purple-400" />
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
