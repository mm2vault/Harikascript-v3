import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRightLeft, Plus, Trash2, CheckCircle2, AlertTriangle, Sparkles, Flame, ShieldAlert, RefreshCw, Copy, Check } from 'lucide-react';
import { MM2Item, BloxFruitItem } from '../types';

export const TradeCalculatorView: React.FC = () => {
  const { mm2Items, bloxItems, showToast } = useApp();

  const [gameMode, setGameMode] = useState<'mm2' | 'blox'>('mm2');
  const [myOffer, setMyOffer] = useState<(MM2Item | BloxFruitItem)[]>([]);
  const [theirOffer, setTheirOffer] = useState<(MM2Item | BloxFruitItem)[]>([]);

  const [isPickingFor, setIsPickingFor] = useState<'mine' | 'theirs' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Calculate totals
  const myTotal = myOffer.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  const theirTotal = theirOffer.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

  const diff = theirTotal - myTotal;
  const percentDiff = myTotal > 0 ? ((diff / myTotal) * 100).toFixed(1) : '0';

  const getFairness = () => {
    if (myOffer.length === 0 && theirOffer.length === 0) return { label: 'Öğe Seçilmedi', color: 'text-slate-400 bg-slate-900/60 border-slate-700/50', desc: 'Takas hesaplamak için her iki tarafa da eşya ekleyin.' };
    const ratio = myTotal > 0 ? theirTotal / myTotal : theirTotal > 0 ? 999 : 1;

    if (ratio >= 1.15) {
      return { label: 'BÜYÜK KAZANÇ (BIG WIN 🟢)', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50 shadow-emerald-900/50', desc: `Bu takasta karşı taraftan yaklaşık +${diff.toLocaleString('tr-TR')} daha fazla değer alıyorsunuz!` };
    } else if (ratio >= 1.03) {
      return { label: 'KAZANÇLI (WIN 🟢)', color: 'text-green-300 bg-green-950/80 border-green-500/50 shadow-green-900/50', desc: 'Az bir farkla karlı bir takas.' };
    } else if (ratio >= 0.97 && ratio <= 1.03) {
      return { label: 'ADİL (FAIR 🤝)', color: 'text-amber-300 bg-amber-950/80 border-amber-500/50 shadow-amber-900/50', desc: 'İki taraf için de dengeli ve adil bir takas!' };
    } else if (ratio >= 0.85) {
      return { label: 'KAYIP (LOSE 🔴)', color: 'text-orange-300 bg-orange-950/80 border-orange-500/50 shadow-orange-900/50', desc: 'Bu takasta biraz değer kaybediyorsunuz.' };
    } else {
      return { label: 'BÜYÜK ZARAR (BIG LOSE 🚨)', color: 'text-rose-300 bg-rose-950/80 border-rose-500/50 shadow-rose-900/50', desc: 'Dikkat! Bu takasta ciddi oranda değer kaybediyorsunuz.' };
    }
  };

  const fairness = getFairness();

  const handleAddItem = (item: MM2Item | BloxFruitItem) => {
    if (isPickingFor === 'mine') {
      setMyOffer(prev => [...prev, item]);
    } else if (isPickingFor === 'theirs') {
      setTheirOffer(prev => [...prev, item]);
    }
    setIsPickingFor(null);
    setSearchQuery('');
  };

  const handleRemoveMyItem = (index: number) => {
    setMyOffer(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveTheirItem = (index: number) => {
    setTheirOffer(prev => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setMyOffer([]);
    setTheirOffer([]);
    showToast('Takas hesaplayıcısı sıfırlandı.');
  };

  const handleCopySummary = () => {
    const text = `⚖️ HarikaScript Takas Raporu (${gameMode.toUpperCase()})\n` +
      `Sizin Teklifiniz (${myTotal.toLocaleString('tr-TR')}): ${myOffer.map(i => i.name).join(', ') || 'Yok'}\n` +
      `Karşı Tarafın Teklifi (${theirTotal.toLocaleString('tr-TR')}): ${theirOffer.map(i => i.name).join(', ') || 'Yok'}\n` +
      `Sonuç: ${fairness.label}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Takas özeti panoya kopyalandı!');
    setTimeout(() => setCopied(false), 2500);
  };

  const availableItems = gameMode === 'mm2' ? mm2Items : bloxItems;
  const filteredAvailableItems = availableItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-[#160d2e] to-indigo-950 border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-extrabold">
              <ArrowRightLeft className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>HarikaScript Gelişmiş Takas Simülatörü</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Takas Hesap Makinesi (Trade Calculator)
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/85 max-w-2xl leading-relaxed">
              MM2 ve Blox Fruits takaslarınızın adil olup olmadığını anlık olarak hesaplayın. Zarar etmeyin, akıllı takas yapın!
            </p>
          </div>

          {/* Game Switcher Tabs */}
          <div className="flex items-center gap-2 bg-[#120a24] p-1.5 rounded-2xl border border-purple-600/40 shadow-xl">
            <button
              onClick={() => { setGameMode('mm2'); setMyOffer([]); setTheirOffer([]); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                gameMode === 'mm2' ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-red-300" />
              <span>MM2</span>
            </button>
            <button
              onClick={() => { setGameMode('blox'); setMyOffer([]); setTheirOffer([]); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                gameMode === 'blox' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Blox Fruits</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fairness Status Banner */}
      <div className={`rounded-3xl border p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${fairness.color}`}>
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-black uppercase tracking-wider opacity-80">Takas Değerlendirmesi</div>
          <div className="text-xl sm:text-2xl font-black tracking-tight">{fairness.label}</div>
          <div className="text-xs opacity-90">{fairness.desc}</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopySummary}
            className="px-4 py-2.5 bg-black/40 hover:bg-black/60 rounded-2xl border border-white/20 text-xs font-extrabold flex items-center gap-2 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kopyalandı!' : 'Raporu Kopyala'}</span>
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-black/40 hover:bg-black/60 rounded-2xl border border-white/20 text-xs font-extrabold flex items-center gap-2 transition-all"
            title="Sıfırla"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Offers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* MY OFFER */}
        <div className="bg-[#120a24] border border-purple-900/50 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-extrabold text-white text-base">Sizin Teklifiniz (My Offer)</h3>
              </div>
              <div className="px-3 py-1 rounded-xl bg-purple-900/40 border border-purple-500/40 text-purple-200 font-mono font-black text-sm">
                Değer: {myTotal.toLocaleString('tr-TR')}
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2.5 min-h-[180px] max-h-[320px] overflow-y-auto pr-1">
              {myOffer.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-xs text-center border-2 border-dashed border-purple-900/40 rounded-2xl">
                  <Plus className="w-8 h-8 mb-2 opacity-40" />
                  <span>Henüz eşya eklemediniz. Aşağıdaki butondan ekleyin.</span>
                </div>
              ) : (
                myOffer.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-center justify-between p-3 rounded-2xl bg-[#1c1236] border border-purple-700/30 group">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-black/40 border border-purple-500/30 shrink-0" />
                      <div>
                        <div className="font-extrabold text-white text-xs sm:text-sm">{item.name}</div>
                        <div className="text-[10px] text-purple-300">{item.type} • {item.demand || 'Normal'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-amber-400 text-xs">{Number(item.value).toLocaleString('tr-TR')}</span>
                      <button
                        onClick={() => handleRemoveMyItem(index)}
                        className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition-colors"
                        title="Kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-purple-900/40">
            <button
              onClick={() => setIsPickingFor('mine')}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Sizin Teklifinize Eşya Ekle</span>
            </button>
          </div>
        </div>

        {/* THEIR OFFER */}
        <div className="bg-[#120a24] border border-purple-900/50 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-400 animate-pulse" />
                <h3 className="font-extrabold text-white text-base">Karşı Tarafın Teklifi (Their Offer)</h3>
              </div>
              <div className="px-3 py-1 rounded-xl bg-purple-900/40 border border-purple-500/40 text-purple-200 font-mono font-black text-sm">
                Değer: {theirTotal.toLocaleString('tr-TR')}
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2.5 min-h-[180px] max-h-[320px] overflow-y-auto pr-1">
              {theirOffer.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-xs text-center border-2 border-dashed border-purple-900/40 rounded-2xl">
                  <Plus className="w-8 h-8 mb-2 opacity-40" />
                  <span>Karşı tarafın teklifini eklemek için tıklayın.</span>
                </div>
              ) : (
                theirOffer.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-center justify-between p-3 rounded-2xl bg-[#1c1236] border border-purple-700/30 group">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-black/40 border border-purple-500/30 shrink-0" />
                      <div>
                        <div className="font-extrabold text-white text-xs sm:text-sm">{item.name}</div>
                        <div className="text-[10px] text-purple-300">{item.type} • {item.demand || 'Normal'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-amber-400 text-xs">{Number(item.value).toLocaleString('tr-TR')}</span>
                      <button
                        onClick={() => handleRemoveTheirItem(index)}
                        className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition-colors"
                        title="Kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-purple-900/40">
            <button
              onClick={() => setIsPickingFor('theirs')}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Karşı Tarafa Eşya Ekle</span>
            </button>
          </div>
        </div>

      </div>

      {/* Item Picker Modal */}
      {isPickingFor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#120a24] border border-purple-500/50 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40 shrink-0">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{isPickingFor === 'mine' ? 'Sizin Teklifiniz İçin Eşya Seçin' : 'Karşı Taraf İçin Eşya Seçin'} ({gameMode.toUpperCase()})</span>
              </h3>
              <button
                onClick={() => { setIsPickingFor(null); setSearchQuery(''); }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Search Bar */}
            <div className="shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Eşya adıyla ara (Örn: Kitsune, Chroma, Darkbringer)..."
                className="w-full bg-[#1c1438] border border-purple-700/50 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                autoFocus
              />
            </div>

            {/* Items Grid to Pick */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1 max-h-[50vh]">
              {filteredAvailableItems.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-slate-500 text-xs">Arama kriterine uygun eşya bulunamadı.</div>
              ) : (
                filteredAvailableItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#1c1236]/80 hover:bg-purple-900/40 border border-purple-700/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-black/40 border border-purple-500/30 group-hover:scale-105 transition-transform shrink-0" />
                      <div>
                        <div className="font-extrabold text-white text-xs group-hover:text-pink-300 transition-colors">{item.name}</div>
                        <div className="text-[10px] text-purple-300">{item.type} • {item.demand || 'Normal'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-400 text-xs">{Number(item.value).toLocaleString('tr-TR')}</div>
                      <span className="text-[10px] text-purple-400 opacity-80 group-hover:underline">+ Ekle</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-purple-900/40 flex justify-end shrink-0">
              <button
                onClick={() => { setIsPickingFor(null); setSearchQuery(''); }}
                className="px-5 py-2.5 rounded-xl bg-purple-950/60 text-slate-300 hover:text-white text-xs font-bold"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
