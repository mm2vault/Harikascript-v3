import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RobloxGame } from '../types';
import { APP_LOGO_URL } from '../constants/branding';
import {
  Gamepad2,
  ExternalLink,
  PlusCircle,
  Search,
  FileCode2,
  Users,
  Star,
  Trash2,
  Edit2
} from 'lucide-react';

export const GamesView: React.FC = () => {
  const {
    games,
    scripts,
    setSelectedGameFilter,
    setActiveTab,
    setIsAddGameModalOpen,
    setEditingGame,
    canEditGame,
    canDeleteGame,
    requestDeleteGame,
    user
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const genres = useMemo(() => ['all', ...Array.from(new Set(games.map(g => g.genre)))], [games]);

  const filteredGames = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return games.filter(game => {
      const matchesSearch =
        !q ||
        game.name.toLowerCase().includes(q) ||
        game.developer.toLowerCase().includes(q) ||
        game.description.toLowerCase().includes(q);
      const matchesGenre = selectedGenre === 'all' || game.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [games, searchQuery, selectedGenre]);

  const handleViewScripts = (gameName: string) => {
    setSelectedGameFilter(gameName);
    setActiveTab('scripts');
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#130d2a] to-[#0c081c] border border-purple-800/40 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
            <Gamepad2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Roblox Oyun Kataloğu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            Popüler Roblox <span className="text-indigo-400">Oyunları</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            HarikaScript kütüphanesindeki tüm Roblox oyunları. Bir oyuna tıklayarak o oyuna ait çalışan scriptleri filtreleyebilir veya doğrudan Roblox'ta başlatabilirsiniz.
          </p>
        </div>

        {/* Right: Cover Logo & Add Game Button */}
        <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3.5 relative z-10 shrink-0 w-full md:w-auto">
          <div className="relative group flex items-center justify-center">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0e0a1c] border-2 border-indigo-500/50 p-1 shadow-2xl overflow-hidden flex items-center justify-center">
              <img
                src={APP_LOGO_URL}
                alt="HarikaScript Logo"
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <button
            onClick={() => setIsAddGameModalOpen(true)}
            className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Oyun Ekle</span>
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0a0817] p-2.5 rounded-2xl border border-purple-900/30">
        
        {/* Genre Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedGenre === genre
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-purple-950/40'
              }`}
            >
              {genre === 'all' ? 'Tüm Türler' : genre}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/70" />
          <input
            type="text"
            placeholder="Oyun veya geliştirici ara..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#120e24] text-xs text-white placeholder-slate-500 pl-8 pr-3 py-1.5 rounded-xl border border-purple-800/40 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map(game => {
          const gameScriptsCount = scripts.filter(s => s.game.toLowerCase() === game.name.toLowerCase()).length;

          return (
            <div
              key={game.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-[#0d0a1b] border border-purple-900/40 hover:border-indigo-500/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-950/30"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-900 mb-3">
                  {!failedImages[game.id] && game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => setFailedImages(prev => ({ ...prev, [game.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-950 via-[#161136] to-purple-950 flex flex-col items-center justify-center p-3 text-center">
                      <Gamepad2 className="w-12 h-12 text-indigo-400/60 mb-1" />
                      <span className="text-xs font-black text-white/90 truncate max-w-full">{game.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a1b] via-transparent to-black/40" />

                  {/* Genre Tag */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
                      {game.genre}
                    </span>
                  </div>

                  {/* Rating / Player stats */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white">
                    <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 font-semibold flex items-center gap-1 text-[11px]">
                      <Users className="w-3 h-3 text-emerald-400" />
                      <span>{game.playerCount || 'Aktif Oyuncular'}</span>
                    </span>
                    <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 font-bold flex items-center gap-1 text-[11px] text-amber-300">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{game.rating || '92%'}</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition-colors">
                      {game.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {canEditGame(game) && (
                        <button
                          onClick={() => {
                            setEditingGame(game);
                            setIsAddGameModalOpen(true);
                          }}
                          className="text-indigo-300 hover:text-white p-1 rounded-md hover:bg-indigo-950/50 transition-colors"
                          title="Oyunu Düzenle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canDeleteGame(game) && (
                        <button
                          onClick={() => {
                            requestDeleteGame(game);
                          }}
                          className="text-slate-400 hover:text-rose-400 p-1 rounded-md hover:bg-rose-950/30 transition-colors"
                          title="Oyunu Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-indigo-400/90 font-medium">
                    Geliştirici: {game.developer}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-purple-900/30 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleViewScripts(game.name)}
                  className="px-3 py-1.5 bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-xs font-bold rounded-xl border border-purple-700/40 transition-colors flex items-center gap-1.5"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Scriptleri Gör ({gameScriptsCount})</span>
                </button>

                <a
                  href={game.robloxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1 active:scale-95"
                >
                  <span>Roblox'ta Oyna</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
