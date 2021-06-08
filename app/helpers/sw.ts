"use strict";


export const registerServiceWorker = () => {

	// see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

	if (!('serviceWorker' in navigator)) {
		console.error('Service Worker API not available!');
		return;
	}

	// see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer

	navigator.serviceWorker.addEventListener('controllerchange', () => {
		console.log('controllerchange: new controller = ', navigator.serviceWorker.controller?.scriptURL);
	});

	navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
		console.log('message:', event);
	});

	// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/startMessages
	navigator.serviceWorker.startMessages();

	navigator.serviceWorker.ready
		.then((registration: ServiceWorkerRegistration) => {
			console.log('serviceWorker ready');
		});

	navigator.serviceWorker.register('/sw.js')
		.then((registration: ServiceWorkerRegistration) => {
			console.log('sw.js registered');
		})
		.catch(err => {
			console.error('sw.js registration failed:', err);
		});

	// navigator.serviceWorker.controller?.postMessage()

};