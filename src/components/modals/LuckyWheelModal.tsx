import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  Coins,
  Crown,
  Gift,
  CheckCircle2,
  Clock,
  RotateCw,
  Trophy,
  PartyPopper,
  Hourglass
} from 'lucide-react';

interface WheelSector {
  label: string;
  sublabel: string;
  type: 'coins' | 'frame' | 'badge';
  amount?: number;
  color: string;
  textColor: string;
}

const SECTORS: WheelSector[] = [
  { label: '50 Coin', sublabel: 'Bronz', type: 'coins', amount: 50, color: '#1e1b4b', textColor: '#a5b4fc' },
  { label: '100 Coin', sublabel: 'Gümüş', type: 'coins', amount: 100, color: '#064e3b', textColor: '#6ee7b7' },
  { label: '250 Coin', sublabel: 'Altın', type: 'coins', amount: 250, color: '#78350f', textColor: '#fde047' },
  { label: '500 Coin', sublabel: 'Elmas', type: 'coins', amount: 500, color: '#581c87', textColor: '#e9d5ff' },
  { label: 'JACKPOT!', sublabel: '1000 Coin 🌟', type: 'coins', amount: 1000, color: '#831843', textColor: '#fbcfe8' },
  { label: '350 Coin', sublabel: 'Mega Bonus 🪙', type: 'coins', amount: 350, color: '#1e293b', textColor: '#38bdf8' },
  { label: '200 Coin', sublabel: 'Zümrüt', type: 'coins', amount: 200, color: '#134e4a', textColor: '#5eead4' },
  { label: '750 Coin', sublabel: 'Süper Ödül 👑', type: 'coins', amount: 750, color: '#701a75', textColor: '#f472b6' }
];

