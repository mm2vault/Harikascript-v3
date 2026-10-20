import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScriptItem } from '../../types';
import { compressImageFile } from '../../utils/imageCompressor';
import {
  X,
  FileCode2,
  Upload,
  Coins,
  Key,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Gamepad2
} from 'lucide-react';

export const AddScriptModal: React.FC = () => {
  const {
    isAddScriptModalOpen,
    setIsAddScriptModalOpen,
    addScript,
    updateScript,
    editingScript,
    setEditingScript,
    games,
    user,
    showToast
  } = useApp();

  const [title, setTitle] = useState('');
  const [game, setGame] = useState('Blox Fruits');
  const [customGame, setCustomGame] = useState('');
  const [category, setCategory] = useState<'Auto Farm' | 'Combat' | 'Visual/ESP' | 'Hub' | 'Misc'>('Auto Farm');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [price, setPrice] = useState<number>(0);
  const [code, setCode] = useState('');
  const [isKeyless, setIsKeyless] = useState(true);
  const [status, setStatus] = useState<'Çalışıyor' | 'Güncellendi' | 'Test Edildi' | 'Güncellemede'>('Çalışıyor');
  const [imageUrl, setImageUrl] = useState('');

  // Sync state when editingScript changes or modal opens
  React.useEffect(() => {
    if (editingScript) {
      setTitle(editingScript.title);
      setGame(editingScript.game);
      setCategory(editingScript.category);
      setDescription(editingScript.description);
      setVersion(editingScript.version);
      setPrice(editingScript.price);
      setCode(editingScript.code);
      setIsKeyless(editingScript.isKeyless);
      setStatus(editingScript.status || 'Çalışıyor');
      setImageUrl(editingScript.imageUrl);
    } else {
      setTitle('');
      setGame('Blox Fruits');
      setCustomGame('');
      setCategory('Auto Farm');
      setDescription('');
      setVersion('v1.0.0');
      setPrice(0);
      setCode('');
      setIsKeyless(true);
      setStatus('Çalışıyor');
      setImageUrl('');
    }
  }, [editingScript, isAddScriptModalOpen]);

  if (!isAddScriptModalOpen) return null;

  const handleClose = () => {
    setIsAddScriptModalOpen(false);
    setEditingScript(null);
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 640, 360, 0.75);
      setImageUrl(compressed);
      showToast('Görsel başarıyla optimize edildi! 📸');
    } catch {
      showToast('Görsel işlenemedi.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) {
      showToast('Lütfen script adı ve kodunu doldurun!');
      return;
    }

    const finalGameName = game === 'custom' ? (customGame || 'Diğer Roblox Oyunu') : game;

    if (editingScript) {
      updateScript(editingScript.id, {
        title,
        game: finalGameName,
        category,
        description,
        version,
        price: price >= 0 ? price : 0,
        isPremium: price > 0,
        code,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
        isKeyless,
        status,
        updatedAt: 'Az önce'
      });
      showToast(`'${title}' scripti güncellendi! ✏️`);
    } else {
      if (!user.uid || user.uid === 'usr_default_01') {
        showToast('Script paylaşmak için önce Google veya e-posta hesabınla giriş yapmalısın.');
        return;
      }
      const newScript: ScriptItem = {
        id: `script_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title,
        game: finalGameName,
        category,
        description: description || 'HarikaScript kullanıcısı tarafından paylaşıldı.',
        version: version || 'v1.0.0',
        price: price >= 0 ? price : 0,
        isPremium: price > 0,
        code,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
        author: user.username,
        authorUid: user.uid,
        authorRole: user.role === 'admin' ? 'Admin' : 'Community',
        isKeyless,
        status,
        downloads: 0,
        likes: 1,
        createdAt: new Date().toISOString()
      };

      addScript(newScript);
      showToast(`'${title}' scripti başarıyla yayınlandı! 🚀`);
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0d091d] border border-purple-500/40 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {editingScript ? 'Scripti Düzenle' : 'Yeni Script Paylaş'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {editingScript ? `'${editingScript.title}' detaylarını ve kodunu güncelleyin` : 'HarikaScript kütüphanesine script ekleyin'}
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

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-5 space-y-4">
          
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Script Başlığı *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Örn: Blox Fruits Auto Farm & Auto Raid Hub"
              className="w-full bg-[#130e25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Roblox Oyunu</label>
              <select
                value={game}
                onChange={e => setGame(e.target.value)}
                className="w-full bg-[#130e25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              >
                {games.map(g => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
                <option value="custom">Özel Oyun Yaz...</option>
              </select>
            </div>

            {game === 'custom' && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Oyun Adı</label>
                <input
                  type="text"
                  value={customGame}
                  onChange={e => setCustomGame(e.target.value)}
                  placeholder="Roblox oyununun adı..."
                  className="w-full bg-[#130e25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Kategori</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-[#130e25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              >
                <option value="Auto Farm">Auto Farm</option>
                <option value="Combat">Combat / Aimbot</option>
                <option value="Visual/ESP">Visual / ESP</option>
                <option value="Hub">Universal Hub</option>
                <option value="Misc">Misc / Eğlence</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Versiyon</label>
              <input
                type="text"
                value={version}
                onChange={e => setVersion(e.target.value)}
                placeholder="v1.0.0"
                className="w-full bg-[#130e25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Coin Fiyatı (0 = Bedava)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-[#130e25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Açıklama</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Scriptin özellikleri, tuş kombinasyonları ve detayları..."
              className="w-full bg-[#130e25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
            />
          </div>

          {/* Lua Code Box */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Lua Script Kodu *</label>
            <textarea
              rows={4}
              required
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder='loadstring(game:HttpGet("https://..."))()'
              className="w-full bg-[#06040d] font-mono text-xs text-purple-200 p-3 rounded-xl border border-purple-800/40 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Image URL or File Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Kapak Görseli</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="Görsel URL'si (opsiyonel)..."
                className="flex-1 bg-[#130e25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              />
              <label className="px-3 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 text-purple-300 hover:text-white cursor-pointer text-xs font-semibold flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Galeriden Seç</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {imageUrl && (
              <div className="h-20 w-36 rounded-xl overflow-hidden border border-purple-500/40 bg-black/40">
                <img src={imageUrl} alt="Önizleme" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Durum</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full bg-[#130e25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              >
                <option value="Çalışıyor">Çalışıyor ✅</option>
                <option value="Güncellendi">Güncellendi 🔄</option>
                <option value="Test Edildi">Test Edildi 🧪</option>
                <option value="Güncellemede">Güncellemede ⏳</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="keylessCheck"
                checked={isKeyless}
                onChange={e => setIsKeyless(e.target.checked)}
                className="rounded text-purple-600 focus:ring-0"
              />
              <label htmlFor="keylessCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
                Keyless (Anahtarsız)
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-900/50 transition-all active:scale-95"
            >
              {editingScript ? 'Scripti Güncelle & Kaydet' : 'Scripti Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
