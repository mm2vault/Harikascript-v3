/**
 * Notification management utility for WebAPK / PWA and browser notifications
 */

const APP_BASE_URL = import.meta.env.BASE_URL;

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) return false;
  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch (err) {
    console.error('Failed to request notification permission:', err);
    return false;
  }
};

export interface SystemNotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
  data?: Record<string, any>;
}

export const sendNativeNotification = async (
  title: string,
  options: SystemNotificationOptions = {}
): Promise<boolean> => {
  if (!isNotificationSupported()) return false;

  // If permission not yet determined, we can try to request it
  let perm = Notification.permission;
  if (perm === 'default') {
    perm = await Notification.requestPermission();
  }

  if (perm !== 'granted') return false;

  const notifOptions = {
    body: options.body || 'HarikaScript yeni bildirim',
    icon: options.icon || 'https://i.imgur.com/GDKPvlx.jpeg',
    badge: options.badge || 'https://i.imgur.com/GDKPvlx.jpeg',
    tag: options.tag || `harikascript_${Date.now()}`,
    data: { url: options.url || APP_BASE_URL, ...(options.data || {}) },
    vibrate: [200, 100, 200]
  };

  try {
    // Priority 1: ServiceWorkerRegistration showNotification (works on Android Chrome WebAPK & background)
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration && 'showNotification' in registration) {
        await registration.showNotification(title, notifOptions);
        return true;
      }
    }

    // Priority 2: Standard Window Notification object
    new Notification(title, notifOptions);
    return true;
  } catch (err) {
    console.warn('Native notification fallback:', err);
    try {
      new Notification(title, notifOptions);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Triggers a congratulatory notification when user installs the APK / PWA
 */
export const sendAppInstalledNotification = async (): Promise<void> => {
  await sendNativeNotification('🎉 HarikaScript APK Yüklendi!', {
    body: 'HarikaScript ana ekranınıza eklendi. Yeni Roblox scriptleri, executorlar ve hediyeler anlık olarak size bildirilecek!',
    icon: 'https://i.imgur.com/GDKPvlx.jpeg',
    url: APP_BASE_URL
  });
};

/**
 * Triggers a notification when a new script is added
 */
export const sendNewScriptNotification = async (
  scriptTitle: string,
  gameName: string
): Promise<void> => {
  await sendNativeNotification(`🔥 Yeni Script: ${scriptTitle}`, {
    body: `${gameName} için yeni çalışan script kütüphaneye eklendi! İncelemek ve kopyalamak için dokunun.`,
    icon: 'https://i.imgur.com/GDKPvlx.jpeg',
    url: APP_BASE_URL
  });
};

/**
 * Triggers a notification when daily reward is ready
 */
export const sendDailyRewardNotification = async (): Promise<void> => {
  await sendNativeNotification('🎁 Günlük Coin Ödülün Hazır!', {
    body: 'Bugünkü +100 ücretsiz coinini almak için tıkla!',
    icon: 'https://i.imgur.com/GDKPvlx.jpeg',
    url: APP_BASE_URL
  });
};
