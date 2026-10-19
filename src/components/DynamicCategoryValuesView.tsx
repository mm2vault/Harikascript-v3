import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UnifiedValueItem } from '../types';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Layers,
  Search,
  PlusCircle,
  Trash2,
  ArrowLeft,
  Sparkles,
  Edit2,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  TrendingUp,
  Minus,
  TrendingDown
} from 'lucide-react';

interface DynamicCategoryValuesViewProps {
  categoryId: string;
}

const DEFAULT_ITEM_IMAGE = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80';

export const DynamicCategoryValuesView: React.FC<DynamicCategoryValuesViewProps> = ({ categoryId }) => {
  const {
    valueCategories,
    valueItems,
    setActiveTab,
    isAuthorizedAdmin,
    addValueItem,
    updateValueItem,
    deleteValueItem,
    updateValueCategory,
    showToast
  } = useApp();

  const category = valueCategories.find((c) => c.id === categoryId);
  const items = valueItems.filter((i) => i.categoryId === categoryId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  // Add / Edit Item Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UnifiedValueItem | null>(null);

  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('Huge');
  const [itemValue, setItemValue] = useState('15000000');
  const [itemDemand, setItemDemand] = useState('Çok Yüksek');
  const [itemRarity, setItemRarity] = useState('Huge');
  const [itemImage, setItemImage] = useState('');
  const [itemStability, setItemStability] = useState<'Yükseliyor' | 'Sabit' | 'Düşüyor'>('Sabit');
  const [itemDescription, setItemDescription] = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Edit Category Modal State (quick edit from inside this game page)
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [catDescInput, setCatDescInput] = useState('');
  const [catImageInput, setCatImageInput] = useState('');
  const [isCatUploading, setIsCatUploading] = useState(false);

  const openAddItemModal = () => {
    setEditingItem(null);
    setItemName('');
    setItemType('Huge');
    setItemValue('15000000');
    setItemDemand('Çok Yüksek');
    setItemRarity('Huge');
    setItemImage('');
    setItemStability('Sabit');
    setItemDescription('');
    setImagePreviewError(false);
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: UnifiedValueItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemType(item.type || 'Pet');
    setItemValue(String(item.value));
    setItemDemand(item.demand || 'Normal');
    setItemRarity(item.rarity || 'Huge');
    setItemImage(item.imageUrl || '');
    setItemStability((item.stability as any) || 'Sabit');
    setItemDescription(item.description || '');
    setImagePreviewError(false);
    setIsItemModalOpen(true);
  };

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressed = await compressImageFile(file, 400, 400, 0.75);
      setItemImage(compressed);
      setImagePreviewError(false);
      showToast('Eşya görseli cihazdan yüklendi ve optimize edildi! 📸');
    } catch {
      showToast('Görsel işlenirken hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      showToast('Lütfen eşya adını girin!');
      return;
    }

    const parsedVal = isNaN(Number(itemValue)) ? itemValue : Number(itemValue);
    const finalImage = itemImage.trim() || DEFAULT_ITEM_IMAGE;

    if (editingItem) {
      await updateValueItem(editingItem.id, {
        name: itemName.trim(),
        type: itemType.trim(),
        value: parsedVal,
        demand: itemDemand,
        rarity: itemRarity,
        imageUrl: finalImage,
        stability: itemStability,
        description: itemDescription.trim() || `${category?.name || 'Oyun'} özel eşya değeri.`
      });
      showToast(`'${itemName}' eşyası güncellendi! ✅`);
    } else {
      await addValueItem({
        categoryId,
        name: itemName.trim(),
        type: itemType.trim(),
        value: parsedVal,
        demand: itemDemand,
        rarity: itemRarity,
        imageUrl: finalImage,
        stability: itemStability,
        description: itemDescription.trim() || `${category?.name || 'Oyun'} özel eşya değeri.`
      });
      showToast(`'${itemName}' listeye eklendi! ✨`);
    }

    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  // Quick edit category handler
  const openEditCategory = () => {
    if (!category) return;
    setCatNameInput(category.name);
    setCatDescInput(category.description || '');
    setCatImageInput(category.imageUrl || '');
    setIsEditCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !catNameInput.trim()) return;

    await updateValueCategory(category.id, {
      name: catNameInput.trim(),
      description: catDescInput.trim(),
      imageUrl: catImageInput.trim() || category.imageUrl
    });

    setIsEditCategoryModalOpen(false);
    showToast('Kategori bilgileri ve resmi güncellendi! ✅');
  };

  const handleCatDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCatUploading(true);
    try {
      const compressed = await compressImageFile(file, 640, 400, 0.8);
      setCatImageInput(compressed);
      showToast('Kategori resmi cihazdan yüklendi! 🖼️');
    } catch {
      showToast('Resim yüklenemedi.');
    } finally {
      setIsCatUploading(false);
    }
  };

  if (!category) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-4">
        <p>Kategori bulunamadı veya silindi.</p>
        <button
          onClick={() => setActiveTab('values_hub')}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
        >
          Değerler Merkezine Dön
        </button>
      </div>
    );
  }

  // Extract all distinct types for quick filtering
  const distinctTypes = Array.from(new Set(items.map((i) => i.type).filter(Boolean)));

  const filteredItems = items.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.type && i.type.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedTypeFilter === 'all' || i.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => setActiveTab('values_hub')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-700/40 text-purple-200 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Değerler Merkezine Dön</span>
        </button>

        {isAuthorizedAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={openEditCategory}
              className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-600/40 text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Oyunu / Kategoriyi Düzenle</span>
            </button>

            <button
              onClick={openAddItemModal}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Bu Oyuna Eşya Ekle</span>
            </button>
          </div>
        )}
      </div>

      {/* Category Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#180f24] to-purple-950 border border-amber-500/30 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-amber-500/20 border border-amber-500/40 p-1 shrink-0 shadow-xl">
          <img
            src={category.imageUrl || DEFAULT_ITEM_IMAGE}
            alt={category.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_ITEM_IMAGE;
            }}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="space-y-1 text-center md:text-left flex-1">
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/50 uppercase">
            Özel Değer Kataloğu
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{category.name} Değerleri</h1>
          <p className="text-xs sm:text-sm text-slate-300">{category.description || 'Güncel eşya değerleri ve talep listesi.'}</p>
        </div>
        <div className="px-5 py-3 rounded-2xl bg-black/40 border border-amber-500/30 text-center shrink-0">
          <span className="block text-2xl font-black text-amber-400">{items.length}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Kayıtlı Eşya</span>
        </div>
      </div>

      {/* Quick Category Edit Modal */}
      {isEditCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#120c24] border border-amber-500/40 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>Kategori Bilgilerini Düzenle</span>
              </h3>
              <button
                onClick={() => setIsEditCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Kategori / Oyun Adı</label>
                <input
                  type="text"
                  required
                  value={catNameInput}
                  onChange={(e) => setCatNameInput(e.target.value)}
                  className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Açıklama</label>
                <input
                  type="text"
                  value={catDescInput}
                  onChange={(e) => setCatDescInput(e.target.value)}
                  className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Kategori Görseli (URL veya Cihazdan Yükle)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={catImageInput}
                    onChange={(e) => setCatImageInput(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-600/40 text-xs font-bold text-purple-200 flex items-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isCatUploading ? '...' : 'Yükle'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCatDeviceUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-900/40">
                <button
                  type="button"
                  onClick={() => setIsEditCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-purple-950/40 text-slate-300 text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 text-white text-xs font-bold"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in zoom-in-95 duration-200">
          <div className="bg-[#120c24] border border-amber-500/40 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{editingItem ? `'${editingItem.name}' Eşyasını Düzenle` : `${category.name} İçin Yeni Eşya Ekle`}</span>
              </h3>
              <button
                onClick={() => {
                  setIsItemModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-300 mb-1">Eşya Adı *</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Örn: Huge Happy Rock, Titanic Dominus"
                    className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-purple-300 mb-1">Eşya Tipi / Sınıfı *</label>
                  <input
                    type="text"
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    placeholder="Örn: Huge, Titanic, Legendary, Secret"
                    className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Quick Type Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-semibold">Hızlı Tip:</span>
                {['Huge', 'Titanic', 'Exclusive', 'Mythical', 'Godly', 'Legendary'].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => {
                      setItemType(t);
                      setItemRarity(t);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors ${
                      itemType === t
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800/40'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-300 mb-1">Değer (Puan) *</label>
                  <input
                    type="text"
                    value={itemValue}
                    onChange={(e) => setItemValue(e.target.value)}
                    placeholder="Örn: 15000000 veya 15M"
                    className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-purple-300 mb-1">Talep (Demand)</label>
                  <select
                    value={itemDemand}
                    onChange={(e) => setItemDemand(e.target.value)}
                    className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Çok Yüksek">Çok Yüksek 🔥</option>
                    <option value="Yüksek">Yüksek 📈</option>
                    <option value="Normal">Normal ⚖️</option>
                    <option value="Düşük">Düşük 📉</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-purple-300 mb-1">Stabilite</label>
                  <select
                    value={itemStability}
                    onChange={(e) => setItemStability(e.target.value as any)}
                    className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Yükseliyor">Yükseliyor 🚀</option>
                    <option value="Sabit">Sabit ⚖️</option>
                    <option value="Düşüyor">Düşüyor 🔻</option>
                  </select>
                </div>
              </div>

              {/* Image Input & Device Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-purple-300">
                  Eşya Görseli (URL veya Cihazdan Yükle)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={itemImage}
                    onChange={(e) => {
                      setItemImage(e.target.value);
                      setImagePreviewError(false);
                    }}
                    placeholder="https://... görsel bağlantısı"
                    className="flex-1 bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
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

                {/* Live Preview Box */}
                <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-900/50 flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/60 border border-purple-700/40 shrink-0 flex items-center justify-center">
                    {!imagePreviewError && itemImage ? (
                      <img
                        src={itemImage}
                        alt="Önizleme"
                        referrerPolicy="no-referrer"
                        onError={() => setImagePreviewError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-1 text-slate-500">
                        <ImageIcon className="w-5 h-5 mx-auto text-amber-400" />
                        <span className="text-[9px] block">Resim Yok</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 text-xs">
                    <span className="font-extrabold text-white block truncate">{itemName || 'Eşya Adı'}</span>
                    <span className="text-amber-400 font-bold block">
                      {itemValue ? `${Number(itemValue).toLocaleString() || itemValue} Değer` : 'Değer Belirtilmedi'}
                    </span>
                    <span className="text-[10px] text-purple-300 block truncate">
                      {itemType} • {itemDemand} • {itemStability}
                    </span>
                    {imagePreviewError && (
                      <span className="text-[10px] text-rose-400 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" />
                        Görsel bağlantısı açılamadı, varsayılan gösterilecek
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-300 mb-1">Açıklama / Not</label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Eşya hakkında ek detaylar..."
                  className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-900/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsItemModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-950/40 text-slate-300 text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 text-white text-xs font-bold shadow-lg"
                >
                  {editingItem ? 'Eşyayı Güncelle' : 'Eşyayı Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter Strip */}
      <div className="p-4 rounded-2xl bg-[#0c0919] border border-purple-900/40 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${category.name} eşyalarında ara (örn: Huge, Titanic, Rock)...`}
            className="w-full bg-[#130f24] text-xs text-white placeholder-slate-500 pl-9 pr-3 py-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-amber-500"
          />
        </div>

        {distinctTypes.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Tip Filtresi:</span>
            <button
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                selectedTypeFilter === 'all'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-[#130f24] text-slate-400 hover:text-white border border-purple-900/30'
              }`}
            >
              Tümü ({items.length})
            </button>
            {distinctTypes.map((t) => {
              const count = items.filter((i) => i.type === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                    selectedTypeFilter === t
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-[#130f24] text-slate-400 hover:text-white border border-purple-900/30'
                  }`}
                >
                  {t} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 bg-[#0c0919] rounded-2xl border border-purple-900/40 space-y-3">
          <p>Aramanızla eşleşen eşya bulunamadı.</p>
          {isAuthorizedAdmin && (
            <button
              onClick={openAddItemModal}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-purple-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>İlk Eşyayı Hemen Ekle</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isRising = item.stability === 'Yükseliyor';
            const isDropping = item.stability === 'Düşüyor';

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#0d0a1b] border border-purple-900/40 hover:border-amber-500/50 flex items-center justify-between gap-3 transition-all hover:bg-[#110d24] shadow-lg group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/60 border border-purple-700/40 p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={item.imageUrl || DEFAULT_ITEM_IMAGE}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_ITEM_IMAGE;
                      }}
                      className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <h4 className="font-extrabold text-sm text-white truncate">{item.name}</h4>
                      <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded border border-amber-800/40 font-bold shrink-0">
                        {item.type}
                      </span>
                    </div>

                    <span className="text-xs text-amber-400 font-black block mt-0.5">
                      {typeof item.value === 'number' ? item.value.toLocaleString('tr-TR') : item.value} Değer
                    </span>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>Talep: <strong className="text-slate-200">{item.demand}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        {isRising && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                        {isDropping && <TrendingDown className="w-3 h-3 text-rose-400" />}
                        {!isRising && !isDropping && <Minus className="w-3 h-3 text-slate-400" />}
                        <strong className={isRising ? 'text-emerald-400' : isDropping ? 'text-rose-400' : 'text-slate-300'}>
                          {item.stability}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {isAuthorizedAdmin && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditItemModal(item)}
                      className="p-2 text-purple-300 hover:text-white rounded-xl hover:bg-purple-900/50 transition-colors"
                      title="Eşyayı ve Resmi Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteValueItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-950/40 transition-colors"
                      title="Eşyayı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
