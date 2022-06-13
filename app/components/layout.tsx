"use strict";

import React from 'react';
import { NavLink } from '../router/compoments';
import { R_ROOT, R_SETTINGS } from '../routes';
import { useFormatMessageIdAsTagFn } from '../helpers/hooks';
import { useAppUser, useConfiguredFirebase } from '../firebase/hooks';
import { isDefined } from '../helpers/common';
import { doSignIn, doSignOut, isAdmin } from '../firebase/helpers';
import { Button } from './common';


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
			<li className="user">
				<Button
					style={isAdmin(user) ? 'danger' : 'primary'}
					className="btn-sm"
					onClick={handleSignOut}
				>
					{user.displayName}
				</Button>
			</li>
		);
	}

	return (
		<li className="user">
			<Button
				label="header.signIn"
				style="danger"
				className="btn-sm"
				onClick={handleSignIn}
			/>
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
