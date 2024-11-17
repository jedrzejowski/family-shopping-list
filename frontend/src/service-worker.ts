const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

self.addEventListener('install', event => {
  console.log('Service worker installed', event);
});

self.addEventListener('activate', event => {
  console.log('Service worker activated', event);
});

self.addEventListener('fetch', (event) => {
  
  console.log(event);
  console.log(this);
  // if (precachedResources.includes(url.pathname)) {
  //   event.respondWith(cacheFirst(event.request));
  // }
});
