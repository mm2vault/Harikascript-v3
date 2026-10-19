import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Copy,
  Check,
  Lock,
  Unlock,
  Coins,
  ShieldCheck,
  Key,
  Gamepad2,
  Download,
  Share2,
  Calendar,
  User,
  Sparkles,
  Edit3,
  Trash2
} from 'lucide-react';

export const ScriptDetailModal: React.FC = () => {
  const {
    selectedScript,
    setSelectedScript,
    user,
    unlockScript,
    showToast,
    setEditingScript,
    setIsAddScriptModalOpen,
    canEditScript,
    canDeleteScript,
    requestDeleteScript
  } = useApp();
  const [copied, setCopied] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  if (!selectedScript) return null;

  const isLocked = selectedScript.price > 0 && !user.unlockedScriptIds.includes(selectedScript.id);

  const handleCopy = () => {
    if (isLocked) {
      unlockScript(selectedScript);
      return;
    }

    navigator.clipboard.writeText(selectedScript.code);
    setCopied(true);
    showToast('Lua script kodu kopyalandı! 📋');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadLua = () => {
    if (isLocked) {
      unlockScript(selectedScript);
      return;
    }
    const element = document.createElement('a');
    const file = new Blob([selectedScript.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedScript.title.replace(/\s+/g, '_')}.lua`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('.lua dosyası indirildi! 💾');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0c0919] border border-purple-500/40 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedScript(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/60 hover:bg-black text-slate-300 hover:text-white transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Top Banner Thumbnail */}
          <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden bg-slate-900 border border-purple-900/40">
            {!imageFailed && selectedScript.imageUrl ? (
              <img
                src={selectedScript.imageUrl}
                alt={selectedScript.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-purple-950 via-[#181136] to-indigo-950 flex flex-col items-center justify-center p-4 text-center">
                <Gamepad2 className="w-14 h-14 text-purple-400/60 mb-2" />
                <span className="text-sm font-black text-white">{selectedScript.game}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0919] via-transparent to-black/30" />

            {/* Badges on Banner */}
            <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{selectedScript.status}</span>
              </span>

              {selectedScript.isKeyless ? (
                <span className="px-2.5 py-1 rounded-lg bg-purple-900/90 text-purple-200 font-bold text-xs border border-purple-600/50 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-purple-400" />
                  <span>Keyless (Anahtarsız)</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-amber-900/90 text-amber-200 font-bold text-xs border border-amber-600/50">
                  Key Sistemli
                </span>
              )}

              <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white font-bold text-xs border border-white/10 flex items-center gap-1">
                <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                <span>{selectedScript.game}</span>
              </span>
            </div>
          </div>

          {/* Title and Meta */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {selectedScript.title}
              </h2>
              {isLocked ? (
                <div className="flex items-center gap-1 text-amber-400 font-extrabold text-sm bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-500/40">
                  <Coins className="w-4 h-4" />
                  <span>{selectedScript.price} Coin</span>
                </div>
              ) : (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                  Kullanıma Hazır
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>Yazar: <strong>{selectedScript.author}</strong></span>
              </span>
              <span>•</span>
              <span>Versiyon: <strong className="text-purple-300">{selectedScript.version}</strong></span>
              <span>•</span>
              <span>Kategori: <strong className="text-slate-300">{selectedScript.category}</strong></span>
              <span>•</span>
              <span>{((selectedScript.downloads ?? selectedScript.likes * 14) || 120).toLocaleString()} Kopyalama</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              {selectedScript.description}
            </p>
          </div>

          {/* Lua Code Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Lua Script Kodu
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {selectedScript.code.length} Karakter
              </span>
            </div>

            <div className="relative rounded-2xl bg-[#06040d] border border-purple-900/60 p-4 font-mono text-xs sm:text-sm overflow-hidden">
              {isLocked ? (
                <div className="py-8 text-center space-y-3">
                  <Lock className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-white text-base">Bu Script Kilitli</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Bu premium scripti görüntülemek ve panonuza kopyalamak için {selectedScript.price} Coin ile kilidini açmalısınız.
                    </p>
                  </div>
                  <button
                    onClick={() => unlockScript(selectedScript)}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Kilidi Aç ({selectedScript.price} Coin)</span>
                  </button>
                </div>
              ) : (
                <pre className="text-purple-200 overflow-x-auto whitespace-pre-wrap break-all max-h-56 scrollbar-thin">
                  <code>{selectedScript.code}</code>
                </pre>
              )}
            </div>
          </div>

          {/* Executor Instructions */}
          <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-900/30 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-purple-300 block">Nasıl Çalıştırılır?</span>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-400 text-[11px]">
              <li>Kodu kopyalayın veya .lua olarak indirin.</li>
              <li>Roblox oyununu açın ve desteklenen bir Executor (Solara, Wave, Delta vb.) inject edin.</li>
              <li>Kodu executor ekranına yapıştırıp "Execute" butonuna basın.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#080612] border-t border-purple-900/40 flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedScript(null)}
            className="px-4 py-2.5 rounded-xl bg-purple-950/40 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            Kapat
          </button>

          <div className="flex items-center gap-2">
            {canEditScript(selectedScript) && (
              <button
                onClick={() => {
                  const toEdit = selectedScript;
                  setSelectedScript(null);
                  setEditingScript(toEdit);
                  setIsAddScriptModalOpen(true);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 text-xs font-bold border border-purple-600/50 transition-colors flex items-center gap-1.5"
                title="Scripti Düzenle"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-300" />
                <span>Düzenle</span>
              </button>
            )}

            {canDeleteScript(selectedScript) && (
              <button
                onClick={() => {
                  requestDeleteScript(selectedScript);
                }}
                className="px-3 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-bold border border-rose-800/50 transition-colors flex items-center gap-1.5"
                title="Scripti Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sil</span>
              </button>
            )}

            {!isLocked && (
              <button
                onClick={handleDownloadLua}
                className="px-4 py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-xs font-bold border border-purple-700/40 transition-colors flex items-center gap-1.5"
                title=".lua Dosyası İndir"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">.lua İndir</span>
              </button>
            )}

            {isLocked ? (
              <button
                onClick={() => unlockScript(selectedScript)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95"
              >
                <Unlock className="w-4 h-4" />
                <span>Kilidi Aç ({selectedScript.price} Coin)</span>
              </button>
            ) : (
              <button
                onClick={handleCopy}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg active:scale-95 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/40'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
