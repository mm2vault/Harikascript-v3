import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BloxFruitItem } from '../types';
import { AddTradePostModal } from './modals/AddTradePostModal';
import {
  Flame,
  Search,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Scale,
  Zap,
  Edit2,
  PlusCircle,
  Share2,
  Copy,
  Layers,
  Crown,
  Gamepad2,
  Info,
  Apple,
  Sword,
  PawPrint
} from 'lucide-react';

export const BloxValuesView: React.FC = () => {
  const {
    bloxItems,
    tradePosts,
    deleteTradePost,
    showToast,
    user,
    setIsAddBloxFruitModalOpen,
    setEditingBloxFruit,
    requestDeleteBloxFruit,
    isAuthorizedAdmin,
    setSelectedBloxFruit
  } = useApp();

  const [subTab, setSubTab] = useState<'values' | 'trades'>('values');
  const [isAddTradeModalOpen, setIsAddTradeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [gameTradeFilter, setGameTradeFilter] = useState<string>('all');

  // Trade Calculator State
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [myOfferItems, setMyOfferItems] = useState<BloxFruitItem[]>([]);
  const [theirOfferItems, setTheirOfferItems] = useState<BloxFruitItem[]>([]);

  // Filtered Blox Fruits
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return bloxItems.filter(item => {
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.rarity.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q));

      let matchesFilter = true;
      if (selectedFilter === 'all') {
        matchesFilter = true;
      } else if (selectedFilter === 'Mythical' || selectedFilter === 'Legendary' || selectedFilter === 'Rare') {
        matchesFilter = item.rarity === selectedFilter;
      } else if (selectedFilter === 'Beast' || selectedFilter === 'Elemental' || selectedFilter === 'Natural') {
        matchesFilter = item.type === selectedFilter;
      } else if (selectedFilter === 'awakened') {
        matchesFilter = !!item.awakening;
      } else if (selectedFilter === 'gamepass') {
        matchesFilter = item.category === 'Gamepass' || item.category === 'Kalıcı (Perm)';
      }

      return matchesSearch && matchesFilter;
    });
  }, [bloxItems, searchQuery, selectedFilter]);

  // Filtered Trade Posts (Blox Fruits tab supports filtering by game or showing Blox Fruits)
  const filteredTrades = useMemo(() => {
    return tradePosts.filter(post => {
      if (gameTradeFilter === 'all') return true;
      if (gameTradeFilter === 'Blox Fruits') return !post.game || post.game === 'Blox Fruits';
      return post.game === gameTradeFilter;
    });
  }, [tradePosts, gameTradeFilter]);

  // Calculator totals
  const myTotalValue = useMemo(() => myOfferItems.reduce((acc, cur) => acc + cur.value, 0), [myOfferItems]);
  const theirTotalValue = useMemo(() => theirOfferItems.reduce((acc, cur) => acc + cur.value, 0), [theirOfferItems]);

  // Trade Outcome Calculation
  const tradeOutcome = useMemo(() => {
    if (myTotalValue === 0 && theirTotalValue === 0) return null;
    const diff = theirTotalValue - myTotalValue;
    const diffMillions = (diff / 1000000).toFixed(1);
    const ratio = myTotalValue > 0 ? (theirTotalValue / myTotalValue) : 1;

    if (diff > 5000000 || ratio > 1.15) {
      return { status: 'win', label: 'BÜYÜK KAZANÇ (BIG WIN)', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40', desc: `+${diffMillions}M Beli Değer Kazancı!` };
    } else if (diff < -5000000 || ratio < 0.85) {
      return { status: 'lose', label: 'ZARAR / KAYIP (LOSE)', color: 'text-rose-400 bg-rose-950/60 border-rose-500/40', desc: `${diffMillions}M Beli Değer Kaybı!` };
    } else {
      return { status: 'fair', label: 'EŞİT / DENGELİ (FAIR)', color: 'text-amber-400 bg-amber-950/60 border-amber-500/40', desc: 'Dengeli ve adil takas' };
    }
  }, [myTotalValue, theirTotalValue]);

  const handleAddToMyOffer = (item: BloxFruitItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMyOfferItems(prev => [...prev, item]);
    setIsCalculatorOpen(true);
    showToast(`'${item.name}' senin teklifine eklendi!`);
  };

  const handleAddToTheirOffer = (item: BloxFruitItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTheirOfferItems(prev => [...prev, item]);
    setIsCalculatorOpen(true);
    showToast(`'${item.name}' karşı tarafın teklifine eklendi!`);
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'Mythical':
        return 'bg-gradient-to-r from-red-600 via-pink-600 to-purple-700 text-white border-red-500/50 shadow-sm shadow-red-900/40';
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#180a2b] via-[#240b3b] to-[#120524] border border-amber-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Blox Fruits Canlı Fandom Değer Listesi & Takas Borsa Merkezi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Blox Fruits Değerleri & Takas Hub</span>
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md shadow-amber-950/50">
                <Apple className="w-5 h-5 fill-amber-400/20" />
              </div>
            </h1>
            <p className="text-sm text-purple-200/80 max-w-2xl leading-relaxed">
              Kitsune, Dragon, Leopard, Dough ve tüm fiziksel/kalıcı meyvelerin güncel takas değerleri, 
              talep durumları, raid uyanışları ve Win/Fair/Lose takas hesaplayıcısı.
            </p>
          </div>

          {/* Quick Header CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsCalculatorOpen(prev => !prev)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-900/40 active:scale-95 transition-all"
            >
              <ArrowRightLeft className="w-4 h-4 text-amber-200" />
              <span>{isCalculatorOpen ? 'Hesaplayıcıyı Gizle' : 'W/F/L Hesaplayıcı'}</span>
            </button>

            <button
              onClick={() => setIsAddTradeModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-purple-200" />
              <span>Takas İlanı Ver</span>
            </button>

            {isAuthorizedAdmin && (
              <button
                onClick={() => {
                  setEditingBloxFruit(null);
                  setIsAddBloxFruitModalOpen(true);
                }}
                className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                title="Yeni Blox Fruits Meyvesi Ekle"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Meyve Ekle</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Statistics Counter Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-purple-800/40">
          <div className="p-3 rounded-2xl bg-black/40 border border-purple-800/30">
            <div className="text-[10px] uppercase font-bold text-purple-300/80">Toplam Meyve & İtem</div>
            <div className="text-xl font-black text-white mt-0.5">{bloxItems.length} Adet</div>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-purple-800/30">
            <div className="text-[10px] uppercase font-bold text-amber-300/80">En Değerli Meyve</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">Kitsune (115M)</div>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-purple-800/30">
            <div className="text-[10px] uppercase font-bold text-emerald-300/80">Raid / Farm Kralı</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">Buddha (SS+ Tier)</div>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-purple-800/30">
            <div className="text-[10px] uppercase font-bold text-cyan-300/80">Canlı Takas İlanları</div>
            <div className="text-xl font-black text-cyan-400 mt-0.5">{tradePosts.length} Aktif</div>
          </div>
        </div>
      </div>

      {/* Primary Subtab Switcher: Meyve Değerleri & Wiki vs Takas İlanları */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-900/50 pb-3">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-purple-950/40 border border-purple-800/30">
          <button
            onClick={() => setSubTab('values')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'values'
                ? 'bg-gradient-to-r from-amber-600 via-red-600 to-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4 text-amber-400" />
            <span>Meyve Değer Listesi & Wiki ({bloxItems.length})</span>
          </button>
          <button
            onClick={() => setSubTab('trades')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'trades'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Topluluk Takas İlanları ({tradePosts.length})</span>
          </button>
        </div>
      </div>

      {/* W/F/L TRADE CALCULATOR DRAWER */}
      {isCalculatorOpen && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#120826] via-[#1a0a33] to-[#0d051a] border-2 border-amber-500/60 shadow-2xl space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Blox Fruits Win / Fair / Lose (W/F/L) Hesaplayıcısı</h3>
                <p className="text-xs text-amber-300/80">Kartların üzerindeki butonlara basarak veya aşağıdaki listelerden eşya ekleyin</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMyOfferItems([]);
                  setTheirOfferItems([]);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Temizle
              </button>
              <button
                onClick={() => setIsCalculatorOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Calculator Offer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* My Offer (Left) */}
            <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Senin Verdiklerin (Your Offer):
                </span>
                <span className="text-sm font-black text-emerald-300 font-mono">
                  {(myTotalValue / 1000000).toFixed(1)}M Beli
                </span>
              </div>

              <div className="min-h-[90px] p-2.5 rounded-xl bg-purple-950/20 border border-purple-900/40 flex flex-wrap gap-1.5 items-start">
                {myOfferItems.length === 0 ? (
                  <div className="w-full h-full text-center py-4 text-xs text-slate-500 italic">
                    Aşağıdaki kartlardan "Senin Teklifin" butonuna basarak meyve ekleyin
                  </div>
                ) : (
                  myOfferItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-1.5 font-bold"
                    >
                      <span>{item.name} ({(item.value / 1000000).toFixed(1)}M)</span>
                      <button
                        onClick={() => setMyOfferItems(prev => prev.filter((_, i) => i !== idx))}
                        className="text-emerald-400 hover:text-white font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Their Offer (Right) */}
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Karşı Tarafın Verdikleri (Their Offer):
                </span>
                <span className="text-sm font-black text-amber-300 font-mono">
                  {(theirTotalValue / 1000000).toFixed(1)}M Beli
                </span>
              </div>

              <div className="min-h-[90px] p-2.5 rounded-xl bg-purple-950/20 border border-purple-900/40 flex flex-wrap gap-1.5 items-start">
                {theirOfferItems.length === 0 ? (
                  <div className="w-full h-full text-center py-4 text-xs text-slate-500 italic">
                    Aşağıdaki kartlardan "Karşı Teklif" butonuna basarak meyve ekleyin
                  </div>
                ) : (
                  theirOfferItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-1.5 font-bold"
                    >
                      <span>{item.name} ({(item.value / 1000000).toFixed(1)}M)</span>
                      <button
                        onClick={() => setTheirOfferItems(prev => prev.filter((_, i) => i !== idx))}
                        className="text-amber-400 hover:text-white font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Trade Evaluation Result Banner */}
          {tradeOutcome && (
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${tradeOutcome.color}`}>
              <div>
                <div className="text-base font-black">{tradeOutcome.label}</div>
                <div className="text-xs font-medium opacity-90">{tradeOutcome.desc}</div>
              </div>
              <div className="text-xs font-mono font-bold bg-black/40 px-3 py-1.5 rounded-xl">
                Sen: {(myTotalValue / 1000000).toFixed(1)}M vs Karşı: {(theirTotalValue / 1000000).toFixed(1)}M
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 1: MEYVE DEĞER LİSTESİ */}
      {subTab === 'values' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Meyve ara (Örn: Kitsune, Dragon, Dough, Beast, Buddha...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#120a26] border border-purple-800/40 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'Mythical', label: 'Mythical' },
                { id: 'Legendary', label: 'Legendary' },
                { id: 'Beast', label: 'Canavar (Zoan)' },
                { id: 'Elemental', label: 'Element (Logia)' },
                { id: 'Natural', label: 'Doğal (Paramecia)' },
                { id: 'awakened', label: 'Uyanış V2' },
                { id: 'gamepass', label: 'Gamepass & Kılıç' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                    selectedFilter === f.id
                      ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white border-amber-500/50 shadow-md'
                      : 'bg-purple-950/30 border-purple-900/40 text-slate-300 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fruit Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const valueMillions = (item.value / 1000000).toFixed(1);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedBloxFruit(item)}
                  className="group relative rounded-3xl bg-gradient-to-b from-[#150d2e] to-[#0c071d] border border-purple-800/40 hover:border-amber-500/60 p-4 space-y-3.5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-950/60 cursor-pointer flex flex-col justify-between"
                >
                  {/* Card Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getRarityBadge(item.rarity)}`}>
                      {item.rarity}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {item.awakening && (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-0.5">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>V2</span>
                        </span>
                      )}
                      <span className="text-[10px] text-purple-300/80 bg-purple-900/40 px-2 py-0.5 rounded-lg font-semibold">
                        {item.type}
                      </span>
                    </div>
                  </div>

                  {/* Artwork Presentation */}
                  <div className="relative aspect-video rounded-2xl bg-gradient-to-b from-black/40 to-purple-950/30 border border-purple-800/30 flex items-center justify-center p-3 overflow-hidden group-hover:border-amber-500/40 transition-colors">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80';
                      }}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(234,88,12,0.35)] group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono text-emerald-300 font-bold">
                      {valueMillions}M Beli
                    </div>
                  </div>

                  {/* Info Header */}
                  <div>
                    <h3 className="font-black text-white text-base group-hover:text-amber-300 transition-colors truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-slate-400">Satıcı:</span>
                      <span className="text-slate-200 font-bold">
                        {item.beliPrice > 0 ? `$${item.beliPrice.toLocaleString()}` : 'Gamepass'}
                      </span>
                    </div>
                    {item.robuxPrice > 0 && (
                      <div className="flex items-center justify-between text-xs mt-0.5">
                        <span className="text-slate-400">Perm Robux:</span>
                        <span className="text-amber-400 font-bold">{item.robuxPrice} R$</span>
                      </div>
                    )}
                  </div>

                  {/* Demand & Stability Strip */}
                  <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 font-bold text-amber-300 text-[11px]">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.demand}</span>
                    </div>

                    <div className="text-[11px] font-bold">
                      {item.stability === 'Yükseliyor' ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> Yükseliyor
                        </span>
                      ) : item.stability === 'Düşüyor' ? (
                        <span className="text-rose-400 flex items-center gap-0.5">
                          <TrendingDown className="w-3 h-3" /> Düşüyor
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <Minus className="w-3 h-3" /> Sabit
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Calculator Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={(e) => handleAddToMyOffer(item, e)}
                      className="py-1.5 px-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 transition-colors"
                      title="Senin teklifine ekle"
                    >
                      +Ver (Sen)
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleAddToTheirOffer(item, e)}
                      className="py-1.5 px-2 rounded-xl bg-amber-950/60 hover:bg-amber-900 text-amber-300 text-[10px] font-bold border border-amber-500/40 transition-colors"
                      title="Karşı tarafın teklifine ekle"
                    >
                      +Al (Karşı)
                    </button>
                  </div>

                  {/* Admin Edit & Delete */}
                  {isAuthorizedAdmin && (
                    <div className="flex gap-1.5 pt-1 border-t border-purple-900/40">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBloxFruit(item);
                          setIsAddBloxFruitModalOpen(true);
                        }}
                        className="flex-1 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-200 text-[10px] font-bold flex items-center justify-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Düzenle</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          requestDeleteBloxFruit(item);
                        }}
                        className="p-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[10px] font-bold"
                        title="Sil"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 p-8 rounded-3xl bg-purple-950/20 border border-purple-900/40 text-slate-400 space-y-2">
              <Search className="w-10 h-10 text-purple-400/50 mx-auto" />
              <h4 className="font-bold text-white">Aradığınız kriterde Blox Fruit bulunamadı</h4>
              <p className="text-xs">Filtreyi temizleyebilir veya yeni arama yapabilirsiniz.</p>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: TOPLULUK TAKAS İLANLARI (MULTI-GAME TRADE HUB) */}
      {subTab === 'trades' && (
        <div className="space-y-4">
          
          {/* Trade Filter Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-purple-950/30 border border-purple-800/30">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Oyun Filtresi:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: 'Tüm Oyunlar' },
                  { id: 'Blox Fruits', label: 'Blox Fruits' },
                  { id: 'MM2', label: 'MM2' },
                  { id: 'Adopt Me!', label: 'Adopt Me!' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGameTradeFilter(g.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                      gameTradeFilter === g.id
                        ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                        : 'bg-black/30 border-purple-900/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsAddTradeModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-red-600 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Takas İlanı Yayınla</span>
            </button>
          </div>

          {/* Trade Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrades.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-3xl bg-gradient-to-b from-[#140b2a] to-[#0d071d] border border-purple-800/40 p-5 space-y-4 shadow-xl hover:border-purple-600/50 transition-colors"
              >
                {/* Author Info & Game Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.authorAvatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80'}
                      alt={post.author}
                      className="w-8 h-8 rounded-full border border-purple-500/50 object-cover"
                    />
                    <div>
                      <div className="text-xs font-black text-white">{post.author}</div>
                      <div className="text-[10px] text-slate-400">{post.createdAt}</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-purple-900/60 border border-purple-600/40 text-purple-200 text-xs font-bold">
                    {post.game || 'Blox Fruits'}
                  </span>
                </div>

                {/* Offering vs Looking For */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                    <div className="text-[10px] uppercase font-bold text-emerald-400">Teklif Ettiği (Veriyor):</div>
                    <div className="flex flex-wrap gap-1">
                      {post.offering.map((item, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-900/50 text-emerald-200 text-[11px] font-bold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                    <div className="text-[10px] uppercase font-bold text-amber-400">Aradığı (İstiyor):</div>
                    <div className="flex flex-wrap gap-1">
                      {post.lookingFor.map((item, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-amber-900/50 text-amber-200 text-[11px] font-bold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {post.notes && (
                  <p className="text-xs text-slate-300 italic bg-purple-950/20 p-2.5 rounded-xl border border-purple-900/30">
                    "{post.notes}"
                  </p>
                )}

                {/* Trade Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-purple-900/30">
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(post.author);
                        showToast(`'${post.author}' kullanıcı adı kopyalandı!`);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800 text-purple-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Roblox Adını Kopyala</span>
                  </button>

                  {(isAuthorizedAdmin || (post.authorEmail && post.authorEmail === user.email)) && (
                    <button
                      onClick={() => deleteTradePost(post.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/40"
                      title="İlanı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Trade Post Modal */}
      <AddTradePostModal
        isOpen={isAddTradeModalOpen}
        onClose={() => setIsAddTradeModalOpen(false)}
        defaultGame="Blox Fruits"
      />

    </div>
  );
};
