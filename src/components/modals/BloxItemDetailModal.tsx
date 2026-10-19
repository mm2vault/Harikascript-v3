import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Zap,
  Sword,
  Shield,
  Coins,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  ArrowRightLeft,
  Info
} from 'lucide-react';

export const BloxItemDetailModal: React.FC = () => {
  const {
    bloxItems,
    selectedBloxFruit,
    setSelectedBloxFruit,
    showToast,
    setActiveTab
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset image index when fruit changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedBloxFruit?.id]);

  // Keyboard navigation & escape listener (Hook placed unconditionally before early return)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedBloxFruit) return;
      if (e.key === 'Escape') {
        setSelectedBloxFruit(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBloxFruit, setSelectedBloxFruit]);

  const currentIndex = selectedBloxFruit ? bloxItems.findIndex((i) => i.id === selectedBloxFruit.id) : -1;
  const hasPrevItem = currentIndex > 0;
  const hasNextItem = currentIndex >= 0 && currentIndex < bloxItems.length - 1;

  const goToPrevItem = () => {
    if (hasPrevItem) {
      setSelectedBloxFruit(bloxItems[currentIndex - 1]);
    }
  };

  const goToNextItem = () => {
    if (hasNextItem) {
      setSelectedBloxFruit(bloxItems[currentIndex + 1]);
    }
  };

  if (!selectedBloxFruit) return null;

  const images: string[] = [
    selectedBloxFruit.imageUrl,
    ...(Array.isArray(selectedBloxFruit.galleryImages) ? selectedBloxFruit.galleryImages : [])
  ].filter(Boolean);

  const currentImage = images[activeImageIndex] || selectedBloxFruit.imageUrl;

  const handleShare = () => {
    const shareText = `HarikaScript Blox Fruits: ${selectedBloxFruit.name} (${selectedBloxFruit.type}) - Değer: ${(selectedBloxFruit.value / 1000000).toFixed(0)}M Beli!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      showToast('Meyve bilgisi kopyalandı!');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getRarityBadge = () => {
    switch (selectedBloxFruit.rarity) {
      case 'Mythical':
        return 'bg-gradient-to-r from-red-600 via-pink-600 to-purple-700 text-white border-red-500/50 shadow-lg shadow-red-900/30';
      case 'Legendary':
        return 'bg-gradient-to-r from-pink-600 to-rose-700 text-white border-pink-500/50';
      case 'Rare':
        return 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-500/50';
      case 'Uncommon':
        return 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-500/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getTypeColor = () => {
    switch (selectedBloxFruit.type) {
      case 'Beast':
        return 'text-red-400 bg-red-950/60 border-red-500/40';
      case 'Elemental':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
      case 'Natural':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      default:
        return 'text-purple-400 bg-purple-950/60 border-purple-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0b0818] border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-900/40 bg-gradient-to-r from-[#140b28] via-[#0d091f] to-[#140b28]">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${getRarityBadge()}`}>
              {selectedBloxFruit.rarity}
            </span>
            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${getTypeColor()}`}>
              {selectedBloxFruit.type === 'Beast' ? 'Canavar (Zoan)' : selectedBloxFruit.type === 'Elemental' ? 'Element (Logia)' : 'Doğal (Paramecia)'}
            </span>
            {selectedBloxFruit.awakening && (
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Uyanış V2</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              title="Bilgiyi Kopyala"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSelectedBloxFruit(null)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Main Artwork & Quick Navigation */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative rounded-2xl bg-gradient-to-b from-purple-950/40 to-black/80 border border-purple-800/40 p-4 aspect-square flex items-center justify-center overflow-hidden group">
                <img
                  src={currentImage}
                  alt={selectedBloxFruit.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80';
                  }}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_25px_rgba(234,88,12,0.4)] group-hover:scale-105 transition-transform duration-300"
                />

                {/* Prev / Next controls */}
                {hasPrevItem && (
                  <button
                    onClick={goToPrevItem}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white border border-white/10 shadow-lg"
                    title="Önceki Meyve"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                {hasNextItem && (
                  <button
                    onClick={goToNextItem}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white border border-white/10 shadow-lg"
                    title="Sonraki Meyve"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Economy Info Strip */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Beli Satıcı Fiyatı</div>
                  <div className="text-sm font-black text-emerald-400">
                    {selectedBloxFruit.beliPrice > 0 ? `$${selectedBloxFruit.beliPrice.toLocaleString()}` : 'Gamepass'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Kalıcı (Perm) Robux</div>
                  <div className="text-sm font-black text-amber-400">
                    {selectedBloxFruit.robuxPrice > 0 ? `${selectedBloxFruit.robuxPrice.toLocaleString()} R$` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Fruit Details, Values, Moves */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
                  <span>{selectedBloxFruit.name}</span>
                </h2>
                <p className="text-xs text-purple-300/80 mt-1">
                  {selectedBloxFruit.category} Blox Fruits Meyvesi & Takas Değeri
                </p>
              </div>

              {/* Value & Demand Grid */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/40 border border-purple-700/40">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Takas Değeri</div>
                  <div className="text-lg font-black text-emerald-400">
                    {(selectedBloxFruit.value / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-[9px] text-slate-400">{selectedBloxFruit.value.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Talep Durumu</div>
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1 mt-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedBloxFruit.demand}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Stabilite</div>
                  <div className="text-xs font-bold flex items-center gap-1 mt-1">
                    {selectedBloxFruit.stability === 'Yükseliyor' ? (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Yükseliyor
                      </span>
                    ) : selectedBloxFruit.stability === 'Düşüyor' ? (
                      <span className="text-rose-400 flex items-center gap-0.5">
                        <TrendingDown className="w-3.5 h-3.5" /> Düşüyor
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-0.5">
                        <Minus className="w-3.5 h-3.5" /> Sabit
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tier Rankings */}
              <div className="flex gap-2">
                {selectedBloxFruit.pveRating && (
                  <div className="flex-1 p-2.5 rounded-xl bg-[#140e2b] border border-purple-800/40 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">PvE / Raid / Farm:</span>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-xs">
                      {selectedBloxFruit.pveRating} Tier
                    </span>
                  </div>
                )}
                {selectedBloxFruit.pvpRating && (
                  <div className="flex-1 p-2.5 rounded-xl bg-[#140e2b] border border-purple-800/40 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">PvP / Savaş Gücü:</span>
                    <span className="px-2 py-0.5 rounded-lg bg-red-500/20 text-red-300 font-black text-xs">
                      {selectedBloxFruit.pvpRating} Tier
                    </span>
                  </div>
                )}
              </div>

              {/* Description & Lore */}
              <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-900/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                  <Info className="w-3.5 h-3.5 text-purple-400" />
                  <span>Meyve Hakkında & Taktikler:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedBloxFruit.description || 'Bu Blox Fruits meyvesi hakkında detaylı bilgi bulunmamaktadır.'}
                </p>
                {selectedBloxFruit.obtainMethod && (
                  <div className="text-[11px] text-slate-400 pt-1">
                    <span className="text-amber-400 font-bold">Nasıl Alınır: </span>
                    {selectedBloxFruit.obtainMethod}
                  </div>
                )}
              </div>

              {/* Moveset Table if available */}
              {Array.isArray(selectedBloxFruit.moves) && selectedBloxFruit.moves.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Sword className="w-3.5 h-3.5 text-amber-400" />
                    <span>Yetenekler (Moveset):</span>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {selectedBloxFruit.moves.map((move, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-[#130d2a] border border-purple-800/30 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-purple-900/60 text-purple-200 font-mono font-black text-center flex items-center justify-center text-[10px]">
                            {move.key}
                          </span>
                          <span className="font-bold text-white">{move.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>Mastery {move.mastery}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trivia list */}
              {Array.isArray(selectedBloxFruit.trivia) && selectedBloxFruit.trivia.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-bold text-purple-300">İlginç Fandom Bilgileri:</div>
                  <ul className="text-[11px] text-slate-400 space-y-0.5 list-disc list-inside">
                    {selectedBloxFruit.trivia.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-5 py-3.5 border-t border-purple-900/40 bg-[#0d091f] flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Kısayol: <kbd className="px-1.5 py-0.5 bg-black/50 rounded border border-white/10 text-[10px]">ESC</kbd> ile kapat
          </div>
          <button
            onClick={() => {
              setSelectedBloxFruit(null);
              setActiveTab('blox_values');
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-red-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Takas Değerleri Sayfasına Git</span>
          </button>
        </div>

      </div>
    </div>
  );
};
