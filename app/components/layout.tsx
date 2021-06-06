"use strict";

import React from 'react';
import { NavLink } from '../router/compoments';
import { R_ROOT, R_SETTINGS } from '../routes';
import { useFormatMessageIdAsTagFn } from '../helpers/hooks';


export const AppHeader = React.memo((props) => {

	const t = useFormatMessageIdAsTagFn();

	return (
		<header className="app-header">

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
				</ul>
			</nav>

		</header>
	);

});

export const App = ({ children }) => {

	const t = useFormatMessageIdAsTagFn();

	return (
		<>
			<AppHeader />

			<main className="app-content">
				{children}
			</main>

			<footer className="app-footer">
				<p>&copy; 2021 <a href="https://github.com/pokusew">Martin Endler</a></p>
				<p>{t`footer.sourceCode`} <a href="https://github.com/pokusew/memorio">GitHub</a></p>
			</footer>
		</>
	);

};
