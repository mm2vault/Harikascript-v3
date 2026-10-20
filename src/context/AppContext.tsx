import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  db,
  auth,
  googleProvider,
  signInWithRedirect,
  setPersistence,
  browserLocalPersistence,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateFirebaseAuthProfile,
  handleFirestoreError,
  OperationType
} from '../firebase';
import { apiFetch } from '../utils/api';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  isAuthorizedAdmin as checkIsAdmin,
  isAuthorizedAdminEmail
} from '../constants/auth';
import {
  sendNativeNotification,
  requestNotificationPermission,
  getNotificationPermission,
  sendNewScriptNotification
} from '../utils/notifications';
import {
  UserProfile,
  CosmeticItem,
  ScriptItem,
  RobloxGame,
  ExecutorItem,
  TaskItem,
  NotificationItem,
  MM2Item,
  BloxFruitItem,
  PromoCodeItem,
  SongItem,
  TradePostItem,
  MysteryCase,
  CaseReward,
  AuditLogItem,
  SystemConfig,
  ValueCategory,
  UnifiedValueItem,
  ReportItem
} from '../types';
import {
  INITIAL_USER,
  INITIAL_COMMUNITY_USERS,
  INITIAL_COSMETICS,
  INITIAL_SCRIPTS,
  INITIAL_GAMES,
  INITIAL_EXECUTORS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MM2_ITEMS,
  INITIAL_BLOX_FRUITS,
  INITIAL_PROMO_CODES,
  INITIAL_SONGS,
  INITIAL_TRADE_POSTS,
  MYSTERY_CASES,
  INITIAL_PS99_CATEGORIES,
  INITIAL_PS99_PETS
} from '../data/initialData';
import {
  playCoinSound,
  playCaseTickSound,
  playCaseWinSound,
  playLevelUpSound,
  playScriptCopySound,
  setSoundMuted,
  getSoundMuted
} from '../utils/soundEffects';

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  allUsers: UserProfile[];
  scripts: ScriptItem[];
  games: RobloxGame[];
  cosmetics: CosmeticItem[];
  executors: ExecutorItem[];
  tasks: TaskItem[];
  notifications: NotificationItem[];
  valueCategories: ValueCategory[];
  valueItems: UnifiedValueItem[];
  promoCodes: PromoCodeItem[];
  songs: SongItem[];
  tradePosts: TradePostItem[];
  mysteryCases: MysteryCase[];
  mm2Items: MM2Item[];
  bloxItems: BloxFruitItem[];
  editingMM2Item: MM2Item | null;
  setEditingMM2Item: (item: MM2Item | null) => void;
  editingBloxFruit: BloxFruitItem | null;
  setEditingBloxFruit: (fruit: BloxFruitItem | null) => void;
  addMM2Item: (item: Omit<MM2Item, 'id'>) => Promise<void>;
  updateMM2Item: (id: string, updates: Partial<MM2Item>) => Promise<void>;
  deleteMM2Item: (id: string) => Promise<void>;
  addBloxFruit: (item: Omit<BloxFruitItem, 'id'>) => Promise<void>;
  updateBloxFruit: (id: string, updates: Partial<BloxFruitItem>) => Promise<void>;
  deleteBloxFruit: (id: string) => Promise<void>;
  
  // UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedGameFilter: string | null;
  setSelectedGameFilter: (gameName: string | null) => void;
  selectedScript: ScriptItem | null;
  setSelectedScript: (script: ScriptItem | null) => void;
  selectedMM2Item: MM2Item | null;
  setSelectedMM2Item: (item: MM2Item | null) => void;
  selectedBloxFruit: BloxFruitItem | null;
  setSelectedBloxFruit: (fruit: BloxFruitItem | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Actions
  buyCosmetic: (cosmetic: CosmeticItem) => boolean;
  equipItem: (cosmetic: CosmeticItem) => void;
  unequipItem: (cosmetic: CosmeticItem) => void;
  unlockScript: (script: ScriptItem) => boolean;
  completeTask: (taskId: string) => Promise<boolean>;
  claimDailyCoins: () => boolean;
  
  // CRUD
  addScript: (script: Omit<ScriptItem, 'id' | 'likes' | 'views' | 'updatedAt'>) => Promise<void>;
  updateScript: (id: string, updates: Partial<ScriptItem>) => Promise<void>;
  deleteScript: (id: string) => Promise<void>;
  addGame: (game: Omit<RobloxGame, 'id'>) => Promise<void>;
  updateGame: (id: string, updates: Partial<RobloxGame>) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  addCosmetic: (cosmetic: Omit<CosmeticItem, 'id'>) => void;
  updateCosmetic: (id: string, updates: Partial<CosmeticItem>) => void;
  deleteCosmetic: (id: string) => void;
  addExecutor: (executor: Omit<ExecutorItem, 'id'>) => Promise<void>;
  updateExecutor: (id: string, updates: Partial<ExecutorItem>) => Promise<void>;
  deleteExecutor: (id: string) => Promise<void>;
  addTask: (task: TaskItem) => Promise<void>;
  updateTask: (id: string, updates: Partial<TaskItem>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  
  // Value CRUD
  addValueCategory: (category: Omit<ValueCategory, 'id'>) => Promise<void>;
  updateValueCategory: (id: string, updates: Partial<ValueCategory>) => Promise<void>;
  deleteValueCategory: (id: string) => Promise<void>;
  addValueItem: (item: Omit<UnifiedValueItem, 'id'>) => Promise<void>;
  updateValueItem: (id: string, updates: Partial<UnifiedValueItem>) => Promise<void>;
  deleteValueItem: (id: string) => Promise<void>;

  // Mystery Case CRUD
  addMysteryCase: (item: Omit<MysteryCase, 'id'>) => Promise<void>;
  updateMysteryCase: (id: string, updates: Partial<MysteryCase>) => Promise<void>;
  deleteMysteryCase: (id: string) => Promise<void>;
  
  // Admin & User Management
  adminSetCoins: (amount: number, isAdd?: boolean) => void;
  adminGiveUserCoins: (targetIdentifier: string, amount: number, isAdd?: boolean) => void;
  updateUserCoins: (amount: number, isAdd?: boolean) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  claimDailyReward: () => boolean;
  sendNotification: (title: string, message: string) => void;
  isAuthorizedAdmin: boolean;
  loginAsAdmin: () => void;
  loginWithEmail: (email: string, password: string, username?: string, register?: boolean) => Promise<void>;
  loginWithGoogle: (email?: string, displayName?: string, photoUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  markNotificationsAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;
  enableSystemNotifications: () => Promise<boolean>;
  notificationPermission: NotificationPermission | 'unsupported';
  
  // Modals & Editing
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isTasksModalOpen: boolean;
  setIsTasksModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAddScriptModalOpen: boolean;
  setIsAddScriptModalOpen: (open: boolean) => void;
  isAddGameModalOpen: boolean;
  setIsAddGameModalOpen: (open: boolean) => void;
  isAddMM2ItemModalOpen: boolean;
  setIsAddMM2ItemModalOpen: (open: boolean) => void;
  isAddBloxFruitModalOpen: boolean;
  setIsAddBloxFruitModalOpen: (open: boolean) => void;
  isAddExecutorModalOpen: boolean;
  setIsAddExecutorModalOpen: (open: boolean) => void;
  isLuckyWheelOpen: boolean;
  setIsLuckyWheelOpen: (open: boolean) => void;
  claimLuckySpin: (prize: { type: 'coins' | 'frame' | 'badge'; amount?: number; name: string }) => void;
  isScriptScannerOpen: boolean;
  setIsScriptScannerOpen: (open: boolean) => void;
  scanScriptCode: (code: string) => { isSafe: boolean; score: number; issues: string[]; detections: string[] };

  // Promo Codes, Songs, Trades
  isRedeemModalOpen: boolean;
  setIsRedeemModalOpen: (open: boolean) => void;
  redeemPromoCode: (code: string) => { success: boolean; message: string; reward?: number };
  addTradePost: (post: Omit<TradePostItem, 'id' | 'createdAt'>) => void;
  deleteTradePost: (id: string) => void;
  addSong: (song: Omit<SongItem, 'id' | 'plays' | 'likes'>) => void;
  deleteSong: (id: string) => void;
  addPromoCode: (promo: PromoCodeItem) => void;
  deletePromoCode: (code: string) => void;
  generateBatchPromoCodes: (prefix: string, count: number, coins: number) => Promise<string[]>;

  // Gamification, Case Opening & Audio
  gainXp: (amount: number, reason?: string) => void;
  isCaseModalOpen: boolean;
  setIsCaseModalOpen: (open: boolean) => void;
  selectedCase: MysteryCase | null;
  setSelectedCase: (c: MysteryCase | null) => void;
  openMysteryCase: (caseItem: MysteryCase) => Promise<CaseReward | null>;
  soundEnabled: boolean;
  toggleSound: () => void;

  // System Announcement
  systemAnnouncement: string;
  updateSystemAnnouncement: (text: string) => void;
  isAnnouncementVisible: boolean;
  setIsAnnouncementVisible: (visible: boolean) => void;
  
  // Edit State & Permissions
  editingScript: ScriptItem | null;
  setEditingScript: (script: ScriptItem | null) => void;
  editingGame: RobloxGame | null;
  setEditingGame: (game: RobloxGame | null) => void;
  editingCosmetic: CosmeticItem | null;
  setEditingCosmetic: (cosmetic: CosmeticItem | null) => void;
  editingTask: TaskItem | null;
  setEditingTask: (task: TaskItem | null) => void;
  editingExecutor: ExecutorItem | null;
  setEditingExecutor: (executor: ExecutorItem | null) => void;
  canEditScript: (script: ScriptItem) => boolean;
  canEditGame: (game: RobloxGame) => boolean;
  
  // Deletion Management
  deleteTarget: { type: 'script' | 'game' | 'cosmetic' | 'task' | 'executor' | 'mm2_item' | 'blox_fruit' | 'value_category' | 'value_item' | 'mystery_case' | 'user'; id: string; name: string } | null;
  setDeleteTarget: (target: { type: 'script' | 'game' | 'cosmetic' | 'task' | 'executor' | 'mm2_item' | 'blox_fruit' | 'value_category' | 'value_item' | 'mystery_case' | 'user'; id: string; name: string } | null) => void;
  requestDeleteScript: (script: ScriptItem) => void;
  requestDeleteGame: (game: RobloxGame) => void;
  requestDeleteCosmetic: (cosmetic: CosmeticItem) => void;
  requestDeleteTask: (taskId: string, title: string) => void;
  requestDeleteExecutor: (executor: ExecutorItem) => void;
  requestDeleteMM2Item: (item: MM2Item) => void;
  requestDeleteBloxFruit: (fruit: BloxFruitItem) => void;
  requestDeleteValueCategory: (category: ValueCategory) => void;
  requestDeleteValueItem: (item: UnifiedValueItem) => void;
  requestDeleteMysteryCase: (c: MysteryCase) => void;
  requestDeleteUser: (user: UserProfile) => void;
  deleteUser: (uid: string) => Promise<void>;
  confirmDelete: () => void;
  canDeleteScript: (script: ScriptItem) => boolean;
  canDeleteGame: (game: RobloxGame) => boolean;

  // System Config & Maintenance
  systemConfig: SystemConfig;
  updateSystemConfig: (newConfig: Partial<SystemConfig>) => Promise<void>;

  // Audit Logs
  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, category: AuditLogItem['category'], details: string) => void;
  clearAuditLogs: () => void;

  // Moderation / Ban
  toggleUserBan: (uid: string, reason?: string) => void;

  // Backup & Restore
  exportFullBackup: () => string;
  restoreFromBackup: (backupJsonString: string) => Promise<{ success: boolean; message: string }>;
  resetToDefaultData: () => Promise<void>;

  // Reports Hub
  reports: ReportItem[];
  submitReport: (category: ReportItem['category'], title: string, description: string) => Promise<void>;
  updateReportStatus: (reportId: string, status: ReportItem['status'], adminReply?: string) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AUTH_LOGIN_INTENT_KEY = 'harikascript_google_login_pending';

const STORAGE_KEYS = {
  USER: 'harikascript_user_v1',
  ALL_USERS: 'harikascript_all_users_v1',
  SCRIPTS: 'harikascript_scripts_v1',
  GAMES: 'harikascript_games_v1',
  COSMETICS: 'harikascript_cosmetics_v1',
  EXECUTORS: 'harikascript_executors_v1',
  TASKS: 'harikascript_tasks_v1',
  NOTIFICATIONS: 'harikascript_notifications_v1',
  MM2_ITEMS: 'harikascript_mm2_items_v1',
  BLOX_FRUITS: 'harikascript_blox_fruits_v1',
  PROMO_CODES: 'harikascript_promo_codes_v1',
  SONGS: 'harikascript_songs_v1',
  TRADE_POSTS: 'harikascript_trade_posts_v1',
  ANNOUNCEMENT: 'harikascript_announcement_v1',
  ANNOUNCEMENT_VISIBLE: 'harikascript_announcement_visible_v1',
  SYSTEM_CONFIG: 'harikascript_system_config_v1',
  AUDIT_LOGS: 'harikascript_audit_logs_v1',
  MYSTERY_CASES: 'harikascript_mystery_cases_v1',
  VALUE_CATEGORIES: 'harikascript_val_cats_v1',
  VALUE_ITEMS: 'harikascript_val_items_v1',
  REPORTS: 'harikascript_reports_v1',
  DELETED_IDS: 'harikascript_deleted_ids_v1'
};

const deduplicateById = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (item && item.id && !seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
};

const deduplicateByCode = (items: PromoCodeItem[]): PromoCodeItem[] => {
  const seen = new Set<string>();
  const result: PromoCodeItem[] = [];
  for (const item of items) {
    if (item && item.code && !seen.has(item.code)) {
      seen.add(item.code);
      result.push(item);
    }
  }
  return result;
};

const getDeletedSet = (): Set<string> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
    if (saved) return new Set(JSON.parse(saved));
  } catch (e) {}
  return new Set();
};

