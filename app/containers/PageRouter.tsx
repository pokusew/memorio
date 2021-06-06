"use strict";

import React, { useEffect } from 'react';

import { IS_DEVELOPMENT, isDefined } from '../helpers/common';
import { useRouter, useRoute } from '../router/hooks';

import {
	R_SETTINGS,
	R_ROOT,
	R_PACKAGE,
} from '../routes';

import NotFoundPage from '../views/NotFoundPage';
import SettingsPage from '../views/SettingsPage';
import HomePage from '../views/HomePage';
import MissingRoutePage from '../views/MissingRoutePage';
import PackagePage from '../views/PackagePage';


const PageRouter = () => {

	const { route } = useRoute();

	console.log(`[PageRouter] route changed`, route);

	// 404: no route matched
	if (!isDefined(route)) {
		return <NotFoundPage />;
	}

	const { name, payload } = route;

	// settings can be accessed no matter the auth state
	if (name === R_SETTINGS) {
		return <SettingsPage />;
	}

	if (name === R_PACKAGE) {
		return <PackagePage />;
	}

	if (name === R_ROOT) {
		return <HomePage />;
	}

	// route was matched, but an appropriate page is missing
	if (IS_DEVELOPMENT) {
		return <MissingRoutePage route={route} />;
	}
	return <NotFoundPage />;

};

export default PageRouter;
