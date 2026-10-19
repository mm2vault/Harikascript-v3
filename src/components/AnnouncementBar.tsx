import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, X, Sparkles, Edit2, Check } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const {
    user,
    systemAnnouncement,
    updateSystemAnnouncement,
    isAnnouncementVisible,
    setIsAnnouncementVisible,
    isAuthorizedAdmin
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(systemAnnouncement);

  if (!isAnnouncementVisible) return null;

  const handleSave = () => {
    if (!tempText.trim()) return;
    updateSystemAnnouncement(tempText.trim());
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-950 via-[#1d0f36] to-indigo-950 border-b border-purple-800/40 px-2.5 sm:px-4 py-2 text-xs text-purple-200 shadow-lg relative z-30 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 min-w-0">
        
        {/* Left: Megaphone Badge & Announcement Message */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <div className="p-1 rounded-lg bg-pink-600/30 border border-pink-500/40 text-pink-300 shrink-0 animate-pulse">
            <Megaphone className="w-3.5 h-3.5" />
          </div>

          {isEditing ? (
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
              <input
                type="text"
                value={tempText}
                onChange={e => setTempText(e.target.value)}
                className="w-full bg-black/70 border border-purple-500/60 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none min-w-0"
                placeholder="Yeni duyuru metnini girin..."
                autoFocus
              />
              <button
                onClick={handleSave}
                className="px-2.5 sm:px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1 transition-colors shrink-0 text-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Yayınla</span>
              </button>
              <button
                onClick={() => {
                  setTempText(systemAnnouncement);
                  setIsEditing(false);
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0 text-xs"
              >
                İptal
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
              <span className="font-black text-amber-300 tracking-wider text-[10px] sm:text-xs shrink-0 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                DUYURU
              </span>
              <span className="text-slate-200 truncate text-[11px] sm:text-xs font-medium">
                {systemAnnouncement}
              </span>
            </div>
          )}
        </div>

        {/* Right: Actions (Admin Edit & Close Button) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isAuthorizedAdmin && !isEditing && (
            <button
              onClick={() => {
                setTempText(systemAnnouncement);
                setIsEditing(true);
              }}
              className="px-2 sm:px-2.5 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-600/40 flex items-center gap-1 transition-colors font-bold text-[11px]"
              title="Duyuruyu Düzenle"
            >
              <Edit2 className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Düzenle</span>
            </button>
          )}

          <button
            onClick={() => setIsAnnouncementVisible(false)}
            className="text-purple-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Duyuruyu Gizle"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