const generateUniqueId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Track permanently deleted item IDs
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const markAsDeleted = (id: string) => {
    setDeletedIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };
  // Load persisted user or default
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        const parsed: UserProfile = JSON.parse(saved);
        // STRICT SECURITY: If not in whitelist, strip admin role
        // Never trust an admin role restored from localStorage. Only a matching
        // Firebase-authenticated allowlisted account may regain admin access.
        if (
          parsed.role === 'admin' &&
          (!auth.currentUser || auth.currentUser.email?.toLowerCase().trim() !== parsed.email?.toLowerCase().trim() || !auth.currentUser.providerData.some((provider) => provider.providerId === 'google.com') || !isAuthorizedAdminEmail(auth.currentUser.email))
        ) {
          parsed.role = 'user';
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load user from localStorage', e);
    }
    return INITIAL_USER;
  });

  // Scripts state
  const [scripts, setScripts] = useState<ScriptItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCRIPTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return deduplicateById(parsed);
      }
    } catch (e) {}
    return deduplicateById(INITIAL_SCRIPTS);
  });

  // Games state
  const [games, setGames] = useState<RobloxGame[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return deduplicateById(parsed);
      }
    } catch (e) {}
    return deduplicateById(INITIAL_GAMES);
  });

  // Cosmetics state
  const [cosmetics, setCosmetics] = useState<CosmeticItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COSMETICS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return deduplicateById(parsed);
      }
    } catch (e) {}
    return deduplicateById(INITIAL_COSMETICS);
  });

  // All community users
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seen = new Set<string>();
          return parsed.filter(u => {
            if (!u || !u.uid || seen.has(u.uid)) return false;
            seen.add(u.uid);
            return true;
          });
        }
      }
    } catch (e) {}
    return INITIAL_COMMUNITY_USERS;
  });

  // Executors state
  const [executors, setExecutors] = useState<ExecutorItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXECUTORS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return deduplicateById(parsed);
      }
    } catch (e) {}
    return deduplicateById(INITIAL_EXECUTORS);
  });

  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return deduplicateById(parsed);
      }
    } catch (e) {}
    return deduplicateById(INITIAL_TASKS);
  });

  // MM2 Items state
  const [mm2Items, setMm2Items] = useState<MM2Item[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MM2_ITEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return deduplicateById(parsed);
      }
    } catch (e) {}
    return deduplicateById(INITIAL_MM2_ITEMS);
  });

  // Blox Fruits state
  const [bloxItems, setBloxItems] = useState<BloxFruitItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOX_FRUITS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: any) => p.id));
          const missing = INITIAL_BLOX_FRUITS.filter((b) => !existingIds.has(b.id));
          return deduplicateById([...parsed, ...missing]);
        }
      }
    } catch (e) {}
    return deduplicateById(INITIAL_BLOX_FRUITS);
  });

  // Mystery Cases state
  const [mysteryCases, setMysteryCases] = useState<MysteryCase[]>(() => {
    try {
      const delSet = getDeletedSet();
      const saved = localStorage.getItem(STORAGE_KEYS.MYSTERY_CASES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter((c: any) => !delSet.has(c.id));
          const existingIds = new Set(filtered.map((c: any) => c.id));
          const missing = MYSTERY_CASES.filter((c) => !existingIds.has(c.id) && !delSet.has(c.id));
          return deduplicateById([...filtered, ...missing]);
        }
      }
      return deduplicateById(MYSTERY_CASES.filter((c) => !delSet.has(c.id)));
    } catch (e) {}
    return deduplicateById(MYSTERY_CASES);
  });

  // Value Categories & Items
  const [valueCategories, setValueCategories] = useState<ValueCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VALUE_CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((c: any) => c.id));
          const missing = INITIAL_PS99_CATEGORIES.filter((c) => !existingIds.has(c.id));
          return deduplicateById([...parsed, ...missing]);
        }
      }
    } catch (e) {}
    return deduplicateById(INITIAL_PS99_CATEGORIES);
  });

  const [valueItems, setValueItems] = useState<UnifiedValueItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VALUE_ITEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: any) => p.id));
          const missing = INITIAL_PS99_PETS.filter((p) => !existingIds.has(p.id));
          return deduplicateById([...parsed, ...missing]);
        }
      }
    } catch (e) {}
    return deduplicateById(INITIAL_PS99_PETS);
  });

  // Promo Codes state
  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROMO_CODES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return deduplicateByCode(parsed);
      }
    } catch (e) {}
    return deduplicateByCode(INITIAL_PROMO_CODES);
  });

  // Songs & Boombox state
  const [songs, setSongs] = useState<SongItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SONGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return deduplicateById(parsed);
      }
    } catch (e) {}
    return deduplicateById(INITIAL_SONGS);
  });

  // MM2 Trade Posts state
  const [tradePosts, setTradePosts] = useState<TradePostItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRADE_POSTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return deduplicateById(parsed);
      }
    } catch (e) {}
    return deduplicateById(INITIAL_TRADE_POSTS);
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) {
        const parsed: NotificationItem[] = JSON.parse(saved);
        const seen = new Set<string>();
        const uniqueList: NotificationItem[] = [];
        for (const item of parsed) {
          if (!item) continue;
          const id = item.id && !seen.has(item.id)
            ? item.id
            : `${item.id || 'notif'}_${Math.random().toString(36).substring(2, 9)}`;
          seen.add(id);
          uniqueList.push({ ...item, id });
        }
        return uniqueList;
      }
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<string>('scripts');
  const [selectedGameFilter, setSelectedGameFilter] = useState<string | null>(null);
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);
  const [selectedMM2Item, setSelectedMM2Item] = useState<MM2Item | null>(null);
  const [selectedBloxFruit, setSelectedBloxFruit] = useState<BloxFruitItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // System Announcement Bar state
  const [systemAnnouncement, setSystemAnnouncement] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT);
      if (saved) return saved;
    } catch (e) {}
    return '🚀 HarikaScript v3.8 Yayında! Roblox Byfron Bypass güncellendi. Günlük şans çarkını çevirmeyi unutmayın! 🎉';
  });

  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT_VISIBLE);
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const updateSystemAnnouncement = async (text: string) => {
    setSystemAnnouncement(text);
    setIsAnnouncementVisible(true);
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, text);
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT_VISIBLE, 'true');
    } catch (e) {}
    showToast('Üst duyuru şeridi başarıyla güncellendi! 📢');
    addNotification('Duyuru Güncellendi 📢', text, 'admin');

    try {
      await setDoc(doc(db, 'system_settings', 'announcement'), {
        text,
        visible: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'system_settings/announcement');
    }
  };

  const handleSetAnnouncementVisible = async (visible: boolean) => {
    setIsAnnouncementVisible(visible);
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT_VISIBLE, String(visible));
    } catch (e) {}

    try {
      await setDoc(doc(db, 'system_settings', 'announcement'), {
        visible,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'system_settings/announcement');
    }
  };

  // SYSTEM CONFIG & MAINTENANCE MODE
  const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
    maintenanceMode: false,
    maintenanceMessage: 'HarikaScript şu anda planlı bakım çalışmasındadır. Yeni scriptler ve güncellemeler hazırlanıyor!',
    allowNewRegistrations: true,
    allowTradeCreation: true,
    scriptCopyCooldownSeconds: 0,
    autoApproveScripts: true,
    antiSpamEnabled: true,
    maxDailyLuckySpins: 3
  };

  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SYSTEM_CONFIG);
      if (saved) return { ...DEFAULT_SYSTEM_CONFIG, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_SYSTEM_CONFIG;
  });

  const updateSystemConfig = async (newConfig: Partial<SystemConfig>) => {
    const updated = { ...systemConfig, ...newConfig };
    setSystemConfig(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.SYSTEM_CONFIG, JSON.stringify(updated));
    } catch (e) {}

    showToast('Sistem ayarları güncellendi! ⚙️');
    addAuditLog(
      'Sistem Ayarları Güncellendi',
      'system',
      `Bakım Modu: ${updated.maintenanceMode ? 'Aktif ⚠️' : 'Kapalı ✅'} | Takas İzni: ${updated.allowTradeCreation ? 'Açık' : 'Kapalı'} | Cooldown: ${updated.scriptCopyCooldownSeconds}s`
    );

    try {
      await setDoc(doc(db, 'system_settings', 'config'), updated, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'system_settings/config');
    }
  };

  // AUDIT LOGS STATE
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'log_init_01',
        adminName: 'Sistem Yöneticisi 👑',
        adminEmail: 'mm2ultimatehub@gmail.com',
        action: 'Yönetim Merkezi Başlatıldı',
        category: 'system',
        details: 'HarikaScript v3.8 yönetim merkezi ve güvenlik motoru devreye alındı.',
        timestamp: 'Bugün, 12:00'
      },
      {
        id: 'log_init_02',
        adminName: 'Harika Admin 👑',
        adminEmail: 'huseynoveleddin87@gmail.com',
        action: 'Firestore Senkronizasyonu',
        category: 'security',
        details: 'Tüm veri tabanı koleksiyonları ve gerçek zamanlı kurallar doğrulandı.',
        timestamp: 'Bugün, 12:15'
      }
    ];
  });

  const addAuditLog = (action: string, category: AuditLogItem['category'], details: string) => {
    const newLog: AuditLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      adminName: user.username || 'Admin',
      adminEmail: user.email || 'admin@harikascript.com',
      action,
      category,
      details,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setAuditLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 99)];
      try {
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      setDoc(doc(db, 'audit_logs', newLog.id), newLog).catch(() => {});
    } catch (e) {}
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    } catch (e) {}
    showToast('Tüm denetim ve işlem kayıtları temizlendi.');
  };

  // MODERATION & USER BAN
  const toggleUserBan = (uid: string, reason?: string) => {
    let targetName = uid;
    let isNowBanned = false;

    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.uid === uid) {
          targetName = u.username;
          isNowBanned = !u.isBanned;
          return {
            ...u,
            isBanned: isNowBanned,
            banReason: isNowBanned ? (reason || 'Yönetici tarafından yasaklandı') : undefined
          };
        }
        return u;
      })
    );

    if (user.uid === uid) {
      setUser((prev) => ({
        ...prev,
        isBanned: !prev.isBanned,
        banReason: !prev.isBanned ? (reason || 'Yönetici tarafından yasaklandı') : undefined
      }));
    }

    showToast(`'${targetName}' kullanıcısı ${isNowBanned ? 'yasaklandı (Banned) ⛔' : 'yasağı kaldırıldı ✅'}`);
    addAuditLog(
      isNowBanned ? 'Kullanıcı Yasaklandı' : 'Kullanıcı Yasağı Kaldırıldı',
      'users',
      `Kullanıcı: ${targetName} (${uid}) | ${isNowBanned ? `Sebep: ${reason || 'Belirtilmedi'}` : 'Erişim tekrar açıldı'}`
    );

    try {
      updateDoc(doc(db, 'users', uid), {
        isBanned: isNowBanned,
        banReason: isNowBanned ? (reason || 'Yönetici tarafından yasaklandı') : null
      }).catch(() => {});
    } catch (e) {}
  };

  // FULL BACKUP & EXPORT
  const exportFullBackup = () => {
    const backupData = {
      appName: 'HarikaScript',
      version: '3.8',
      exportedAt: new Date().toISOString(),
      systemConfig,
      systemAnnouncement,
      counts: {
        scripts: scripts.length,
        games: games.length,
        executors: executors.length,
        mm2Items: mm2Items.length,
        bloxItems: bloxItems.length,
        cosmetics: cosmetics.length,
        promoCodes: promoCodes.length,
        songs: songs.length,
        tasks: tasks.length,
        tradePosts: tradePosts.length,
        users: allUsers.length,
        valueCategories: valueCategories.length,
        valueItems: valueItems.length,
        mysteryCases: mysteryCases.length
      },
      scripts,
      games,
      executors,
      mm2Items,
      bloxItems,
      cosmetics,
      promoCodes,
      songs,
      tasks,
      tradePosts,
      valueCategories,
      valueItems,
      mysteryCases
    };

    addAuditLog('Veri Tabanı Yedeği Alındı', 'system', 'Tüm sistem verileri ve içerikler JSON formatında dışa aktarıldı.');
    return JSON.stringify(backupData, null, 2);
  };

  // RESTORE FROM BACKUP
  const restoreFromBackup = async (backupJsonString: string): Promise<{ success: boolean; message: string }> => {
    try {
      const data = JSON.parse(backupJsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Geçersiz JSON formatı!' };
      }

      let restoredCount = 0;

      if (Array.isArray(data.scripts) && data.scripts.length > 0) {
        setScripts(data.scripts);
        for (const s of data.scripts) setDoc(doc(db, 'scripts', s.id), s).catch(() => {});
        restoredCount += data.scripts.length;
      }
      if (Array.isArray(data.games) && data.games.length > 0) {
        setGames(data.games);
        for (const g of data.games) setDoc(doc(db, 'games', g.id), g).catch(() => {});
        restoredCount += data.games.length;
      }
      if (Array.isArray(data.mm2Items) && data.mm2Items.length > 0) {
        setMm2Items(data.mm2Items);
        for (const m of data.mm2Items) setDoc(doc(db, 'mm2_items', m.id), m).catch(() => {});
        restoredCount += data.mm2Items.length;
      }
      if (Array.isArray(data.bloxItems) && data.bloxItems.length > 0) {
        setBloxItems(data.bloxItems);
        for (const b of data.bloxItems) setDoc(doc(db, 'blox_fruits', b.id), b).catch(() => {});
        restoredCount += data.bloxItems.length;
      }
      if (Array.isArray(data.executors) && data.executors.length > 0) {
        setExecutors(data.executors);
        for (const ex of data.executors) setDoc(doc(db, 'executors', ex.id), ex).catch(() => {});
        restoredCount += data.executors.length;
      }
      if (Array.isArray(data.cosmetics) && data.cosmetics.length > 0) {
        setCosmetics(data.cosmetics);
        for (const c of data.cosmetics) setDoc(doc(db, 'cosmetics', c.id), c).catch(() => {});
        restoredCount += data.cosmetics.length;
      }
      if (Array.isArray(data.promoCodes) && data.promoCodes.length > 0) {
        setPromoCodes(data.promoCodes);
        for (const p of data.promoCodes) setDoc(doc(db, 'promo_codes', p.code), p).catch(() => {});
        restoredCount += data.promoCodes.length;
      }
      if (Array.isArray(data.songs) && data.songs.length > 0) {
        setSongs(data.songs);
        for (const sg of data.songs) setDoc(doc(db, 'songs', sg.id), sg).catch(() => {});
        restoredCount += data.songs.length;
      }
      if (Array.isArray(data.tasks) && data.tasks.length > 0) {
        setTasks(data.tasks);
        for (const t of data.tasks) setDoc(doc(db, 'tasks', t.id), t).catch(() => {});
        restoredCount += data.tasks.length;
      }
      if (Array.isArray(data.tradePosts) && data.tradePosts.length > 0) {
        setTradePosts(data.tradePosts);
        for (const tp of data.tradePosts) setDoc(doc(db, 'trade_posts', tp.id), tp).catch(() => {});
        restoredCount += data.tradePosts.length;
      }
      if (Array.isArray(data.valueCategories) && data.valueCategories.length > 0) {
        setValueCategories(data.valueCategories);
        for (const vc of data.valueCategories) setDoc(doc(db, 'value_categories', vc.id), vc).catch(() => {});
        restoredCount += data.valueCategories.length;
      }
      if (Array.isArray(data.valueItems) && data.valueItems.length > 0) {
        setValueItems(data.valueItems);
        for (const vi of data.valueItems) setDoc(doc(db, 'value_items', vi.id), vi).catch(() => {});
        restoredCount += data.valueItems.length;
      }
      if (Array.isArray(data.mysteryCases) && data.mysteryCases.length > 0) {
        setMysteryCases(data.mysteryCases);
        for (const mc of data.mysteryCases) setDoc(doc(db, 'mystery_cases', mc.id), mc).catch(() => {});
        restoredCount += data.mysteryCases.length;
      }
      if (data.systemConfig) {
        setSystemConfig(data.systemConfig);
        setDoc(doc(db, 'system_settings', 'config'), data.systemConfig).catch(() => {});
      }

      addAuditLog('Yedekten Geri Yüklendi', 'system', `JSON yedeğinden toplam ${restoredCount} veri parçası geri yüklendi.`);
      showToast('Yedek başarıyla geri yüklendi ve veri tabanı güncellendi! 🎉');
      return { success: true, message: `Başarıyla ${restoredCount} içerik geri yüklendi!` };
    } catch (err: any) {
      return { success: false, message: 'Yedek yüklenirken hata oluştu: ' + (err?.message || 'Geçersiz veri') };
    }
  };

  // FACTORY RESET TO INITIAL DATA
  const resetToDefaultData = async () => {
    setDeletedIds([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.DELETED_IDS);
    } catch (e) {}

    setScripts(INITIAL_SCRIPTS);
    setGames(INITIAL_GAMES);
    setExecutors(INITIAL_EXECUTORS);
    setMm2Items(INITIAL_MM2_ITEMS);
    setBloxItems(INITIAL_BLOX_FRUITS);
    setCosmetics(INITIAL_COSMETICS);
    setPromoCodes(INITIAL_PROMO_CODES);
    setSongs(INITIAL_SONGS);
    setTasks(INITIAL_TASKS);
    setTradePosts(INITIAL_TRADE_POSTS);
    setValueCategories(INITIAL_PS99_CATEGORIES);
    setValueItems(INITIAL_PS99_PETS);
    setMysteryCases(MYSTERY_CASES);

    for (const s of INITIAL_SCRIPTS) setDoc(doc(db, 'scripts', s.id), s).catch(() => {});
    for (const g of INITIAL_GAMES) setDoc(doc(db, 'games', g.id), g).catch(() => {});
    for (const e of INITIAL_EXECUTORS) setDoc(doc(db, 'executors', e.id), e).catch(() => {});
    for (const m of INITIAL_MM2_ITEMS) setDoc(doc(db, 'mm2_items', m.id), m).catch(() => {});
    for (const b of INITIAL_BLOX_FRUITS) setDoc(doc(db, 'blox_fruits', b.id), b).catch(() => {});
    for (const c of INITIAL_COSMETICS) setDoc(doc(db, 'cosmetics', c.id), c).catch(() => {});
    for (const p of INITIAL_PROMO_CODES) setDoc(doc(db, 'promo_codes', p.code), p).catch(() => {});
    for (const sg of INITIAL_SONGS) setDoc(doc(db, 'songs', sg.id), sg).catch(() => {});
    for (const vc of INITIAL_PS99_CATEGORIES) setDoc(doc(db, 'value_categories', vc.id), vc).catch(() => {});
    for (const vi of INITIAL_PS99_PETS) setDoc(doc(db, 'value_items', vi.id), vi).catch(() => {});
    for (const mc of MYSTERY_CASES) setDoc(doc(db, 'mystery_cases', mc.id), mc).catch(() => {});

    addAuditLog('Varsayılan Veriler Sıfırlandı', 'system', 'Tüm koleksiyonlar başlangıç verilerine döndürüldü.');
    showToast('Tüm koleksiyonlar başlangıç fabrika verilerine döndürüldü! 🔄');
  };

  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);
  const [isScriptScannerOpen, setIsScriptScannerOpen] = useState(false);

  // Modals & Editing State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddScriptModalOpen, setIsAddScriptModalOpen] = useState(false);
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [isAddMM2ItemModalOpen, setIsAddMM2ItemModalOpen] = useState(false);
  const [isAddBloxFruitModalOpen, setIsAddBloxFruitModalOpen] = useState(false);
  const [isAddExecutorModalOpen, setIsAddExecutorModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<MysteryCase | null>(MYSTERY_CASES[0]);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => !getSoundMuted());

  const toggleSound = () => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      setSoundMuted(!next);
      showToast(next ? 'Ses efektleri açıldı 🔊' : 'Ses efektleri kapatıldı 🔇');
      return next;
    });
  };

  const [editingScript, setEditingScript] = useState<ScriptItem | null>(null);
  const [editingGame, setEditingGame] = useState<RobloxGame | null>(null);
  const [editingCosmetic, setEditingCosmetic] = useState<CosmeticItem | null>(null);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [editingExecutor, setEditingExecutor] = useState<ExecutorItem | null>(null);
  const [editingMM2Item, setEditingMM2Item] = useState<MM2Item | null>(null);
  const [editingBloxFruit, setEditingBloxFruit] = useState<BloxFruitItem | null>(null);

  // Reports state & handlers
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reports, setReports] = useState<ReportItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const submitReport = async (category: ReportItem['category'], title: string, description: string) => {
    const newReport: ReportItem = {
      id: `report_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.uid,
      username: user.username || 'Oyuncu',
      userEmail: user.email || 'oyuncu@harikascript.com',
      category,
      title: title.trim(),
      description: description.trim(),
      status: 'Beklemede',
      createdAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
    };

    setReports((prev) => {
      const updated = [newReport, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast('Raporunuz başarıyla yöneticiye iletildi! Teşekkür ederiz. 🛡️');
    addNotification('Rapor Gönderildi 📋', `'${title}' konulu raporunuz incelemeye alındı.`, 'system');
    addAuditLog('Kullanıcı Raporu Oluşturuldu', 'content', `Kategori: ${category} | Başlık: ${title}`);

    try {
      await setDoc(doc(db, 'user_reports', newReport.id), newReport);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `user_reports/${newReport.id}`);
    }
  };

  const updateReportStatus = async (reportId: string, status: ReportItem['status'], adminReply?: string) => {
    setReports((prev) => {
      const updated = prev.map((r) => (r.id === reportId ? { ...r, status, adminReply: adminReply !== undefined ? adminReply : r.adminReply } : r));
      try {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast(`Rapor durumu '${status}' olarak güncellendi.`);
    addAuditLog('Rapor Durumu Güncellendi', 'content', `Rapor ID: ${reportId} | Yeni Durum: ${status}`);

    try {
      await setDoc(doc(db, 'user_reports', reportId), { status, adminReply: adminReply || null }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `user_reports/${reportId}`);
    }
  };

  const deleteReport = async (reportId: string) => {
    setReports((prev) => {
      const updated = prev.filter((r) => r.id !== reportId);
      try {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast('Rapor silindi. 🗑️');
    addAuditLog('Rapor Silindi', 'content', `Rapor ID: ${reportId}`);

    try {
      await deleteDoc(doc(db, 'user_reports', reportId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `user_reports/${reportId}`);
    }
  };

  // Deletion Target State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'script' | 'game' | 'cosmetic' | 'task' | 'executor' | 'mm2_item' | 'blox_fruit' | 'value_category' | 'value_item' | 'mystery_case' | 'user';
    id: string;
    name: string;
  } | null>(null);

  // --- FIREBASE REAL-TIME SYNCHRONIZATION ---
  const initialSeededRef = useRef(false);

  useEffect(() => {
    // 1. Sync Scripts from Firebase Firestore
    const unsubScripts = onSnapshot(
      collection(db, 'scripts'),
      (snapshot) => {
        const delSet = getDeletedSet();
        if (!snapshot.empty) {
          const list: ScriptItem[] = [];
          snapshot.forEach((docSnap) => {
            if (!delSet.has(docSnap.id)) {
              list.push({ id: docSnap.id, ...docSnap.data() } as ScriptItem);
            }
          });
          setScripts(list);
          try {
            localStorage.setItem(STORAGE_KEYS.SCRIPTS, JSON.stringify(list));
          } catch (e) {}
        } else if (!initialSeededRef.current) {
          INITIAL_SCRIPTS.filter((s) => !delSet.has(s.id)).forEach((s) => {
            setDoc(doc(db, 'scripts', s.id), s).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'scripts');
      }
    );

    // 2. Sync Games from Firebase Firestore
    const unsubGames = onSnapshot(
      collection(db, 'games'),
      (snapshot) => {
        const delSet = getDeletedSet();
        if (!snapshot.empty) {
          const list: RobloxGame[] = [];
          snapshot.forEach((docSnap) => {
            if (!delSet.has(docSnap.id)) {
              list.push({ id: docSnap.id, ...docSnap.data() } as RobloxGame);
            }
          });
          setGames(list);
          try {
            localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(list));
          } catch (e) {}
        } else if (!initialSeededRef.current) {
          INITIAL_GAMES.filter((g) => !delSet.has(g.id)).forEach((g) => {
            setDoc(doc(db, 'games', g.id), g).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'games');
      }
    );

    // 3. Sync Executors from Firebase Firestore
    const unsubExecutors = onSnapshot(
      collection(db, 'executors'),
      (snapshot) => {
        const delSet = getDeletedSet();
        if (!snapshot.empty) {
          const list: ExecutorItem[] = [];
          snapshot.forEach((docSnap) => {
            if (!delSet.has(docSnap.id)) {
              list.push({ id: docSnap.id, ...docSnap.data() } as ExecutorItem);
            }
          });
          setExecutors(list);
          try {
            localStorage.setItem(STORAGE_KEYS.EXECUTORS, JSON.stringify(list));
          } catch (e) {}
        } else if (!initialSeededRef.current) {
          INITIAL_EXECUTORS.filter((e) => !delSet.has(e.id)).forEach((e) => {
            setDoc(doc(db, 'executors', e.id), e).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'executors');
      }
    );

    // 4. Sync MM2 Items from Firebase Firestore
    const unsubMM2 = onSnapshot(
      collection(db, 'mm2_items'),
      (snapshot) => {
        const delSet = getDeletedSet();
        if (!snapshot.empty) {
          const list: MM2Item[] = [];
          snapshot.forEach((docSnap) => {
            if (!delSet.has(docSnap.id)) {
              list.push({ id: docSnap.id, ...docSnap.data() } as MM2Item);
            }
          });
          setMm2Items(list);
          try {
            localStorage.setItem(STORAGE_KEYS.MM2_ITEMS, JSON.stringify(list));
          } catch (e) {}
        } else if (!initialSeededRef.current) {
          INITIAL_MM2_ITEMS.filter((m) => !delSet.has(m.id)).forEach((item) => {
            setDoc(doc(db, 'mm2_items', item.id), item).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'mm2_items');
      }
    );

    // Sync Blox Fruits from Firebase Firestore
    const unsubBlox = onSnapshot(
      collection(db, 'blox_fruits'),
      (snapshot) => {
        const delSet = getDeletedSet();
        if (!snapshot.empty) {
          const list: BloxFruitItem[] = [];
          snapshot.forEach((docSnap) => {
            if (!delSet.has(docSnap.id)) {
              list.push({ id: docSnap.id, ...docSnap.data() } as BloxFruitItem);
            }
          });
          const existingIds = new Set(list.map((i) => i.id));
          const missing = INITIAL_BLOX_FRUITS.filter((b) => !existingIds.has(b.id) && !delSet.has(b.id));
          const fullList = [...list, ...missing];
          setBloxItems(fullList);
          try {
            localStorage.setItem(STORAGE_KEYS.BLOX_FRUITS, JSON.stringify(fullList));
          } catch (e) {}
        } else if (!initialSeededRef.current) {
          INITIAL_BLOX_FRUITS.filter((b) => !delSet.has(b.id)).forEach((item) => {
            setDoc(doc(db, 'blox_fruits', item.id), item).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'blox_fruits');
      }
    );

    // Sync Value Categories from Firebase Firestore
    const unsubValueCats = onSnapshot(
      collection(db, 'value_categories'),
      (snapshot) => {
        const delSet = getDeletedSet();
        if (!snapshot.empty) {
          const list: ValueCategory[] = [];
          snapshot.forEach((docSnap) => {
            if (!delSet.has(docSnap.id)) {
              list.push({ id: docSnap.id, ...docSnap.data() } as ValueCategory);
            }
          });
          const existingIds = new Set(list.map((c) => c.id));
          const missing = INITIAL_PS99_CATEGORIES.filter((c) => !existingIds.has(c.id) && !delSet.has(c.id));
          const fullList = [...list, ...missing];
          setValueCategories(fullList);
          try {
            localStorage.setItem(STORAGE_KEYS.VALUE_CATEGORIES, JSON.stringify(fullList));
          } catch (e) {}
        } else if (!initialSeededRef.current) {
          INITIAL_PS99_CATEGORIES.filter((c) => !delSet.has(c.id)).forEach((cat) => {
            setDoc(doc(db, 'value_categories', cat.id), cat).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'value_categories');
      }
    );

    // Sync Value Items from Firebase Firestore
    const unsubValueItems = onSnapshot(
      collection(db, 'value_items'),
      (snapshot) => {
        const delSet = getDeletedSet();
        if (!snapshot.empty) {
          const list: UnifiedValueItem[] = [];
          snapshot.forEach((docSnap) => {
            if (!delSet.has(docSnap.id)) {
              list.push({ id: docSnap.id, ...docSnap.data() } as UnifiedValueItem);
            }
          });
          const existingIds = new Set(list.map((p) => p.id));
          const missing = INITIAL_PS99_PETS.filter((p) => !existingIds.has(p.id) && !delSet.has(p.id));
          const fullList = [...list, ...missing];
          setValueItems(fullList);
          try {
            localStorage.setItem(STORAGE_KEYS.VALUE_ITEMS, JSON.stringify(fullList));
          } catch (e) {}
        } else if (!initialSeededRef.current) {
          INITIAL_PS99_PETS.filter((p) => !delSet.has(p.id)).forEach((item) => {
            setDoc(doc(db, 'value_items', item.id), item).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'value_items');
      }
    );

    // 5. Sync Tasks from Firebase Firestore
    const unsubTasks = onSnapshot(
      collection(db, 'tasks'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: TaskItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as TaskItem);
          });
          setTasks(list);
        } else if (!initialSeededRef.current) {
          INITIAL_TASKS.forEach((t) => {
            setDoc(doc(db, 'tasks', t.id), t).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'tasks');
      }
    );

    // 6. Sync Cosmetics from Firebase Firestore
    const unsubCosmetics = onSnapshot(
      collection(db, 'cosmetics'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: CosmeticItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as CosmeticItem);
          });
          setCosmetics(list);
        } else if (!initialSeededRef.current) {
          INITIAL_COSMETICS.forEach((c) => {
            setDoc(doc(db, 'cosmetics', c.id), c).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'cosmetics');
      }
    );

    // 7. Sync Promo Codes from Firebase Firestore
    const unsubPromoCodes = onSnapshot(
      collection(db, 'promo_codes'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PromoCodeItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              code: data.code || docSnap.id,
              rewardCoins: data.rewardCoins || 100,
              description: data.description || '',
              expiresAt: data.expiresAt
            });
          });
          setPromoCodes(list);
        } else if (!initialSeededRef.current) {
          INITIAL_PROMO_CODES.forEach((p) => {
            setDoc(doc(db, 'promo_codes', p.code), p).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'promo_codes');
      }
    );

    // 8. Sync Songs from Firebase Firestore
    const unsubSongs = onSnapshot(
      collection(db, 'songs'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: SongItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as SongItem);
          });
          setSongs(list);
        } else if (!initialSeededRef.current) {
          INITIAL_SONGS.forEach((s) => {
            setDoc(doc(db, 'songs', s.id), s).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'songs');
      }
    );

    // 9. Sync Trade Posts from Firebase Firestore
    const unsubTradePosts = onSnapshot(
      collection(db, 'trade_posts'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: TradePostItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as TradePostItem);
          });
          setTradePosts(list);
        } else if (!initialSeededRef.current) {
          INITIAL_TRADE_POSTS.forEach((t) => {
            setDoc(doc(db, 'trade_posts', t.id), t).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'trade_posts');
      }
    );

    // 10. Sync System Announcement from Firebase Firestore
    const unsubAnnouncement = onSnapshot(
      doc(db, 'system_settings', 'announcement'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.text) setSystemAnnouncement(data.text);
          if (data.visible !== undefined) setIsAnnouncementVisible(data.visible);
        } else if (!initialSeededRef.current) {
          setDoc(doc(db, 'system_settings', 'announcement'), {
            text: '🚀 HarikaScript v3.8 Yayında! Roblox Byfron Bypass güncellendi. Günlük şans çarkını çevirmeyi unutmayın! 🎉',
            visible: true,
            updatedAt: new Date().toISOString()
          }).catch(() => {});
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'system_settings/announcement');
      }
    );

    // 11. Sync System Settings Config from Firebase Firestore
    const unsubConfig = onSnapshot(
      doc(db, 'system_settings', 'config'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSystemConfig((prev) => ({ ...prev, ...data } as SystemConfig));
        }
      },
      () => {}
    );

    // 13. Sync Mystery Cases from Firebase Firestore
    const unsubMysteryCases = onSnapshot(
      collection(db, 'mystery_cases'),
      (snapshot) => {
        const delSet = getDeletedSet();
        if (!snapshot.empty) {
          const list: MysteryCase[] = [];
          snapshot.forEach((docSnap) => {
            if (!delSet.has(docSnap.id)) {
              list.push({ id: docSnap.id, ...docSnap.data() } as MysteryCase);
            }
          });
          const existingIds = new Set(list.map((c) => c.id));
          const missing = MYSTERY_CASES.filter((c) => !existingIds.has(c.id) && !delSet.has(c.id));
          const fullList = deduplicateById([...list, ...missing]);
          setMysteryCases(fullList);
          try {
            localStorage.setItem(STORAGE_KEYS.MYSTERY_CASES, JSON.stringify(fullList));
          } catch (e) {}
        } else if (!initialSeededRef.current) {
          MYSTERY_CASES.filter((c) => !delSet.has(c.id)).forEach((c) => {
            setDoc(doc(db, 'mystery_cases', c.id), c).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'mystery_cases');
      }
    );

    initialSeededRef.current = true;

    return () => {
      unsubScripts();
      unsubGames();
      unsubExecutors();
      unsubMM2();
      unsubBlox();
      unsubTasks();
      unsubCosmetics();
      unsubPromoCodes();
      unsubSongs();
      unsubTradePosts();
      unsubAnnouncement();
      unsubConfig();
      unsubMysteryCases();
    };
  }, []);

  // Firebase Auth State Listener and redirect result errors
  useEffect(() => {
    // A redirect login can succeed while the user remains on the main page.
    // Use the returned credential to open the profile only after a real login.
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          // A returning Google redirect can resolve without a fresh auth-state
          // transition (for example when the same account was already cached).
          // Complete the explicit login intent here as well, so the profile
          // does not remain closed after successful sign-in.
          setIsAuthModalOpen(false);
          let shouldOpenProfile = false;
          try {
            shouldOpenProfile = sessionStorage.getItem(AUTH_LOGIN_INTENT_KEY) === '1';
            if (shouldOpenProfile) sessionStorage.removeItem(AUTH_LOGIN_INTENT_KEY);
          } catch {}
          if (shouldOpenProfile) setIsProfileModalOpen(true);
        }
      })
      .catch((error: any) => {
        try { sessionStorage.removeItem(AUTH_LOGIN_INTENT_KEY); } catch {}
        console.error('Google redirect sign-in error:', error?.code || error, error?.message);
        const code = String(error?.code || '');
        const messages: Record<string, string> = {
          'auth/unauthorized-domain': 'Bu site Firebase tarafından yetkilendirilmemiş. Authorized domains listesinde mm2vault.github.io bulunduğunu kontrol et.',
          'auth/operation-not-allowed': 'Firebase Console > Authentication > Sign-in method bölümünde Google sağlayıcısını etkinleştir.',
          'auth/network-request-failed': 'Bağlantı hatası. İnternetini kontrol edip tekrar dene.',
          'auth/invalid-api-key': 'Firebase API anahtarı geçersiz; Firebase yapılandırması kontrol edilmeli.'
        };
        showToast(messages[code] || `Google yönlendirme hatası: ${code || error?.message || 'Bilinmeyen hata'}`);
      });

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.email) {
        // Complete only the login flow the user explicitly started. Existing
        // sessions should not force-open the profile on every page refresh.
        setIsAuthModalOpen(false);
        let shouldOpenProfile = false;
        try {
          shouldOpenProfile = sessionStorage.getItem(AUTH_LOGIN_INTENT_KEY) === '1';
          if (shouldOpenProfile) sessionStorage.removeItem(AUTH_LOGIN_INTENT_KEY);
        } catch {}
        const cleanEmail = fbUser.email.toLowerCase().trim();
        const isGoogleAccount = fbUser.providerData.some((provider) => provider.providerId === 'google.com');
        const isAdmin = isGoogleAccount && isAuthorizedAdminEmail(cleanEmail);
        const displayName = fbUser.displayName || cleanEmail.split('@')[0];

        // Read the profile before hydrating React state. Never silently hide
        // Firestore permission/network errors or overwrite an existing profile.
        let remoteData: Partial<UserProfile> = {};
        let profileDocumentExists = false;
        let profileReadSucceeded = false;
        try {
          const snap = await getDoc(doc(db, 'users', fbUser.uid));
          profileReadSucceeded = true;
          profileDocumentExists = snap.exists();
          if (profileDocumentExists) remoteData = snap.data() as Partial<UserProfile>;
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${fbUser.uid}`);
          showToast('Google girişi başarılı; profil okunamadı. Firestore kurallarını kontrol et.');
        }

        // INITIAL_USER contains demo rewards/items for the guest preview.
        // Never copy those into a real Firebase account.
        const cleanNewProfile: UserProfile = {
          ...INITIAL_USER,
          uid: fbUser.uid,
          email: cleanEmail,
          username: displayName,
          coins: 200,
          xp: 0,
          level: 1,
          role: 'user',
          equippedFrameId: '',
          equippedAvatarId: '',
          equippedEffectId: '',
          equippedBadges: [],
          inventory: [],
          unlockedScriptIds: [],
          completedTaskIds: [],
          lastDailyClaim: '',
          lastDailyRewardDate: '',
          lastLuckySpin: '',
          isBanned: false,
          banReason: ''
        };
        const fallbackProfile: UserProfile = {
          ...cleanNewProfile,
          ...(profileDocumentExists ? remoteData : {}),
          uid: fbUser.uid,
          email: cleanEmail,
          username: isAdmin ? `${displayName} 👑` : (remoteData.username || displayName),
          avatarUrl: fbUser.photoURL || remoteData.avatarUrl || cleanNewProfile.avatarUrl,
          role: isAdmin ? 'admin' : 'user',
          coins: isAdmin
            ? Math.max(typeof remoteData.coins === 'number' ? remoteData.coins : 0, 10000)
            : (profileDocumentExists && typeof remoteData.coins === 'number' ? remoteData.coins : 200)
        };

        // Keep writes out of the React state updater; React StrictMode can call
        // updater functions more than once.
        setUser(fallbackProfile);

        // Only create a genuinely missing profile after a successful read.
        // Never treat a failed read as a missing document.
        if (profileReadSucceeded && !profileDocumentExists) {
          setDoc(doc(db, 'users', fbUser.uid), fallbackProfile, { merge: true }).catch((error) => {
            handleFirestoreError(error, OperationType.CREATE, `users/${fbUser.uid}`);
            showToast('Giriş yapıldı fakat profil kaydedilemedi. Firestore users kurallarını kontrol et.');
          });
        }
        if (shouldOpenProfile) setIsProfileModalOpen(true);
      } else {
        // Clear stale local-only sessions from the old fake email login.
        setUser({ ...INITIAL_USER, coins: 200, role: 'user' });
        setIsProfileModalOpen(false);
      }
    });

    return () => unsubAuth();
  }, []);

  // Admin-only listeners: reports and audit logs contain private information.
  useEffect(() => {
    const fbUser = auth.currentUser;
    const isVerifiedAdmin = !!fbUser?.email
      && fbUser.uid === user.uid
      && user.role === 'admin'
      && isAuthorizedAdminEmail(fbUser.email);

    if (!isVerifiedAdmin) {
      setAuditLogs([]);
      setReports([]);
      return;
    }

    const unsubAuditLogs = onSnapshot(
      collection(db, 'audit_logs'),
      (snapshot) => {
        const list: AuditLogItem[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as AuditLogItem);
        });
        list.sort((a, b) => b.id.localeCompare(a.id));
        setAuditLogs(list.slice(0, 100));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'audit_logs')
    );

    const unsubReports = onSnapshot(
      collection(db, 'user_reports'),
      (snapshot) => {
        const list: ReportItem[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as ReportItem);
        });
        list.sort((a, b) => b.id.localeCompare(a.id));
        setReports(list);
        try {
          localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list));
        } catch {}
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'user_reports')
    );

    return () => {
      unsubAuditLogs();
      unsubReports();
    };
  }, [user.uid, user.email, user.role]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(
    getNotificationPermission()
  );

  useEffect(() => {
    setNotificationPermission(getNotificationPermission());
  }, []);

  const enableSystemNotifications = async (): Promise<boolean> => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(getNotificationPermission());
    if (granted) {
      showToast('Sistem bildirimleri aktif edildi! 🔔');
      sendNativeNotification('HarikaScript Bildirimleri Açıldı! 🚀', {
        body: 'Yeni Roblox scriptleri ve güncellemeler anlık olarak cihazınıza iletilecek.'
      });
    } else {
      showToast('Bildirim izni verilmedi. Tarayıcı ayarlarından açabilirsiniz.');
    }
    return granted;
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'system') => {
    const newNotif: NotificationItem = {
      id: generateUniqueId('notif'),
      title,
      message,
      type,
      timestamp: 'Şimdi',
      read: false
    };
    setNotifications((prev) => {
      if (prev.length > 0 && prev[0].title === title && prev[0].message === message) {
        return prev;
      }
      return [newNotif, ...prev];
    });

    sendNativeNotification(title, { body: message }).catch(() => {});
  };

  // GAIN XP & LEVEL PROGRESSION
  const gainXp = (amount: number, reason?: string) => {
    setUser((prev) => {
      const currentXp = (prev.xp || 0) + amount;
      const currentLevel = prev.level || 1;
      const xpNeeded = currentLevel * 150;

      if (currentXp >= xpNeeded) {
        const newLevel = currentLevel + 1;
        const remainder = currentXp - xpNeeded;
        showToast(`Tebrikler! Seviye Atladınız: Seviye ${newLevel}! 🏆`);
        playLevelUpSound();
        addNotification(
          'Seviye Atladın! 🏆',
          `Tebrikler, Seviye ${newLevel} unvanına ulaştınız! +100 Bonus Coin hesabınıza eklendi.`,
          'reward'
        );
        return {
          ...prev,
          xp: remainder,
          level: newLevel,
          coins: prev.coins + 100
        };
      }

      return {
        ...prev,
        xp: currentXp
      };
    });
  };

  // MYSTERY CASE OPENING
  const openMysteryCase = async (caseItem: MysteryCase): Promise<CaseReward | null> => {
    if (user.coins < caseItem.price) {
      showToast(`Yetersiz bakiye! Bu sandık için ${caseItem.price} Coin gerekiyor.`);
      return null;
    }

    const rand = Math.random();
    const jackpotItem = caseItem.rewards.find((r) => r.isJackpot);
    let chosen: CaseReward;

    if (rand < 0.08 && jackpotItem) {
      chosen = jackpotItem;
    } else {
      const pool = caseItem.rewards;
      chosen = pool[Math.floor(Math.random() * pool.length)];
    }

    setUser((prev) => {
      const baseCoins = prev.coins - caseItem.price;
      let finalCoins = baseCoins;
      const newInventory = [...prev.inventory];

      if (chosen.type === 'coins') {
        finalCoins += chosen.value;
      } else if (chosen.type === 'cosmetic' || chosen.type === 'frame' || chosen.type === 'badge') {
        if (!newInventory.includes(chosen.id)) {
          newInventory.push(chosen.id);
        }
      }

      return {
        ...prev,
        coins: finalCoins,
        inventory: newInventory
      };
    });

    playCaseWinSound(chosen.isJackpot);
    gainXp(35, 'Sandık Açıldı');
    showToast(`🎉 Sandıktan Çıktı: ${chosen.name}!`);
    addNotification('Sandık Açıldı! 🎁', `${caseItem.name} açıldı ve '${chosen.name}' (${chosen.rarity}) kazanıldı.`, 'reward');

    return chosen;
  };

  // ADMIN BATCH PROMO CODES GENERATOR
  const generateBatchPromoCodes = async (prefix: string, count: number, coins: number): Promise<string[]> => {
    const cleanPrefix = (prefix.trim() || 'HARIKA').toUpperCase();
    const generated: PromoCodeItem[] = [];
    const codeNames: string[] = [];

    for (let i = 0; i < count; i++) {
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `${cleanPrefix}_${randomSuffix}`;
      codeNames.push(code);
      const item: PromoCodeItem = {
        code,
        rewardCoins: coins,
        description: `Admin toplu üretimi (+${coins} Coin)`
      };
      generated.push(item);
    }

    setPromoCodes((prev) => [...generated, ...prev]);
    showToast(`${count} adet yeni kupon kodu oluşturuldu ve sisteme kaydedildi! 🎁`);

    for (const item of generated) {
      try {
        await setDoc(doc(db, 'promo_codes', item.code), item);
      } catch (e) {}
    }

    return codeNames;
  };

  // BUY COSMETIC
  const buyCosmetic = (cosmetic: CosmeticItem): boolean => {
    if (user.inventory.includes(cosmetic.id)) {
      showToast(`'${cosmetic.name}' zaten envanterinizde mevcut!`);
      return false;
    }
    if (user.coins < cosmetic.price) {
      showToast(`Yetersiz bakiye! ${cosmetic.price - user.coins} Coin daha gerekiyor.`);
      setIsTasksModalOpen(true);
      return false;
    }

    const updatedCoins = user.coins - cosmetic.price;
    const updatedInventory = [...user.inventory, cosmetic.id];

    let updatedUser = { ...user, coins: updatedCoins, inventory: updatedInventory };
    if (cosmetic.type === 'frame' && !user.equippedFrameId) {
      updatedUser.equippedFrameId = cosmetic.id;
    } else if (cosmetic.type === 'effect' && !user.equippedEffectId) {
      updatedUser.equippedEffectId = cosmetic.id;
    }

    setUser(updatedUser);
    showToast(`Tebrikler! '${cosmetic.name}' satın alındı ve envantere eklendi.`);
    addNotification('Satın Alma Başarılı! 🛍️', `'${cosmetic.name}' ${cosmetic.price} Coin karşılığında satın alındı.`, 'purchase');
    return true;
  };

  // EQUIP ITEM
  const equipItem = (cosmetic: CosmeticItem) => {
    if (!user.inventory.includes(cosmetic.id)) {
      showToast('Bu eşyaya sahip değilsiniz!');
      return;
    }

    setUser((prev) => {
      const updated = { ...prev };
      if (cosmetic.type === 'frame') {
        updated.equippedFrameId = cosmetic.id;
      } else if (cosmetic.type === 'avatar') {
        updated.equippedAvatarId = cosmetic.id;
        updated.avatarUrl = cosmetic.imageUrl;
      } else if (cosmetic.type === 'effect') {
        updated.equippedEffectId = cosmetic.id;
      } else if (cosmetic.type === 'badge') {
        if (!updated.equippedBadges.includes(cosmetic.id)) {
          updated.equippedBadges = [...updated.equippedBadges.slice(-3), cosmetic.id];
        }
      }
      return updated;
    });

    showToast(`'${cosmetic.name}' başarıyla kuşanıldı!`);
  };

  // UNEQUIP ITEM
  const unequipItem = (cosmetic: CosmeticItem) => {
    setUser((prev) => {
      const updated = { ...prev };
      if (cosmetic.type === 'frame' && updated.equippedFrameId === cosmetic.id) {
        updated.equippedFrameId = undefined;
      } else if (cosmetic.type === 'effect' && updated.equippedEffectId === cosmetic.id) {
        updated.equippedEffectId = undefined;
      } else if (cosmetic.type === 'badge') {
        updated.equippedBadges = updated.equippedBadges.filter((id) => id !== cosmetic.id);
      }
      return updated;
    });
    showToast(`'${cosmetic.name}' çıkarıldı.`);
  };

  // UNLOCK SCRIPT
  const unlockScript = (script: ScriptItem): boolean => {
    if (user.unlockedScriptIds.includes(script.id) || script.price === 0) {
      return true;
    }
    if (user.coins < script.price) {
      showToast(`Yetersiz bakiye! Bu script için ${script.price} Coin gerekiyor.`);
      setIsTasksModalOpen(true);
      return false;
    }

    setUser((prev) => ({
      ...prev,
      coins: prev.coins - script.price,
      unlockedScriptIds: [...prev.unlockedScriptIds, script.id]
    }));

    showToast(`'${script.title}' scriptinin kilidi açıldı!`);
    addNotification('Script Kilidi Açıldı! 🔓', `'${script.title}' kütüphanenize eklendi.`, 'reward');
    return true;
  };

  // COMPLETE TASK
  const completeTask = async (taskId: string): Promise<boolean> => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;

    if (user.completedTaskIds.includes(taskId)) {
      showToast('Bu görevi zaten tamamladınız!');
      return false;
    }

    try {
      const res = await apiFetch('/api/verify-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, userId: user.uid, taskType: task.type })
      });
      const data = await res.json();

      if (data.success && data.verified === true) {
        setUser((prev) => ({
          ...prev,
          coins: prev.coins + task.rewardCoins,
          completedTaskIds: [...prev.completedTaskIds, taskId]
        }));
        showToast(`Tebrikler! '${task.title}' tamamlandı ve +${task.rewardCoins} Coin kazandınız! 🪙`);
        addNotification('Görev Tamamlandı! 🎯', `'${task.title}' görevinden +${task.rewardCoins} Coin kazandınız.`, 'reward');
        return true;
      } else {
        showToast(data.error || 'Görev doğrulanamadı.');
        return false;
      }
    } catch (error) {
      // Fail closed: network/API errors must never grant coins or mark tasks complete.
      console.error('Task verification failed:', error);
      showToast('Görev doğrulanamadı. Sunucuya ulaşılamadı; ödül verilmedi.');
      return false;
    }
  };

  // DAILY COIN CLAIM
  const claimDailyCoins = (): boolean => {
    const today = new Date().toDateString();
    if (user.lastDailyClaim === today) {
      showToast('Bugünkü günlük ödülünüzü zaten aldınız. Lütfen yarın tekrar deneyin!');
      return false;
    }

    setUser((prev) => ({
      ...prev,
      coins: prev.coins + 100,
      lastDailyClaim: today
    }));

    showToast('Günlük Giriş Ödülü: +100 Coin bakiyenize eklendi! 🎉');
    addNotification('Günlük Ödül Alındı! 🎁', '+100 Coin hesabınıza tanımlandı. Yarın tekrar gelmeyi unutmayın!', 'reward');
    return true;
  };

  // LUCKY WHEEL CLAIM (STRICTLY ONCE PER DAY)
  const claimLuckySpin = (prize: { type: 'coins' | 'frame' | 'badge'; amount?: number; name: string }) => {
    const today = new Date().toDateString();
    setUser((prev) => {
      const updated = { ...prev, lastLuckySpin: today };
      if (prize.type === 'coins' && prize.amount) {
        updated.coins += prize.amount;
      } else if (prize.type === 'frame') {
        if (!updated.inventory.includes('frame_lucky_neon')) {
          updated.inventory = [...updated.inventory, 'frame_lucky_neon'];
        }
        updated.equippedFrameId = 'frame_lucky_neon';
      } else if (prize.type === 'badge') {
        if (!updated.equippedBadges.includes('badge_lucky_spinner')) {
          updated.equippedBadges = [...updated.equippedBadges, 'badge_lucky_spinner'];
        }
      }
      return updated;
    });

    addNotification('Şans Çarkı Ödülü! 🎁', `'${prize.name}' ödülü kazandınız ve hesabınıza tanımlandı!`, 'reward');
    showToast(`Tebrikler! ${prize.name} kazandınız! 🎉`);
  };

  // SCRIPT SCANNER
  const scanScriptCode = (code: string) => {
    const issues: string[] = [];
    const detections: string[] = [];
    let score = 100;

    if (/discord(?:app)?\.com\/api\/webhooks/i.test(code)) {
      issues.push('Kritik: Kod içinde Discord Webhook tespit edildi! (Olası hesap çalıcı / logger)');
      detections.push('Discord Webhook');
      score -= 50;
    }

    if (/ipify\.org|ipinfo\.io|checkip|myip|icanhazip/i.test(code)) {
      issues.push('Uyarı: IP adresi sorgulayan dış servis bağlantısı bulundu.');
      detections.push('IP Grabber Servisi');
      score -= 30;
    }

    if (/(?:syn\.request|http_request|request|HttpService:PostAsync)/i.test(code)) {
      detections.push('Dış HTTP İstekleri');
      score -= 10;
    }

    if (/loadstring\(game:HttpGet/i.test(code)) {
      detections.push('Harici Loader (HttpGet)');
    }

    if (code.length > 500 && (code.match(/\\x[0-9a-fA-F]{2}/g) || []).length > 20) {
      issues.push('Bilgilendirme: Hex/Bytecode şifrelenmiş kod blokları içeriyor.');
      detections.push('Obfuscation (Şifreleme)');
      score -= 15;
    }

    score = Math.max(0, Math.min(100, score));
    const isSafe = score >= 70 && !issues.some((i) => i.startsWith('Kritik'));

    return {
      isSafe,
      score,
      issues,
      detections
    };
  };

  // ADMIN & USER AUTHENTICATION
  const loginAsAdmin = () => {
    const authenticatedEmail = auth.currentUser?.email?.toLowerCase().trim();
    if (!authenticatedEmail || authenticatedEmail !== user.email.toLowerCase().trim() || !auth.currentUser?.providerData.some((provider) => provider.providerId === 'google.com') || !isAuthorizedAdminEmail(authenticatedEmail)) {
      showToast('Yönetici erişimi için yetkili Google/Firebase hesabıyla giriş yapmalısınız.');
      return;
    }
    setUser((prev) => ({
      ...prev,
      role: 'admin',
      coins: Math.max(prev.coins, 10000)
    }));
    showToast('Yönetici yetkileri doğrulandı. 👑');
  };

  // Real Firebase email/password authentication; never create a local-only session.
  const loginWithEmail = async (email: string, password: string, username?: string, register = false): Promise<void> => {
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !password) {
      throw new Error('E-posta ve şifre zorunludur.');
    }

    try { sessionStorage.setItem(AUTH_LOGIN_INTENT_KEY, '1'); } catch {}
    try {
      if (register) {
        const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const displayName = username?.trim() || cleanEmail.split('@')[0];
        await updateFirebaseAuthProfile(credential.user, { displayName });
        await credential.user.reload();
        showToast('Hesabın oluşturuldu! Hoş geldin. 🎉');
        return;
      }

      await signInWithEmailAndPassword(auth, cleanEmail, password);
      showToast('Giriş başarılı. Hoş geldin! 💜');
    } catch (error) {
      try { sessionStorage.removeItem(AUTH_LOGIN_INTENT_KEY); } catch {}
      throw error;
    }
  };

  const loginWithGoogle = async (_email?: string, _displayName?: string, _photoUrl?: string): Promise<void> => {
    // Use a full-page OAuth redirect instead of a popup. This is more reliable
    // on Android/mobile browsers and GitHub Pages, where popups are often blocked.
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (persistenceError) {
      // Redirect auth can still work if browser storage blocks persistence.
      console.warn('Firebase persistence could not be set; continuing with redirect.', persistenceError);
    }
    try {
      // Persist the user's intent across the full-page Google redirect.
      sessionStorage.setItem(AUTH_LOGIN_INTENT_KEY, '1');
    } catch (storageError) {
      console.warn('Could not persist Google login intent:', storageError);
    }
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      try { sessionStorage.removeItem(AUTH_LOGIN_INTENT_KEY); } catch {}
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setUser({
      ...INITIAL_USER,
      coins: 200,
      role: 'user'
    });
    showToast('Çıkış yapıldı.');
  };

  const adminSetCoins = (amount: number, isAdd = false) => {
    setUser((prev) => ({
      ...prev,
      coins: isAdd ? prev.coins + amount : Math.max(0, amount)
    }));
    showToast(`Bakiye güncellendi: ${isAdd ? `+${amount}` : amount} Coin`);
  };

  const adminGiveUserCoins = (targetIdentifier: string, amount: number, isAdd = true) => {
    let targetUsername = targetIdentifier;
    let targetUid: string | null = null;
    let finalCoins = 0;

    setAllUsers((prev) => {
      const updated = prev.map((u) => {
        if (
          u.uid === targetIdentifier ||
          u.username.toLowerCase() === targetIdentifier.toLowerCase() ||
          u.email.toLowerCase() === targetIdentifier.toLowerCase()
        ) {
          targetUsername = u.username;
          targetUid = u.uid;
          finalCoins = isAdd ? (u.coins || 0) + amount : Math.max(0, amount);
          return { ...u, coins: finalCoins };
        }
        return u;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (
      user.uid === targetIdentifier ||
      user.username.toLowerCase() === targetIdentifier.toLowerCase() ||
      user.email.toLowerCase() === targetIdentifier.toLowerCase()
    ) {
      setUser((prev) => ({
        ...prev,
        coins: isAdd ? prev.coins + amount : Math.max(0, amount)
      }));
    }

    if (targetUid) {
      setDoc(doc(db, 'users', targetUid), { coins: finalCoins }, { merge: true }).catch(() => {});
    }

    showToast(`'${targetUsername}' kullanıcısına ${isAdd ? `+${amount}` : amount} Coin tanımlandı! 🎉`);
    addNotification(
      'Admin Coin Transferi 💰',
      `'${targetUsername}' kullanıcısına ${isAdd ? `+${amount}` : amount} Coin aktarıldı.`,
      'admin'
    );
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    // Only allow profile presentation fields from the browser. Economy,
    // permissions, progression, inventory and moderation stay server-owned.
    const allowedFields: (keyof UserProfile)[] = [
      'username', 'robloxUsername', 'avatarUrl', 'bio', 'bannerColor',
      'equippedFrameId', 'equippedAvatarId', 'equippedEffectId',
      'equippedBadges', 'soundEnabled'
    ];
    const safeUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => allowedFields.includes(key as keyof UserProfile))
    ) as Partial<UserProfile>;

    if (Object.keys(safeUpdates).length === 0) {
      showToast('Güncellenecek izinli profil alanı bulunamadı.');
      return;
    }

    setUser((prev) => ({ ...prev, ...safeUpdates }));
    try {
      if (!auth.currentUser || auth.currentUser.uid !== user.uid) {
        throw new Error('Profil kaydetmek için aynı hesapla giriş yapmalısınız.');
      }
      await updateDoc(doc(db, 'users', user.uid), safeUpdates);
      showToast('Profil başarıyla güncellendi!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      showToast('Profil bu kez kaydedilemedi. Bağlantıyı ve profil izinlerini kontrol et.');
    }
  };

  // --- CRUD WITH FIREBASE FIRESTORE SYNC ---

  // 1. SCRIPTS CRUD
  const addScript = async (scriptData: Omit<ScriptItem, 'id' | 'likes' | 'views' | 'updatedAt'>) => {
    const newScript: ScriptItem = {
      ...scriptData,
      id: generateUniqueId('script'),
      // Rules require a stable Firebase owner UID for community submissions.
      authorUid: auth.currentUser?.uid || '',
      authorRole: user.role === 'admin' ? 'Admin' : 'Community',
      likes: 0,
      views: 1,
      updatedAt: 'Az önce'
    };

    setScripts((prev) => [newScript, ...prev]);
    showToast(`'${newScript.title}' başarıyla eklendi!`);
    addNotification('Yeni Script Yayında! 📜', `'${newScript.title}' (${newScript.game}) eklendi.`, 'system');
    sendNewScriptNotification(newScript.title, newScript.game).catch(() => {});

    try {
      await setDoc(doc(db, 'scripts', newScript.id), newScript);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `scripts/${newScript.id}`);
    }
  };

  const updateScript = async (id: string, updates: Partial<ScriptItem>) => {
    setScripts((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Script başarıyla güncellendi.');

    try {
      await updateDoc(doc(db, 'scripts', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `scripts/${id}`);
    }
  };

  const deleteScript = async (id: string) => {
    markAsDeleted(id);
    setScripts((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.SCRIPTS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Script silindi. 🗑️');

    try {
      await deleteDoc(doc(db, 'scripts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `scripts/${id}`);
    }
  };

  // 2. GAMES CRUD
  const addGame = async (gameData: Omit<RobloxGame, 'id'>) => {
    const newGame: RobloxGame = {
      ...gameData,
      id: generateUniqueId('game')
    };

    setGames((prev) => [newGame, ...prev]);
    showToast(`'${newGame.name}' oyunu eklendi!`);

    try {
      await setDoc(doc(db, 'games', newGame.id), newGame);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `games/${newGame.id}`);
    }
  };

  const updateGame = async (id: string, updates: Partial<RobloxGame>) => {
    setGames((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    showToast('Oyun güncellendi.');

    try {
      await updateDoc(doc(db, 'games', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `games/${id}`);
    }
  };

  const deleteGame = async (id: string) => {
    markAsDeleted(id);
    setGames((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Oyun silindi. 🗑️');

    try {
      await deleteDoc(doc(db, 'games', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `games/${id}`);
    }
  };

  // 3. EXECUTORS CRUD
  const addExecutor = async (executorData: Omit<ExecutorItem, 'id'>) => {
    const newExec: ExecutorItem = {
      ...executorData,
      id: generateUniqueId('exec')
    };

    setExecutors((prev) => [newExec, ...prev]);
    showToast(`'${newExec.name}' executoru eklendi!`);

    try {
      await setDoc(doc(db, 'executors', newExec.id), newExec);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `executors/${newExec.id}`);
    }
  };

  const updateExecutor = async (id: string, updates: Partial<ExecutorItem>) => {
    setExecutors((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    showToast('Executor güncellendi.');

    try {
      await updateDoc(doc(db, 'executors', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `executors/${id}`);
    }
  };

  const deleteExecutor = async (id: string) => {
    markAsDeleted(id);
    setExecutors((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.EXECUTORS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Executor silindi. 🗑️');

    try {
      await deleteDoc(doc(db, 'executors', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `executors/${id}`);
    }
  };

  // VALUE CATEGORIES CRUD
  const addValueCategory = async (categoryData: Omit<ValueCategory, 'id'>) => {
    const newCategory: ValueCategory = {
      ...categoryData,
      id: generateUniqueId('valcat')
    };
    setValueCategories((prev) => {
      const updated = [...prev, newCategory];
      try {
        localStorage.setItem(STORAGE_KEYS.VALUE_CATEGORIES, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`'${newCategory.name}' kategorisi eklendi! 🎉`);
    try {
      await setDoc(doc(db, 'value_categories', newCategory.id), newCategory);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `value_categories/${newCategory.id}`);
    }
  };

  const updateValueCategory = async (id: string, updates: Partial<ValueCategory>) => {
    setValueCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      try {
        localStorage.setItem(STORAGE_KEYS.VALUE_CATEGORIES, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Kategori başarıyla güncellendi! ✅');
    try {
      await setDoc(doc(db, 'value_categories', id), updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `value_categories/${id}`);
    }
  };

  const deleteValueCategory = async (id: string) => {
    markAsDeleted(id);
    setValueCategories((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.VALUE_CATEGORIES, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    // Also remove items belonging to this category
    setValueItems((prev) => {
      const updated = prev.filter((i) => i.categoryId !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.VALUE_ITEMS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (activeTab === `value_cat_${id}`) {
      setActiveTab('values_hub');
    }
    showToast('Kategori ve bağlı eşyaları silindi. 🗑️');
    try {
      await deleteDoc(doc(db, 'value_categories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `value_categories/${id}`);
    }
  };

  // VALUE ITEMS CRUD
  const addValueItem = async (itemData: Omit<UnifiedValueItem, 'id'>) => {
    const newItem: UnifiedValueItem = {
      ...itemData,
      id: generateUniqueId('valitem')
    };
    setValueItems((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.VALUE_ITEMS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`'${newItem.name}' listeye eklendi! ✨`);
    try {
      await setDoc(doc(db, 'value_items', newItem.id), newItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `value_items/${newItem.id}`);
    }
  };

  const updateValueItem = async (id: string, updates: Partial<UnifiedValueItem>) => {
    setValueItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      try {
        localStorage.setItem(STORAGE_KEYS.VALUE_ITEMS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Eşya bilgileri ve değeri güncellendi! ✅');
    try {
      await setDoc(doc(db, 'value_items', id), updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `value_items/${id}`);
    }
  };

  const deleteValueItem = async (id: string) => {
    markAsDeleted(id);
    setValueItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.VALUE_ITEMS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Eşya silindi. 🗑️');
    try {
      await deleteDoc(doc(db, 'value_items', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `value_items/${id}`);
    }
  };

  // MM2 ITEMS CRUD
  const addMM2Item = async (itemData: Omit<MM2Item, 'id'>) => {
    const newItem: MM2Item = {
      ...itemData,
      id: generateUniqueId('mm2')
    };
    setMm2Items((prev) => [newItem, ...prev]);
    showToast(`'${newItem.name}' MM2 eşyası eklendi!`);
    try {
      await setDoc(doc(db, 'mm2_items', newItem.id), newItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `mm2_items/${newItem.id}`);
    }
  };

  const updateMM2Item = async (id: string, updates: Partial<MM2Item>) => {
    setMm2Items((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    showToast('MM2 eşyası güncellendi.');
    try {
      await updateDoc(doc(db, 'mm2_items', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `mm2_items/${id}`);
    }
  };

  const deleteMM2Item = async (id: string) => {
    markAsDeleted(id);
    setMm2Items((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.MM2_ITEMS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('MM2 eşyası silindi. 🗑️');
    try {
      await deleteDoc(doc(db, 'mm2_items', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `mm2_items/${id}`);
    }
  };

  // BLOX FRUITS CRUD
  const addBloxFruit = async (itemData: Omit<BloxFruitItem, 'id'>) => {
    const newItem: BloxFruitItem = {
      ...itemData,
      id: generateUniqueId('blox')
    };
    setBloxItems((prev) => [newItem, ...prev]);
    showToast(`'${newItem.name}' Blox eşyası eklendi!`);
    try {
      await setDoc(doc(db, 'blox_fruits', newItem.id), newItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `blox_fruits/${newItem.id}`);
    }
  };

  const updateBloxFruit = async (id: string, updates: Partial<BloxFruitItem>) => {
    setBloxItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    showToast('Blox eşyası güncellendi.');
    try {
      await setDoc(doc(db, 'blox_fruits', id), updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `blox_fruits/${id}`);
    }
  };

  const deleteBloxFruit = async (id: string) => {
    markAsDeleted(id);
    setBloxItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.BLOX_FRUITS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Blox Fruits eşyası silindi. 🗑️');
    try {
      await deleteDoc(doc(db, 'blox_fruits', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `blox_fruits/${id}`);
    }
  };

  // MYSTERY CASES CRUD
  const addMysteryCase = async (caseData: Omit<MysteryCase, 'id'>) => {
    const newItem: MysteryCase = {
      ...caseData,
      id: generateUniqueId('case')
    };
    setMysteryCases((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.MYSTERY_CASES, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`'${newItem.name}' gizemli kutusu eklendi! 🎁`);
    addAuditLog('Gizemli Kutu Eklendi', 'content', `Kutu: ${newItem.name} (${newItem.price} Coin)`);
    try {
      await setDoc(doc(db, 'mystery_cases', newItem.id), newItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `mystery_cases/${newItem.id}`);
    }
  };

  const updateMysteryCase = async (id: string, updates: Partial<MysteryCase>) => {
    setMysteryCases((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      try {
        localStorage.setItem(STORAGE_KEYS.MYSTERY_CASES, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Gizemli kutu güncellendi.');
    addAuditLog('Gizemli Kutu Güncellendi', 'content', `Kutu ID: ${id}`);
    try {
      await setDoc(doc(db, 'mystery_cases', id), updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `mystery_cases/${id}`);
    }
  };

  const deleteMysteryCase = async (id: string) => {
    markAsDeleted(id);
    let deletedName = id;
    setMysteryCases((prev) => {
      const target = prev.find((c) => c.id === id);
      if (target) deletedName = target.name;
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.MYSTERY_CASES, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Gizemli kutu silindi. 🗑️');
    addAuditLog('Gizemli Kutu Silindi', 'content', `Kutu: ${deletedName} (${id})`);
    try {
      await deleteDoc(doc(db, 'mystery_cases', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `mystery_cases/${id}`);
    }
  };

  // 5. TASKS CRUD
  const addTask = async (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
    showToast(`'${newTask.title}' görevi eklendi!`);

    try {
      await setDoc(doc(db, 'tasks', newTask.id), newTask);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `tasks/${newTask.id}`);
    }
  };

  const updateTask = async (id: string, updates: Partial<TaskItem>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Görev güncellendi.');

    try {
      await updateDoc(doc(db, 'tasks', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${id}`);
    }
  };

  const deleteTask = async (taskId: string) => {
    markAsDeleted(taskId);
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      try {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Görev silindi. 🗑️');

    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${taskId}`);
    }
  };

  // 6. COSMETICS CRUD
  const addCosmetic = async (cosmeticData: Omit<CosmeticItem, 'id'>) => {
    const newCosmetic: CosmeticItem = {
      ...cosmeticData,
      id: generateUniqueId('cosm')
    };
    setCosmetics((prev) => [newCosmetic, ...prev]);
    showToast(`'${newCosmetic.name}' kozmetik markete eklendi!`);

    try {
      await setDoc(doc(db, 'cosmetics', newCosmetic.id), newCosmetic);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `cosmetics/${newCosmetic.id}`);
    }
  };

  const updateCosmetic = async (id: string, updates: Partial<CosmeticItem>) => {
    setCosmetics((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Kozmetik ürün güncellendi.');

    try {
      await updateDoc(doc(db, 'cosmetics', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `cosmetics/${id}`);
    }
  };

  const deleteCosmetic = async (id: string) => {
    markAsDeleted(id);
    setCosmetics((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.COSMETICS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Kozmetik ürün silindi. 🗑️');

    try {
      await deleteDoc(doc(db, 'cosmetics', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `cosmetics/${id}`);
    }
  };

  // Permission Checks
  const canEditScript = (script: ScriptItem): boolean => {
    if (checkIsAdmin(user)) return true;
    return !!auth.currentUser && auth.currentUser.uid === user.uid && script.authorUid === user.uid;
  };

  const canEditGame = (_game: RobloxGame): boolean => checkIsAdmin(user);

  const canDeleteScript = (script: ScriptItem): boolean => {
    if (checkIsAdmin(user)) return true;
    return !!auth.currentUser && auth.currentUser.uid === user.uid && script.authorUid === user.uid;
  };

  const canDeleteGame = (_game: RobloxGame): boolean => checkIsAdmin(user);

  // Request Deletion Modal Handlers
  const requestDeleteScript = (script: ScriptItem) => {
    setDeleteTarget({ type: 'script', id: script.id, name: script.title });
  };

  const requestDeleteGame = (game: RobloxGame) => {
    setDeleteTarget({ type: 'game', id: game.id, name: game.name });
  };

  const requestDeleteCosmetic = (cosmetic: CosmeticItem) => {
    setDeleteTarget({ type: 'cosmetic', id: cosmetic.id, name: cosmetic.name });
  };

  const requestDeleteTask = (taskId: string, title: string) => {
    setDeleteTarget({ type: 'task', id: taskId, name: title });
  };

  const requestDeleteExecutor = (executor: ExecutorItem) => {
    setDeleteTarget({ type: 'executor', id: executor.id, name: executor.name });
  };

  const requestDeleteMM2Item = (item: MM2Item) => {
    setDeleteTarget({ type: 'mm2_item', id: item.id, name: item.name });
  };

  const requestDeleteBloxFruit = (fruit: BloxFruitItem) => {
    setDeleteTarget({ type: 'blox_fruit', id: fruit.id, name: fruit.name });
  };

  const requestDeleteValueCategory = (category: ValueCategory) => {
    setDeleteTarget({ type: 'value_category', id: category.id, name: category.name });
  };

  const requestDeleteValueItem = (item: UnifiedValueItem) => {
    setDeleteTarget({ type: 'value_item', id: item.id, name: item.name });
  };

  const requestDeleteMysteryCase = (c: MysteryCase) => {
    setDeleteTarget({ type: 'mystery_case', id: c.id, name: c.name });
  };

  const requestDeleteUser = (targetUser: UserProfile) => {
    setDeleteTarget({ type: 'user', id: targetUser.uid, name: targetUser.username || targetUser.email });
  };

  const deleteUser = async (uid: string) => {
    markAsDeleted(uid);
    setAllUsers((prev) => {
      const updated = prev.filter((u) => u.uid !== uid);
      try {
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Kullanıcı hesabı silindi. 🗑️');
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${uid}`);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'script') {
      deleteScript(deleteTarget.id);
      if (selectedScript?.id === deleteTarget.id) {
        setSelectedScript(null);
      }
    } else if (deleteTarget.type === 'game') {
      deleteGame(deleteTarget.id);
    } else if (deleteTarget.type === 'cosmetic') {
      deleteCosmetic(deleteTarget.id);
    } else if (deleteTarget.type === 'task') {
      deleteTask(deleteTarget.id);
    } else if (deleteTarget.type === 'executor') {
      deleteExecutor(deleteTarget.id);
    } else if (deleteTarget.type === 'mm2_item') {
      deleteMM2Item(deleteTarget.id);
    } else if (deleteTarget.type === 'blox_fruit') {
      deleteBloxFruit(deleteTarget.id);
    } else if (deleteTarget.type === 'value_category') {
      deleteValueCategory(deleteTarget.id);
    } else if (deleteTarget.type === 'value_item') {
      deleteValueItem(deleteTarget.id);
    } else if (deleteTarget.type === 'mystery_case') {
      deleteMysteryCase(deleteTarget.id);
    } else if (deleteTarget.type === 'user') {
      deleteUser(deleteTarget.id);
    }

    setDeleteTarget(null);
  };

  // Auto-persist changes to localStorage & Firebase Firestore
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MYSTERY_CASES, JSON.stringify(mysteryCases));
    } catch (e) {}
  }, [mysteryCases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {}

    if (user.uid && user.uid !== 'usr_default_01') {
      setDoc(doc(db, 'users', user.uid), user, { merge: true }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
    } catch (e) {}
  }, [allUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCRIPTS, JSON.stringify(scripts));
    } catch (e) {}
  }, [scripts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    } catch (e) {}
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COSMETICS, JSON.stringify(cosmetics));
    } catch (e) {}
  }, [cosmetics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXECUTORS, JSON.stringify(executors));
    } catch (e) {}
  }, [executors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MM2_ITEMS, JSON.stringify(mm2Items));
    } catch (e) {}
  }, [mm2Items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOX_FRUITS, JSON.stringify(bloxItems));
    } catch (e) {}
  }, [bloxItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROMO_CODES, JSON.stringify(promoCodes));
    } catch (e) {}
  }, [promoCodes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
    } catch (e) {}
  }, [songs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRADE_POSTS, JSON.stringify(tradePosts));
    } catch (e) {}
  }, [tradePosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VALUE_CATEGORIES, JSON.stringify(valueCategories));
    } catch (e) {}
  }, [valueCategories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VALUE_ITEMS, JSON.stringify(valueItems));
    } catch (e) {}
  }, [valueItems]);

  // Promo Code Redeem Handler
  const redeemPromoCode = (inputCode: string) => {
    const clean = inputCode.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code.toUpperCase() === clean);
    if (!found) {
      return { success: false, message: 'Geçersiz veya süresi dolmuş kupon kodu!' };
    }
    const alreadyUsed = user.completedTaskIds?.includes(`code_${clean}`);
    if (alreadyUsed) {
      return { success: false, message: 'Bu kodu daha önce kullandınız!' };
    }
    const newCoins = user.coins + found.rewardCoins;
    const newCompleted = [...(user.completedTaskIds || []), `code_${clean}`];
    setUser((prev) => ({
      ...prev,
      coins: newCoins,
      completedTaskIds: newCompleted
    }));
    showToast(`Tebrikler! ${found.code} koduyla +${found.rewardCoins} Coin kazandınız! 🎁`);
    addNotification('Kupon Kullanıldı 🎉', `${found.code} kodu ile +${found.rewardCoins} Coin hesabınıza eklendi.`, 'reward');
    return { success: true, message: `Başarılı! +${found.rewardCoins} Coin kazandınız.`, reward: found.rewardCoins };
  };

  const addTradePost = async (post: Omit<TradePostItem, 'id' | 'createdAt'>) => {
    const newPost: TradePostItem = {
      ...post,
      id: generateUniqueId('trade'),
      createdAt: 'Şimdi'
    };
    setTradePosts((prev) => [newPost, ...prev]);
    showToast('MM2 Takas ilanınız yayınlandı! ⚔️');

    try {
      await setDoc(doc(db, 'trade_posts', newPost.id), newPost);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `trade_posts/${newPost.id}`);
    }
  };

  const deleteTradePost = async (id: string) => {
    setTradePosts((prev) => prev.filter((p) => p.id !== id));
    showToast('İlan silindi.');

    try {
      await deleteDoc(doc(db, 'trade_posts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `trade_posts/${id}`);
    }
  };

  const addSong = async (song: Omit<SongItem, 'id' | 'plays' | 'likes'>) => {
    const newSong: SongItem = {
      ...song,
      id: generateUniqueId('song'),
      plays: 1,
      likes: 1
    };
    setSongs((prev) => [newSong, ...prev]);
    showToast('Şarkı kütüphaneye eklendi! 🎵');

    try {
      await setDoc(doc(db, 'songs', newSong.id), newSong);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `songs/${newSong.id}`);
    }
  };

  const deleteSong = async (id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
    showToast('Şarkı silindi.');

    try {
      await deleteDoc(doc(db, 'songs', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `songs/${id}`);
    }
  };

  const addPromoCode = async (promo: PromoCodeItem) => {
    setPromoCodes((prev) => [promo, ...prev]);
    showToast(`'${promo.code}' kuponu sisteme eklendi! 🎁`);

    try {
      await setDoc(doc(db, 'promo_codes', promo.code), promo);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `promo_codes/${promo.code}`);
    }
  };

  const deletePromoCode = async (code: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.code !== code));
    showToast(`'${code}' kuponu silindi.`);

    try {
      await deleteDoc(doc(db, 'promo_codes', code));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `promo_codes/${code}`);
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Tüm bildirimler temizlendi.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        allUsers,
        scripts,
        games,
        cosmetics,
        executors,
        tasks,
        notifications,
        promoCodes,
        songs,
        tradePosts,
        mysteryCases,
        addMysteryCase,
        updateMysteryCase,
        deleteMysteryCase,
        mm2Items,
        bloxItems,
        editingMM2Item,
        setEditingMM2Item,
        editingBloxFruit,
        setEditingBloxFruit,
        addMM2Item,
        updateMM2Item,
        deleteMM2Item,
        addBloxFruit,
        updateBloxFruit,
        deleteBloxFruit,
        isRedeemModalOpen,
        setIsRedeemModalOpen,
        redeemPromoCode,
        addTradePost,
        deleteTradePost,
        addSong,
        deleteSong,
        addPromoCode,
        deletePromoCode,
        activeTab,
        setActiveTab,
        selectedGameFilter,
        setSelectedGameFilter,
        selectedScript,
        setSelectedScript,
        selectedMM2Item,
        setSelectedMM2Item,
        selectedBloxFruit,
        setSelectedBloxFruit,
        toastMessage,
        showToast,
        buyCosmetic,
        equipItem,
        unequipItem,
        unlockScript,
        completeTask,
        claimDailyCoins,
        addScript,
        updateScript,
        deleteScript,
        addGame,
        updateGame,
        deleteGame,
        addCosmetic,
        updateCosmetic,
        deleteCosmetic,
        addExecutor,
        updateExecutor,
        deleteExecutor,
        addTask,
        updateTask,
        deleteTask,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isTasksModalOpen,
        setIsTasksModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAddScriptModalOpen,
        setIsAddScriptModalOpen,
        isAddGameModalOpen,
        setIsAddGameModalOpen,
        isAddMM2ItemModalOpen,
        setIsAddMM2ItemModalOpen,
        isAddBloxFruitModalOpen,
        setIsAddBloxFruitModalOpen,
        isAddExecutorModalOpen,
        setIsAddExecutorModalOpen,
        valueCategories,
        addValueCategory,
        updateValueCategory,
        deleteValueCategory,
        valueItems,
        addValueItem,
        updateValueItem,
        deleteValueItem,
        isLuckyWheelOpen,
        setIsLuckyWheelOpen,
        claimLuckySpin,
        isScriptScannerOpen,
        setIsScriptScannerOpen,
        scanScriptCode,
        editingScript,
        setEditingScript,
        editingGame,
        setEditingGame,
        editingCosmetic,
        setEditingCosmetic,
        editingTask,
        setEditingTask,
        editingExecutor,
        setEditingExecutor,
        canEditScript,
        canEditGame,
        canDeleteScript,
        canDeleteGame,
        deleteTarget,
        setDeleteTarget,
        requestDeleteScript,
        requestDeleteGame,
        requestDeleteCosmetic,
        requestDeleteTask,
        requestDeleteExecutor,
        requestDeleteMM2Item,
        requestDeleteBloxFruit,
        requestDeleteValueCategory,
        requestDeleteValueItem,
        requestDeleteMysteryCase,
        requestDeleteUser,
        deleteUser,
        confirmDelete,
        adminSetCoins,
        adminGiveUserCoins,
        updateUserCoins: adminSetCoins,
        updateUserProfile,
        updateProfile: updateUserProfile,
        claimDailyReward: claimDailyCoins,
        sendNotification: (t, m) => addNotification(t, m, 'system'),
        isAuthorizedAdmin: checkIsAdmin(user),
        loginAsAdmin,
        loginWithEmail,
        loginWithGoogle,
        logout,
        markNotificationsAsRead,
        clearNotifications,
        addNotification,
        enableSystemNotifications,
        notificationPermission,
        systemAnnouncement,
        updateSystemAnnouncement,
        isAnnouncementVisible,
        setIsAnnouncementVisible: handleSetAnnouncementVisible,
        gainXp,
        isCaseModalOpen,
        setIsCaseModalOpen,
        selectedCase,
        setSelectedCase,
        openMysteryCase,
        soundEnabled,
        toggleSound,
        generateBatchPromoCodes,
        systemConfig,
        updateSystemConfig,
        auditLogs,
        addAuditLog,
        clearAuditLogs,
        toggleUserBan,
        exportFullBackup,
        restoreFromBackup,
        resetToDefaultData,
        reports,
        submitReport,
        updateReportStatus,
        deleteReport,
        isReportModalOpen,
        setIsReportModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
