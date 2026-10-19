import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_LOGO_URL } from '../constants/branding';
import {
  Trophy,
  Crown,
  Medal,
  Coins,
  FileCode2,
  Sparkles,
  Flame,
  Shield,
  ArrowUpRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { CoinIcon } from './CoinIcon';

interface LeaderboardUser {
  rank: number;
  username: string;
  avatarUrl: string;
  coins: number;
  scriptsCount: number;
  luckyWins: number;
  role: 'admin' | 'user';
  badge: string;
}

export const LeaderboardView: React.FC = () => {
  const { user, scripts, allUsers } = useApp();
  const [filterType, setFilterType] = useState<'coins' | 'scripts' | 'lucky'>('coins');

  // Generate realistic community leaderboard merged with active user
  const baseCommunity: LeaderboardUser[] = [
    {
      rank: 1,
      username: 'BloxMaster_TR',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      coins: 48500,
      scriptsCount: 19,
      luckyWins: 14,
      role: 'admin',
      badge: 'Efsane Lider 👑'
    },
    {
      rank: 2,
      username: 'MM2_ShadowKing',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      coins: 36200,
      scriptsCount: 14,
      luckyWins: 11,
      role: 'user',
      badge: 'Godly Koleksiyoncusu 🗡️'
    },
    {
      rank: 3,
      username: 'ScriptWizard_Lua',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      coins: 29400,
      scriptsCount: 22,
      luckyWins: 8,
      role: 'user',
      badge: 'Lua Mimarı ⚡'
    },
    {
      rank: 4,
      username: 'DeltaExecutorFan',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      coins: 18900,
      scriptsCount: 8,
      luckyWins: 9,
      role: 'user',
      badge: 'Byfron Avcısı 🛡️'
    },
    {
      rank: 5,
      username: 'CandyLover_MM2',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      coins: 14200,
      scriptsCount: 6,
      luckyWins: 7,
      role: 'user',
      badge: 'Chroma Tüccarı ✨'
    },
    {
      rank: 6,
      username: 'RobloxGamer_99',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      coins: 11500,
      scriptsCount: 5,
      luckyWins: 6,
      role: 'user',
      badge: 'Topluluk Kıdemlisi 🚀'
    }
  ];

  // Include current user in ranking
  const currentUserItem: LeaderboardUser = {
    rank: 7,
    username: user.username,
    avatarUrl: user.avatarUrl,
    coins: user.coins,
    scriptsCount: scripts.filter(s => s.author === user.username || s.authorRole === 'Admin').length || 3,
    luckyWins: user.completedTaskIds?.filter(t => t.includes('lucky')).length || 4,
    role: user.role,
    badge: user.role === 'admin' ? 'Super Admin 👑' : 'Aktif Oyuncu ⚡'
  };

  const combinedList = [...baseCommunity, currentUserItem];

  // Sort based on active filter
  const sortedList = [...combinedList].sort((a, b) => {
    if (filterType === 'coins') return b.coins - a.coins;
    if (filterType === 'scripts') return b.scriptsCount - a.scriptsCount;
    return b.luckyWins - a.luckyWins;
  }).map((item, idx) => ({ ...item, rank: idx + 1 }));

  const top1 = sortedList[0];
  const top2 = sortedList[1];
  const top3 = sortedList[2];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#1a0f30] to-[#0c081c] border border-amber-500/40 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Küresel HarikaScript Sıralaması</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            Liderlik <span className="text-amber-400">Tablosu</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            HarikaScript topluluğunun en çok coin toplayan zenginleri, en popüler script yazarları ve şans çarkı liderleri!
          </p>
        </div>

        {/* Brand Logo Badge */}
        <div className="relative group flex items-center justify-center shrink-0">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0e0a1c] border-2 border-amber-400/50 p-1 shadow-2xl overflow-hidden flex items-center justify-center">
            <img src={APP_LOGO_URL} alt="Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterType('coins')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'coins'
              ? 'bg-amber-600 text-black shadow-lg shadow-amber-900/40 font-black'
              : 'bg-[#0e0b1f] text-slate-300 hover:text-white border border-purple-900/40'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>En Çok Coin Toplayanlar</span>
        </button>

        <button
          onClick={() => setFilterType('scripts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'scripts'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 font-black'
              : 'bg-[#0e0b1f] text-slate-300 hover:text-white border border-purple-900/40'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>En Çok Script Paylaşanlar</span>
        </button>

        <button
          onClick={() => setFilterType('lucky')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'lucky'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/40 font-black'
              : 'bg-[#0e0b1f] text-slate-300 hover:text-white border border-purple-900/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Şans Çarkı Ustaları</span>
        </button>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* 2nd Place */}
        {top2 && (
          <div className="order-2 md:order-1 rounded-3xl bg-gradient-to-b from-[#140e2b] to-[#0a0716] border border-slate-400/40 p-5 flex flex-col items-center text-center relative shadow-xl hover:-translate-y-1 transition-transform">
            <div className="absolute -top-3.5 px-3 py-0.5 rounded-full bg-slate-300 text-slate-900 text-xs font-black flex items-center gap-1 shadow-md">
              <Medal className="w-3.5 h-3.5" />
              <span>#2 İKİNCİ</span>
            </div>
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-300/60 p-0.5 mb-3 mt-2 shadow-lg">
              <img src={top2.avatarUrl} alt={top2.username} className="w-full h-full object-cover rounded-xl" />
            </div>
            <h3 className="font-extrabold text-white text-sm">{top2.username}</h3>
            <span className="text-[10px] text-slate-400 mb-2">{top2.badge}</span>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-400/30 text-slate-200 font-black text-xs flex items-center gap-1.5">
              <CoinIcon className="w-3.5 h-3.5" />
              <span>
                {filterType === 'coins' ? `${top2.coins.toLocaleString('tr-TR')} Coin` : filterType === 'scripts' ? `${top2.scriptsCount} Script` : `${top2.luckyWins} Çark Galibiyeti`}
              </span>
            </div>
          </div>
        )}

        {/* 1st Place (Champion) */}
        {top1 && (
          <div className="order-1 md:order-2 rounded-3xl bg-gradient-to-b from-amber-950/60 via-[#1c1236] to-[#0d091d] border-2 border-amber-400/70 p-6 flex flex-col items-center text-center relative shadow-2xl hover:-translate-y-1 transition-transform md:-mt-3">
            <div className="absolute -top-4 px-4 py-1 rounded-full bg-amber-400 text-black text-xs font-black flex items-center gap-1 shadow-xl animate-bounce">
              <Crown className="w-4 h-4 fill-black" />
              <span>#1 ŞAMPİYON</span>
            </div>
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 p-0.5 mb-3 mt-2 shadow-xl ring-4 ring-amber-400/20">
              <img src={top1.avatarUrl} alt={top1.username} className="w-full h-full object-cover rounded-xl" />
            </div>
            <h3 className="font-black text-white text-base">{top1.username}</h3>
            <span className="text-[11px] text-amber-300 font-semibold mb-2">{top1.badge}</span>
            <div className="px-4 py-2 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-300 font-black text-sm flex items-center gap-1.5 shadow-lg">
              <CoinIcon className="w-4 h-4" />
              <span>
                {filterType === 'coins' ? `${top1.coins.toLocaleString('tr-TR')} Coin` : filterType === 'scripts' ? `${top1.scriptsCount} Script` : `${top1.luckyWins} Çark Galibiyeti`}
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3 && (
          <div className="order-3 rounded-3xl bg-gradient-to-b from-[#140e2b] to-[#0a0716] border border-amber-700/40 p-5 flex flex-col items-center text-center relative shadow-xl hover:-translate-y-1 transition-transform">
            <div className="absolute -top-3.5 px-3 py-0.5 rounded-full bg-amber-700 text-white text-xs font-black flex items-center gap-1 shadow-md">
              <Medal className="w-3.5 h-3.5" />
              <span>#3 ÜÇÜNCÜ</span>
            </div>
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-700/60 p-0.5 mb-3 mt-2 shadow-lg">
              <img src={top3.avatarUrl} alt={top3.username} className="w-full h-full object-cover rounded-xl" />
            </div>
            <h3 className="font-extrabold text-white text-sm">{top3.username}</h3>
            <span className="text-[10px] text-slate-400 mb-2">{top3.badge}</span>
            <div className="px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-700/30 text-amber-200 font-black text-xs flex items-center gap-1.5">
              <CoinIcon className="w-3.5 h-3.5" />
              <span>
                {filterType === 'coins' ? `${top3.coins.toLocaleString('tr-TR')} Coin` : filterType === 'scripts' ? `${top3.scriptsCount} Script` : `${top3.luckyWins} Çark Galibiyeti`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-3xl bg-[#0d091b] border border-purple-900/40 overflow-hidden shadow-2xl">
        <div className="p-4 bg-purple-950/40 border-b border-purple-900/40 flex items-center justify-between">
          <span className="font-extrabold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Tüm Sıralama Tablosu ({sortedList.length} Oyuncu)</span>
          </span>
          <span className="text-xs text-purple-300">Her saat güncellenir</span>
        </div>

        <div className="divide-y divide-purple-900/30">
          {sortedList.map((item) => {
            const isMe = item.username === user.username;
            return (
              <div
                key={item.rank + item.username}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                  isMe
                    ? 'bg-purple-900/30 border-l-4 border-pink-500'
                    : 'hover:bg-purple-950/30'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Badge */}
                  <div className="w-7 text-center font-black text-sm text-slate-400 shrink-0">
                    {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-purple-700/40 shrink-0">
                    <img src={item.avatarUrl} alt={item.username} className="w-full h-full object-cover" />
                  </div>

                  {/* Name & Badge */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-white truncate">{item.username}</span>
                      {isMe && (
                        <span className="px-1.5 py-0.2 rounded bg-pink-600/40 text-pink-300 text-[10px] font-extrabold border border-pink-500/40">
                          SEN
                        </span>
                      )}
                      {item.role === 'admin' && (
                        <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-purple-300/80 block truncate">{item.badge}</span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="font-black text-xs sm:text-sm text-amber-300 flex items-center justify-end gap-1.5">
                    <CoinIcon className="w-3.5 h-3.5" />
                    <span>
                      {filterType === 'coins'
                        ? item.coins.toLocaleString('tr-TR')
                        : filterType === 'scripts'
                        ? `${item.scriptsCount} Script`
                        : `${item.luckyWins} Çark`}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {filterType === 'coins' ? 'Coin Bakiyesi' : filterType === 'scripts' ? 'Paylaşılan' : 'Galibiyet'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
