import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BloxFruitItem } from '../../types';
import { X, Flame, Zap, TrendingUp, TrendingDown, Minus, Sparkles, Image as ImageIcon, DollarSign } from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';

export const AddBloxItemModal: React.FC = () => {
  const {
    isAddBloxFruitModalOpen,
    setIsAddBloxFruitModalOpen,
    addBloxFruit,
    updateBloxFruit,
    editingBloxFruit,
    setEditingBloxFruit,
    showToast
  } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<BloxFruitItem['type']>('Natural');
  const [category, setCategory] = useState<BloxFruitItem['category']>('Fiziksel');
  const [value, setValue] = useState<number>(5000000);
  const [demand, setDemand] = useState<BloxFruitItem['demand']>('Normal');
  const [stability, setStability] = useState<BloxFruitItem['stability']>('Sabit');
  const [rarity, setRarity] = useState<BloxFruitItem['rarity']>('Legendary');
  const [beliPrice, setBeliPrice] = useState<number>(1000000);
  const [robuxPrice, setRobuxPrice] = useState<number>(1500);
  const [awakening, setAwakening] = useState<boolean>(false);
  const [pveRating, setPveRating] = useState('S');
  const [pvpRating, setPvpRating] = useState('S');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);

  useEffect(() => {
    if (editingBloxFruit) {
      setName(editingBloxFruit.name);
      setType(editingBloxFruit.type);
      setCategory(editingBloxFruit.category);
      setValue(editingBloxFruit.value);
      setDemand(editingBloxFruit.demand);
      setStability(editingBloxFruit.stability);
      setRarity(editingBloxFruit.rarity);
      setBeliPrice(editingBloxFruit.beliPrice || 0);
      setRobuxPrice(editingBloxFruit.robuxPrice || 0);
      setAwakening(!!editingBloxFruit.awakening);
      setPveRating(editingBloxFruit.pveRating || 'S');
      setPvpRating(editingBloxFruit.pvpRating || 'S');
      setImageUrl(editingBloxFruit.imageUrl);
      setDescription(editingBloxFruit.description || '');
      setImagePreviewFailed(false);
    } else {
      setName('');
      setType('Natural');
      setCategory('Fiziksel');
      setValue(5000000);
      setDemand('Normal');
      setStability('Sabit');
      setRarity('Legendary');
      setBeliPrice(1000000);
      setRobuxPrice(1500);
      setAwakening(false);
      setPveRating('S');
      setPvpRating('S');
      setImageUrl('');
      setDescription('');
      setImagePreviewFailed(false);
    }
  }, [editingBloxFruit, isAddBloxFruitModalOpen]);

  if (!isAddBloxFruitModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Lütfen meyve adını girin!');
      return;
    }

    const finalImage = imageUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80';

    if (editingBloxFruit) {
      updateBloxFruit(editingBloxFruit.id, {
        name: name.trim(),
        type,
        category,
        value: Number(value),
        demand,
        stability,
        rarity,
        beliPrice: Number(beliPrice),
        robuxPrice: Number(robuxPrice),
        awakening,
        pveRating,
        pvpRating,
        imageUrl: finalImage,
        description: description.trim()
      });
      showToast(`'${name}' güncellendi!`);
    } else {
      addBloxFruit({
        name: name.trim(),
        type,
        category,
        value: Number(value),
        demand,
        stability,
        rarity,
        beliPrice: Number(beliPrice),
        robuxPrice: Number(robuxPrice),
        awakening,
        pveRating,
        pvpRating,
        imageUrl: finalImage,
        description: description.trim()
      });
      showToast(`'${name}' yeni Blox Fruit olarak eklendi!`);
    }

    setEditingBloxFruit(null);
    setIsAddBloxFruitModalOpen(false);
  };

  const handleClose = () => {
    setEditingBloxFruit(null);
    setIsAddBloxFruitModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0c081e] border border-amber-500/50 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-lg text-white">
              {editingBloxFruit ? 'Blox Fruit Güncelle' : 'Yeni Blox Fruit / Eşya Ekle'}
            </h3>
            <p className="text-xs text-amber-300">Değer listesi ve takas piyasası için meyve bilgilerini girin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Fruit Name & Rarity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Meyve Adı *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Kitsune, Dragon, Dough..."
                className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-800/40 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nadirlik (Rarity)</label>
              <select
                value={rarity}
                onChange={(e) => setRarity(e.target.value as BloxFruitItem['rarity'])}
                className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-800/40 text-xs text-white focus:outline-none"
              >
                <option value="Mythical">Mythical (Mitik - Kırmızı/Mor)</option>
                <option value="Legendary">Legendary (Efsanevi - Pembe)</option>
                <option value="Rare">Rare (Nadir - Mavi)</option>
                <option value="Uncommon">Uncommon (Yeşil)</option>
                <option value="Common">Common (Yaygın - Gri)</option>
              </select>
            </div>
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Meyve Türü</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as BloxFruitItem['type'])}
                className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-800/40 text-xs text-white focus:outline-none"
              >
                <option value="Beast">Beast (Canavar / Zoan)</option>
                <option value="Elemental">Elemental (Logia)</option>
                <option value="Natural">Natural (Doğal / Paramecia)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BloxFruitItem['category'])}
                className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-800/40 text-xs text-white focus:outline-none"
              >
                <option value="Fiziksel">Fiziksel Meyve</option>
                <option value="Kalıcı (Perm)">Kalıcı (Perm)</option>
                <option value="Gamepass">Gamepass & Kılıç</option>
              </select>
            </div>
          </div>

          {/* Value & Demand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Takas Değeri (Beli)</label>
              <input
                type="number"
                required
                min={0}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                placeholder="Örn: 115000000"
                className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-emerald-500/40 text-xs text-emerald-400 font-bold focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">{(value / 1000000).toFixed(1)}M Değer</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Talep</label>
              <select
                value={demand}
                onChange={(e) => setDemand(e.target.value as BloxFruitItem['demand'])}
                className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-800/40 text-xs text-white focus:outline-none"
              >
                <option value="Çok Yüksek">Çok Yüksek</option>
                <option value="Yüksek">Yüksek</option>
                <option value="Normal">Normal</option>
                <option value="Düşük">Düşük</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Stabilite</label>
              <select
                value={stability}
                onChange={(e) => setStability(e.target.value as BloxFruitItem['stability'])}
                className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-800/40 text-xs text-white focus:outline-none"
              >
                <option value="Yükseliyor">Yükseliyor</option>
                <option value="Sabit">Sabit</option>
                <option value="Düşüyor">Düşüyor</option>
              </select>
            </div>
          </div>

          {/* In-game Beli & Robux Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Satıcı Beli Fiyatı ($)</label>
              <input
                type="number"
                min={0}
                value={beliPrice}
                onChange={(e) => setBeliPrice(Number(e.target.value))}
                placeholder="Örn: 8000000"
                className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-800/40 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Perm Robux Fiyatı (R$)</label>
              <input
                type="number"
                min={0}
                value={robuxPrice}
                onChange={(e) => setRobuxPrice(Number(e.target.value))}
                placeholder="Örn: 4000"
                className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-800/40 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Awakening Checkbox */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-950/30 border border-purple-800/40">
            <input
              type="checkbox"
              id="awakeningCheckbox"
              checked={awakening}
              onChange={(e) => setAwakening(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 bg-black/40 border-purple-700 focus:ring-0"
            />
            <label htmlFor="awakeningCheckbox" className="text-xs font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Raid Uyanışı (Awakened V2) Mevcut</span>
            </label>
          </div>

          {/* Image URL & File Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Görsel URL veya Dosya Yükle</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreviewFailed(false);
                }}
                placeholder="https://..."
                className="flex-1 p-2.5 rounded-xl bg-[#140e2d] border border-purple-800/40 text-xs text-white focus:outline-none"
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const compressed = await compressImageFile(file);
                      setImageUrl(compressed);
                      setImagePreviewFailed(false);
                      showToast('Resim başarıyla yüklendi!');
                    } catch (error) {
                      showToast('Resim yüklenemedi: ' + error);
                    }
                  }
                }}
                className="hidden"
                id="fruit-image-upload"
              />
              <label
                htmlFor="fruit-image-upload"
                className="px-4 py-2 bg-purple-900/60 hover:bg-purple-800 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center"
              >
                <ImageIcon className="w-4 h-4" />
              </label>
            </div>
          </div>

          {/* Live Image Preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-950/30 border border-purple-900/40">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-purple-700/40 flex items-center justify-center shrink-0">
              {!imagePreviewFailed && imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Önizleme"
                  referrerPolicy="no-referrer"
                  onError={() => setImagePreviewFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-1">
                  <Sparkles className="w-6 h-6 text-amber-400 mx-auto" />
                </div>
              )}
            </div>
            <div className="text-xs space-y-0.5 min-w-0">
              <span className="font-black text-white block truncate">
                {name || 'Eşya Önizleme'}
              </span>
              <span className="text-emerald-300 font-bold block">
                {(value / 1000000).toFixed(1)}M Beli
              </span>
              <span className="text-[10px] text-purple-300 block truncate">
                {type} • {category} • {demand}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Açıklama & Notlar</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Meyvenin takas durumu, pasifleri ve yetenekleri hakkında bilgi..."
              className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-800/40 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-amber-600 via-red-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all"
            >
              {editingBloxFruit ? 'Meyveyi Kaydet' : 'Blox Fruits Listesine Ekle'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
