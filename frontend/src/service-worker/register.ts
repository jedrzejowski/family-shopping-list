// const SERVICE_WORKER_URL = '/src/service-worker.ts';
//
// export function initServiceWorker() {
//   isServiceWorkerRegistered().then(isRegistered => {
//     if (!isRegistered) {
//       registerServiceWorker();
//     }
//   });
// }
//
// async function registerServiceWorker() {
//   if ('serviceWorker' in navigator) {
//     const registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL);
//
//     return true;
//   }
//
//   return false;
// }
//
// async function unregisterServiceWorker() {
//   if ('serviceWorker' in navigator) {
//     const registration = await navigator.serviceWorker.getRegistration();
//     if (registration) {
//       await registration.unregister();
//     }
//   }
// }
//
// async function isServiceWorkerRegistered() {
//   if ('serviceWorker' in navigator) {
//     const registration = await navigator.serviceWorker.getRegistration();
//     return !!registration;
//   }
//
//   return false;
// }
