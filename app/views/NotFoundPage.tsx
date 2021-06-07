"use strict";

import React from 'react';

import { R_ROOT } from '../routes';
import { Link } from '../router/compoments';

import { useDocumentTitle, useFormatMessageIdAsTagFn } from '../helpers/hooks';


const NotFoundPage = (props) => {

	const t = useFormatMessageIdAsTagFn();

	useDocumentTitle(t`titles.notFound`);

	return (
		<>
			<h1>{t`titles.notFound`}</h1>
			<p>
				{t`notFoundPage.message`}
			</p>
			<Link name={R_ROOT}>{t`notFoundPage.backToHomePageBtn`}</Link>
		</>
	);
};


export default NotFoundPage;
