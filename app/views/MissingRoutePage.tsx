"use strict";

import React from 'react';

import { R_ROOT } from '../routes';
import { Link } from '../router/compoments';

import { useDocumentTitle, useFormatMessageIdExperimental } from '../helpers/hooks';


const MissingRoutePage = ({ route }) => {

	const t = useFormatMessageIdExperimental();

	useDocumentTitle('Missing route!');

	return (
		<div>
			<h1>missing view for route</h1>
			<pre>route = {JSON.stringify(route)}</pre>
			<Link name={R_ROOT}>{t`notFoundPage.backToHomePageBtn`}</Link>
		</div>
	);
};


export default MissingRoutePage;
