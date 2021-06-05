"use strict";

// TODO: TypeScript and ServiceWorkerGlobalScope
//       see https://www.devextent.com/create-service-worker-typescript/
//       see https://github.com/microsoft/TypeScript/issues/14877
//       see https://github.com/microsoft/TypeScript/issues/11781

export type {};
declare var self: ServiceWorkerGlobalScope & typeof globalThis;

// USEFUL RESOURCES:
//   https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
//   https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers

const NAME = 'sw-v1';
const CACHE_NAME = 'memorio-v1';


console.log(`[${NAME}] hello`);

// // Files to cache
// const appShellFiles = [
// 	'/pwa-examples/js13kpwa/',
// 	'/pwa-examples/js13kpwa/index.html',
// 	'/pwa-examples/js13kpwa/app.js',
// 	'/pwa-examples/js13kpwa/style.css',
// 	'/pwa-examples/js13kpwa/fonts/graduate.eot',
// 	'/pwa-examples/js13kpwa/fonts/graduate.ttf',
// 	'/pwa-examples/js13kpwa/fonts/graduate.woff',
// 	'/pwa-examples/js13kpwa/favicon.ico',
// 	'/pwa-examples/js13kpwa/img/js13kgames.png',
// 	'/pwa-examples/js13kpwa/img/bg.png',
// 	'/pwa-examples/js13kpwa/icons/icon-32.png',
// 	'/pwa-examples/js13kpwa/icons/icon-64.png',
// 	'/pwa-examples/js13kpwa/icons/icon-96.png',
// 	'/pwa-examples/js13kpwa/icons/icon-128.png',
// 	'/pwa-examples/js13kpwa/icons/icon-168.png',
// 	'/pwa-examples/js13kpwa/icons/icon-192.png',
// 	'/pwa-examples/js13kpwa/icons/icon-256.png',
// 	'/pwa-examples/js13kpwa/icons/icon-512.png',
// ];
// // const gamesImages = [];
// // for (let i = 0; i < games.length; i++) {
// // 	gamesImages.push(`data/img/${games[i].slug}.jpg`);
// // }
// const contentToCache = appShellFiles.concat([]/* gamesImages */);


self.addEventListener('install', (e: ExtendableEvent) => {

	console.log(`[${NAME}] install`);

	// the promise that skipWaiting() returns can be safely ignored
	// noinspection JSIgnoredPromiseFromCall
	// self.skipWaiting();

	e.waitUntil((async () => {
		// const cache = await caches.open(cacheName);
		// console.log('[Service Worker] Caching all: app shell and content');
		// await cache.addAll(contentToCache);
	})());

});

self.addEventListener('activate', (e: ExtendableEvent) => {

	console.log(`[${NAME}] activate`);

	// remove old caches

	// e.waitUntil(caches.keys().then((keyList) => {
	// 	Promise.all(keyList.map((key) => {
	// 		if (key === cacheName) { return; }
	// 		caches.delete(key);
	// 	}))
	// })());

});

self.addEventListener('message', (e: ExtendableMessageEvent) => {

	if (!(e.source instanceof Client)) {
		console.log(`[${NAME}] message NOT from client`, e.data);
		return;
	}

	console.log(`[${NAME}] message from client ${e.source.id}`, e.data);

	const data = e.data;

	if (data === 1) {
		console.log(`[${NAME}] got one`);
		return;
	}

	if (data === 2) {
		console.log(`[${NAME}] got two`);
		return;
	}

	console.log(`[${NAME}] unknown message`);

});

self.addEventListener('fetch', (e: FetchEvent) => {

	console.log(`[${NAME}] fetch`, e.request.url);

	// e.respondWith((async () => {
	// 	const r = await caches.match(e.request);
	// 	console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
	// 	if (r) {
	// 		return r;
	// 	}
	// 	const response = await fetch(e.request);
	// 	const cache = await caches.open(cacheName);
	// 	console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
	// 	cache.put(e.request, response.clone());
	// 	return response;
	// })());

});
