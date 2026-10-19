import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CosmeticItem, CosmeticType } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Package,
  Check,
  CheckCircle,
  Sparkles,
  ShoppingBag,
  Layers,
  Zap,
  Smile,
  Award
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { user, cosmetics, equipItem, unequipItem, setActiveTab, setIsProfileModalOpen } = useApp();
  const [selectedType, setSelectedType] = useState<CosmeticType | 'all'>('all');

  const ownedItems = cosmetics.filter(item => user.inventory.includes(item.id));

  const filteredItems = ownedItems.filter(item => {
    if (selectedType === 'all') return true;
    return item.type === selectedType;
  });

  const getIsEquipped = (item: CosmeticItem) => {
    if (item.type === 'frame') return user.equippedFrameId === item.id;
    if (item.type === 'avatar') return user.equippedAvatarId === item.id;
    if (item.type === 'effect') return user.equippedEffectId === item.id;
    if (item.type === 'badge') return user.equippedBadges.includes(item.id);
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card with Current Equipped Setup */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/70 via-[#120e24] to-[#0c0919] border border-purple-800/40 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/50 border border-pink-500/40 text-pink-300 text-xs font-semibold">
            <Package className="w-3.5 h-3.5 text-pink-400" />
            <span>Kişisel Dolabın</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Kozmetik <span className="text-pink-400">Envanterim</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md">
            Sahip olduğun {ownedItems.length} kozmetik eşya burada listelenir. Tek tıkla kuşanabilir ve profilinde anında aktif edebilirsin.
          </p>
        </div>

        {/* Live Equipped Showcase */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#090714] border border-purple-500/30 shadow-xl">
          <AvatarDisplay size="xl" showGlow={true} isInteractive={true} onClick={() => setIsProfileModalOpen(true)} />
          <div className="text-left space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold block">
              Aktif Profil Donanımın
            </span>
            <h4 className="text-sm font-extrabold text-white truncate max-w-[140px]">
              {user.username}
            </h4>
            <div className="text-[11px] text-slate-400 space-y-0.5">
              <div>Çerçeve: <span className="text-purple-300 font-medium">{cosmetics.find(c => c.id === user.equippedFrameId)?.name || 'Yok'}</span></div>
              <div>Efekt: <span className="text-pink-300 font-medium">{cosmetics.find(c => c.id === user.equippedEffectId)?.name || 'Yok'}</span></div>
              <div>Rozetler: <span className="text-amber-300 font-medium">{user.equippedBadges.length} Adet</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Tümü', icon: Layers, count: ownedItems.length },
          { id: 'frame', label: 'Çerçeveler', icon: Sparkles, count: ownedItems.filter(i => i.type === 'frame').length },
          { id: 'avatar', label: 'Avatarlar', icon: Smile, count: ownedItems.filter(i => i.type === 'avatar').length },
          { id: 'effect', label: 'Efektler', icon: Zap, count: ownedItems.filter(i => i.type === 'effect').length },
          { id: 'badge', label: 'Rozetler', icon: Award, count: ownedItems.filter(i => i.type === 'badge').length }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedType === tab.id
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-900/40'
                  : 'bg-[#0f0c20] text-slate-400 hover:text-white border border-purple-900/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inventory Item Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0d0a1c] border border-purple-900/30 space-y-3">
          <Package className="w-12 h-12 text-purple-500/40 mx-auto" />
          <h3 className="text-base font-bold text-white">Bu Kategoride Henüz Eşyanız Yok</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Marketi ziyaret ederek Discord Nitro tarzı harika çerçeveler ve kozmetikler edinebilirsiniz.
          </p>
          <button
            onClick={() => setActiveTab('market_all')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-900/40 inline-flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Markete Git</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map(item => {
            const isEquipped = getIsEquipped(item);

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between rounded-2xl bg-[#0f0c20] border p-4 transition-all duration-300 hover:shadow-xl ${
                  isEquipped
                    ? 'border-pink-500/80 shadow-lg shadow-pink-950/40 bg-gradient-to-b from-[#160f2e] to-[#0f0c20]'
                    : 'border-purple-900/40 hover:border-purple-600/50'
                }`}
              >
                {/* Active Equipped Indicator */}
                {isEquipped && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-extrabold shadow-md shadow-pink-600/40">
                    <Check className="w-3 h-3" />
                    <span>KUŞANILDI</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-700/40 uppercase">
                    {item.type === 'frame' ? 'Çerçeve' : item.type === 'avatar' ? 'Avatar' : item.type === 'effect' ? 'Efekt' : 'Rozet'}
                  </span>
                  {item.isAnimated && (
                    <span className="text-[10px] text-pink-400 font-bold">GIF</span>
                  )}
                </div>

                {/* Display Center */}
                <div className="py-4 flex flex-col items-center justify-center min-h-[110px]">
                  {item.type === 'frame' ? (
                    <AvatarDisplay size="lg" overrideFrame={item} />
                  ) : item.type === 'effect' ? (
                    <AvatarDisplay size="lg" effectId={item.id} />
                  ) : (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-purple-500/30 bg-purple-950/40 flex items-center justify-center p-1">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="space-y-1 mb-3">
                  <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Equip / Unequip Toggle */}
                {isEquipped ? (
                  <button
                    onClick={() => unequipItem(item)}
                    className="w-full py-2 bg-slate-800 hover:bg-rose-950/70 hover:text-rose-300 hover:border-rose-600/40 text-slate-300 border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    <span>Çıkar</span>
                  </button>
                ) : (
                  <button
                    onClick={() => equipItem(item)}
                    className="w-full py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-pink-900/40 flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Kullan / Kuşan</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
