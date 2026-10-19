import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ValueCategory } from '../types';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Flame,
  Sparkles,
  Layers,
  ArrowRight,
  Plus,
  Upload,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const PRESET_BANNERS = [
  {
    name: 'Pet Simulator',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Anime / Roblox',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Neon Gaming',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Blade / Battle',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'
  }
];

const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';

export const ValuesHubView: React.FC = () => {
  const {
    setActiveTab,
    valueCategories,
    valueItems,
    mm2Items,
    bloxItems,
    isAuthorizedAdmin,
    addValueCategory,
    updateValueCategory,
    deleteValueCategory,
    requestDeleteValueCategory,
    showToast
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ValueCategory | null>(null);

  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const openAddModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setCatImage(PRESET_BANNERS[0].url);
    setPreviewError(false);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: ValueCategory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setCatImage(cat.imageUrl || DEFAULT_BANNER);
    setPreviewError(false);
    setIsModalOpen(true);
  };

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressed = await compressImageFile(file, 640, 400, 0.8);
      setCatImage(compressed);
      setPreviewError(false);
      showToast('Kategori resmi cihazdan başarıyla yüklendi! 🖼️');
    } catch (err) {
      showToast('Görsel yüklenirken hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      showToast('Lütfen oyun / kategori adını girin!');
      return;
    }

    const finalImage = catImage.trim() || DEFAULT_BANNER;

    if (editingCategory) {
      await updateValueCategory(editingCategory.id, {
        name: catName.trim(),
        description: catDesc.trim() || 'Roblox özel eşya değerleri ve takas rehberi',
        imageUrl: finalImage
      });
      showToast(`'${catName}' kategorisi başarıyla güncellendi! ✅`);
    } else {
      await addValueCategory({
        name: catName.trim(),
        description: catDesc.trim() || 'Roblox özel eşya değerleri ve takas rehberi',
        imageUrl: finalImage
      });
      showToast(`'${catName}' yeni kategori olarak eklendi! 🎉`);
    }

    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetCat = valueCategories.find(c => c.id === id) || { id, name, imageUrl: '' };
    requestDeleteValueCategory(targetCat);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-[#190d2e] to-indigo-950 border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-10 w-32 h-32 bg-pink-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
              <span>HarikaScript Değerler & Takas Merkezi v3.9</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Oyun Değerleri & Eşya Hub'ı
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/85 max-w-2xl leading-relaxed">
              Murder Mystery 2, Blox Fruits, Pet Simulator 99 ve dilediğiniz tüm Roblox oyunlarının güncel eşya değerlerini, talep oranlarını ve görsellerini keşfedin veya yönetin!
            </p>
          </div>

          {isAuthorizedAdmin && (
            <button
              onClick={openAddModal}
              className="px-5 py-3 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-purple-900/50 flex items-center gap-2 shrink-0 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Oyun / Kategori Ekle</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#120c24] border border-purple-500/40 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>{editingCategory ? `'${editingCategory.name}' Kategorisini Düzenle` : 'Yeni Değer Kategorisi (Oyun) Ekle'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCategory(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-300 mb-1">Oyun / Kategori Adı *</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Örn: Pet Simulator 99, Adopt Me!, Blade Ball"
                  className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-300 mb-1">Açıklama</label>
                <input
                  type="text"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Örn: En güncel devasa (huge) ve titan pet değer listesi..."
                  className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Image Input & Device Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-purple-300">
                  Kategori Görseli (URL veya Cihazdan Yükle)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={catImage}
                    onChange={(e) => {
                      setCatImage(e.target.value);
                      setPreviewError(false);
                    }}
                    placeholder="https://... görsel bağlantısı"
                    className="flex-1 bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-600/40 text-xs font-bold text-purple-200 flex items-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Yükleniyor...' : 'Cihazdan Yükle'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDeviceUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Quick Preset Banners */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold block">Hızlı Örnek Kapaklar:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {PRESET_BANNERS.map((preset) => (
                      <button
                        type="button"
                        key={preset.name}
                        onClick={() => {
                          setCatImage(preset.url);
                          setPreviewError(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-800/40 text-[10px] text-purple-300 whitespace-nowrap transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Banner Preview Box */}
                <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-900/50 flex items-center gap-3">
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-black/60 border border-purple-700/40 shrink-0 flex items-center justify-center">
                    {!previewError && catImage ? (
                      <img
                        src={catImage}
                        alt="Önizleme"
                        referrerPolicy="no-referrer"
                        onError={() => setPreviewError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-1 text-slate-500">
                        <ImageIcon className="w-5 h-5 mx-auto text-purple-400" />
                        <span className="text-[9px] block">Görsel Yok</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 text-xs">
                    <span className="font-extrabold text-white block truncate">{catName || 'Kategori Adı'}</span>
                    <span className="text-[11px] text-purple-300 block truncate">{catDesc || 'Açıklama'}</span>
                    {previewError && (
                      <span className="text-[10px] text-rose-400 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" />
                        Bağlantı açılamadı, varsayılan kapak kullanılacak
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-900/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-950/40 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white text-xs font-bold shadow-lg"
                >
                  {editingCategory ? 'Değişiklikleri Kaydet' : 'Kategoriyi Yayınla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Games / Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* 1. MM2 Card */}
        <div
          onClick={() => setActiveTab('mm2_values')}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#160d2e] via-[#0d091b] to-[#070512] border border-red-500/30 hover:border-red-500/70 p-6 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-950/50 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-red-600/20 transition-all" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center shadow-lg shadow-red-900/50 text-white">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-800/50">
                {mm2Items.length} Eşya
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white group-hover:text-red-400 transition-colors">
                Murder Mystery 2 (MM2)
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Godlies, Chromas, Legendaries, Ancients ve Fandom Wiki destekli 7 görselli eşya değer listesi.
              </p>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between border-t border-red-950/60 mt-4">
            <span className="text-xs font-bold text-red-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
              <span>Değerleri İncele</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] text-slate-500 font-mono">SUPREME / TR</span>
          </div>
        </div>

        {/* 2. Blox Fruits Card */}
        <div
          onClick={() => setActiveTab('blox_values')}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e162e] via-[#090e1b] to-[#050710] border border-cyan-500/30 hover:border-cyan-500/70 p-6 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/50 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-600/20 transition-all" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-900/50 text-white">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                {bloxItems.length} Meyve
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors">
                Blox Fruits Değerleri
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Kitsune, Dragon, Leopard ve tüm Mythical/Legendary meyveler, gamepass ve kalıcı takas değerleri.
              </p>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between border-t border-cyan-950/60 mt-4">
            <span className="text-xs font-bold text-cyan-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
              <span>Meyveleri İncele</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] text-slate-500 font-mono">TRADE HUB</span>
          </div>
        </div>

        {/* 3. Custom Admin-Added Categories (Pet Simulator 99, etc.) */}
        {valueCategories.map((cat) => {
          const count = valueItems.filter((i) => i.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              onClick={() => setActiveTab(`value_cat_${cat.id}`)}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#24170d] via-[#150d07] to-[#0a0604] border border-amber-500/30 hover:border-amber-500/70 p-6 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-950/50 flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-600/20 transition-all" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-amber-500/20 border border-amber-500/40 p-0.5 shrink-0">
                    <img
                      src={cat.imageUrl || DEFAULT_BANNER}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_BANNER;
                      }}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/50">
                      {count} Eşya
                    </span>
                    {isAuthorizedAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => openEditModal(cat, e)}
                          className="p-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 hover:text-white border border-amber-700/50 transition-colors"
                          title="Kategoriyi ve Resmi Düzenle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(cat.id, cat.name, e)}
                          className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-700/50 transition-colors"
                          title="Kategoriyi Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {cat.description || 'Yönetici tarafından eklenen özel oyun değerleri ve rehberi.'}
                  </p>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-amber-950/60 mt-4">
                <span className="text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                  <span>Değerleri Gör</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ÖZEL OYUN</span>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};
