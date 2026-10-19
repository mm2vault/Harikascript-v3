import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AvatarDisplay } from '../AvatarDisplay';
import { CoinIcon } from '../CoinIcon';
import { compressImageFile } from '../../utils/imageCompressor';
import {
  X,
  User,
  Upload,
  Coins,
  Crown,
  Gamepad2,
  Save,
  LogOut,
  ExternalLink,
  Settings,
  Gift,
  Key,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    user,
    updateProfile,
    showToast,
    isAuthorizedAdmin,
    logout,
    setActiveTab,
    setIsRedeemModalOpen,
    setIsTasksModalOpen
  } = useApp();

  const [username, setUsername] = useState(user.username);
  const [robloxUsername, setRobloxUsername] = useState(user.robloxUsername || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [isSaved, setIsSaved] = useState(false);

  // ProfileModal stays mounted even while hidden. Refresh its form fields when
  // Firebase finishes loading a different/current user's profile after login.
  useEffect(() => {
    setUsername(user.username || '');
    setRobloxUsername(user.robloxUsername || '');
    setBio(user.bio || '');
    setAvatarUrl(user.avatarUrl || '');
    setIsSaved(false);
  }, [user.uid, user.username, user.robloxUsername, user.bio, user.avatarUrl]);

  if (!isProfileModalOpen) return null;

  // Phone gallery / local image upload handler for avatar
  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 256, 256, 0.85);
      setAvatarUrl(compressed);
      showToast('Profil fotoğrafınız yüklendi! 📷');
    } catch {
      showToast('Profil resmi işlenemedi.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      showToast('Kullanıcı adı boş bırakılamaz!');
      return;
    }

    updateProfile({
      username: username.trim(),
      robloxUsername: robloxUsername.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim() || user.avatarUrl
    });
    setIsSaved(true);
    showToast('Profil bilgileriniz başarıyla güncellendi! ✨');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg flex flex-col rounded-3xl bg-[#0c0919] border border-purple-500/40 shadow-2xl overflow-hidden my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="relative p-5 bg-gradient-to-r from-purple-950/80 via-[#180e32] to-[#0c0919] border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarDisplay size="lg" avatarUrl={avatarUrl} showGlow={true} />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base sm:text-lg text-white">{user.username}</h3>
                {isAuthorizedAdmin && (
                  <span title="Yetkili Admin" className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black">
                    <Crown className="w-3 h-3 text-amber-400" /> ADMIN
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-300 font-medium mt-0.5">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <CoinIcon className="w-4 h-4" />
                  {user.coins.toLocaleString('tr-TR')} Coin
                </span>
                <span>•</span>
                <span className="text-slate-400">Lv. {user.level || 1}</span>
              </div>

              {/* XP Progress Bar */}
              <div className="pt-1.5 flex items-center gap-2">
                <div className="w-24 h-1.5 bg-purple-950 rounded-full overflow-hidden border border-purple-800/40">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-pink-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(10, ((user.xp || 0) / ((user.level || 1) * 150)) * 100))}%`
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {user.xp || 0} XP
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300 block">
                  Roblox Kullanıcı Adı
                </label>
                {robloxUsername && (
                  <a
                    href={`https://www.roblox.com/search/users?keyword=${encodeURIComponent(robloxUsername)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-purple-400 hover:text-pink-300 flex items-center gap-1 font-bold"
                  >
                    <span>Profili Gör</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="relative">
                <Gamepad2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={robloxUsername}
                  onChange={e => setRobloxUsername(e.target.value)}
                  placeholder="Roblox kullanıcı adınız (MM2 takasları için)"
                  className="w-full bg-[#130f25] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Hakkında & Biyografi
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="MM2 takas tercihlerin veya kendini tanıtan bir not..."
                className="w-full bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-purple-400 resize-none"
              />
            </div>

            {/* Avatar URL or Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Avatar Görseli
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  placeholder="https://... görsel bağlantısı"
                  className="flex-1 bg-[#130f25] text-xs text-white p-2.5 rounded-xl border border-purple-800/40 focus:outline-none focus:border-purple-400"
                />
                <label className="px-3 py-2.5 bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 rounded-xl text-purple-200 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5 text-purple-400" />
                  <span>Yükle</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Kaydedildi!' : 'Değişiklikleri Kaydet'}</span>
            </button>
          </form>

          {/* Quick Hub Navigation Shortcuts */}
          <div className="pt-2 border-t border-purple-900/40 grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                setActiveTab('settings');
              }}
              className="p-2.5 rounded-xl bg-[#130f25] hover:bg-purple-900/30 border border-purple-900/40 text-center transition-colors group"
            >
              <Settings className="w-4 h-4 text-purple-400 mx-auto mb-1 group-hover:rotate-45 transition-transform" />
              <span className="text-[10px] font-bold text-slate-300 block">Ayarlar</span>
            </button>

            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                setIsTasksModalOpen(true);
              }}
              className="p-2.5 rounded-xl bg-[#130f25] hover:bg-amber-900/30 border border-purple-900/40 text-center transition-colors group"
            >
              <Coins className="w-4 h-4 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-slate-300 block">Görevler</span>
            </button>

            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                setIsRedeemModalOpen(true);
              }}
              className="p-2.5 rounded-xl bg-[#130f25] hover:bg-pink-900/30 border border-purple-900/40 text-center transition-colors group"
            >
              <Key className="w-4 h-4 text-pink-400 mx-auto mb-1 group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-bold text-slate-300 block">Kupon Kodu</span>
            </button>
          </div>

          {/* Logout Action */}
          <div className="pt-1">
            <button
              onClick={() => {
                logout();
                setIsProfileModalOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/40 text-xs font-bold text-rose-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Oturumu Kapat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
