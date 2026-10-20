export type CosmeticType = 'frame' | 'avatar' | 'effect' | 'badge';
export type RarityType = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface CosmeticItem {
  id: string;
  name: string;
  type: CosmeticType;
  price: number;
  rarity: RarityType;
  tag?: string;
  isAnimated: boolean;
  imageUrl: string;
  description: string;
  effectClass?: string;
  badgeIcon?: string;
  glowColor?: string;
  frameSvg?: string;
}

export interface ScriptItem {
  id: string;
  title: string;
  game: string;
  gameId?: string;
  category: 'Auto Farm' | 'Combat' | 'Visual/ESP' | 'Hub' | 'Misc';
  description: string;
  version: string;
  price: number; // 0 = Free
  isPremium: boolean;
  isKeyless: boolean;
  status: 'Çalışıyor' | 'Güncellendi' | 'Test Edildi' | 'Güncellemede';
  imageUrl: string;
  code: string;
  author: string;
  authorUid?: string;
  authorRole: 'Admin' | 'Community' | 'Verified Dev';
  likes: number;
  views?: number;
  downloads?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RobloxGame {
  id: string;
  name: string;
  robloxUrl: string;
  developer: string;
  genre: string;
  description: string;
  imageUrl: string;
  playerCount?: string;
  rating?: string;
  addedBy?: string;
  category: string;
}

export interface ExecutorItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  platforms: ('Windows' | 'Android' | 'iOS' | 'macOS')[];
  downloadUrl: string;
  status: 'Aktif' | 'Güncellemede' | 'İncelemede';
  version: string;
  uncPercent: string;
  isKeyless: boolean;
  level: string;
  isRecommended?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  type?: 'discord' | 'youtube' | 'tiktok' | 'daily' | 'script_copy' | 'profile_edit';
  platform?: 'discord' | 'youtube' | 'tiktok' | 'daily';
  link?: string;
  actionUrl?: string;
  actionText?: string;
  isCompleted?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'reward' | 'purchase' | 'system' | 'admin';
  timestamp: string;
  read: boolean;
}

export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  username: string;
  robloxUsername?: string;
  avatarUrl: string;
  bio: string;
  bannerColor: string;
  coins: number;
  xp?: number;
  level?: number;
  soundEnabled?: boolean;
  role: 'admin' | 'user';
  equippedFrameId?: string;
  equippedAvatarId?: string;
  equippedEffectId?: string;
  equippedBadges: string[];
  inventory: string[]; // cosmetic IDs
  unlockedScriptIds: string[]; // script IDs unlocked via coins
  completedTaskIds: string[]; // completed task IDs
  lastDailyClaim?: string;
  lastDailyRewardDate?: string;
  lastLuckySpin?: string;
  isBanned?: boolean;
  banReason?: string;
}

export interface CaseReward {
  id: string;
  name: string;
  type: 'coins' | 'cosmetic' | 'badge' | 'frame';
  value: number; // coin amount or cosmetic value
  rarity: RarityType;
  imageUrl: string;
  description: string;
  isJackpot?: boolean;
}

export interface MysteryCase {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  color: string;
  tag: string;
  rewards: CaseReward[];
}

export interface MM2Item {
  id: string;
  name: string;
  type: 'Godly' | 'Ancient' | 'Chroma' | 'Vintage' | 'Unique';
  category: 'Knife' | 'Gun' | 'Pet';
  value: number;
  demand: 'Çok Yüksek' | 'Yüksek' | 'Normal' | 'Düşük';
  rarity: string;
  imageUrl: string;
  galleryImages?: string[]; // Max 7 images for Fandom Wiki gallery
  stability: 'Yükseliyor' | 'Sabit' | 'Düşüyor';
  origin: string;
  description?: string; // Detailed Fandom Wiki lore / about
  trivia?: string[]; // Fandom Wiki bullet points
  obtainMethod?: string; // How to get
  releaseYear?: string; // Release date or event year
}

export interface BloxFruitItem {
  id: string;
  name: string;
  type: 'Beast' | 'Natural' | 'Elemental';
  category: 'Fiziksel' | 'Kalıcı (Perm)' | 'Gamepass';
  value: number; // In-game trade value in Millions (e.g. 115000000 for Kitsune)
  demand: 'Çok Yüksek' | 'Yüksek' | 'Normal' | 'Düşük';
  beliPrice: number; // In-game Beli shop price
  robuxPrice: number; // Robux permanent purchase price
  rarity: 'Mythical' | 'Legendary' | 'Rare' | 'Uncommon' | 'Common';
  imageUrl: string;
  galleryImages?: string[];
  stability: 'Yükseliyor' | 'Sabit' | 'Düşüyor';
  awakening?: boolean; // Has Raid Awakening (V2)
  pveRating?: string; // e.g. "SS+", "S", "A"
  pvpRating?: string; // e.g. "SS", "S", "A"
  description?: string;
  obtainMethod?: string;
  origin?: string;
  trivia?: string[];
  moves?: { name: string; mastery: number; key: string; desc?: string }[];
}

export interface PromoCodeItem {
  code: string;
  rewardCoins: number;
  description: string;
  expiresAt?: string;
}

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  audioId: string;
  category: 'Phonk' | 'Türkçe' | 'Gaming' | 'Meme' | 'Pop/Trap';
  plays: number;
  likes: number;
}

export interface TradePostItem {
  id: string;
  game?: string; // 'Blox Fruits' | 'MM2' | 'Adopt Me' | 'Pet Sim 99' | 'Blade Ball'
  author: string;
  authorEmail?: string;
  authorAvatar?: string;
  offering: string[];
  lookingFor: string[];
  notes: string;
  createdAt: string;
  status: 'Açık' | 'Tamamlandı';
}

export interface AuditLogItem {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  category: 'economy' | 'content' | 'security' | 'system' | 'users';
  details: string;
  timestamp: string;
}

export interface SystemConfig {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowNewRegistrations: boolean;
  allowTradeCreation: boolean;
  scriptCopyCooldownSeconds: number;
  autoApproveScripts: boolean;
  antiSpamEnabled: boolean;
  maxDailyLuckySpins: number;
}

export interface ValueCategory {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export interface UnifiedValueItem {
  id: string;
  categoryId: string;
  name: string;
  type: string;
  value: number | string;
  demand: string;
  rarity: string;
  imageUrl: string;
  stability: 'Yükseliyor' | 'Sabit' | 'Düşüyor';
  description?: string;
  metadata?: Record<string, any>;
}

export interface ReportItem {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  category: 'Bug / Hata' | 'İçerik / Script' | 'Taciz / Spam' | 'Öneri / İstek' | 'Diğer';
  title: string;
  description: string;
  status: 'Beklemede' | 'İnceleniyor' | 'Çözüldü' | 'Reddedildi';
  createdAt: string;
  adminReply?: string;
}

