import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MM2Item } from '../../types';
import { compressImageFile } from '../../utils/imageCompressor';
import {
  X,
  Flame,
  Sword,
  Crosshair,
  Sparkles,
  Image,
  Upload,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const AddMM2ItemModal: React.FC = () => {
  const {
    isAddMM2ItemModalOpen,
    setIsAddMM2ItemModalOpen,
    addMM2Item,
    updateMM2Item,
    editingMM2Item,
    setEditingMM2Item,
    showToast
  } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<MM2Item['type']>('Godly');
  const [category, setCategory] = useState<MM2Item['category']>('Knife');
  const [value, setValue] = useState<number>(100);
  const [demand, setDemand] = useState<MM2Item['demand']>('Normal');
  const [stability, setStability] = useState<MM2Item['stability']>('Sabit');
  const [rarity, setRarity] = useState('Godly Tier');
  const [origin, setOrigin] = useState('Mystery Box');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [newExtraUrl, setNewExtraUrl] = useState('');
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);

  useEffect(() => {
    if (editingMM2Item) {
      setName(editingMM2Item.name);
      setType(editingMM2Item.type);
      setCategory(editingMM2Item.category);
      setValue(editingMM2Item.value);
      setDemand(editingMM2Item.demand);
      setStability(editingMM2Item.stability);
      setRarity(editingMM2Item.rarity);
      setOrigin(editingMM2Item.origin);
      setImageUrl(editingMM2Item.imageUrl);
      setDescription(editingMM2Item.description || '');
      setExtraImages(
        Array.isArray(editingMM2Item.galleryImages)
          ? editingMM2Item.galleryImages.filter(u => u !== editingMM2Item.imageUrl).slice(0, 6)
          : []
      );
      setImagePreviewFailed(false);
    } else {
      setName('');
      setType('Godly');
      setCategory('Knife');
      setValue(100);
      setDemand('Normal');
      setStability('Sabit');
      setRarity('Godly Tier');
      setOrigin('Mystery Box');
      setImageUrl('');
      setDescription('');
      setExtraImages([]);
      setImagePreviewFailed(false);
    }
  }, [editingMM2Item, isAddMM2ItemModalOpen]);

  if (!isAddMM2ItemModalOpen) return null;

  const handleClose = () => {
    setIsAddMM2ItemModalOpen(false);
    setEditingMM2Item(null);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 480, 480, 0.75);
      setImageUrl(compressed);
      setImagePreviewFailed(false);
      showToast('Resim optimize edilip yüklendi! 📸');
    } catch {
      showToast('Resim optimize edilirken hata oluştu.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Lütfen eşya adını girin.');
      return;
    }

    if (value < 0) {
      showToast('Eşya değeri 0 veya daha büyük olmalıdır.');
      return;
    }

    const defaultImagesByType: Record<string, string> = {
      Godly: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=300&auto=format&fit=crop&q=80',
      Ancient: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80',
      Chroma: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
      Vintage: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=300&auto=format&fit=crop&q=80',
      Unique: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80'
    };

    const finalImageUrl = imageUrl.trim() || defaultImagesByType[type] || defaultImagesByType.Godly;
    const allGallery = Array.from(new Set([finalImageUrl, ...extraImages.filter(u => u && u.trim())])).slice(0, 7);

    const payload = {
      name: name.trim(),
      type,
      category,
      value: Number(value),
      demand,
      stability,
      rarity: rarity.trim() || `${type} Tier`,
      origin: origin.trim() || 'Roblox MM2',
      imageUrl: finalImageUrl,
      galleryImages: allGallery,
      description: description.trim()
    };

    if (editingMM2Item) {
      updateMM2Item(editingMM2Item.id, payload);
      showToast(`'${name}' başarıyla güncellendi!`);
    } else {
      addMM2Item(payload);
      showToast(`'${name}' MM2 değer kataloğuna eklendi!`);
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0e0a1f] border border-purple-500/50 shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-purple-950/60 transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-red-900/40">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {editingMM2Item ? 'MM2 Eşyasını Düzenle' : 'Yeni MM2 Eşyası / Silah Ekle'}
            </h2>
            <p className="text-xs text-slate-300">
              Roblox Murder Mystery 2 değer kataloğuna yeni silah, bıçak veya eşya kaydedin.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Eşya / Silah Adı <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Örn: Harvester, Sakura, Chroma Candleflame..."
              required
              className="w-full px-4 py-2.5 rounded-xl bg-purple-950/40 border border-purple-700/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          {/* Type & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Tür / Tier</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as MM2Item['type'])}
                className="w-full px-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-700/50 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="Godly">Godly (Kırmızı)</option>
                <option value="Ancient">Ancient (Mor/Siyah)</option>
                <option value="Chroma">Chroma (Gökkuşağı RGB)</option>
                <option value="Vintage">Vintage (Altın/Klasik 2014)</option>
                <option value="Unique">Unique (Özel/Geliştirici)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Kategori</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as MM2Item['category'])}
                className="w-full px-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-700/50 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="Knife">Bıçak (Knife 🗡️)</option>
                <option value="Gun">Silah (Gun 🔫)</option>
                <option value="Pet">Evcil Hayvan (Pet 🐾)</option>
              </select>
            </div>
          </div>

          {/* Value & Demand Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Değer (Seer/Value) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={value}
                onChange={e => setValue(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2.5 rounded-xl bg-purple-950/40 border border-purple-700/50 text-amber-300 font-extrabold text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Talep (Demand)</label>
              <select
                value={demand}
                onChange={e => setDemand(e.target.value as MM2Item['demand'])}
                className="w-full px-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-700/50 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="Çok Yüksek">Çok Yüksek 🔥</option>
                <option value="Yüksek">Yüksek 📈</option>
                <option value="Normal">Normal ⚖️</option>
                <option value="Düşük">Düşük 📉</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Trend / Stabilite</label>
              <select
                value={stability}
                onChange={e => setStability(e.target.value as MM2Item['stability'])}
                className="w-full px-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-700/50 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="Yükseliyor">Yükseliyor 🟢</option>
                <option value="Sabit">Sabit 🟡</option>
                <option value="Düşüyor">Düşüyor 🔴</option>
              </select>
            </div>
          </div>

          {/* Rarity Tag & Origin Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Nadirlik Açıklaması</label>
              <input
                type="text"
                value={rarity}
                onChange={e => setRarity(e.target.value)}
                placeholder="Örn: Ancient Tier, Chroma Ancient..."
                className="w-full px-3 py-2.5 rounded-xl bg-purple-950/40 border border-purple-700/50 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Köken (Origin)</label>
              <input
                type="text"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                placeholder="Örn: Halloween 2021 Tier 100, Box #1..."
                className="w-full px-3 py-2.5 rounded-xl bg-purple-950/40 border border-purple-700/50 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Image URL & File Upload */}
          <div className="space-y-2 pt-1 border-t border-purple-900/40">
            <label className="block text-xs font-bold text-slate-300">
              Eşya Görseli (Resim URL veya Cihazdan Yükle)
            </label>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={e => {
                  setImageUrl(e.target.value);
                  setImagePreviewFailed(false);
                }}
                placeholder="https://... (PNG/JPG URL)"
                className="flex-1 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-700/50 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />

              <label className="cursor-pointer px-3 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-600/40 text-xs font-bold text-purple-200 flex items-center gap-1.5 shrink-0 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Yükle</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Live Image Preview */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-950/30 border border-purple-900/40">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-purple-700/40 flex items-center justify-center shrink-0">
                {!imagePreviewFailed && imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Önizleme"
                    onError={() => setImagePreviewFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-1">
                    {category === 'Gun' ? (
                      <Crosshair className="w-6 h-6 text-purple-400 mx-auto" />
                    ) : (
                      <Sword className="w-6 h-6 text-red-400 mx-auto" />
                    )}
                  </div>
                )}
              </div>
              <div className="text-xs space-y-0.5 min-w-0">
                <span className="font-black text-white block truncate">
                  {name || 'Eşya Önizleme'}
                </span>
                <span className="text-amber-300 font-bold block">
                  {value.toLocaleString('tr-TR')} Değer
                </span>
                <span className="text-[10px] text-purple-300 block truncate">
                  {type} • {category} • {demand}
                </span>
              </div>
            </div>

            {/* Fandom Wiki Lore & Overview */}
            <div className="pt-2 border-t border-purple-900/40 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Fandom Wiki "Hakkında" Açıklaması & Hikayesi
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Bu eşyanın tasarımı, etkinlik kökeni veya takas popülerliği hakkında bilgi yazın..."
                className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-700/50 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            {/* Extra Gallery Images (Max 7 Total) */}
            <div className="pt-2 border-t border-purple-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300">
                  Fandom Galeri Görselleri ({1 + extraImages.length}/7 Görsel)
                </label>
                <span className="text-[10px] text-purple-300">Maksimum 7 görsel</span>
              </div>

              {extraImages.length < 6 && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newExtraUrl}
                    onChange={e => setNewExtraUrl(e.target.value)}
                    placeholder="https://... ek galeri görseli"
                    className="flex-1 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-700/50 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newExtraUrl.trim() && newExtraUrl.startsWith('http')) {
                        setExtraImages(prev => [...prev, newExtraUrl.trim()].slice(0, 6));
                        setNewExtraUrl('');
                      } else {
                        showToast('Geçerli bir görsel bağlantısı girin!');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-xs font-bold text-purple-200 transition-colors"
                  >
                    Görsel Ekle
                  </button>
                </div>
              )}

              {extraImages.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {extraImages.map((url, i) => (
                    <div key={i} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-black/40 border border-purple-900/40 text-[10px] text-slate-300">
                      <img src={url} alt={`Galeri ${i + 2}`} className="w-6 h-6 object-cover rounded" />
                      <span>#{i + 2}</span>
                      <button
                        type="button"
                        onClick={() => setExtraImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-rose-400 hover:text-rose-200 ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-slate-300 text-xs font-bold transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-red-900/40 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingMM2Item ? 'Değişiklikleri Kaydet' : 'Eşyayı Kataloğa Ekle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
