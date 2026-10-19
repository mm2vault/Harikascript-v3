import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trash2, X } from 'lucide-react';

export const ConfirmDeleteModal: React.FC = () => {
  const { deleteTarget, setDeleteTarget, confirmDelete } = useApp();

  if (!deleteTarget) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0d091e] border border-rose-500/50 shadow-2xl p-5 space-y-4 text-center">
        <button
          onClick={() => setDeleteTarget(null)}
          className="absolute top-3 right-3 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
          <Trash2 className="w-6 h-6 animate-bounce" />
        </div>

        <div className="space-y-1">
          <h3 className="font-extrabold text-base text-white">Silmeyi Onayla</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-rose-400">{deleteTarget.name}</strong> öğesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={() => setDeleteTarget(null)}
            className="py-2.5 px-4 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-slate-300 font-bold text-xs border border-purple-800/40 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={() => confirmDelete()}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs shadow-lg shadow-rose-950/50 transition-all active:scale-95"
          >
            Evet, Sil
          </button>
        </div>
      </div>
    </div>
  );
};
