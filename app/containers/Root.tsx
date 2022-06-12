"use strict";

import React from 'react';

import StoreContext from '../store/StoreContext';
import Store from '../store/Store';
import { ConfiguredFirebase } from '../firebase/types';
import { FirebaseContext } from '../firebase/contexts';
import RouterContext from '../router/RouterContext';
import Router from '../router/Router';
import { FirebaseUserProvider } from '../firebase/components';

import LocaleLoader from './LocaleLoader';
import PageRouter from './PageRouter';

import { AppState } from '../types';
import { App } from '../components/layout';
import LoadingBarrier from './LoadingBarrier';


export interface RootProps {
	store: Store<AppState>;
	firebase: ConfiguredFirebase;
	router: Router;
}

const Root = ({ store, firebase, router }: RootProps) => {

	return (
		<StoreContext.Provider value={store}>
			<FirebaseContext.Provider value={firebase}>
				<RouterContext.Provider value={router}>
					<FirebaseUserProvider>
						<LocaleLoader>
							<LoadingBarrier>
								<App>
									<PageRouter />
								</App>
							</LoadingBarrier>
						</LocaleLoader>
					</FirebaseUserProvider>
				</RouterContext.Provider>
			</FirebaseContext.Provider>
		</StoreContext.Provider>
	);

};

export default Root;