export const LuckyWheelModal: React.FC = () => {
  const {
    isLuckyWheelOpen,
    setIsLuckyWheelOpen,
    user,
    setUser,
    claimLuckySpin,
    showToast
  } = useApp();

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<WheelSector | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const today = new Date().toDateString();
  // STRICT RULE: Every user can only spin ONCE per calendar day
  const alreadySpunToday = user.lastLuckySpin === today;

  // Real-time countdown timer to midnight (00:00:00)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('00s 00d 00sn');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}s ${minutes.toString().padStart(2, '0')}d ${seconds.toString().padStart(2, '0')}sn`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Play synthetic audio chime for spin and victory
  const playChime = (type: 'tick' | 'win') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'tick') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch {}
  };

  const handleSpin = () => {
    if (isSpinning) return;
    if (alreadySpunToday) {
      showToast(`Bugünkü ücretsiz çark hakkınızı kullandınız! Yenilenme süresi: ${timeLeft}`);
      return;
    }

    setIsSpinning(true);
    setWonPrize(null);
    setShowCelebration(false);

    // Immediately mark today as spun so user cannot multi-spin
    setUser(prev => ({ ...prev, lastLuckySpin: today }));

    // Pick random target slice (weighted towards fair rewards, slight jackpot chance)
    const weights = [25, 25, 18, 12, 5, 5, 8, 2];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let randomNum = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < weights.length; i++) {
      if (randomNum < weights[i]) {
        selectedIndex = i;
        break;
      }
      randomNum -= weights[i];
    }

    const sectorAngle = 360 / SECTORS.length;
    // Calculate final rotation degrees: 6 full revolutions + target alignment
    const extraSpins = 360 * 6;
    const targetSectorCenter = selectedIndex * sectorAngle + sectorAngle / 2;
    const targetDegree = extraSpins + (360 - targetSectorCenter);

    const newRotation = rotation + targetDegree;
    setRotation(newRotation);

    // Sound ticks simulation
    const interval = setInterval(() => {
      playChime('tick');
    }, 350);

    // End of spin duration (5 seconds)
    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
      const prize = SECTORS[selectedIndex];
      setWonPrize(prize);
      setShowCelebration(true);
      playChime('win');

      // Grant reward in AppContext
      claimLuckySpin({
        type: prize.type,
        amount: prize.amount,
        name: `${prize.label} (${prize.sublabel})`
      });
    }, 5000);
  };

  if (!isLuckyWheelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0d091e] border border-purple-500/50 p-4 sm:p-6 shadow-2xl text-center">
        
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mb-20 w-60 h-60 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsLuckyWheelOpen(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 text-slate-400 hover:text-white rounded-xl bg-purple-950/40 hover:bg-white/10 transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Her Gün Yalnızca 1 Kez Çevrilebilir</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Günlük <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Şans Çarkı</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Günde 1 kez çarkı çevirerek 1.000 Coin Jackpot, Discord Nitro çerçevesi veya özel rozet kazan!
          </p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-56 h-56 xs:w-64 xs:h-64 sm:w-72 sm:h-72 mx-auto my-3 flex items-center justify-center select-none">
          
          {/* Top Indicator Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none drop-shadow-[0_4px_10px_rgba(234,179,8,0.8)]">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400" />
          </div>

          {/* Outer Wheel Glow Rim */}
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.4)] pointer-events-none z-10" />

          {/* Rotating Wheel Canvas / SVG */}
          <div
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
            }}
            className="w-full h-full rounded-full overflow-hidden shadow-2xl relative"
          >
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {SECTORS.map((sector, index) => {
                const angle = 360 / SECTORS.length;
                const startAngle = index * angle;
                const endAngle = startAngle + angle;

                // SVG Arc math
                const x1 = 150 + 150 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                const y1 = 150 + 150 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                const x2 = 150 + 150 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                const y2 = 150 + 150 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                const d = `M150,150 L${x1},${y1} A150,150 0 0,1 ${x2},${y2} Z`;
                const textAngle = startAngle + angle / 2;

                return (
                  <g key={index}>
                    <path d={d} fill={sector.color} stroke="#3b0764" strokeWidth="1.5" />
                    <text
                      x="150"
                      y="45"
                      fill={sector.textColor}
                      fontSize="11"
                      fontWeight="900"
                      textAnchor="middle"
                      transform={`rotate(${textAngle}, 150, 150)`}
                      className="font-sans select-none tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                    >
                      {sector.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub Button */}
          <div
            onClick={!isSpinning && !alreadySpunToday ? handleSpin : undefined}
            className={`absolute z-20 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-amber-600 via-purple-700 to-pink-600 border-3 border-amber-300 flex flex-col items-center justify-center text-white font-black text-[11px] shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all ${
              isSpinning || alreadySpunToday
                ? 'opacity-60 cursor-not-allowed grayscale-[30%]'
                : 'hover:scale-105 cursor-pointer active:scale-95'
            }`}
          >
            <RotateCw className={`w-4 h-4 mb-0.5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? '...' : alreadySpunToday ? 'BİTTİ' : 'ÇEVİR'}</span>
          </div>
        </div>

        {/* Celebration / Won Result Box */}
        {showCelebration && wonPrize && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-500/50 space-y-1.5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center gap-2 text-amber-300 font-extrabold text-sm">
              <PartyPopper className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>TEBRİKLER KAZANDIN!</span>
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
            </div>
            <p className="font-black text-base text-white">
              {wonPrize.label} <span className="text-amber-400">({wonPrize.sublabel})</span>
            </p>
            <p className="text-[11px] text-slate-300">
              Ödülünüz hesabınıza aktarıldı. Güle güle kullanın!
            </p>
          </div>
        )}

        {/* Bottom Spin Action & Cooldown Notice with Live Timer */}
        <div className="mt-4 pt-3 border-t border-purple-900/40 space-y-2">
          {!alreadySpunToday ? (
            <button
              disabled={isSpinning}
              onClick={handleSpin}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:from-amber-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSpinning ? 'Şans Çarkı Dönüyor...' : 'Şansını Dene (Günde 1 Kez)'}</span>
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-purple-950/50 border border-purple-800/40 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Bugünkü Çevirme Hakkı Kullanıldı</span>
                </div>
                <span className="text-[10px] bg-purple-900/80 text-purple-300 px-2 py-0.5 rounded font-bold border border-purple-700/40">
                  Günde 1 Kez
                </span>
              </div>

              {/* Real-time Cooldown countdown timer */}
              <div className="flex items-center justify-between pt-1 border-t border-purple-900/40 text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Sonraki Çevirme:</span>
                </span>
                <span className="font-extrabold text-amber-300 font-mono tracking-wider tabular-nums">
                  {timeLeft || 'Yarın 00:00'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
