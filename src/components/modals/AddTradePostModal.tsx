import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ArrowRightLeft, Plus, Gamepad2, Sparkles } from 'lucide-react';

interface AddTradePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGame?: string;
}

const POPULAR_GAMES = [
  { id: 'Blox Fruits', label: '🍎 Blox Fruits', color: 'from-amber-600 to-red-600', border: 'border-amber-500/50' },
  { id: 'MM2', label: '🗡️ Murder Mystery 2', color: 'from-red-600 to-purple-700', border: 'border-red-500/50' },
  { id: 'Adopt Me!', label: '🐾 Adopt Me!', color: 'from-pink-600 to-rose-600', border: 'border-pink-500/50' },
  { id: 'Pet Sim 99', label: '💎 Pet Simulator 99', color: 'from-blue-600 to-cyan-600', border: 'border-blue-500/50' },
  { id: 'Blade Ball', label: '⚔️ Blade Ball', color: 'from-purple-600 to-indigo-700', border: 'border-purple-500/50' }
];

const SUGGESTIONS: Record<string, string[]> = {
  'Blox Fruits': ['Kitsune', 'Dragon (Rework)', 'Leopard', 'Dough (Awakened)', 'T-Rex', 'Buddha', 'Portal', 'Dark Blade', '+1 Fruit Storage'],
  'MM2': ['Harvester', 'Gingerscope', "Traveler's Axe", 'Bat', 'Chroma Fang', 'Darksword', 'Icebreaker', 'Candy Set'],
  'Adopt Me!': ['Shadow Dragon', 'Bat Dragon', 'Frost Dragon', 'Giraffe', 'Owl', 'Neon Cow', 'Fly Ride Potion'],
  'Pet Sim 99': ['Titanic Pet', 'Huge Happy Rock', 'Huge Hell Rock', 'Exclusive Egg', '100M Diamonds'],
  'Blade Ball': ['Dual Dragon', 'Galaxy Scythe', 'Void Sword', 'Infinity Emote', 'Quantum Slash']
};

export const AddTradePostModal: React.FC<AddTradePostModalProps> = ({ isOpen, onClose, defaultGame = 'Blox Fruits' }) => {
  const { addTradePost, user } = useApp();

  const [selectedGame, setSelectedGame] = useState<string>(defaultGame);
  const [offeringInput, setOfferingInput] = useState('');
  const [lookingForInput, setLookingForInput] = useState('');
  const [offeringList, setOfferingList] = useState<string[]>([]);
  const [lookingForList, setLookingForList] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleAddOffering = (itemToAdd?: string) => {
    const val = (itemToAdd || offeringInput).trim();
    if (!val) return;
    if (!offeringList.includes(val)) {
      setOfferingList(prev => [...prev, val]);
    }
    if (!itemToAdd) setOfferingInput('');
  };

  const handleAddLooking = (itemToAdd?: string) => {
    const val = (itemToAdd || lookingForInput).trim();
    if (!val) return;
    if (!lookingForList.includes(val)) {
      setLookingForList(prev => [...prev, val]);
    }
    if (!itemToAdd) setLookingForInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offeringList.length === 0 || lookingForList.length === 0) {
      alert('Lütfen en az bir teklif ettiğin ve bir aradığın eşya ekle!');
      return;
    }

    addTradePost({
      game: selectedGame,
      author: user.username,
      authorAvatar: user.avatarUrl,
      authorEmail: user.email,
      offering: offeringList,
      lookingFor: lookingForList,
      notes: notes || 'Teklifler için canlı sohbette yazabilirsiniz.',
      status: 'Açık'
    });

    setOfferingList([]);
    setLookingForList([]);
    setNotes('');
    onClose();
  };

  const suggestions = SUGGESTIONS[selectedGame] || [];

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0e0a1f] border border-purple-500/40 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-lg text-white">Yeni Takas İlanı Yayınla</h3>
            <p className="text-xs text-purple-300">Roblox oyununda hangi eşyaları verip ne istediğini belirt</p>
          </div>
        </div>

        {/* Game Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Hangi Oyun İçin Takas?</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {POPULAR_GAMES.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGame(g.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border text-left truncate ${
                  selectedGame === g.id
                    ? `bg-gradient-to-r ${g.color} text-white ${g.border} shadow-md`
                    : 'bg-purple-950/30 border-purple-900/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        {suggestions.length > 0 && (
          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/30 space-y-1.5">
            <div className="flex items-center gap-1 text-[11px] font-bold text-purple-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Hızlı Ekle ({selectedGame}):</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestions.slice(0, 6).map((sugg) => (
                <div key={sugg} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleAddOffering(sugg)}
                    className="px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[10px] hover:bg-emerald-800/60 font-semibold"
                    title="Tekliflerine Ekle"
                  >
                    +Ver: {sugg}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddLooking(sugg)}
                    className="px-2 py-0.5 rounded-md bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[10px] hover:bg-amber-800/60 font-semibold"
                    title="Aradıklarına Ekle"
                  >
                    +Ara: {sugg}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Offering Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-400 block">
              1. Teklif Ettiğin Eşyalar (Verdiklerin):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={offeringInput}
                onChange={(e) => setOfferingInput(e.target.value)}
                placeholder="Örn: Kitsune, Dough, Bat..."
                className="flex-1 p-2.5 rounded-xl bg-[#140e2d] border border-emerald-500/40 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddOffering()}
                className="px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </div>
            {/* Added chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {offeringList.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5 font-bold"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => setOfferingList(prev => prev.filter((_, i) => i !== idx))}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Looking For Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-400 block">
              2. Karşılığında Aradığın Eşyalar (İstediklerin):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={lookingForInput}
                onChange={(e) => setLookingForInput(e.target.value)}
                placeholder="Örn: Harvester, Gingerscope, Waves..."
                className="flex-1 p-2.5 rounded-xl bg-[#140e2d] border border-amber-500/40 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddLooking()}
                className="px-3 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </div>
            {/* Added chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {lookingForList.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-1.5 font-bold"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => setLookingForList(prev => prev.filter((_, i) => i !== idx))}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-slate-300 block mb-1">Takas Notun / Açıklama:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Overpay aranır, canlı sohbette yazabilirsiniz."
              className="w-full p-2.5 rounded-xl bg-[#140e2d] border border-purple-700/40 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all"
            >
              İlanı Yayınla 📢
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-slate-800 text-slate-300 text-xs rounded-xl"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
