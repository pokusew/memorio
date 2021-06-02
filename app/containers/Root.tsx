"use strict";

import React from 'react';

import StoreContext from '../store/StoreContext';
import Store from '../store/Store';
import DataManager from '../db/DataManager';
import DataManagerContext from '../db/DataManagerContext';
import RouterContext from '../router/RouterContext';
import Router from '../router/Router';

import LocaleLoader from './LocaleLoader';
import PageRouter from './PageRouter';

import { AppState } from '../types';


export interface RootProps {
	store: Store<AppState>;
	dm: DataManager;
	router: Router;
}

const Root = ({ store, dm, router }: RootProps) => {

	return (
		<StoreContext.Provider value={store}>
			<DataManagerContext.Provider value={dm}>
				<RouterContext.Provider value={router}>
					<LocaleLoader>
						<PageRouter />
					</LocaleLoader>
				</RouterContext.Provider>
			</DataManagerContext.Provider>

		</StoreContext.Provider>
	);

};

export default Root;

