import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Sidebar } from './components/Sidebar';
import { ScriptsView } from './components/ScriptsView';
import { GamesView } from './components/GamesView';
import { ExecutorsView } from './components/ExecutorsView';
import { AdminPanel } from './components/AdminPanel';
import { MM2ValuesView } from './components/MM2ValuesView';
import { BloxValuesView } from './components/BloxValuesView';
import { ValuesHubView } from './components/ValuesHubView';
import { DynamicCategoryValuesView } from './components/DynamicCategoryValuesView';
import { ScriptPlaygroundView } from './components/ScriptPlaygroundView';
import { LiveChatView } from './components/LiveChatView';
import { LeaderboardView } from './components/LeaderboardView';
import { BoomboxView } from './components/BoomboxView';
import { SettingsView } from './components/SettingsView';
import { TradeCalculatorView } from './components/TradeCalculatorView';
import { ScriptDetailModal } from './components/modals/ScriptDetailModal';
import { MM2ItemDetailModal } from './components/modals/MM2ItemDetailModal';
import { BloxItemDetailModal } from './components/modals/BloxItemDetailModal';
import { AddScriptModal } from './components/modals/AddScriptModal';
import { AddGameModal } from './components/modals/AddGameModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { TasksModal } from './components/modals/TasksModal';
import { AuthModal } from './components/modals/AuthModal';
import { ConfirmDeleteModal } from './components/modals/ConfirmDeleteModal';
import { LuckyWheelModal } from './components/modals/LuckyWheelModal';
import { AddMM2ItemModal } from './components/modals/AddMM2ItemModal';
import { AddBloxItemModal } from './components/modals/AddBloxItemModal';
import { AddExecutorModal } from './components/modals/AddExecutorModal';
import { RedeemCodeModal } from './components/modals/RedeemCodeModal';
import { AlertTriangle, Crown } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, toastMessage, isAuthorizedAdmin, systemConfig, user } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('harikascript_theme_mode') || 'purple');
  const [animationsEnabled, setAnimationsEnabled] = useState(() => localStorage.getItem('harikascript_animations') !== 'false');

  // Sync settings periodically
  React.useEffect(() => {
    const syncTheme = () => {
      const mode = localStorage.getItem('harikascript_theme_mode') || 'purple';
      const anim = localStorage.getItem('harikascript_animations') !== 'false';
      setThemeMode(mode);
      setAnimationsEnabled(anim);
    };
    window.addEventListener('storage', syncTheme);
    const interval = setInterval(syncTheme, 1500);
    return () => {
      window.removeEventListener('storage', syncTheme);
      clearInterval(interval);
    };
  }, []);

  // Lock background scroll when mobile sidebar drawer is open
  React.useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  // Render appropriate view based on activeTab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'scripts':
        return <ScriptsView />;
      case 'values_hub':
        return <ValuesHubView />;
      case 'mm2_values':
        return <MM2ValuesView />;
      case 'blox_values':
        return <BloxValuesView />;
      case 'games':
        return <GamesView />;
      case 'executors':
        return <ExecutorsView />;
      case 'script_playground':
        return <ScriptPlaygroundView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'boombox':
        return <BoomboxView />;
      case 'live_chat':
        return <LiveChatView />;
      case 'settings':
        return <SettingsView />;
      case 'trade_calculator':
        return <TradeCalculatorView />;
      case 'admin':
        return isAuthorizedAdmin ? <AdminPanel /> : <ScriptsView />;
      default:
        if (activeTab.startsWith('value_cat_')) {
          const catId = activeTab.replace('value_cat_', '');
          return <DynamicCategoryValuesView categoryId={catId} />;
        }
        return <ScriptsView />;
    }
  };

  const getThemeBg = () => {
    switch (themeMode) {
      case 'oled':
        return 'bg-black';
      case 'midnight':
        return 'bg-[#040614]';
      case 'crimson':
        return 'bg-[#0e0407]';
      case 'emerald':
        return 'bg-[#030d0a]';
      default:
        return 'bg-[#070510]';
    }
  };

  return (
    <div className={`min-h-screen w-full overflow-x-hidden ${getThemeBg()} text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white ${!animationsEnabled ? '[&_*]:transition-none [&_*]:animate-none' : ''}`}>
      
      {/* Top Fixed Navbar */}
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />
      <AnnouncementBar />

      {/* Maintenance Mode Notice Banner */}
      {systemConfig.maintenanceMode && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-center gap-2 border-b border-amber-400/40 shadow-lg text-center animate-in fade-in duration-200">
          <AlertTriangle className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
          <span>
            <strong>DİKKAT (BAKIM ÇALIŞMASI):</strong> {systemConfig.maintenanceMessage || 'HarikaScript şu anda planlı bakım modundadır.'}
          </span>
          {isAuthorizedAdmin && (
            <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-amber-200 border border-amber-300/40 font-mono inline-flex items-center gap-1">
              <span>Yönetici Erişimi Aktif</span>
              <Crown className="w-3 h-3 text-amber-300 inline-block" />
            </span>
          )}
        </div>
      )}

      {/* Banned User Warning Banner */}
      {user.isBanned && (
        <div className="bg-rose-950/95 text-rose-200 border-b border-rose-500/50 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Hesabınız yönetici tarafından kısıtlanmıştır: {user.banReason || 'Topluluk kurallarını ihlal'}</span>
        </div>
      )}
      <div className="flex-1 flex max-w-7xl w-full mx-auto min-w-0">
        {/* Navigation Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 pb-20 md:pb-12 max-w-full">
          {renderMainContent()}
        </main>
      </div>

      {/* Modals */}
      <ScriptDetailModal />
      <MM2ItemDetailModal />
      <BloxItemDetailModal />
      <AddScriptModal />
      <AddGameModal />
      <ProfileModal />
      <TasksModal />
      <AuthModal />
      <ConfirmDeleteModal />
      <LuckyWheelModal />
      <AddMM2ItemModal />
      <AddBloxItemModal />
      <AddExecutorModal />
      <RedeemCodeModal />

      {/* Toast Notification Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
          <div className="px-4 py-2.5 rounded-2xl bg-[#140e2d]/95 text-white font-bold text-xs sm:text-sm border border-purple-500/50 shadow-2xl shadow-purple-900/50 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
