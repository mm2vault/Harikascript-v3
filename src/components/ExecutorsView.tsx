import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExecutorItem } from '../types';
import { APP_LOGO_URL } from '../constants/branding';
import {
  Terminal,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Smartphone,
  Apple,
  Sparkles,
  Zap,
  Info,
  PlusCircle,
  Edit2,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

export const ExecutorsView: React.FC = () => {
  const {
    executors,
    user,
    setIsAddExecutorModalOpen,
    setEditingExecutor,
    requestDeleteExecutor,
    isAuthorizedAdmin
  } = useApp();

  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredExecutors = executors.filter(item => {
    if (platformFilter === 'all') return true;
    return item.platforms.includes(platformFilter as any);
  });

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case 'Windows':
        return <span title="Windows PC"><Monitor className="w-3.5 h-3.5" /></span>;
      case 'Android':
        return <span title="Android APK"><Smartphone className="w-3.5 h-3.5 text-emerald-400" /></span>;
      case 'iOS':
      case 'macOS':
        return <span title="Apple iOS / macOS"><Apple className="w-3.5 h-3.5 text-slate-300" /></span>;
      default:
        return <Terminal className="w-3.5 h-3.5" />;
    }
  };

  const handleEditExecutor = (executor: ExecutorItem) => {
    setEditingExecutor(executor);
    setIsAddExecutorModalOpen(true);
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#110c26] to-[#0a0818] border border-purple-800/40 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Güvenli & Test Edilmiş Yürütücüler ({executors.length})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            Roblox <span className="text-emerald-400">Executorlar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Windows, Android, iOS ve macOS için 2026 yılının en güvenilir, çökme korumalı ve %100 UNC uyumlu Lua executor kütüphanesi.
          </p>
        </div>

        {/* Right: Cover Logo & Add Button */}
        <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3.5 relative z-10 shrink-0 w-full md:w-auto">
          <div className="relative group flex items-center justify-center">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0e0a1c] border-2 border-emerald-500/50 p-1 shadow-2xl overflow-hidden flex items-center justify-center">
              <img
                src={APP_LOGO_URL}
                alt="Executor Hub Logo"
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setEditingExecutor(null);
              setIsAddExecutorModalOpen(true);
            }}
            className="w-full md:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Executor Ekle</span>
          </button>
        </div>
      </div>

      {/* Platform Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'Windows', 'Android', 'iOS', 'macOS'].map(plat => (
          <button
            key={plat}
            onClick={() => setPlatformFilter(plat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              platformFilter === plat
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'bg-[#0e0b1f] text-slate-400 hover:text-white border border-purple-900/30'
            }`}
          >
            <span>{plat === 'all' ? 'Tüm Platformlar' : plat}</span>
          </button>
        ))}
      </div>

      {/* Executor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExecutors.map(executor => (
          <div
            key={executor.id}
            className="group relative flex flex-col justify-between rounded-2xl bg-[#0d0a1b] border border-purple-900/40 hover:border-emerald-500/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/20"
          >
            <div>
              {/* Header: Logo, Name, Status, and Admin Actions */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {/* Clickable Image with Hover Edit Overlay */}
                  <div
                    onClick={() => handleEditExecutor(executor)}
                    className="relative group/img w-13 h-13 rounded-xl overflow-hidden bg-purple-950/60 border border-purple-600/40 p-1 flex items-center justify-center shrink-0 cursor-pointer shadow-md shadow-purple-950/50"
                    title="Resmi veya bilgileri düzenlemek için tıkla"
                  >
                    {!failedImages[executor.id] && executor.imageUrl ? (
                      <img
                        src={executor.imageUrl}
                        alt={executor.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-lg group-hover/img:scale-105 transition-transform"
                        onError={() => setFailedImages(prev => ({ ...prev, [executor.id]: true }))}
                      />
                    ) : (
                      <Terminal className="w-6 h-6 text-emerald-400" />
                    )}

                    {/* Hover change picture icon */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <Edit2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                      <span>{executor.name}</span>
                      {executor.isRecommended && (
                        <span className="text-[9px] font-black bg-purple-600/80 text-white px-1.5 py-0.5 rounded border border-purple-400/40">
                          TOP
                        </span>
                      )}
                    </h3>
                    <span className="text-[11px] text-purple-300 font-semibold">
                      {executor.version} • {executor.level}
                    </span>
                  </div>
                </div>

                {/* Status Badge & Admin Edit Controls */}
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                      executor.status === 'Aktif'
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                        : 'bg-amber-950/70 text-amber-300 border-amber-700/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        executor.status === 'Aktif' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                      }`}
                    />
                    <span>{executor.status}</span>
                  </span>

                  {isAuthorizedAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditExecutor(executor)}
                        className="p-1 rounded-md bg-purple-900/50 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-700/40 transition-colors"
                        title="Executoru Düzenle (Resim, Versiyon, Link)"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => requestDeleteExecutor(executor)}
                        className="p-1 rounded-md bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/40 transition-colors"
                        title="Executoru Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                {executor.description}
              </p>

              {/* Metadata Badges (UNC, Keyless, Platforms) */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-xl bg-purple-950/30 border border-purple-900/30">
                  <span className="text-slate-400 font-medium">UNC Uyumluluğu:</span>
                  <span className="text-emerald-400 font-extrabold">{executor.uncPercent}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-xl bg-purple-950/30 border border-purple-900/30">
                  <span className="text-slate-400 font-medium">Key Durumu:</span>
                  <span className={executor.isKeyless ? 'text-purple-300 font-bold' : 'text-amber-300 font-bold'}>
                    {executor.isKeyless ? 'Keyless (Keysiz)' : 'Key Sistemi Var'}
                  </span>
                </div>

                {/* Supported Platforms List */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 mr-1">Platformlar:</span>
                  {executor.platforms.map(p => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded-md bg-[#130f28] border border-purple-800/40 text-[10px] font-bold text-slate-200 flex items-center gap-1"
                    >
                      {getPlatformIcon(p)}
                      <span>{p}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Download Link & Quick Change Image */}
            <div className="pt-3 border-t border-purple-900/30 flex items-center gap-2">
              <a
                href={executor.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resmi Siteden İndir</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-75" />
              </a>

              {isAuthorizedAdmin && (
                <button
                  onClick={() => handleEditExecutor(executor)}
                  className="p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 hover:text-white border border-purple-700/40 transition-colors"
                  title="Resmi / Detayları Güncelle"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Safety Notice Callout */}
      <div className="rounded-2xl bg-purple-950/30 border border-purple-800/30 p-4 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Önemli Bilgilendirme:</strong> HarikaScript üzerindeki tüm executor yönlendirmeleri geliştiricilerin resmi doğrulanmış web sitelerine aittir. Güvenliğiniz için her zaman sahte kopyalardan kaçının ve antivirüsünüze gerekirse dışlama kuralı ekleyin.
        </p>
      </div>
    </div>
  );
};
