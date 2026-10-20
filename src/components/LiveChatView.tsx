import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, doc, setDoc } from 'firebase/firestore';
import { APP_LOGO_URL } from '../constants/branding';
import { MessageSquare, Send, Sparkles, Shield, Crown, Flame, Zap, User, ArrowLeft, Lock } from 'lucide-react';

interface ChatMessage {
  id?: string;
  senderName: string;
  senderUid: string;
  senderEmail: string;
  isAdmin: boolean;
  avatarUrl: string;
  text: string;
  timestamp: string;
}

const QUICK_MESSAGES = [
  'Elinde Godly / Ancient olan var mı? 🗡️',
  'En iyi çalışan executor hangisi? ⚡',
  'Yeni script yükledim, onay bekliyor 📜',
  'Biri bana trade konusunda yardım edebilir mi? ⚖️',
  'Herkese iyi oyunlar! 🚀'
];

export const LiveChatView: React.FC = () => {
  const { user, showToast, setIsAuthModalOpen, isAuthorizedAdmin } = useApp();
  const [activeTab, setActiveTab] = useState<'global' | 'dm'>('global');
  const [targetUser, setTargetUser] = useState<{ uid: string; name: string; email: string; avatarUrl: string } | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestMessageIdRef = useRef<string | null>(null);

  // Use Firebase UIDs, not reversible base64 emails, for private room IDs.
  const getDmRoomId = (uid1: string, uid2: string) => {
    const sorted = [uid1, uid2].sort();
    return `dm_${sorted[0]}_${sorted[1]}`;
  };

  const playMsgChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  // Sync messages (Global or DM)
  useEffect(() => {
    let colRef;
    if (activeTab === 'global') {
      colRef = query(collection(db, 'chat_messages'), orderBy('timestamp', 'desc'), limit(60));
    } else if (targetUser && user.email) {
      const roomId = getDmRoomId(user.uid, targetUser.uid);
      colRef = query(collection(db, 'direct_messages', roomId, 'messages'), orderBy('timestamp', 'desc'), limit(60));
    } else {
      return;
    }

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
        });
        const latestMessageId = list[0]?.id || null;
        if (latestMessageIdRef.current && latestMessageId && latestMessageId !== latestMessageIdRef.current) {
          playMsgChime();
        }
        latestMessageIdRef.current = latestMessageId;
        // Query newest messages first, then render them chronologically.
        setMessages(list.reverse());
        scrollToBottom();
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, activeTab === 'global' ? 'chat_messages' : 'direct_messages');
      }
    );

    return () => unsubscribe();
  }, [activeTab, targetUser?.uid, targetUser?.email, user.uid, user.email]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenDm = async (uid: string, name: string, email: string, avatarUrl: string) => {
    if (!auth.currentUser || auth.currentUser.uid !== user.uid || !user.email) {
      showToast('Özel sohbet başlatmak için Firebase hesabınızla giriş yapmalısınız.');
      setIsAuthModalOpen(true);
      return;
    }
    if (!uid) {
      showToast('Bu eski mesajda kullanıcı kimliği yok. Kullanıcı yeni bir mesaj yazdıktan sonra özel sohbet açılabilir.');
      return;
    }
    if (uid === user.uid || email.toLowerCase().trim() === user.email.toLowerCase().trim()) {
      showToast('Kendi kendinizle özel sohbet açamazsınız!');
      return;
    }

    const roomId = getDmRoomId(user.uid, uid);
    const participantUids = [user.uid, uid].sort();
    const participantEmails = [user.email.toLowerCase().trim(), email.toLowerCase().trim()].sort();
    try {
      await setDoc(doc(db, 'direct_messages', roomId), { participantUids, participantEmails }, { merge: true });
      setTargetUser({ uid, name, email, avatarUrl });
      setActiveTab('dm');
      showToast(`${name} ile özel oda açıldı! 💬`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `direct_messages/${roomId}`);
      showToast('Özel sohbet açılamadı. Girişini ve bağlantını kontrol et.');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim() || isSending) return;

    if (!user.email) {
      showToast('Sohbette mesaj yazmak için lütfen giriş yapın.');
      return;
    }

    const newMsg: ChatMessage = {
      senderName: user.username,
      senderUid: user.uid,
      senderEmail: user.email,
      isAdmin: isAuthorizedAdmin,
      avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: content.trim(),
      timestamp: new Date().toISOString()
    };

    setIsSending(true);
    if (!textToSend) setInputText('');

    try {
      if (activeTab === 'global') {
        await addDoc(collection(db, 'chat_messages'), newMsg);
      } else if (targetUser) {
        const roomId = getDmRoomId(user.uid, targetUser.uid);
        const participantUids = [user.uid, targetUser.uid].sort();
        const participantEmails = [user.email.toLowerCase().trim(), targetUser.email.toLowerCase().trim()].sort();
        await setDoc(doc(db, 'direct_messages', roomId), { participantUids, participantEmails }, { merge: true });
        await addDoc(collection(db, 'direct_messages', roomId, 'messages'), newMsg);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, activeTab === 'global' ? 'chat_messages' : 'direct_messages');
      setMessages((prev) => [...prev, newMsg]);
    } finally {
      setIsSending(false);
      scrollToBottom();
    }
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/90 via-[#150d30] to-[#0c081c] border border-purple-500/40 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500/40 text-purple-300 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
            <span>Firebase Canlı Sohbet & Özel Mesajlaşma (DM)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            Topluluk <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300">Sohbet & Özel Oda</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Canlı sohbette herhangi bir kullanıcının adına tıklayarak onunla baş başa özel odaya (DM) geçebilir, güvenli şekilde konuşabilirsiniz!
          </p>
        </div>

        {/* Logo Badge */}
        <div className="relative group flex items-center justify-center shrink-0">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0e0a1c] border-2 border-purple-500/50 p-1 shadow-2xl overflow-hidden flex items-center justify-center">
            <img src={APP_LOGO_URL} alt="Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Global vs DM */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setActiveTab('global');
            setTargetUser(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'global'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/40'
              : 'bg-[#0e0b1f] text-slate-300 border border-purple-900/40 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
          <span>Global Sohbet Odası</span>
        </button>

        {targetUser && (
          <button
            onClick={() => setActiveTab('dm')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'dm'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-950/40'
                : 'bg-[#0e0b1f] text-slate-300 border border-purple-900/40 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Özel Oda: {targetUser.name}</span>
          </button>
        )}
      </div>

      {/* Quick Message Shortcuts (Only in Global) */}
      {activeTab === 'global' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-bold shrink-0">Hızlı Mesajlar:</span>
          {QUICK_MESSAGES.map(qm => (
            <button
              key={qm}
              onClick={() => handleSendMessage(qm)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0e0b1f] hover:bg-purple-900/50 text-slate-200 border border-purple-900/40 hover:border-pink-500/50 transition-all whitespace-nowrap active:scale-95"
            >
              {qm}
            </button>
          ))}
        </div>
      )}

      {/* Chat Box Container */}
      <div className="flex flex-col rounded-2xl bg-[#0c0919] border border-purple-900/40 h-[520px] shadow-2xl overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-3.5 bg-purple-950/60 border-b border-purple-900/40 flex items-center justify-between text-xs">
          {activeTab === 'global' ? (
            <div className="flex items-center gap-2 text-white font-extrabold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>HarikaScript Global Chat (Birinin üstüne basarak özel odaya geçebilirsin!)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-white font-extrabold">
              <button
                onClick={() => {
                  setActiveTab('global');
                  setTargetUser(null);
                }}
                className="p-1 rounded-lg bg-purple-900/40 text-purple-200 hover:text-white mr-1"
                title="Global Sohbet'e Dön"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Özel Fısıltı Odası: <span className="text-pink-300">{targetUser?.name}</span></span>
            </div>
          )}

          <span className="text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded font-bold border border-purple-700/40">
            {messages.length} Mesaj
          </span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs space-y-1">
              <MessageSquare className="w-8 h-8 text-purple-500/40 animate-pulse" />
              <p>
                {activeTab === 'global'
                  ? 'Henüz mesaj yok. İlk mesajı sen gönder!'
                  : `${targetUser?.name} ile özel oda başlatıldı. İlk mesajı yazarak konuşmaya başlayın!`}
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderEmail === user.email;

              return (
                <div
                  key={msg.id || idx}
                  className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-8 h-8 rounded-xl overflow-hidden bg-purple-950 border border-purple-600/40 shrink-0">
                    <img src={msg.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} alt="Avatar" className="w-full h-full object-cover" />
                  </div>

                  <div className={`max-w-[80%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-md ${
                    isMe
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                      : 'bg-[#150f2e] border border-purple-800/40 text-slate-100 rounded-tl-none'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {/* Clickable username to open private DM */}
                      <span
                        onClick={() => {
                          if (!isMe) {
                            handleOpenDm(msg.senderUid || '', msg.senderName, msg.senderEmail, msg.avatarUrl);
                          }
                        }}
                        className={`font-extrabold text-[11px] text-pink-300 ${!isMe ? 'cursor-pointer hover:underline hover:text-pink-200' : ''}`}
                        title={!isMe ? `${msg.senderName} ile özel odaya geç` : undefined}
                      >
                        {msg.senderName} {!isMe && '(Özel Odaya Geç 💬)'}
                      </span>

                      {msg.isAdmin && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-black">
                          Admin 👑
                        </span>
                      )}
                      <span className="text-[9px] text-slate-400 ml-auto">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="leading-relaxed break-all sm:break-words">{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        {!user.email ? (
          <div className="p-3 bg-purple-950/40 border-t border-purple-900/40 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-300">Sohbette mesaj yazmak için giriş yapmanız gerekmektedir.</span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs shadow-md transition-all shrink-0 active:scale-95"
            >
              Giriş Yap
            </button>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-purple-950/40 border-t border-purple-900/40 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={
                activeTab === 'global'
                  ? 'Global sohbete mesaj yazın...'
                  : `${targetUser?.name} ile özel sohbete yazın...`
              }
              disabled={isSending}
              className="flex-1 bg-[#08060f] text-xs text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-purple-800/40 focus:border-pink-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gönder</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
