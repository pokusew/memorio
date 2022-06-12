"use strict";

import React from 'react';
import { NavLink } from '../router/compoments';
import { R_ROOT, R_SETTINGS } from '../routes';
import { useFormatMessageIdAsTagFn } from '../helpers/hooks';
import { useAppUser, useConfiguredFirebase } from '../firebase/hooks';
import { isDefined } from '../helpers/common';
import { doSignIn, doSignOut } from '../firebase/helpers';


export const AppHeaderUser = () => {

	const t = useFormatMessageIdAsTagFn();

	const { auth } = useConfiguredFirebase();
	const user = useAppUser();

	const handleSignIn = (event) => {
		event.preventDefault();
		doSignIn(auth);
	};

	const handleSignOut = (event) => {
		event.preventDefault();
		doSignOut(auth);
	};

	if (isDefined(user)) {
		return (
			<li>
				<button onClick={handleSignOut}>{user.data.displayName}</button>
			</li>
		);
	}

	return (
		<li>
			<button onClick={handleSignIn}>{t`header.signIn`}</button>
		</li>
	);

};

export const AppHeader = React.memo((props) => {

	const t = useFormatMessageIdAsTagFn();

	return (
		<header className="app-header">

			<div className="container">

				<div className="app-name">
					{t`header.appName`}
				</div>

				<nav className="app-navigation">
					<ul className="left">
						<li>
							<NavLink name={R_ROOT}>{t`titles.home`}</NavLink>
						</li>
					</ul>
					<ul className="right">
						<li>
							<NavLink name={R_SETTINGS}>{t`titles.settings`}</NavLink>
						</li>
						<AppHeaderUser />
					</ul>
				</nav>

			</div>

		</header>
	);

});

export const App = ({ children }) => {

	const t = useFormatMessageIdAsTagFn();

	return (
		<>
			<AppHeader />

			<main className="app-content">
				<div className="container">
					{children}
				</div>
			</main>

			<footer className="app-footer">
				<p>&copy; 2022 <a href="https://github.com/pokusew">Martin Endler</a></p>
				<p>{t`footer.sourceCode`} <a href="https://github.com/pokusew/memorio">GitHub</a></p>
			</footer>
		</>
	);

};

export const LoadingScreen = () => {

	const t = useFormatMessageIdAsTagFn();

	return (
		<div className="loading-screen">
			<div className="loading-screen-message">
				{t`ui.loading`}
			</div>
			<div className="loading-screen-message-spinner sk-flow">
				<div className="sk-flow-dot" />
				<div className="sk-flow-dot" />
				<div className="sk-flow-dot" />
			</div>
		</div>
	);

};

export const LoadingError = () => {

	const t = useFormatMessageIdAsTagFn();

	return (
		<div className="loading-error">
			{t`ui.loadingError`}
		</div>
	);

};
