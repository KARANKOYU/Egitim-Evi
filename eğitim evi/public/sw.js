/*
  Service worker — uygulamanın telefona kurulabilmesi ve çevrimdışı
  açılabilmesi için.

  Strateji bilerek sade tutuldu:
    - /api/ istekleri HER ZAMAN ağdan gider, asla önbelleğe alınmaz.
      (Ders programı, notlar, giriş kodu gibi veriler bayat olmamalı.)
    - Sayfa ve dosyalar önce ağdan denenir, ağ yoksa önbellekten verilir.
      Böylece güncelleme yaptığında kullanıcı eski sürümde takılı kalmaz.
*/

const SURUM = 'egitim-evi-v1';
const KABUK = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
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

self.addEventListener('fetch', function (e) {
  const istek = e.request;

  /* Sadece kendi sunucumuzdaki GET isteklerine karışıyoruz. */
  if (istek.method !== 'GET') return;
  const url = new URL(istek.url);
  if (url.origin !== self.location.origin) return;

  /* API asla önbelleğe alınmaz. */
  if (url.pathname.indexOf('/api/') === 0) return;

  e.respondWith(
    fetch(istek)
      .then(function (yanit) {
        /* Başarılı yanıtı bir kenara yaz, çevrimdışı için dursun. */
        if (yanit && yanit.status === 200 && yanit.type === 'basic') {
          const kopya = yanit.clone();
          caches.open(SURUM).then(function (c) { c.put(istek, kopya); }).catch(function () {});
        }
        return yanit;
      })
      .catch(function () {
        return caches.match(istek).then(function (bulunan) {
          if (bulunan) return bulunan;
          /* Gezinme isteğiyse en azından ana sayfayı ver. */
          if (istek.mode === 'navigate') return caches.match('/index.html');
          return new Response('Çevrimdışısın', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });
      })
  );
});
