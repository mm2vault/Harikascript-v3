import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MM2Item } from '../types';
import { APP_LOGO_URL } from '../constants/branding';
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
  AlertTriangle,
  Zap,
  Sword,
  Crosshair,
  RefreshCw,
  ExternalLink,
  Edit2,
  PlusCircle,
  ShieldAlert,
  Crown,
  MessageSquare,
  Users
} from 'lucide-react';

export const MM2ValuesView: React.FC = () => {
  const {
    mm2Items,
    tradePosts,
    addTradePost,
    deleteTradePost,
    setActiveTab,
    showToast,
    user,
    setIsAddMM2ItemModalOpen,
    setEditingMM2Item,
    requestDeleteMM2Item,
    isAuthorizedAdmin,
    gainXp,
    setSelectedMM2Item
  } = useApp();

  const [subTab, setSubTab] = useState<'values' | 'trades'>('values');
  const [isAddTradeModalOpen, setIsAddTradeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Trade Calculator State
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [myOfferItems, setMyOfferItems] = useState<MM2Item[]>([]);
  const [theirOfferItems, setTheirOfferItems] = useState<MM2Item[]>([]);

  // Filtered MM2 items
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return mm2Items.filter(item => {
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        item.rarity.toLowerCase().includes(q);

      let matchesFilter = true;
      if (selectedFilter === 'all') {
        matchesFilter = true;
      } else if (selectedFilter === 'Knife' || selectedFilter === 'Gun' || selectedFilter === 'Pet') {
        matchesFilter = item.category === selectedFilter;
      } else {
        matchesFilter = item.type.toLowerCase() === selectedFilter.toLowerCase();
      }

      return matchesSearch && matchesFilter;
    });
  }, [mm2Items, searchQuery, selectedFilter]);

  // Calculator totals
  const myTotalValue = useMemo(() => myOfferItems.reduce((acc, cur) => acc + cur.value, 0), [myOfferItems]);
  const theirTotalValue = useMemo(() => theirOfferItems.reduce((acc, cur) => acc + cur.value, 0), [theirOfferItems]);

  // Trade Outcome Calculation
  const tradeOutcome = useMemo(() => {
    if (myTotalValue === 0 && theirTotalValue === 0) return null;
    const diff = theirTotalValue - myTotalValue;
    const ratio = myTotalValue > 0 ? (theirTotalValue / myTotalValue) : 1;

    if (diff > 50 || ratio > 1.15) {
      return { status: 'win', label: 'BÜYÜK KAZANÇ (WIN) 🟢', color: 'text-emerald-400', desc: `+${diff.toLocaleString()} Değer Kazancı!` };
    } else if (diff < -50 || ratio < 0.85) {
      return { status: 'lose', label: 'ZARAR / KAYIP (LOSE) 🔴', color: 'text-rose-400', desc: `${diff.toLocaleString()} Değer Kaybı!` };
    } else {
      return { status: 'fair', label: 'EŞİT / DENGELİ (FAIR) 🟡', color: 'text-amber-400', desc: 'Dengeli ve adil takas' };
    }
  }, [myTotalValue, theirTotalValue]);

  const addToMyOffer = (item: MM2Item) => {
    if (myOfferItems.length >= 8) {
      showToast('En fazla 8 eşya ekleyebilirsiniz.');
      return;
    }
    setMyOfferItems(prev => [...prev, item]);
    setIsCalculatorOpen(true);
    showToast(`'${item.name}' senin teklifine eklendi! ⚔️`);
  };

  const addToTheirOffer = (item: MM2Item) => {
    if (theirOfferItems.length >= 8) {
      showToast('En fazla 8 eşya ekleyebilirsiniz.');
      return;
    }
    setTheirOfferItems(prev => [...prev, item]);
    setIsCalculatorOpen(true);
    showToast(`'${item.name}' karşı tarafın teklifine eklendi! ⚖️`);
  };

  const publishCalculatorTradePost = () => {
    if (myOfferItems.length === 0 && theirOfferItems.length === 0) {
      showToast('Lütfen en az bir eşya ekleyin.');
      return;
    }
    const offeringNames = myOfferItems.map(i => i.name);
    const lookingForNames = theirOfferItems.map(i => i.name);
    addTradePost({
      author: user.username,
      authorEmail: user.email,
      authorAvatar: user.avatarUrl,
      offering: offeringNames.length > 0 ? offeringNames : ['Herhangi bir teklif'],
      lookingFor: lookingForNames.length > 0 ? lookingForNames : ['Tekliflere açık'],
      notes: `Değer farkı: ${(theirTotalValue - myTotalValue).toLocaleString()} Değer. İlgilenenler yazsın!`,
      status: 'Açık'
    });
    gainXp(25, 'Takas İlanı');
    showToast('Hesaplayıcı teklifiniz başarıyla Takas Pazarına ilan olarak yayınlandı! ⚔️');
    setSubTab('trades');
  };

  return (
    <div className="space-y-6">

      {/* Hero Banner with Official Logo Cover */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/80 via-[#1a0f2e] to-[#0c081e] border border-red-800/40 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/50 border border-red-500/40 text-red-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>MM2 Ultimate Hub Resmi Değer Kataloğu ({mm2Items.length} Eşya)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            MM2 Silah & Bıçak <span className="bg-gradient-to-r from-red-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">Değer Listesi</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Murder Mystery 2'deki tüm Godly, Ancient, Chroma, Vintage ve Unique eşyaların 2026 güncel takas değerleri. Canlı takas hesaplayıcı ile anında win/lose sonucunu öğrenin!
          </p>
        </div>

        {/* Right: Cover Logo & Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3.5 relative z-10 shrink-0 w-full md:w-auto">
          <div className="relative group flex items-center justify-center">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-red-500 via-pink-600 to-amber-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0e0a1c] border-2 border-red-500/50 p-1 shadow-2xl overflow-hidden flex items-center justify-center">
              <img
                src={APP_LOGO_URL}
                alt="MM2 Ultimate Hub Logo"
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 w-full">
            {isAuthorizedAdmin && (
              <button
                onClick={() => {
                  setEditingMM2Item(null);
                  setIsAddMM2ItemModalOpen(true);
                }}
                className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-950/40 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Yeni Eşya</span>
              </button>
            )}

            {/* Trade Calculator Toggle Button */}
            <button
              onClick={() => setIsCalculatorOpen(prev => !prev)}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center gap-2 active:scale-95 ${
                isCalculatorOpen
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-900/40'
                  : 'bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 text-white shadow-red-950/50'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{isCalculatorOpen ? 'Hesaplayıcıyı Gizle' : 'Takas Hesaplayıcı'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation: Values vs Trade Posts */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-purple-900/40 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubTab('values')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'values'
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
                : 'bg-[#0e0b1f] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <Sword className="w-3.5 h-3.5" />
            <span>Değer Listesi & Hesaplayıcı</span>
          </button>

          <button
            onClick={() => setSubTab('trades')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'trades'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-950/50'
                : 'bg-[#0e0b1f] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Topluluk Takas İlanları ({tradePosts.length})</span>
          </button>
        </div>

        {subTab === 'trades' && (
          <button
            onClick={() => setIsAddTradeModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-950/40 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Yeni Takas İlanı Ver</span>
          </button>
        )}
      </div>

      {subTab === 'values' ? (
        <>

      {/* Interactive Trade Calculator Panel */}
      {isCalculatorOpen && (
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0f0b24] border border-amber-500/40 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-purple-900/40 gap-2">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-base text-white">Canlı MM2 Takas Hesaplayıcı</h3>
            </div>
            
            {/* Quick Reset */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMyOfferItems([]);
                  setTheirOfferItems([]);
                }}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Teklifleri Temizle</span>
              </button>
            </div>
          </div>

          {/* Trade Sides: You vs Them */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left Side: Your Offer */}
            <div className="p-4 rounded-2xl bg-[#0a0718] border border-purple-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-purple-300 uppercase tracking-wider">
                  SENİN TEKLİFİN ({myOfferItems.length}/8)
                </span>
                <span className="font-black text-sm text-purple-200 tabular-nums">
                  {myTotalValue.toLocaleString()} Değer
                </span>
              </div>

              {myOfferItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-purple-900/40 rounded-xl">
                  Aşağıdaki listeden eşyaya dokunup "+ Teklifime Ekle" seçin.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {myOfferItems.map((item, idx) => (
                    <div
                      key={`my_${item.id}_${idx}`}
                      className="p-2 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between gap-1 text-xs"
                    >
                      <div className="truncate">
                        <span className="block font-bold text-white truncate">{item.name}</span>
                        <span className="text-[10px] text-amber-300 font-semibold">{item.value.toLocaleString()} Değer</span>
                      </div>
                      <button
                        onClick={() => setMyOfferItems(prev => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Their Offer */}
            <div className="p-4 rounded-2xl bg-[#0a0718] border border-indigo-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-indigo-300 uppercase tracking-wider">
                  KARŞI TARAFIN TEKLİFİ ({theirOfferItems.length}/8)
                </span>
                <span className="font-black text-sm text-indigo-200 tabular-nums">
                  {theirTotalValue.toLocaleString()} Değer
                </span>
              </div>

              {theirOfferItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-indigo-900/40 rounded-xl">
                  Aşağıdaki listeden eşyaya dokunup "+ Karşıya Ekle" seçin.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {theirOfferItems.map((item, idx) => (
                    <div
                      key={`their_${item.id}_${idx}`}
                      className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-between gap-1 text-xs"
                    >
                      <div className="truncate">
                        <span className="block font-bold text-white truncate">{item.name}</span>
                        <span className="text-[10px] text-amber-300 font-semibold">{item.value.toLocaleString()} Değer</span>
                      </div>
                      <button
                        onClick={() => setTheirOfferItems(prev => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Result Calculation Card */}
          {tradeOutcome && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-[#150f2f] to-purple-950/80 border border-purple-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className={`text-base sm:text-lg font-black ${tradeOutcome.color}`}>
                  {tradeOutcome.label}
                </span>
                <p className="text-xs text-slate-300 font-medium">
                  {tradeOutcome.desc} (Fark: {(theirTotalValue - myTotalValue).toLocaleString()} Değer)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-bold">Teklif Oranı</span>
                  <span className="text-sm font-black text-white">
                    {myTotalValue > 0 ? `${((theirTotalValue / myTotalValue) * 100).toFixed(0)}%` : '—'}
                  </span>
                </div>

                <button
                  onClick={publishCalculatorTradePost}
                  className="px-3.5 py-2 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>İlan Olarak Yayınla</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0a0817] p-2.5 rounded-2xl border border-purple-900/30">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'Ancient', label: 'Ancient' },
            { id: 'Godly', label: 'Godly' },
            { id: 'Chroma', label: 'Chroma' },
            { id: 'Vintage', label: 'Vintage' },
            { id: 'Unique', label: 'Unique' },
            { id: 'Knife', label: '🗡️ Bıçak' },
            { id: 'Gun', label: '🔫 Silah' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedFilter === cat.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-purple-950/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
          <input
            type="text"
            placeholder="Silah veya bıçak ara (Gingerscope, Harvester...)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#120e24] text-xs text-white placeholder-slate-500 pl-8 pr-3 py-2 rounded-xl border border-purple-800/40 focus:border-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Weapons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map(item => {
          const hasFailed = failedImages[item.id];
          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-[#0d0a1b] border border-purple-900/40 hover:border-red-500/70 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-950/20"
            >
              <div>
                {/* Thumbnail Banner */}
                <div
                  onClick={() => setSelectedMM2Item(item)}
                  className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 mb-3 cursor-pointer group/img"
                  title="Detaylı Fandom Wiki sayfasını ve görsellerini açmak için tıkla"
                >
                  {!hasFailed && item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => setFailedImages(prev => ({ ...prev, [item.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-red-950 via-[#1e0e2e] to-purple-950 flex flex-col items-center justify-center p-3 text-center">
                      {item.category === 'Gun' ? (
                        <Crosshair className="w-10 h-10 text-purple-400/60 mb-1" />
                      ) : (
                        <Sword className="w-10 h-10 text-red-400/60 mb-1" />
                      )}
                      <span className="text-xs font-black text-white">{item.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a1b] via-transparent to-black/40" />

                  {/* Fandom Click Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-bold text-white pointer-events-none">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>Fandom Wiki Sayfası</span>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-red-300 border border-red-500/40">
                      {item.type}
                    </span>
                    {item.type === 'Chroma' && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white animate-pulse">
                        RGB
                      </span>
                    )}
                  </div>

                  {/* Admin Edit/Delete Floating Overlay */}
                  {isAuthorizedAdmin && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setEditingMM2Item(item);
                          setIsAddMM2ItemModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-800 text-purple-200 border border-purple-600/50 shadow-md transition-colors"
                        title="Eşyayı Düzenle"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          requestDeleteMM2Item(item);
                        }}
                        className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-800 text-rose-200 border border-rose-600/50 shadow-md transition-colors"
                        title="Eşyayı Sil"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Value Pill on Banner */}
                  <div className="absolute bottom-2 right-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 shadow-md tabular-nums">
                      {item.value.toLocaleString()} Değer
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3
                      onClick={() => setSelectedMM2Item(item)}
                      className="font-extrabold text-sm sm:text-base text-white hover:text-pink-300 transition-colors truncate cursor-pointer"
                      title="Fandom Wiki sayfasını aç"
                    >
                      {item.name}
                    </h3>
                    <span className="text-[10px] text-purple-300 font-semibold shrink-0">
                      {item.category === 'Knife' ? '🗡️ Bıçak' : item.category === 'Gun' ? '🔫 Silah' : '🐾 Pet'}
                    </span>
                  </div>

                  {/* Demand & Stability */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">
                      Talep: <strong className="text-emerald-400 font-bold">{item.demand}</strong>
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      {item.stability === 'Yükseliyor' ? (
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                      ) : item.stability === 'Düşüyor' ? (
                        <TrendingDown className="w-3 h-3 text-rose-400" />
                      ) : (
                        <Minus className="w-3 h-3 text-amber-400" />
                      )}
                      <span className="text-slate-300 font-semibold">{item.stability}</span>
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 truncate">
                    Köken: {item.origin}
                  </p>
                </div>
              </div>

              {/* Fandom Wiki Detail Button */}
              <div className="mt-3 space-y-1.5">
                <button
                  onClick={() => setSelectedMM2Item(item)}
                  className="w-full py-1.5 px-2 bg-gradient-to-r from-purple-900/60 via-pink-950/40 to-indigo-900/60 hover:from-purple-800 hover:to-pink-800 text-pink-200 hover:text-white font-extrabold text-[11px] rounded-xl border border-purple-600/40 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Fandom Wiki & Detay</span>
                </button>

                {/* Calculator Quick Action Buttons */}
                <div className="pt-1.5 border-t border-purple-900/30 grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => addToMyOffer(item)}
                    className="py-1.5 px-2 bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 hover:text-white font-bold text-[10px] rounded-lg border border-purple-700/40 transition-colors flex items-center justify-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Teklifime Ekle</span>
                  </button>
                  <button
                    onClick={() => addToTheirOffer(item)}
                    className="py-1.5 px-2 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-200 hover:text-white font-bold text-[10px] rounded-lg border border-indigo-700/40 transition-colors flex items-center justify-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Karşıya Ekle</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </>
      ) : (
        /* Community Trade Posts Board */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Canlı MM2 Takas İlanları</h2>
              <p className="text-xs text-slate-400">Oyuncuların güncel takas teklifleri. Beğendiğin ilana sohbette hemen teklif ver!</p>
            </div>
            <span className="text-xs text-amber-300 font-bold bg-amber-950/50 border border-amber-500/40 px-3 py-1 rounded-xl">
              {tradePosts.length} Aktif İlan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tradePosts.map((post) => {
              const isMyPost = post.author === user.username || isAuthorizedAdmin;
              return (
                <div
                  key={post.id}
                  className="rounded-3xl bg-[#0d091b] border border-purple-900/40 hover:border-amber-500/50 p-5 space-y-4 shadow-xl transition-all hover:-translate-y-0.5"
                >
                  {/* Post Header: Trader Info & Time */}
                  <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl overflow-hidden border border-purple-600/40 shrink-0">
                        <img
                          src={post.authorAvatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80'}
                          alt={post.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-white block">{post.author}</span>
                        <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-black">
                        {post.status}
                      </span>
                      {isMyPost && (
                        <button
                          onClick={() => deleteTradePost(post.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="İlanı Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Trade Exchange Grid: Offering vs Looking For */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Offering */}
                    <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                      <span className="block font-black text-emerald-300 text-[11px] uppercase tracking-wider">
                        Verdiği Eşyalar:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {post.offering.map((item, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-emerald-900/60 text-emerald-200 font-bold text-[11px] border border-emerald-500/40"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Looking For */}
                    <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                      <span className="block font-black text-amber-300 text-[11px] uppercase tracking-wider">
                        Aradığı Eşyalar:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {post.lookingFor.map((item, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-amber-900/60 text-amber-200 font-bold text-[11px] border border-amber-500/40"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Trader Notes */}
                  {post.notes && (
                    <p className="text-xs text-slate-300 bg-black/40 p-2.5 rounded-xl border border-purple-900/30 italic">
                      💬 "{post.notes}"
                    </p>
                  )}

                  {/* Quick Action Button: Chat */}
                  <button
                    onClick={() => {
                      setActiveTab('live_chat');
                      showToast(`${post.author} ile sohbet etmek için Canlı Sohbet odasına yönlendirildiniz! 💬`);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Sohbette Yaz & Anlaş ({post.author})</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Trade Post Modal */}
      <AddTradePostModal
        isOpen={isAddTradeModalOpen}
        onClose={() => setIsAddTradeModalOpen(false)}
      />
    </div>
  );
};
