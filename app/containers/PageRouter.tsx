"use strict";

import React from 'react';

import { IS_DEVELOPMENT, isDefined } from '../helpers/common';
import { useRoute } from '../router/hooks';

import { R_PACKAGE, R_PACKAGE_CATEGORY, R_PACKAGE_PRACTICE, R_PACKAGE_QUESTION, R_ROOT, R_SETTINGS } from '../routes';

import NotFoundPage from '../views/NotFoundPage';
import SettingsPage from '../views/SettingsPage';
import HomePage from '../views/HomePage';
import MissingRoutePage from '../views/MissingRoutePage';
import PackagePage from '../views/PackagePage';
import CategoryPage from '../views/CategoryPage';
import QuestionPage from '../views/QuestionPage';
import PracticePage from '../views/PracticePage';


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

	if (name === R_PACKAGE_CATEGORY) {
		return <CategoryPage />;
	}

	if (name === R_PACKAGE_QUESTION) {
		return <QuestionPage />;
	}

	if (name === R_PACKAGE_PRACTICE) {
		return <PracticePage />;
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
