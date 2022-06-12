"use strict";

import React from 'react';

import StoreContext from '../store/StoreContext';
import Store from '../store/Store';
import { ConfiguredFirebase } from '../firebase/types';
import { FirebaseContext } from '../firebase/contexts';
import DataManager from '../db/DataManager';
import DataManagerContext from '../db/DataManagerContext';
import RouterContext from '../router/RouterContext';
import Router from '../router/Router';
import { FirebaseUserProvider } from '../firebase/components';

import LocaleLoader from './LocaleLoader';
import PageRouter from './PageRouter';

import { AppState } from '../types';
import { App } from '../components/layout';


export interface RootProps {
	store: Store<AppState>;
	firebase: ConfiguredFirebase;
	dm: DataManager;
	router: Router;
}

const Root = ({ store, firebase, dm, router }: RootProps) => {

	return (
		<StoreContext.Provider value={store}>
			<FirebaseContext.Provider value={firebase}>
				<DataManagerContext.Provider value={dm}>
					<RouterContext.Provider value={router}>
						<FirebaseUserProvider>
							<LocaleLoader>
								<App>
									<PageRouter />
								</App>
							</LocaleLoader>
						</FirebaseUserProvider>
					</RouterContext.Provider>
				</DataManagerContext.Provider>
			</FirebaseContext.Provider>
		</StoreContext.Provider>
	);

};

export default Root;

