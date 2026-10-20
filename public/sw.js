// Service Worker for HarikaScript PWA / APK installation & Notifications
const CACHE_NAME = 'harikascript-cache-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);
  // Never intercept cross-origin requests such as Firebase/Google APIs.
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request).then((response) => {
      if (response && response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      // Offline navigation fallback stays inside this app's GitHub Pages scope.
      if (request.mode === 'navigate') {
        const appEntry = new URL('index.html', self.registration.scope);
        const cachedEntry = await caches.match(appEntry.href);
        if (cachedEntry) return cachedEntry;
      }
      return new Response('Çevrimdışısın. HarikaScript için tekrar internete bağlan.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })
  );
});

// Handle notification click: focus or open HarikaScript app window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const requestedUrl = event.notification.data?.url || './';
  const urlToOpen = requestedUrl === '/' ? self.registration.scope : new URL(requestedUrl, self.registration.scope).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab if open
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          return client.navigate(urlToOpen);
        }
      }
      // Open new window if none open
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Listen for message from app to show rich system notification
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, {
      icon: new URL('icon-192.png', self.registration.scope).href,
      badge: new URL('icon-192.png', self.registration.scope).href,
      vibrate: [200, 100, 200],
      ...options
    });
  }
});

// Push notification support
self.addEventListener('push', (event) => {
  let data = {
    title: 'HarikaScript Bildirimi ⚡',
    body: 'Yeni Roblox scriptleri ve güncellemeler seni bekliyor!',
    url: './'
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: new URL('icon-192.png', self.registration.scope).href,
    badge: new URL('icon-192.png', self.registration.scope).href,
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
