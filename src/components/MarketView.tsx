import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CosmeticItem, CosmeticType, RarityType } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import { CoinIcon } from './CoinIcon';
import {
  Sparkles,
  Coins,
  Check,
  Zap,
  ShoppingBag,
  SlidersHorizontal,
  Search,
  CheckCircle,
  Eye,
  RefreshCw,
  Plus
} from 'lucide-react';

interface MarketViewProps {
  filterType?: CosmeticType | 'all';
}

const RARITY_COLORS: Record<RarityType, { badge: string; border: string; glow: string; text: string }> = {
  common: {
    badge: 'bg-slate-700/60 text-slate-300 border-slate-600',
    border: 'border-slate-800 hover:border-slate-600',
    glow: 'rgba(148, 163, 184, 0.2)',
    text: 'Yaygın'
  },
  rare: {
    badge: 'bg-blue-900/60 text-blue-300 border-blue-700/60',
    border: 'border-blue-900/40 hover:border-blue-500/70',
    glow: 'rgba(59, 130, 246, 0.3)',
    text: 'Nadir'
  },
  epic: {
    badge: 'bg-purple-900/60 text-purple-300 border-purple-700/60',
    border: 'border-purple-900/40 hover:border-purple-500/80',
    glow: 'rgba(168, 85, 247, 0.4)',
    text: 'Epik'
  },
  legendary: {
    badge: 'bg-amber-900/60 text-amber-300 border-amber-700/60',
    border: 'border-amber-900/40 hover:border-amber-500/80',
    glow: 'rgba(245, 158, 11, 0.4)',
    text: 'Efsanevi'
  },
  mythic: {
    badge: 'bg-pink-900/70 text-pink-300 border-pink-700/70',
    border: 'border-pink-900/50 hover:border-pink-500',
    glow: 'rgba(236, 72, 153, 0.5)',
    text: 'Mistisizm'
  }
};

