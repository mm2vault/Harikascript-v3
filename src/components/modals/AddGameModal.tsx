import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RobloxGame } from '../../types';
import { compressImageFile } from '../../utils/imageCompressor';
import {
  X,
  Gamepad2,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const AddGameModal: React.FC = () => {
  const {
    isAddGameModalOpen,
    setIsAddGameModalOpen,
    addGame,
    updateGame,
    editingGame,
    setEditingGame,
    user,
    showToast
  } = useApp();

  const [name, setName] = useState('');
  const [robloxUrl, setRobloxUrl] = useState('');
  const [developer, setDeveloper] = useState('');
  const [genre, setGenre] = useState('Action');
  const [category, setCategory] = useState('Diğer');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Pre-fill fields if editingGame is passed
  React.useEffect(() => {
    if (editingGame) {
      setName(editingGame.name);
      setRobloxUrl(editingGame.robloxUrl);
      setDeveloper(editingGame.developer);
      setGenre(editingGame.genre);
      setCategory(editingGame.category || 'Diğer');
      setDescription(editingGame.description);
      setImageUrl(editingGame.imageUrl);
    } else {
      setName('');
      setRobloxUrl('');
      setDeveloper('');
      setGenre('Action');
      setCategory('Diğer');
      setDescription('');
      setImageUrl('');
    }
  }, [editingGame, isAddGameModalOpen]);

  if (!isAddGameModalOpen) return null;

  const handleClose = () => {
    setIsAddGameModalOpen(false);
    setEditingGame(null);
  };

  // File upload from phone gallery or local disk
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 512, 512, 0.75);
      setImageUrl(compressed);
      showToast('Oyun görseli başarıyla optimize edildi! 🎮');
    } catch {
      showToast('Görsel işlenemedi.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Lütfen oyun adını girin!');
      return;
    }

    if (editingGame) {
      updateGame(editingGame.id, {
        name,
        robloxUrl: robloxUrl || 'https://www.roblox.com',
        developer: developer || 'Topluluk',
        genre,
        category,
        description: description || 'HarikaScript kütüphanesine yeni eklenen Roblox oyunu.',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'
      });
      showToast(`'${name}' oyunu güncellendi! ✏️`);
    } else {
      const newGame: RobloxGame = {
        id: `game_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name,
        robloxUrl: robloxUrl || 'https://www.roblox.com',
        developer: developer || 'Topluluk',
        genre,
        description: description || 'HarikaScript kütüphanesine yeni eklenen Roblox oyunu.',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
        playerCount: 'Yeni Eklendi',
        rating: '95%',
        addedBy: user.username,
        category: 'Diğer'
      };

      addGame(newGame);
      showToast(`'${name}' oyunu kataloğa eklendi! 🎉`);
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-[#0c0919] border border-indigo-500/40 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {editingGame ? 'Oyunu Düzenle' : 'Yeni Oyun Ekle'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {editingGame ? `'${editingGame.name}' bilgilerini güncelleyin` : 'Kataloğa yeni bir Roblox oyunu kaydedin'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-5 space-y-4">
          
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Oyun Adı *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Örn: Murder Mystery 2"
              className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Geliştirici</label>
              <input
                type="text"
                value={developer}
                onChange={e => setDeveloper(e.target.value)}
                placeholder="Örn: Nikilis"
                className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Oyun Türü</label>
              <select
                value={genre}
                onChange={e => setGenre(e.target.value)}
                className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              >
                <option value="Action">Action</option>
                <option value="RPG">RPG</option>
                <option value="Adventure">Adventure</option>
                <option value="Horror">Horror</option>
                <option value="Fighting">Fighting</option>
                <option value="Sports">Sports</option>
                <option value="Simulator">Simulator</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Kategori</label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Örn: Popüler, Yeni, vs."
              className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Roblox Oyun Linki</label>
            <div className="relative">
              <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="url"
                value={robloxUrl}
                onChange={e => setRobloxUrl(e.target.value)}
                placeholder="https://www.roblox.com/games/..."
                className="w-full bg-[#130f25] text-xs text-white pl-8 pr-3 py-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Açıklama</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Oyun hakkında kısa bilgi..."
              className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
            />
          </div>

          {/* Image Upload / URL - Non-mandatory */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Kapak Görseli <span className="text-[11px] text-slate-400 font-normal">(İsteğe bağlı)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="Görsel linki yapıştırın..."
                className="flex-1 bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              />
              <label className="px-3 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 text-indigo-300 hover:text-white cursor-pointer text-xs font-semibold flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Galeriden Yükle</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
              </label>
            </div>
            {imageUrl && (
              <div className="h-20 w-36 rounded-xl overflow-hidden border border-indigo-500/40 bg-black/40">
                <img src={imageUrl} alt="Önizleme" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-900/40 transition-all active:scale-95"
            >
              {editingGame ? 'Oyunu Güncelle & Kaydet' : 'Oyunu Kataloğa Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
