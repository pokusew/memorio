"use strict";

import React from 'react';

// see https://github.com/welldone-software/why-did-you-render
// if (process.env.NODE_ENV === 'development') {
// 	const whyDidYouRender = require('@welldone-software/why-did-you-render');
// 	whyDidYouRender(React, {
// 		trackAllPureComponents: true,
// 	});
// }
import { render } from 'react-dom';

// import Manager from './metrics/Manager';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { routesMap } from './routes';

import './styles/main.scss';
import './robots.txt';
import './_redirects';
import './_headers';
import './manifest.json';
import Store from './store/Store';
import Router from './router/Router';
import { typedMapConstructor } from './helpers/common';
import { AppState } from './types';
import DataManager from './db/DataManager';


const store = new Store<AppState>({
	version: '0.0.1', // TODO: use build hash
	onInitData: () => typedMapConstructor([
		['locale', 'cs'],
	]),
});

const dm = new DataManager();

const router = new Router(routesMap);

render(
	<AppContainer>
		<Root store={store} dm={dm} router={router} />
	</AppContainer>,
	document.getElementById('root'),
);

// @ts-ignore
if (module.hot) {
	// @ts-ignore
	module.hot.accept('./containers/Root', () => {
		const NextRoot = require('./containers/Root').default; // eslint-disable-line global-require
		render(
			<AppContainer>
				<NextRoot store={store} dm={dm} router={router} />
			</AppContainer>,
			document.getElementById('root'),
		);
	});
}
