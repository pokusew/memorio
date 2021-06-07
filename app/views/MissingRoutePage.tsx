"use strict";

import React from 'react';

import { R_ROOT } from '../routes';
import { Link } from '../router/compoments';

import { useDocumentTitle, useFormatMessageIdAsTagFn } from '../helpers/hooks';


const MissingRoutePage = ({ route }) => {

	const t = useFormatMessageIdAsTagFn();

	useDocumentTitle('Missing route!');

	return (
		<>
			<h1>missing view for route</h1>
			<pre>route = {JSON.stringify(route)}</pre>
			<Link name={R_ROOT}>{t`notFoundPage.backToHomePageBtn`}</Link>
		</>
	);
};


export default MissingRoutePage;
