'use strict';
// AMK Gästeliste PRO — Service Worker (App-Shell-Cache)
// Registrierung nur unter https/localhost (siehe gaesteliste.html) — hier keine weitere Prüfung nötig.

const CACHE_NAME = 'amk-gl-v16';
const SHELL_URLS = [
  './',
  './index.html',
  './gaesteliste.html',
  './gast.html',
  './seatmaps.js',
  './qr.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon-180.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // Robust: jede URL einzeln cachen. Fehlt eine Datei (z. B. Icon noch nicht
      // erzeugt), darf das den Install-Schritt NICHT scheitern lassen.
      return Promise.allSettled(
        SHELL_URLS.map(function (url) {
          return cache.add(url).catch(function (err) {
            return null; // einzelner Fehlschlag ist ok, Rest wird trotzdem gecacht
          });
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names
          .filter(function (name) { return name !== CACHE_NAME; })
          .map(function (name) { return caches.delete(name); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  // Seiten (HTML) IMMER zuerst aus dem Netz holen — sonst zeigt ein alter Cache
  // nach einer Veroeffentlichung weiter den alten Stand. Ohne Netz greift der Cache.
  const url = new URL(event.request.url);
  const istSeite = event.request.mode === 'navigate' ||
                   event.request.destination === 'document' ||
                   /\.html$/.test(url.pathname) || url.pathname.endsWith('/');
  if (istSeite) {
    event.respondWith(
      fetch(event.request).then(function (response) {
        if (response && response.status === 200 && response.type === 'basic') {
          const klon = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, klon).catch(function () {});
          });
        }
        return response;
      }).catch(function () {
        return caches.match(event.request).then(function (fallback) {
          return fallback || caches.match('./gaesteliste.html').then(function (f2) {
            return f2 || new Response('Offline', { status: 504, statusText: 'Offline', headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
          });
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      return fetch(event.request).then(function (response) {
        // Nur gültige, same-origin Antworten cachen
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseClone).catch(function () {});
        });
        return response;
      }).catch(function () {
        // Kein Netz — sauberen Fallback liefern: erneut Cache versuchen, sonst 504.
        return caches.match(event.request).then(function (fallback) {
          return fallback || new Response('Offline', { status: 504, statusText: 'Offline', headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        });
      });
    })
  );
});
