"use strict";

import React, { useEffect } from 'react';

import { IS_DEVELOPMENT, isDefined } from '../helpers/common';
import { useLocation, useRouter } from '../router/hooks';

import {
	R_SETTINGS,
	R_ROOT,
	R_DATASET,
} from '../routes';

import NotFoundPage from '../views/NotFoundPage';
import SettingsPage from '../views/SettingsPage';
import HomePage from '../views/HomePage';
import MissingRoutePage from '../views/MissingRoutePage';
import SetPage from '../views/SetPage';


const PageRouter = () => {

	const router = useRouter();
	const { route } = useLocation();

	// 404: no route matched
	if (!isDefined(route)) {
		return <NotFoundPage />;
	}

	const { name, payload } = route;

	// settings can be accessed no matter the auth state
	if (name === R_SETTINGS) {
		return <SettingsPage />;
	}

	if (name === R_DATASET) {
		return <SetPage />;
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
