"use strict";

import React, { useContext, useState, useEffect } from 'react';

import RouterContext from './RouterContext';
import { useSubscription } from '../helpers/useSubscription';


export const useRouter = () => useContext(RouterContext);

// TODO: deprecated in favour of useRoute, remove
export const useLocation = () => {

	const router = useRouter();

	const [route, setRoute] = useState(router.route);

	useEffect(() => {

		console.log(`[useLocation] run`);

		const handleRouteChange = nextRoute => {
			console.log(`[useLocation] handleValueChange`, nextRoute);
			setRoute(nextRoute);
		};

		const unlisten = router.listen(handleRouteChange);

		return () => {

			console.log(`[useLocation] cleanup`);

			unlisten();

		};

	}, [router, setRoute]);

	return {
		router,
		location: location,
		route,
	};

};

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
