/*
  Service worker — uygulamanın telefona kurulabilmesi ve çevrimdışı
  açılabilmesi için.

  Strateji bilerek sade tutuldu:
    - /api/ istekleri HER ZAMAN ağdan gider, asla önbelleğe alınmaz.
      (Ders programı, notlar, giriş kodu gibi veriler bayat olmamalı.)
    - Sayfa ve dosyalar önce ağdan denenir, ağ yoksa önbellekten verilir.
      Böylece güncelleme yaptığında kullanıcı eski sürümde takılı kalmaz.
*/

const SURUM = 'egitim-evi-v6';   // dosya listesi değişince artır
const KABUK = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/tema.js',
  '/js/app.js',
  '/yazitipi/plex-sans-400-700-latin.woff2',
  '/yazitipi/plex-sans-400-700-latin-ext.woff2',
  '/yazitipi/newsreader-700-latin.woff2',
  '/yazitipi/newsreader-700-latin-ext.woff2',
  '/manifest.json',
  '/simge-192.png',
  '/simge-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(SURUM)
      .then(function (c) { return c.addAll(KABUK); })
      /* Bir dosya bulunamazsa kurulum tamamen çökmesin. */
      .catch(function () { return null; })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (anahtarlar) {
      return Promise.all(anahtarlar.map(function (k) {
        if (k !== SURUM) return caches.delete(k);
        return null;
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Telefon bildirimi. İçerik sunucuda bu tarayıcının anahtarıyla şifrelenir;
   yalnızca başlık, metin ve uygulama içi adres taşır. */
self.addEventListener('push', function (e) {
  let veri = {};
  try { veri = e.data ? e.data.json() : {}; } catch (h) { veri = {}; }
  const baslik = typeof veri.t === 'string' ? veri.t.slice(0, 80) : 'Eğitim Evi';
  const metin = typeof veri.b === 'string' ? veri.b.slice(0, 300) : '';
  e.waitUntil(self.registration.showNotification(baslik, {
    body: metin,
    icon: '/simge-192.png',
    badge: '/simge-192.png',
    data: { adres: typeof veri.u === 'string' ? veri.u : '/' }
  }));
});

/* Bildirime dokununca uygulama açılır (açıksa o pencere öne gelir).
   Yalnızca kendi sitemizdeki bir adrese gidilir. */
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  let hedef;
  try { hedef = new URL((e.notification.data && e.notification.data.adres) || '/', self.location.origin); }
  catch (h) { hedef = new URL('/', self.location.origin); }
  if (hedef.origin !== self.location.origin) hedef = new URL('/', self.location.origin);
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (liste) {
    for (let i = 0; i < liste.length; i++) {
      const p = liste[i];
      if (new URL(p.url).origin === self.location.origin && 'focus' in p) {
        return p.focus().then(function (o) { return o && 'navigate' in o ? o.navigate(hedef.href) : o; })['catch'](function () {});
      }
    }
    return self.clients.openWindow(hedef.href);
  }));
});

