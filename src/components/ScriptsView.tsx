import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ScriptItem } from '../types';
import { APP_LOGO_URL } from '../constants/branding';
import {
  FileCode2,
  Copy,
  Check,
  Lock,
  Unlock,
  Coins,
  Search,
  PlusCircle,
  Eye,
  Heart,
  Tag,
  Gamepad2,
  Key,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
  Edit2,
  Trash2,
  Download,
  X
} from 'lucide-react';

const POPULAR_ROBLOX_GAMES = [
  'Tümü',
  'Murder Mystery 2',
  'Blox Fruits',
  'Blade Ball',
  'Rivals',
  'Knife Duels',
  'Evade',
  'Da Hood',
  'Doors',
  'Pet Simulator 99'
];

export const ScriptsView: React.FC = () => {
  const {
    scripts,
    user,
    unlockScript,
    selectedGameFilter,
    setSelectedGameFilter,
    setSelectedScript,
    showToast,
    setIsAddScriptModalOpen,
    setEditingScript,
    canEditScript,
    canDeleteScript,
    requestDeleteScript
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFeed, setSelectedFeed] = useState<'all' | 'official' | 'community'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Optimized memoized script filtering
  const filteredScripts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return scripts.filter(script => {
      const matchesSearch =
        !q ||
        script.title.toLowerCase().includes(q) ||
        script.game.toLowerCase().includes(q) ||
        script.description.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'all' || script.category === selectedCategory;

      const matchesGame = !selectedGameFilter || script.game.toLowerCase() === selectedGameFilter.toLowerCase();

      const matchesFeed =
        selectedFeed === 'all' ||
        (selectedFeed === 'official' && script.authorRole === 'Admin') ||
        (selectedFeed === 'community' && script.authorRole !== 'Admin');

      return matchesSearch && matchesCategory && matchesGame && matchesFeed;
    });
  }, [scripts, searchQuery, selectedCategory, selectedGameFilter, selectedFeed]);

  const handleCopyCode = (e: React.MouseEvent, script: ScriptItem) => {
    e.stopPropagation();

    // Check if script is coin-locked and user hasn't bought it
    const isLocked = script.price > 0 && !user.unlockedScriptIds.includes(script.id);
    if (isLocked) {
      unlockScript(script);
      return;
    }

    navigator.clipboard.writeText(script.code);
    setCopiedId(script.id);
    showToast(`'${script.title}' Lua kodu panoya kopyalandı! 📋`);
    setTimeout(() => {
      setCopiedId(prev => (prev === script.id ? null : prev));
    }, 2500);
  };

  const handleDownloadLua = (e: React.MouseEvent, script: ScriptItem) => {
    e.stopPropagation();
    const isLocked = script.price > 0 && !user.unlockedScriptIds.includes(script.id);
    if (isLocked) {
      unlockScript(script);
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([script.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${script.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.lua`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`'${script.title}.lua' dosyası indirildi! 💾`);
  };

  return (
    <div className="space-y-6">

      {/* Header Banner with Modern Gaming Atmosphere & Official Cover Logo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/90 via-[#130d2b] to-[#0c081c] border border-purple-800/40 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-gradient-to-bl from-pink-500/20 via-purple-600/25 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Left: Text & Metrics */}
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500/40 text-purple-300 text-xs font-semibold">
            <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Roblox Lua Hub & Script Kataloğu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            Çalışan Roblox <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">Scriptleri</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            MM2, Blox Fruits, Blade Ball ve onlarca oyun için güncel, antivirüs onaylı, keyless ve bedava scriptler. Tek tıkla kopyala veya .lua olarak telefonuna/PC'ne indir!
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-purple-900/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{scripts.length} Aktif Script</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-purple-900/40 text-purple-300">
              <Key className="w-3 h-3 text-purple-400" />
              <span>{scripts.filter(s => s.isKeyless).length} Keyless</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-purple-900/40 text-amber-300">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>%100 Test Edildi</span>
            </div>
          </div>
        </div>

        {/* Right: Official Program Cover Logo + Add Action */}
        <div className="relative z-10 flex flex-col sm:flex-row md:flex-col items-center gap-4 shrink-0 w-full md:w-auto">
          <div className="relative group flex items-center justify-center">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0e0a1c] border-2 border-purple-500/50 p-1 shadow-2xl overflow-hidden flex items-center justify-center">
              <img
                src={APP_LOGO_URL}
                alt="HarikaScript Logo Kapağı"
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Add Script Action Button */}
          <button
            onClick={() => setIsAddScriptModalOpen(true)}
            className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-900/50 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Script Paylaş</span>
          </button>
        </div>
      </div>

      {/* Popular Games Quick Pill Shortcuts */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span className="flex items-center gap-1.5 text-purple-300">
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Popüler Oyunlara Göre Filtrele:</span>
          </span>
          {selectedGameFilter && (
            <button
              onClick={() => setSelectedGameFilter(null)}
              className="text-[11px] text-pink-400 hover:text-pink-300 underline font-semibold flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Filtreyi Temizle</span>
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {POPULAR_ROBLOX_GAMES.map(game => {
            const isAll = game === 'Tümü';
            const isSelected = isAll ? !selectedGameFilter : selectedGameFilter?.toLowerCase() === game.toLowerCase();

            return (
              <button
                key={game}
                onClick={() => setSelectedGameFilter(isAll ? null : game)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-900/50 font-black scale-105'
                    : 'bg-[#0f0b22] text-slate-300 hover:text-white hover:bg-purple-950/60 border border-purple-900/40'
                }`}
              >
                <span>{game}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Navigation Bar */}
      <div className="space-y-3 bg-[#0a0817] p-3 rounded-2xl border border-purple-900/30">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Feed Filter: All vs Official vs Community */}
          <div className="flex items-center gap-1 bg-[#120e24] p-1 rounded-xl border border-purple-900/40 overflow-x-auto max-w-full scrollbar-none">
            <button
              onClick={() => setSelectedFeed('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedFeed === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tüm Scriptler ({scripts.length})
            </button>
            <button
              onClick={() => setSelectedFeed('official')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedFeed === 'official'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              👑 Resmi Hub ({scripts.filter(s => s.authorRole === 'Admin').length})
            </button>
            <button
              onClick={() => setSelectedFeed('community')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedFeed === 'community'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              👥 Topluluk ({scripts.filter(s => s.authorRole !== 'Admin').length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 md:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
            <input
              type="text"
              placeholder="Script veya oyun adı ara..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#120e24] text-xs text-white placeholder-slate-500 pl-8 pr-8 py-2 rounded-xl border border-purple-800/40 focus:border-purple-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'Auto Farm', 'Combat', 'Visual/ESP', 'Hub', 'Misc'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-purple-700/60 text-purple-200 border border-purple-500/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/30'
              }`}
            >
              {cat === 'all' ? 'Tüm Kategoriler' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scripts Grid */}
      {filteredScripts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0c0919] border border-purple-900/30 space-y-3">
          <FileCode2 className="w-12 h-12 text-purple-500/30 mx-auto" />
          <h3 className="text-base font-bold text-white">Aranan Kriterde Script Bulunamadı</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Farklı bir arama yapmayı deneyebilir, filtreyi temizleyebilir veya yeni bir script ekleyebilirsiniz.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            {(selectedGameFilter || searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSelectedGameFilter(null);
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Tüm Filtreleri Sıfırla
              </button>
            )}
            <button
              onClick={() => setIsAddScriptModalOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-900/40 inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yeni Script Ekle</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredScripts.map(script => {
            const isLocked = script.price > 0 && !user.unlockedScriptIds.includes(script.id);
            const isCopied = copiedId === script.id;
            const hasImgFailed = failedImages[script.id];

            return (
              <div
                key={script.id}
                onClick={() => setSelectedScript(script)}
                className="group relative flex flex-col justify-between rounded-2xl bg-[#0d0a1b] border border-purple-900/40 hover:border-purple-500/70 p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-950/40 cursor-pointer min-w-0 max-w-full"
              >
                <div>
                  {/* Thumbnail Banner with badges */}
                  <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 mb-3.5">
                    {!hasImgFailed && script.imageUrl ? (
                      <img
                        src={script.imageUrl}
                        alt={script.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setFailedImages(prev => ({ ...prev, [script.id]: true }))}
                      />
                    ) : (
                      /* Styled Fallback Container if image fails to load */
                      <div className="w-full h-full bg-gradient-to-tr from-purple-950 via-[#1a1236] to-indigo-950 flex flex-col items-center justify-center p-3 text-center">
                        <Gamepad2 className="w-10 h-10 text-purple-400/60 mb-1" />
                        <span className="text-xs font-black text-white/90 truncate max-w-full">{script.game}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a1b] via-transparent to-black/40" />

                    {/* Top Status & Keyless Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{script.status}</span>
                      </span>

                      {script.isKeyless ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-900/90 text-purple-200 border border-purple-700/60 flex items-center gap-0.5 shadow-sm">
                          <Key className="w-3 h-3 text-purple-400" />
                          <span>Keyless</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-900/90 text-amber-200 border border-amber-700/60 shadow-sm">
                          Key Sistemli
                        </span>
                      )}
                    </div>

                    {/* Game Name Tag & Version */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2">
                      <span className="text-xs font-bold text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
                        <Gamepad2 className="w-3 h-3 text-purple-400" />
                        <span>{script.game}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded">
                        {script.version}
                      </span>
                    </div>

                    {/* Price / Coin Lock Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {isLocked ? (
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>{script.price} Coin</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-900/80 text-purple-200 border border-purple-600/50 flex items-center gap-1">
                          {script.price === 0 ? 'ÜCRETSİZ' : 'AÇILDI'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1 mb-1.5">
                    {script.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {script.description}
                  </p>
                </div>

                {/* Lua Code Preview Box */}
                <div className="mt-2 space-y-3">
                  <div className="relative rounded-xl bg-[#070510] border border-purple-950 p-2.5 font-mono text-[11px] text-purple-300/80 overflow-hidden select-none">
                    <div className="truncate">
                      {isLocked ? '🔒 Bu script kodunu görüntülemek için kilidi açın...' : script.code}
                    </div>
                  </div>

                  {/* Bottom Footer: Author, Stats & Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-purple-900/30">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 min-w-0">
                      <span className="truncate max-w-[120px]">{script.author}</span>
                      {script.authorRole === 'Admin' && (
                        <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-400 font-bold shrink-0">
                          Admin
                        </span>
                      )}
                    </div>

                    {/* Buttons: Edit, Delete, Lua Download, Copy or Unlock */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Edit Button for Author or Admin */}
                      {canEditScript(script) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingScript(script);
                            setIsAddScriptModalOpen(true);
                          }}
                          className="p-1.5 text-purple-300 hover:text-white rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/40 transition-colors flex items-center gap-1"
                          title="Scripti Düzenle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete shortcut for Author or Admin */}
                      {canDeleteScript(script) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            requestDeleteScript(script);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                          title="Scripti Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Download .lua File Button */}
                      {!isLocked && (
                        <button
                          onClick={(e) => handleDownloadLua(e, script)}
                          className="p-1.5 text-purple-200 hover:text-white rounded-lg bg-purple-950/70 hover:bg-purple-900/90 border border-purple-700/40 transition-colors"
                          title=".lua dosyasını cihazına indir"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isLocked ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            unlockScript(script);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Kilidi Aç ({script.price} Coin)</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleCopyCode(e, script)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95 ${
                            isCopied
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-900/40'
                          }`}
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Kopyalandı' : 'Kopyala'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
