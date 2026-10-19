import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReportItem } from '../../types';
import { X, AlertCircle, Send, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';

export const SubmitReportModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, submitReport } = useApp();

  const [category, setCategory] = useState<ReportItem['category']>('Bug / Hata');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReportModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    await submitReport(category, title.trim(), description.trim());
    setIsSubmitting(false);
    setTitle('');
    setDescription('');
    setIsReportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0e0a1f] border border-purple-500/50 p-5 sm:p-6 space-y-4 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-[#0c081c] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Yöneticiye Bildir / Rapor Et</h3>
              <p className="text-[11px] text-slate-400">Sitede bulduğunuz hataları veya isteklerinizi bildirin</p>
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] text-slate-300 font-bold block mb-1">Rapor Kategorisi:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReportItem['category'])}
              className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-rose-500"
            >
              <option value="Bug / Hata">Bug / Yazılımsal Hata</option>
              <option value="İçerik / Script">İçerik / Bozuk Script</option>
              <option value="Taciz / Spam">Taciz / Uygunsuz Davranış</option>
              <option value="Öneri / İstek">Öneri / Yeni Özellik İsteği</option>
              <option value="Diğer">Diğer Konular</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-bold block mb-1">Konu Başlığı:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: X scripti çalışmıyor veya buton hatası..."
              className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-bold block mb-1">Detaylı Açıklama:</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Karşılaştığınız sorunu veya önerinizi detaylıca anlatın..."
              className="w-full bg-[#130f24] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Gönderiliyor...' : 'Raporu Yöneticiye Gönder'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
