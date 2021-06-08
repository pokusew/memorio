"use strict";

import './styles/main.scss';
import { isDefined } from './helpers/common';
import { doSomethingWithDB } from './db';
import { registerServiceWorker } from './helpers/sw';


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

doSomethingWithDB();
