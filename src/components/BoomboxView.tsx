import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SongItem } from '../types';
import { APP_LOGO_URL } from '../constants/branding';
import {
  Music,
  Radio,
  Play,
  Square,
  Copy,
  Check,
  Search,
  PlusCircle,
  Sparkles,
  Volume2,
  Heart,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const BoomboxView: React.FC = () => {
  const { songs, addSong, showToast, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  // Modal for adding new song
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newAudioId, setNewAudioId] = useState('');
  const [newCategory, setNewCategory] = useState<SongItem['category']>('Phonk');

  // Audio tone synthesizer using Web Audio API for safe sound preview
  const playPreviewTone = (id: string) => {
    if (playingSongId === id) {
      setPlayingSongId(null);
      return;
    }

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        // Play melodic sequence
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.6);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.0);
      }
    } catch (e) {}

    setPlayingSongId(id);
    showToast('Ses önizleme efekti çalınıyor 🎵');
    setTimeout(() => {
      setPlayingSongId(prev => (prev === id ? null : prev));
    }, 1500);
  };

  const handleCopyId = (audioId: string, title: string) => {
    navigator.clipboard.writeText(audioId);
    setCopiedId(audioId);
    showToast(`'${title}' Roblox ID kopyalandı: ${audioId} 📋`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAudioId.trim()) {
      showToast('Lütfen şarkı adı ve Roblox Ses ID girin!');
      return;
    }

    addSong({
      title: newTitle.trim(),
      artist: newArtist.trim() || 'Bilinmiyor',
      audioId: newAudioId.trim().replace(/\D/g, '') || newAudioId.trim(),
      category: newCategory
    });

    setNewTitle('');
    setNewArtist('');
    setNewAudioId('');
    setIsAddSongOpen(false);
  };

  const filteredSongs = songs.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.artist.toLowerCase().includes(query) ||
      item.audioId.includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#180e35] to-[#0c081c] border border-purple-800/40 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/40 text-pink-300 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-pink-400" />
            <span>Roblox Boombox & Radyo Şarkı ID Arşivi ({songs.length})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            Roblox <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Müzik ID'leri</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Roblox oyunlarında radyolarda ve boomboxlarda çalan en popüler Türkçe, Phonk, Meme ve Trap müzik kodları. Tek tıkla kopyala ve oyunda çal!
          </p>
        </div>

        {/* Right Action: Add Song & Logo */}
        <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3.5 relative z-10 shrink-0 w-full md:w-auto">
          <div className="relative group flex items-center justify-center">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0e0a1c] border-2 border-pink-500/50 p-1 shadow-2xl overflow-hidden flex items-center justify-center">
              <img src={APP_LOGO_URL} alt="Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>

          <button
            onClick={() => setIsAddSongOpen(true)}
            className="w-full md:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-pink-950/40 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Şarkı ID Ekle</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Şarkı adı, sanatçı veya ID ara..."
            className="w-full bg-[#0d091b] border border-purple-900/40 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'Phonk', 'Türkçe', 'Gaming', 'Meme', 'Pop/Trap'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-900/40'
                  : 'bg-[#0e0b1f] text-slate-400 hover:text-white border border-purple-900/30'
              }`}
            >
              {cat === 'all' ? 'Tümü' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Song Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSongs.map((song) => {
          const isCopied = copiedId === song.audioId;
          const isPlaying = playingSongId === song.id;

          return (
            <div
              key={song.id}
              className="group rounded-2xl bg-[#0d091b] border border-purple-900/40 hover:border-pink-500/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-950/20 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Disc Icon, Title, Artist */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => playPreviewTone(song.id)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isPlaying
                          ? 'bg-pink-500 text-white animate-spin-slow ring-4 ring-pink-500/30'
                          : 'bg-purple-950/60 text-pink-400 group-hover:bg-pink-600 group-hover:text-white'
                      }`}
                      title={isPlaying ? 'Durdur' : 'Önizleme Sesi Çal'}
                    >
                      {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <div className="min-w-0">
                      <h3 className="font-extrabold text-sm text-white group-hover:text-pink-300 transition-colors truncate">
                        {song.title}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">{song.artist}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-lg bg-purple-950/70 border border-purple-800/40 text-[10px] font-bold text-purple-300 shrink-0">
                    {song.category}
                  </span>
                </div>

                {/* Audio ID Display Box */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-purple-900/50 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Roblox Boombox ID:</span>
                    <span className="font-mono font-black text-sm text-emerald-400 tracking-wider">
                      {song.audioId}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyId(song.audioId, song.title)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 active:scale-95 ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-purple-900/60 hover:bg-pink-600 text-purple-200 hover:text-white border border-purple-700/40'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-purple-900/30 mt-3">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-purple-400" />
                  <span>{song.plays.toLocaleString('tr-TR')} Çalma</span>
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-pink-400 fill-pink-400/20" />
                  <span>{song.likes} Beğeni</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Song Modal */}
      {isAddSongOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0e0a1f] border border-pink-500/50 p-6 space-y-4 shadow-2xl">
            <button
              onClick={() => setIsAddSongOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-600/30 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">Yeni Roblox Şarkı ID Ekle</h3>
                <p className="text-xs text-purple-300">Boombox kütüphanesine yeni şarkı kodu tanımla</p>
              </div>
            </div>

            <form onSubmit={handleSaveSong} className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Şarkı Adı:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Kordhell - Live Another Day"
                  className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-700/40 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Sanatçı / Kanal:</label>
                <input
                  type="text"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="Örn: Kordhell"
                  className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-700/40 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs text-emerald-400 font-bold block mb-1">Roblox Ses ID (Sayısal Kod):</label>
                <input
                  type="text"
                  required
                  value={newAudioId}
                  onChange={(e) => setNewAudioId(e.target.value)}
                  placeholder="Örn: 9114717145"
                  className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-emerald-500/40 text-xs text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Kategori:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-700/40 text-xs text-white focus:outline-none"
                >
                  <option value="Phonk">Phonk</option>
                  <option value="Türkçe">Türkçe</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Meme">Meme</option>
                  <option value="Pop/Trap">Pop/Trap</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Şarkıyı Arşive Ekle
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddSongOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs rounded-xl"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
