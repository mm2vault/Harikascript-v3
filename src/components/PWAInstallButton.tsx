import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { APP_LOGO_URL, APP_NAME } from '../constants/branding';
import { Smartphone, Download, X, CheckCircle2, ExternalLink, Copy, Check, Sparkles, Bell } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'sidebar' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledSuccess(true);
        return;
      }
    }
    setShowGuideModal(true);
  };

  const handleOpenDirect = () => {
    try {
      const a = document.createElement('a');
      a.href = window.location.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      // Fallback
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isInstalled || installedSuccess) {
    if (variant === 'sidebar') {
      return (
        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Uygulama Yüklendi</span>
        </div>
      );
    }
    return null;
  }

  const renderModal = () => (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0e0a1f] border border-purple-500/50 p-5 sm:p-6 space-y-4 text-center shadow-2xl overflow-hidden">
        <button
          onClick={() => setShowGuideModal(false)}
          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative group mx-auto w-16 h-16 sm:w-20 sm:h-20">
          <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 via-teal-500 to-purple-600 rounded-3xl blur-sm opacity-80 animate-pulse" />
          <div className="relative w-full h-full rounded-2xl bg-[#0c081c] border-2 border-emerald-400/50 p-1 shadow-xl overflow-hidden flex items-center justify-center">
            <img
              src={APP_LOGO_URL}
              alt="HarikaScript Logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        <div>
          <h3 className="font-black text-lg sm:text-xl text-white">HarikaScript Uygulamasını Yükle</h3>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            Uygulamayı cihazınızın ana ekranına tam ekran, hızlı ve anlık bildirim destekli bir web uygulaması olarak ekleyebilirsiniz.
          </p>
        </div>

        {/* Automatic Notification Alert Feature */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/70 via-indigo-950/70 to-purple-900/40 border border-purple-500/40 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
            <Bell className="w-3.5 h-3.5 text-pink-400" />
            <span>Otomatik Anlık Bildirimler ⚡</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Yeni Roblox scriptleri, executor güncellemeleri veya ücretsiz coin hediyeleri eklendiğinde telefonunuza otomatik bildirim gelir!
          </p>
        </div>

        {/* If inside an iframe (like AI Studio preview), inform user to open directly */}
        {isInIframe && (
          <div className="p-3 rounded-2xl bg-purple-950/50 border border-purple-500/40 text-left space-y-2">
            <span className="text-[11px] font-bold text-pink-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Önizleme İçi Bilgilendirme</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Uygulamayı cihazınıza kurmak için doğrudan tarayıcı sekmesinde açabilirsiniz.
            </p>
            <button
              onClick={handleOpenDirect}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Yeni Sekmede Aç & Yükle</span>
            </button>
          </div>
        )}

        {/* Direct Install prompt button if available */}
        {isInstallable && (
          <button
            onClick={async () => {
              const res = await install();
              if (res) {
                setInstalledSuccess(true);
                setShowGuideModal(false);
              }
            }}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Cihaza Yükle (Ana Ekrana Ekle)</span>
          </button>
        )}

        {/* Step by Step Guide for Android & iOS */}
        <div className="p-3.5 rounded-2xl bg-[#140e2d] border border-purple-900/40 text-left space-y-2.5 text-xs">
          <div>
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android & Chrome Kullanıcıları:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
              <li>Sağ üstteki <strong>⋮ (Üç Nokta)</strong> menüsüne dokunun.</li>
              <li><strong>"Uygulamayı Yükle"</strong> veya <strong>"Ana Ekrana Ekle"</strong> seçeneğine tıklayın.</li>
            </ol>
          </div>

          <div className="pt-2 border-t border-purple-900/40">
            <div className="font-bold text-purple-300 flex items-center gap-1.5 mb-1">
              <span>iPhone / Safari Kullanıcıları:</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Safari altındaki <strong>Paylaş</strong> ikonuna dokunun ve <strong>"Ana Ekrana Ekle"</strong> seçin.
            </p>
          </div>
        </div>

        {/* Copy Link Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-2 px-3 bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 text-xs font-bold rounded-xl border border-purple-700/40 transition-colors flex items-center justify-center gap-1.5"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Kopyalandı!' : 'Site Linkini Kopyala'}</span>
          </button>

          <button
            onClick={() => setShowGuideModal(false)}
            className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );

  if (variant === 'sidebar') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:from-purple-600 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-950/50 transition-all flex items-center justify-between gap-2 active:scale-95"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden border border-purple-300/40 shrink-0">
              <img src={APP_LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-black">Uygulamayı Yükle</span>
              <span className="block text-[10px] text-purple-200 font-normal">Hızlı Masaüstü & Mobil</span>
            </div>
          </div>
          <Download className="w-4 h-4 shrink-0" />
        </button>

        {showGuideModal && renderModal()}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white font-bold text-[11px] sm:text-xs shadow-md border border-purple-500/40 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
        title="HarikaScript Uygulamasını Cihaza Kur"
      >
        <Smartphone className="w-3.5 h-3.5 text-purple-300" />
        <span className="hidden xs:inline">Uygulamayı Kur</span>
      </button>

      {showGuideModal && renderModal()}
    </>
  );
};
