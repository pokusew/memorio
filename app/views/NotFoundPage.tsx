"use strict";

import React from 'react';

import { R_ROOT } from '../routes';
import { Link } from '../router/compoments';

import { useDocumentTitle, useFormatMessageIdAsTagFn } from '../helpers/hooks';


const NotFoundPage = (props) => {

	const t = useFormatMessageIdAsTagFn();

	useDocumentTitle(t`titles.notFound`);

	return (
		<div>
				<p>
					<br />
					{t`notFoundPage.message`}
				</p>
				<Link name={R_ROOT}>{t`notFoundPage.backToHomePageBtn`}</Link>
		</div>
	);
};


export default NotFoundPage;
