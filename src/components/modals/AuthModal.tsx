import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_LOGO_URL } from '../../constants/branding';
import { isAuthorizedAdminEmail } from '../../constants/auth';
import {
  X,
  Shield,
  Crown,
  User,
  Mail,
  ArrowRight,
  Sparkles,
  Key
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, loginWithEmail, showToast } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.warn('Firebase Sign-In notice:', error);
      showToast('Google Giriş penceresi açılamadı veya engellendi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      showToast('Lütfen e-posta adresinizi girin.');
      return;
    }
    loginWithEmail(cleanEmail, usernameInput.trim() || cleanEmail.split('@')[0], passcodeInput.trim());
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md flex flex-col rounded-3xl bg-[#0c0919] border border-purple-500/40 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950/80 via-[#180e32] to-[#0c0919] border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 p-0.5 shadow-md shadow-purple-500/20 overflow-hidden flex items-center justify-center">
              <img src={APP_LOGO_URL} alt="HarikaScript Logo" className="w-full h-full object-cover rounded-[8px]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">HarikaScript Girişi</h3>
              <p className="text-[11px] text-slate-400">Google veya E-Posta ile Güvenli Bağlanın</p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* Google Sign-In Button */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm shadow-lg shadow-white/10 transition-all flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'Google ile Bağlanılıyor...' : 'Google ile Giriş Yap'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-purple-900/40 w-full" />
            <span className="bg-[#0c0919] px-3 text-[11px] text-slate-500 uppercase font-semibold">veya e-posta ile</span>
            <div className="border-t border-purple-900/40 w-full" />
          </div>

          {/* Form for Standard Username & Email Login */}
          <form onSubmit={handleStandardLogin} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">E-Posta Adresi</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="e-postaniz@gmail.com"
                  className="w-full bg-[#130f25] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-purple-800/40 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {isAuthorizedAdminEmail(emailInput) && (
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-xs font-extrabold">Yönetici Doğrulama Anahtarı</span>
                </div>
                <p className="text-[10px] text-amber-200/80">
                  Yetkili yönetici hesabınız için güvenlik anahtarını girin.
                </p>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                  <input
                    type="password"
                    required
                    value={passcodeInput}
                    onChange={e => setPasscodeInput(e.target.value)}
                    placeholder="Admin Güvenlik Anahtarı"
                    className="w-full bg-[#130f25] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-amber-500/50 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Kullanıcı Adı (İsteğe Bağlı)</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  placeholder="Roblox Oyuncusu"
                  className="w-full bg-[#130f25] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-purple-800/40 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Giriş Yap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
