// Definiamo un nome e una versione per la nostra cache
const CACHE_NAME = 'todo-app-cache-v1';

// Elenco delle risorse fondamentali dell'app da salvare in cache
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap'
];

// 1. Evento 'install': si attiva quando il service worker viene installato
self.addEventListener('install', event => {
  console.log('Service Worker: Installazione...');
  // Aspettiamo che la cache sia pronta
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache aperta, aggiungo le risorse di base.');
        // Aggiungiamo tutte le nostre risorse fondamentali alla cache
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('Service Worker: Errore durante il caching iniziale', err);
      })
  );
});

// 2. Evento 'fetch': si attiva ogni volta che l'app richiede una risorsa (es. un file, un'immagine)
self.addEventListener('fetch', event => {
  // Ignoriamo le richieste a Firebase, che devono sempre essere online
  if (event.request.url.includes('firestore.googleapis.com')) {
    return;
  }

  // Rispondiamo alla richiesta
  event.respondWith(
    // Controlliamo se la risorsa richiesta è già nella nostra cache
    caches.match(event.request)
      .then(cachedResponse => {
        // Se la troviamo nella cache, la restituiamo subito (funzionamento offline)
        if (cachedResponse) {
          console.log('Service Worker: Risorsa trovata in cache:', event.request.url);
          return cachedResponse;
        }
        
        // Se non è in cache, proviamo a recuperarla dalla rete
        console.log('Service Worker: Risorsa non in cache, la scarico:', event.request.url);
        return fetch(event.request);
      })
      .catch(err => {
        console.error('Service Worker: Errore durante il fetch', err);
      })
  );
});

// 3. Evento 'activate': si attiva quando il service worker viene attivato
// Utile per pulire le vecchie cache quando ne rilasciamo una nuova versione
self.addEventListener('activate', event => {
  console.log('Service Worker: Attivazione...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Pulizia vecchia cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});