export const MarketView: React.FC<MarketViewProps> = ({ filterType = 'all' }) => {
  const {
    cosmetics,
    user,
    buyCosmetic,
    equipItem,
    unequipItem,
    setActiveTab,
    setIsProfileModalOpen,
    setIsTasksModalOpen
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<CosmeticType | 'all'>(filterType);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [previewCosmetic, setPreviewCosmetic] = useState<CosmeticItem | null>(null);

  // Sync prop changes
  React.useEffect(() => {
    setActiveCategory(filterType);
  }, [filterType]);

  const filteredCosmetics = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return cosmetics.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
      return matchesCategory && matchesSearch && matchesRarity;
    });
  }, [cosmetics, activeCategory, searchQuery, selectedRarity]);

  const getIsEquipped = (item: CosmeticItem) => {
    if (item.type === 'frame') return user.equippedFrameId === item.id;
    if (item.type === 'avatar') return user.equippedAvatarId === item.id;
    if (item.type === 'effect') return user.equippedEffectId === item.id;
    if (item.type === 'badge') return user.equippedBadges.includes(item.id);
    return false;
  };

  const getIsOwned = (item: CosmeticItem) => {
    return user.inventory.includes(item.id);
  };

  return (
    <div className="space-y-6">

      {/* Header Banner: Discord Nitro Aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#130d2b] to-[#0d0920] border border-purple-800/40 p-5 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-gradient-to-bl from-pink-500/10 via-purple-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-60 h-60 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500/40 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />
              <span>Discord Nitro Stili Roblox Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Kozmetik & Çerçeve <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">Market</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Avatarını Discord Nitro tarzı animasyonlu çerçeveler, kuantum efektleri ve özel rozetlerle özelleştir. Her eşya profilin üzerinde anında çalışır.
            </p>
          </div>

          {/* Interactive Live Preview Sandbox Card */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4 p-3.5 rounded-2xl bg-[#090714]/80 border border-purple-500/30 backdrop-blur-md shadow-xl">
            <div className="text-right">
              <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">
                {previewCosmetic ? 'Önizlenen Ürün' : 'Aktif Profilin'}
              </span>
              <span className="text-xs font-bold text-white max-w-[130px] truncate block">
                {previewCosmetic ? previewCosmetic.name : user.username}
              </span>
              {previewCosmetic && (
                <button
                  onClick={() => setPreviewCosmetic(null)}
                  className="text-[10px] text-pink-400 hover:text-pink-300 flex items-center gap-1 mt-0.5 justify-end"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Sıfırla
                </button>
              )}
            </div>

            {/* Avatar Preview */}
            <AvatarDisplay
              size="lg"
              overrideFrame={previewCosmetic?.type === 'frame' ? previewCosmetic : undefined}
              effectId={previewCosmetic?.type === 'effect' ? previewCosmetic.id : undefined}
              avatarUrl={previewCosmetic?.type === 'avatar' ? previewCosmetic.imageUrl : undefined}
              isInteractive={true}
              onClick={() => setIsProfileModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0a0817] p-2.5 rounded-2xl border border-purple-900/30">
        
        {/* Horizontal Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'frame', label: 'Çerçeveler' },
            { id: 'avatar', label: 'Avatarlar' },
            { id: 'effect', label: 'Efektler' },
            { id: 'badge', label: 'Rozetler' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-purple-950/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Rarity Controls */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
            <input
              type="text"
              placeholder="Kozmetik ara..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#120e24] text-xs text-white placeholder-slate-500 pl-8 pr-3 py-1.5 rounded-xl border border-purple-800/40 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Rarity Selector */}
          <select
            value={selectedRarity}
            onChange={e => setSelectedRarity(e.target.value)}
            className="bg-[#120e24] text-xs text-purple-200 border border-purple-800/40 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
          >
            <option value="all">Tüm Nadirlikler</option>
            <option value="common">Yaygın</option>
            <option value="rare">Nadir</option>
            <option value="epic">Epik</option>
            <option value="legendary">Efsanevi</option>
            <option value="mythic">Mistisizm</option>
          </select>
        </div>
      </div>

      {/* Cosmetics Product Grid */}
      {filteredCosmetics.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-purple-950/20 border border-purple-900/30">
          <ShoppingBag className="w-10 h-10 text-purple-500/50 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Eşleşen Kozmetik Bulunamadı</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Arama kriterlerinize uygun kozmetik ürün bulunmuyor. Farklı bir arama yapmayı deneyin.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setSelectedRarity('all');
            }}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCosmetics.map(item => {
            const isOwned = getIsOwned(item);
            const isEquipped = getIsEquipped(item);
            const rarityInfo = RARITY_COLORS[item.rarity];
            const isPreviewing = previewCosmetic?.id === item.id;

            return (
              <div
                key={item.id}
                className={`relative group flex flex-col justify-between rounded-2xl bg-[#0e0b1d] border ${
                  rarityInfo.border
                } p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isPreviewing ? 'ring-2 ring-pink-500' : ''
                }`}
                style={{
                  boxShadow: `0 4px 20px -5px ${rarityInfo.glow}`
                }}
              >
                {/* Top Badges Row */}
                <div className="flex items-center justify-between gap-1 mb-3">
                  <div className="flex items-center gap-1.5">
                    {/* Rarity Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${rarityInfo.badge}`}
                    >
                      {rarityInfo.text}
                    </span>

                    {/* Tag Badge */}
                    {item.tag && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-900/40 text-purple-300 border border-purple-700/40">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Animated Indicator */}
                  {item.isAnimated && (
                    <span
                      className="text-[10px] font-bold text-pink-400 flex items-center gap-0.5"
                      title="Animasyonlu Discord Nitro Kozmetiği"
                    >
                      <Zap className="w-3 h-3 fill-pink-400" />
                      <span>GIF</span>
                    </span>
                  )}
                </div>

                {/* Product Visual Centerpiece */}
                <div className="relative py-4 flex flex-col items-center justify-center min-h-[120px]">
                  {item.type === 'frame' ? (
                    /* Frame Showcase Preview around a demo avatar */
                    <div className="relative">
                      <AvatarDisplay
                        size="xl"
                        overrideFrame={item}
                        avatarUrl={user.avatarUrl}
                        showGlow={true}
                      />
                    </div>
                  ) : item.type === 'effect' ? (
                    <div className="relative flex items-center justify-center">
                      <AvatarDisplay size="lg" effectId={item.id} />
                    </div>
                  ) : (
                    /* Image / Badge / Avatar icon */
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-purple-500/30 bg-purple-950/40 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  )}

                  {/* Quick Try / Önizle Button */}
                  <button
                    onClick={() => setPreviewCosmetic(item)}
                    className="mt-3 px-2 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-[10px] text-purple-300 hover:text-white border border-purple-800/40 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Avatarında Dene</span>
                  </button>
                </div>

                {/* Info Section */}
                <div className="mt-2 pt-2 border-t border-purple-900/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Actions Row */}
                <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                  {/* Price */}
                  <div className="flex items-center gap-1.5">
                    <CoinIcon className="w-4 h-4" />
                    <span className="font-extrabold text-sm text-amber-300">
                      {item.price === 0 ? 'ÜCRETSİZ' : item.price}
                    </span>
                    {item.price > 0 && (
                      <span className="text-[10px] text-amber-400/80">Coin</span>
                    )}
                  </div>

                  {/* Buttons: Buy, Equip, Unequip */}
                  {isOwned ? (
                    isEquipped ? (
                      <button
                        onClick={() => unequipItem(item)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/70 hover:text-rose-300 hover:border-rose-600/40 text-slate-300 border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Çıkar</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => equipItem(item)}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shadow-md shadow-emerald-900/40 active:scale-95"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Kullan</span>
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => buyCosmetic(item)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shadow-md shadow-purple-900/50 active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Satın Al</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Banner: Task prompt to earn coins */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/50 via-purple-950/30 to-amber-950/30 border border-purple-800/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Coins className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Daha Fazla Coin'e mi İhtiyacın Var?</h4>
            <p className="text-xs text-slate-300">
              Discord ve YouTube görevlerimizi tamamlayarak anında 700+ Coin kazanabilirsin!
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsTasksModalOpen(true)}
          className="shrink-0 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Görevleri Tamamla</span>
        </button>
      </div>
    </div>
  );
};
