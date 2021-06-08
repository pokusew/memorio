"use strict";

// TODO: TypeScript and ServiceWorkerGlobalScope
//       see https://www.devextent.com/create-service-worker-typescript/
//       see https://github.com/microsoft/TypeScript/issues/14877
//       see https://github.com/microsoft/TypeScript/issues/11781

import { isDefined } from '../helpers/common';

export type {};
declare var self: ServiceWorkerGlobalScope & typeof globalThis
	// self.__WB_MANIFEST is injected by the Workbox InjectPlugin, see webpack config
	& { __WB_MANIFEST: { revision: string; url: string; }[] | undefined };

// USEFUL RESOURCES:
//   https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
//   https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers

const NAME = 'sw-v1';
const CACHE_NAME = 'memorio-v1';
const MANIFEST = self.__WB_MANIFEST ?? [];
const MANIFEST_URLS: string[] = MANIFEST.map(({ url }) => url);

// currently, our "API" is served from the same origin as the SPA (and the SW)
const MEMORIO_API = location.origin + '/data/';

const FONT_AWESOME_URL_PATTERN = /font-awesome/;
const GOOGLE_FONTS_URL_PATTERN = /fonts\.(googleapis|gstatic)\.com/;

const shouldCacheAdditional = (url: string) =>
	FONT_AWESOME_URL_PATTERN.test(url) || GOOGLE_FONTS_URL_PATTERN.test(url);

const isImmutable = (response: Response) => {

	const cacheControl: string | null = response.headers.get('Cache-Control');

	return isDefined(cacheControl) && cacheControl.indexOf('immutable') != -1;

};

const shouldIgnoreUrl = (url: string) => {

	if (url.startsWith('chrome-extension://')) {
		return true;
	}

	// ignore requests to our "API"
	// as the content caching is solved in the app
	if (url.startsWith(MEMORIO_API)) {
		return true;
	}

	// if (process.env.NODE_ENV === 'development') {
	//
	// 	if (FONT_AWESOME_URL_PATTERN.test(url) || GOOGLE_FONTS_URL_PATTERN.test(url)) {
	// 		return true;
	// 	}
	//
	// }

	return false;

};

console.log(`[${NAME}] hello`);

self.addEventListener('install', (e: ExtendableEvent) => {

	console.log(`[${NAME}] install`);

	// the promise that skipWaiting() returns can be safely ignored
	// noinspection JSIgnoredPromiseFromCall
	// self.skipWaiting();

	e.waitUntil((async () => {

		if (process.env.NODE_ENV !== 'development') {
			const cache = await caches.open(CACHE_NAME);
			console.log(`[${NAME}] caching files from MANIFEST`, MANIFEST_URLS);
			await cache.addAll(MANIFEST_URLS);
		}

	})());

});

self.addEventListener('activate', (e: ExtendableEvent) => {

	console.log(`[${NAME}] activate`);

	// remove old caches
	e.waitUntil((async () => {

		const cachesKeys = await caches.keys();

		const cachesKeysToRemove = cachesKeys.filter(key => key != CACHE_NAME);

		console.log(`[${NAME}] activate: removing old caches`, cachesKeysToRemove);

		await Promise.all(cachesKeysToRemove.map(key => caches.delete(key)));

	})());

});

self.addEventListener('fetch', (e: FetchEvent) => {

	// console.log(`[${NAME}] fetch`, e.request.url);

	// if we know beforehand that we do not want to cache the response
	// we can completely skip our custom fetching logic and let the browser handle it
	// (instead of fetching and then returning it)
	if (shouldIgnoreUrl(e.request.url)) {
		return;
	}

	e.respondWith((async () => {

		const cachedResponse: Response | undefined = await caches.match(e.request);

		if (isDefined(cachedResponse)) {

			// if the cached response is immutable we can return it immediately and skip refreshing it
			if (isImmutable(cachedResponse)) {
				console.log(`[${NAME}] immutable response from cache for`, e.request.url);
				return cachedResponse;
			}

			// otherwise we try to get a fresh response (if the cached one is not immutable)
			// note 1: it is still possible that no actual request will be made
			//         as it will be served from the browser's internal cache (according to Cache-Control headers)
			// note 2: we could also return the cached maybe-stale response immediately
			//         and attempt the refresh in the background (that's called stale-while-revalidate)

			try {

				console.log(`[${NAME}] revalidating`, e.request.url);

				const response = await fetch(e.request);

				const cache = await caches.open(CACHE_NAME);

				await cache.put(e.request, response.clone());

				return response;

			} catch (err) {

				console.log(
					`[${NAME}] an error occurred while revalidating, using maybe-stale cache as fallback`,
					e.request.url, err,
				);

				// if there was an error getting a fresh response, return the maybe-style one from cache
				return cachedResponse;

			}

		}

		console.log(`[${NAME}] no cache > fetching`, e.request.url);

		const response = await fetch(e.request);

		// as we do not know the exact URL addresses for Google Fonts and Font Awesome CDN
		// we cache them at the first time when these requests go through this service worker
		// note: other files are already cached during the install event
		if (shouldCacheAdditional(e.request.url)) {
			const cache = await caches.open(CACHE_NAME);
			console.log(`[${NAME}] caching additional resource`, e.request.url);
			await cache.put(e.request, response.clone());
		}

		return response;

	})());

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
