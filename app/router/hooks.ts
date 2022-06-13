"use strict";

import { useContext } from 'react';

import RouterContext from './RouterContext';
import { useSubscription } from '../helpers/useSubscription';


export const useRouter = () => useContext(RouterContext);

export const useRoute = () => {

	const router = useRouter();

	const route = useSubscription({
		getCurrentValue: router.currentRouteGetter,
		subscribe: router.listenForRoute,
	});

	return {
		router,
		route,
	};

};
