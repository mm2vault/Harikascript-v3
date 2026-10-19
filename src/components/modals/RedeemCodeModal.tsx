import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_LOGO_URL } from '../../constants/branding';
import { CoinIcon } from '../CoinIcon';
import { Gift, X, Sparkles, CheckCircle2, AlertCircle, Coins, Key, ArrowRight, PlusCircle } from 'lucide-react';

export const RedeemCodeModal: React.FC = () => {
  const {
    isRedeemModalOpen,
    setIsRedeemModalOpen,
    redeemPromoCode,
    promoCodes,
    addPromoCode,
    user,
    isAuthorizedAdmin
  } = useApp();

  const [code, setCode] = useState('');
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAdminAdd, setShowAdminAdd] = useState(false);
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeCoins, setNewCodeCoins] = useState(250);
  const [newCodeDesc, setNewCodeDesc] = useState('');

  if (!isRedeemModalOpen) return null;

  const handleRedeem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;

    const res = redeemPromoCode(code.trim());
    if (res.success) {
      setResultMessage({ type: 'success', text: res.message });
      setCode('');
    } else {
      setResultMessage({ type: 'error', text: res.message });
    }
  };

  const handleQuickFill = (c: string) => {
    setCode(c);
    setResultMessage(null);
  };

  const handleAdminCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeName.trim()) return;
    addPromoCode({
      code: newCodeName.trim().toUpperCase(),
      rewardCoins: Number(newCodeCoins) || 100,
      description: newCodeDesc || `${newCodeCoins} Bedava Coin Hediyesi`
    });
    setNewCodeName('');
    setNewCodeCoins(250);
    setNewCodeDesc('');
    setShowAdminAdd(false);
    setResultMessage({ type: 'success', text: 'Yeni promosyon kodu başarıyla yayınlandı!' });
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0e0a1f] border border-purple-500/50 p-5 sm:p-6 space-y-4 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsRedeemModalOpen(false);
            setResultMessage(null);
          }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-lg shadow-pink-500/30 flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#0c081c] flex items-center justify-center">
              <Gift className="w-6 h-6 text-pink-400 animate-bounce" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-lg text-white">Promosyon & Hediye Kodu</h3>
            <p className="text-xs text-purple-300">Özel kupon kodunu gir, anında hediye Coin kazan!</p>
          </div>
        </div>

        {/* Code Input Form */}
        <form onSubmit={handleRedeem} className="space-y-3 pt-1">
          <div className="relative">
            <Key className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setResultMessage(null);
              }}
              placeholder="ÖRN: HARIKA2026"
              className="w-full bg-[#140e2d] border border-purple-500/40 rounded-2xl pl-10 pr-24 py-3 text-white font-mono text-sm tracking-wider uppercase placeholder:text-slate-500 focus:outline-none focus:border-pink-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={!code.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs rounded-xl transition-all disabled:opacity-40 flex items-center gap-1 active:scale-95 shadow-md"
            >
              <span>Kullan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feedback Alert */}
          {resultMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                resultMessage.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/60 border border-rose-500/50 text-rose-300'
              }`}
            >
              {resultMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{resultMessage.text}</span>
            </div>
          )}
        </form>

        {/* Available / Active Quick Codes List */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Aktif Kuponlar (Tek Tıkla Dene):</span>
            </span>
            <span className="text-[10px] text-purple-300">Günde 1 kez</span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
            {promoCodes.map((item) => {
              const isUsed = user.completedTaskIds?.includes(`code_${item.code.toUpperCase()}`);
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleQuickFill(item.code)}
                  className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isUsed
                      ? 'bg-purple-950/20 border-purple-900/30 opacity-60'
                      : 'bg-[#150f30] hover:bg-purple-900/40 border-purple-700/40 hover:border-pink-500/60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono font-bold text-xs text-pink-300">{item.code}</span>
                    <span className="text-[10px] text-amber-300 font-extrabold flex items-center gap-1">
                      <CoinIcon className="w-3 h-3" />
                      +{item.rewardCoins}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 truncate mt-0.5">{item.description}</span>
                  {isUsed && (
                    <span className="text-[9px] text-emerald-400 font-bold mt-1">✓ Kullanıldı</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin Section: Create New Code */}
        {isAuthorizedAdmin && (
          <div className="pt-2 border-t border-purple-900/40">
            {!showAdminAdd ? (
              <button
                type="button"
                onClick={() => setShowAdminAdd(true)}
                className="w-full py-2 px-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-900/50 transition-colors flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Yönetici: Yeni Kupon Kodu Ekle</span>
              </button>
            ) : (
              <form onSubmit={handleAdminCreate} className="p-3 rounded-2xl bg-black/40 border border-amber-500/40 space-y-2">
                <div className="text-[11px] font-bold text-amber-300">Yeni Kupon Oluştur</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newCodeName}
                    onChange={(e) => setNewCodeName(e.target.value.toUpperCase())}
                    placeholder="Kod (örn. VIP2026)"
                    className="p-2 rounded-lg bg-[#140e2d] border border-purple-700/40 text-xs text-white"
                  />
                  <input
                    type="number"
                    value={newCodeCoins}
                    onChange={(e) => setNewCodeCoins(Number(e.target.value))}
                    placeholder="Coin Ödülü"
                    className="p-2 rounded-lg bg-[#140e2d] border border-purple-700/40 text-xs text-white"
                  />
                </div>
                <input
                  type="text"
                  value={newCodeDesc}
                  onChange={(e) => setNewCodeDesc(e.target.value)}
                  placeholder="Açıklama (örn. Özel Discord Etkinlik Kodu)"
                  className="w-full p-2 rounded-lg bg-[#140e2d] border border-purple-700/40 text-xs text-white"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-xs rounded-lg"
                  >
                    Kodu Kaydet & Yayınla
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdminAdd(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
                  >
                    Vazgeç
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
