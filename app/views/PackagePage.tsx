"use strict";

import React, { useCallback, useMemo, useState } from 'react';

import {
	R_ROOT,
} from '../routes';
import { useDocumentTitle, useFormatMessageIdAsTagFn } from '../helpers/hooks';
import { packages } from '../db/queries';
import { useQuery } from '../db/hooks';
import { Package } from '../types';
import { useRoute } from '../router/hooks';
import { isDefined } from '../helpers/common';
import { Redirect } from '../router/compoments';


const PackagePage = () => {

	const t = useFormatMessageIdAsTagFn();

	// useDocumentTitle(t`titles.set`);

	const { route } = useRoute();

	const idStr = route?.payload?.setId as string;

	const id = parseInt(idStr);

	const query = useMemo(() => packages.findOneById(id), [id]);

	const op = useQuery(query);

	return (
		<>

			SetPage

			{op.loading
				? <div>loading</div>
				: <pre>{JSON.stringify(op.data)}</pre>
			}

		</>
	);

};

export default PackagePage;
