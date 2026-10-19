import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExecutorItem } from '../../types';
import { compressImageFile } from '../../utils/imageCompressor';
import {
  X,
  Terminal,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Image as ImageIcon
} from 'lucide-react';

const DEFAULT_PLATFORMS: ('Windows' | 'Android' | 'iOS' | 'macOS')[] = [
  'Windows',
  'Android',
  'iOS',
  'macOS'
];

export const AddExecutorModal: React.FC = () => {
  const {
    isAddExecutorModalOpen,
    setIsAddExecutorModalOpen,
    addExecutor,
    updateExecutor,
    editingExecutor,
    setEditingExecutor,
    showToast
  } = useApp();

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [platforms, setPlatforms] = useState<('Windows' | 'Android' | 'iOS' | 'macOS')[]>(['Windows', 'Android']);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Güncellemede' | 'İncelemede'>('Aktif');
  const [version, setVersion] = useState('v1.0');
  const [uncPercent, setUncPercent] = useState('100% UNC');
  const [isKeyless, setIsKeyless] = useState(false);
  const [level, setLevel] = useState('Level 7');
  const [isRecommended, setIsRecommended] = useState(false);

  useEffect(() => {
    if (editingExecutor) {
      setName(editingExecutor.name);
      setImageUrl(editingExecutor.imageUrl || '');
      setDescription(editingExecutor.description || '');
      setPlatforms(editingExecutor.platforms || ['Windows', 'Android']);
      setDownloadUrl(editingExecutor.downloadUrl || '');
      setStatus(editingExecutor.status || 'Aktif');
      setVersion(editingExecutor.version || 'v1.0');
      setUncPercent(editingExecutor.uncPercent || '100% UNC');
      setIsKeyless(!!editingExecutor.isKeyless);
      setLevel(editingExecutor.level || 'Level 7');
      setIsRecommended(!!editingExecutor.isRecommended);
    } else {
      setName('');
      setImageUrl('');
      setDescription('');
      setPlatforms(['Windows', 'Android']);
      setDownloadUrl('');
      setStatus('Aktif');
      setVersion('v1.0');
      setUncPercent('100% UNC');
      setIsKeyless(false);
      setLevel('Level 7');
      setIsRecommended(false);
    }
  }, [editingExecutor, isAddExecutorModalOpen]);

  if (!isAddExecutorModalOpen) return null;

  const handleClose = () => {
    setIsAddExecutorModalOpen(false);
    setEditingExecutor(null);
  };

  const handlePlatformToggle = (plat: 'Windows' | 'Android' | 'iOS' | 'macOS') => {
    setPlatforms(prev =>
      prev.includes(plat)
        ? prev.length > 1 ? prev.filter(p => p !== plat) : prev
        : [...prev, plat]
    );
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file);
      setImageUrl(compressed);
      showToast('Executor resmi optimize edilip hazırlandı! 🖼️');
    } catch {
      showToast('Resim yüklenemedi.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Lütfen executor adını girin!');
      return;
    }

    const payload = {
      name: name.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
      description: description.trim() || 'Güvenli, kararlı ve yüksek performanslı Roblox Lua executoru.',
      platforms,
      downloadUrl: downloadUrl.trim() || 'https://getwave.gg',
      status,
      version: version.trim() || 'v1.0',
      uncPercent: uncPercent.trim() || '100% UNC',
      isKeyless,
      level,
      isRecommended
    };

    if (editingExecutor) {
      updateExecutor(editingExecutor.id, payload);
      showToast(`'${name}' executoru ve resmi güncellendi! ✏️`);
    } else {
      addExecutor(payload);
      showToast(`'${name}' executoru başarıyla eklendi! 🚀`);
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-[#0d091e] border border-emerald-500/40 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-900/40 flex items-center justify-between bg-gradient-to-r from-emerald-950/60 via-[#150f2f] to-[#0d091e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {editingExecutor ? 'Executor Düzenle' : 'Yeni Executor Ekle'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {editingExecutor ? `'${editingExecutor.name}' resmini ve özelliklerini güncelleyin` : 'Kütüphaneye yeni bir executor kaydedin'}
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
          
          {/* Name & Version */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Executor Adı *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Örn: Delta Executor, Wave, Arceus X"
                className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Versiyon</label>
              <input
                type="text"
                value={version}
                onChange={e => setVersion(e.target.value)}
                placeholder="Örn: v2.4"
                className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              />
            </div>
          </div>

          {/* IMAGE URL & UPLOAD */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-[#140e2b] border border-purple-800/40">
            <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Executor Logosu / Resmi *</span>
            </label>
            
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://... veya resim linki yapıştırın"
                className="flex-1 bg-[#0d091b] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:border-emerald-500 focus:outline-none"
              />
              <label className="px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 hover:text-white cursor-pointer text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Yükle</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
              </label>
            </div>

            {/* Live Image Preview */}
            {imageUrl && (
              <div className="flex items-center gap-3 pt-1">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-emerald-500/50 bg-black/60 p-1 shrink-0">
                  <img src={imageUrl} alt="Önizleme" className="w-full h-full object-cover rounded-lg" />
                </div>
                <span className="text-[11px] text-slate-300">
                  Resim önizlemesi hazır. Kaydettiğinizde kartta bu logo görünecektir.
                </span>
              </div>
            )}
          </div>

          {/* Platforms Selection */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Desteklenen Platformlar</label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_PLATFORMS.map(p => {
                const isSelected = platforms.includes(p);
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => handlePlatformToggle(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50 border border-emerald-400'
                        : 'bg-[#130f25] text-slate-400 border border-purple-900/40 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'opacity-40'}`} />
                    <span>{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status, UNC, Level */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Durum</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              >
                <option value="Aktif">Aktif 🟢</option>
                <option value="Güncellemede">Güncellemede 🟡</option>
                <option value="İncelemede">İncelemede 🔵</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">UNC Yüzdesi</label>
              <input
                type="text"
                value={uncPercent}
                onChange={e => setUncPercent(e.target.value)}
                placeholder="Örn: 100% UNC"
                className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Seviye (Level)</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              >
                <option value="Level 7">Level 7</option>
                <option value="Level 8">Level 8 (En Yüksek)</option>
                <option value="Level 6">Level 6</option>
              </select>
            </div>
          </div>

          {/* Keyless Checkbox & Recommended Checkbox */}
          <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-[#130f25] border border-purple-800/40 text-xs text-slate-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isKeyless}
                onChange={e => setIsKeyless(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold">Keyless (Key İstemez)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecommended}
                onChange={e => setIsRecommended(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="font-semibold">Önerilen Rozeti</span>
            </label>
          </div>

          {/* Download URL */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Resmi İndirme Bağlantısı (URL) *</label>
            <div className="relative">
              <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="url"
                required
                value={downloadUrl}
                onChange={e => setDownloadUrl(e.target.value)}
                placeholder="https://getwave.gg veya resmi indirme linki"
                className="w-full bg-[#130f25] text-xs text-white pl-8 pr-3 py-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Açıklama</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Executor özellikleri, stabilite ve detayları..."
              className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{editingExecutor ? 'Executoru ve Resmi Güncelle' : 'Executoru Kaydet & Yayınla'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
