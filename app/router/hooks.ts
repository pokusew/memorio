"use strict";

import React, { useContext, useState, useEffect } from 'react';

import RouterContext from './RouterContext';


export const useRouter = () => useContext(RouterContext);

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
