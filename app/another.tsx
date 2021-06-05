"use strict";

import './styles/main.scss';
import { isDefined } from './helpers/common';


const registerServiceWorker = () => {

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

console.log('hey from the page');

registerServiceWorker();

const b1El = document.getElementById('b1');
const b2El = document.getElementById('b2');

if (isDefined(b1El)) {
	b1El.addEventListener('click', () => {
		navigator.serviceWorker.controller?.postMessage(1);
	});
}

if (isDefined(b2El)) {
	b2El.addEventListener('click', () => {
		navigator.serviceWorker.controller?.postMessage(2);
	});
}



