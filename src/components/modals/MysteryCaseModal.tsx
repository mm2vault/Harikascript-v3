import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MysteryCase, CaseReward } from '../../types';
import { CoinIcon } from '../CoinIcon';
import { playCaseTickSound } from '../../utils/soundEffects';
import {
  X,
  Gift,
  Coins,
  Sparkles,
  Crown,
  Flame,
  Zap,
  RotateCw,
  Trophy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const MysteryCaseModal: React.FC = () => {
  const {
    mysteryCases,
    isCaseModalOpen,
    setIsCaseModalOpen,
    user,
    openMysteryCase,
    showToast,
    setIsTasksModalOpen
  } = useApp();

  const [selectedCase, setSelectedCase] = useState<MysteryCase | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [stripItems, setStripItems] = useState<CaseReward[]>([]);
  const [wonReward, setWonReward] = useState<CaseReward | null>(null);
  const [spinOffset, setSpinOffset] = useState(0);

  const stripContainerRef = useRef<HTMLDivElement>(null);

  // Keep selectedCase in sync with mysteryCases
  useEffect(() => {
    if (mysteryCases.length === 0) {
      setSelectedCase(null);
      return;
    }
    // If selectedCase is not set or was deleted, pick first available
    if (!selectedCase || !mysteryCases.some((c) => c.id === selectedCase.id)) {
      setSelectedCase(mysteryCases[0]);
    } else {
      // Keep it up to date with updated fields (e.g., price, name, rewards)
      const fresh = mysteryCases.find((c) => c.id === selectedCase.id);
      if (fresh && fresh !== selectedCase) {
        setSelectedCase(fresh);
      }
    }
  }, [mysteryCases, selectedCase]);

  // Initialize display strip when case changes
  useEffect(() => {
    if (!selectedCase || !selectedCase.rewards || selectedCase.rewards.length === 0) {
      setStripItems([]);
      return;
    }
    // Generate a long random strip of 50 items with the winning item placed at index 38
    const items: CaseReward[] = [];
    const pool = selectedCase.rewards;
    for (let i = 0; i < 50; i++) {
      items.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    setStripItems(items);
    setSpinOffset(0);
    setWonReward(null);
  }, [selectedCase, isCaseModalOpen]);

  if (!isCaseModalOpen) return null;

  const handleOpenCase = async () => {
    if (isSpinning || !selectedCase) return;

    if (user.coins < selectedCase.price) {
      showToast(`Yetersiz bakiye! Bu sandık için ${selectedCase.price} Coin gerekiyor.`);
      setIsTasksModalOpen(true);
      return;
    }

    setIsSpinning(true);
    setWonReward(null);

    // Call openMysteryCase in context to deduct coins and pick server/state reward
    const reward = await openMysteryCase(selectedCase);
    if (!reward) {
      setIsSpinning(false);
      return;
    }

    // Build strip of 60 items with target at index 45
    const targetIndex = 45;
    const newStrip: CaseReward[] = [];
    const pool = selectedCase.rewards && selectedCase.rewards.length > 0 ? selectedCase.rewards : [reward];
    for (let i = 0; i < 60; i++) {
      if (i === targetIndex) {
        newStrip.push(reward);
      } else {
        newStrip.push(pool[Math.floor(Math.random() * pool.length)]);
      }
    }
    setStripItems(newStrip);

    // Reset position first
    setSpinOffset(0);

    // Start tick sounds intervals
    let tickCount = 0;
    const maxTicks = 25;
    const tickInterval = setInterval(() => {
      tickCount++;
      playCaseTickSound();
      if (tickCount >= maxTicks) {
        clearInterval(tickInterval);
      }
    }, 140);

    // Trigger sliding animation
    // Each item card is ~140px width + 12px gap = 152px
    // Center alignment offset
    const itemWidth = 152;
    const containerWidth = stripContainerRef.current?.clientWidth || 600;
    const targetOffset = targetIndex * itemWidth - containerWidth / 2 + itemWidth / 2;

    setTimeout(() => {
      setSpinOffset(targetOffset + (Math.random() * 40 - 20)); // slight jitter for realism
    }, 50);

    // Animation duration is 4.5 seconds
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setWonReward(reward);
    }, 4500);
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return 'border-rose-500 text-rose-300 bg-rose-950/60 shadow-rose-900/40';
      case 'legendary':
        return 'border-amber-400 text-amber-300 bg-amber-950/60 shadow-amber-900/40';
      case 'epic':
        return 'border-purple-400 text-purple-300 bg-purple-950/60 shadow-purple-900/40';
      case 'rare':
        return 'border-blue-400 text-blue-300 bg-blue-950/60 shadow-blue-900/40';
      default:
        return 'border-slate-500 text-slate-300 bg-slate-900/60';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl flex flex-col rounded-3xl bg-[#0d091e] border border-purple-500/50 shadow-2xl overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950/90 via-[#190e38] to-[#0c0919] border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5 shadow-lg shadow-purple-950/50 flex items-center justify-center">
              <Gift className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">Şans Sandığı Açılımı</h3>
                <span className="text-[10px] bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                  KASA OYUNU
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Coin harcayarak nadir Nitro profilleri ve Jackpotlar kazanın!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <CoinIcon className="w-4 h-4" />
              <span>{user.coins.toLocaleString()} Coin</span>
            </div>

            <button
              onClick={() => {
                if (isSpinning) return;
                setIsCaseModalOpen(false);
              }}
              disabled={isSpinning}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Case Selector Tabs */}
          {mysteryCases.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-purple-950/30 rounded-2xl border border-purple-800/40">
              Şu anda yayında şans kutusu bulunmamaktadır.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {mysteryCases.map((caseItem) => {
                const isSelected = selectedCase?.id === caseItem.id;
                return (
                  <button
                    key={caseItem.id}
                    disabled={isSpinning}
                    onClick={() => setSelectedCase(caseItem)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'border-purple-400 bg-gradient-to-br from-purple-900/60 to-[#1b1035] shadow-lg shadow-purple-950/50 ring-2 ring-purple-500/30'
                        : 'border-purple-900/30 bg-[#120d26]/60 hover:bg-[#161030] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/40">
                        {caseItem.tag || 'Kasa'}
                      </span>
                      <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                        <CoinIcon className="w-3.5 h-3.5" />
                        {caseItem.price} Coin
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={caseItem.imageUrl || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200&auto=format&fit=crop&q=80'}
                        alt={caseItem.name}
                        className="w-12 h-12 rounded-xl object-cover border border-purple-500/30 shadow-md shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-white truncate">{caseItem.name}</h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{caseItem.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Roller Carousel Section (CS:GO / ROBLOX STYLE) */}
          <div className="relative rounded-3xl bg-[#070512] border-2 border-purple-500/40 p-4 shadow-2xl overflow-hidden">
            {/* Center Pointer / Crosshair Marker */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-20 w-1 bg-gradient-to-b from-amber-400 via-pink-500 to-purple-600 shadow-lg shadow-amber-400/50 flex flex-col justify-between pointer-events-none">
              <div className="w-4 h-4 bg-amber-400 rotate-45 -translate-x-[6px] -translate-y-2 shadow-md shadow-amber-400" />
              <div className="w-4 h-4 bg-amber-400 rotate-45 -translate-x-[6px] translate-y-2 shadow-md shadow-amber-400" />
            </div>

            {/* Fading side overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#070512] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#070512] to-transparent z-10 pointer-events-none" />

            {/* Moving Strip Container */}
            <div
              ref={stripContainerRef}
              className="overflow-hidden w-full py-4 relative"
            >
              <div
                className="flex items-center gap-3 transition-transform"
                style={{
                  transform: `translateX(-${spinOffset}px)`,
                  transitionDuration: isSpinning ? '4500ms' : '0ms',
                  transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.25, 1)'
                }}
              >
                {stripItems.map((item, index) => (
                  <div
                    key={`${item.id}_${index}`}
                    className={`w-[140px] h-[160px] shrink-0 rounded-2xl border-2 p-3 flex flex-col items-center justify-between text-center transition-all bg-[#120d28] ${getRarityBadge(
                      item.rarity
                    )}`}
                  >
                    <span className="text-[9px] uppercase font-extrabold tracking-wider opacity-80">
                      {item.rarity}
                    </span>

                    <div className="relative w-16 h-16 rounded-xl overflow-hidden my-1 bg-black/40 border border-white/10 flex items-center justify-center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {item.isJackpot && (
                        <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-black text-[8px] font-black uppercase text-center py-0.5">
                          JACKPOT
                        </span>
                      )}
                    </div>

                    <div className="w-full">
                      <p className="text-[11px] font-extrabold text-white truncate max-w-[120px]">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-slate-400 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Winning Reward Reveal Card */}
          {wonReward && !isSpinning && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-purple-950/60 to-emerald-950/60 border-2 border-emerald-500/60 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-black/40 border-2 border-emerald-400 overflow-hidden shrink-0 shadow-lg shadow-emerald-500/30">
                  <img
                    src={wonReward.imageUrl}
                    alt={wonReward.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                      KAZANDINIZ!
                    </span>
                    <span className="text-xs font-bold text-emerald-300 uppercase">
                      {wonReward.rarity}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">{wonReward.name}</h4>
                  <p className="text-xs text-slate-300">{wonReward.description}</p>
                </div>
              </div>

              {selectedCase && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleOpenCase}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    Tekrar Aç ({selectedCase.price} C)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action Button & Potential Drops */}
          {selectedCase && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-left w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-300 block mb-1">
                  Sandık İçeriği & Olası Ödüller ({selectedCase.rewards?.length || 0}):
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedCase.rewards?.map((r) => (
                    <span
                      key={r.id}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${getRarityBadge(
                        r.rarity
                      )}`}
                    >
                      {r.name}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleOpenCase}
                disabled={isSpinning || user.coins < selectedCase.price}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 ${
                  user.coins < selectedCase.price
                    ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white shadow-purple-900/50'
                } disabled:opacity-50`}
              >
                {isSpinning ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-white" />
                    <span>Sandık Açılıyor...</span>
                  </>
                ) : user.coins < selectedCase.price ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Yetersiz Bakiye ({selectedCase.price} Coin)</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>Sandığı Aç ({selectedCase.price} Coin)</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
