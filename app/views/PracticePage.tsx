"use strict";

import React, { useCallback, useMemo, useState } from 'react';

import {
	R_ROOT,
} from '../routes';
import { useDocumentTitle, useFormatMessageIdAsTagFn } from '../helpers/hooks';
import { packages } from '../db/queries';
import { useQuery } from '../db/hooks';
import { Package } from '../types';


const PracticePage = () => {

	const t = useFormatMessageIdAsTagFn();

	useDocumentTitle(t`titles.practice`);

	return (
		<div>
			<nav className="navbar">
				<ul>
					<a href="/">xxx</a>
				</ul>
			</nav>

			PracticePage

		</div>
	);

};

export default PracticePage;
