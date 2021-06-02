"use strict";

import React, { useCallback, useMemo, useState } from 'react';

import {
	R_ROOT,
} from '../routes';
import { useDocumentTitle, useFormatMessageIdExperimental } from '../helpers/hooks';
import { datasets } from '../db/queries';
import { useQuery } from '../db/hooks';
import { Dataset } from '../types';
import { useLocation } from '../router/hooks';
import { isDefined } from '../helpers/common';
import { Redirect } from '../router/compoments';


const SetPage = () => {

	const t = useFormatMessageIdExperimental();

	// useDocumentTitle(t`titles.set`);

	const { route } = useLocation();

	const id = route?.payload?.setId as string;

	const query = useMemo(() => datasets.findOneById(id), [id]);

	const op = useQuery(query);

	return (
		<div>
			<nav className="navbar">
				<ul>
					<a href="/">xxx</a>
				</ul>
			</nav>

			SetPage

			{op.loading
				? <div>loading</div>
				: <pre>{JSON.stringify(op.data)}</pre>
			}

		</div>
	);

};

export default SetPage;
