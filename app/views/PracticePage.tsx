"use strict";

import React, { useCallback, useMemo, useState } from 'react';

import {
	R_ROOT,
} from '../routes';
import { useDocumentTitle, useFormatMessageIdExperimental } from '../helpers/hooks';
import { datasets } from '../db/queries';
import { useQuery } from '../db/hooks';
import { Dataset } from '../types';


const PracticePage = () => {

	const t = useFormatMessageIdExperimental();

	useDocumentTitle(t`titles.practice`);

	const [id, setId] = useState<string>(() => 'test');

	const query = useMemo(() => datasets.findOneById(id), [id]);

	const op = useQuery(query);

	return (
		<div>
			<nav className="navbar">
				<ul>
					<a href="/">xxx</a>
				</ul>
			</nav>

			PracticePage

			{op.loading
				? <div>loading</div>
				: <pre>{JSON.stringify(op.data)}</pre>
			}

			<button onClick={(event) => {
				event.preventDefault();
				setId('a');
			}}>
				a
			</button>

			<button onClick={(event) => {
				event.preventDefault();
				setId('b');
			}}>
				b
			</button>

			<button onClick={(event) => {
				event.preventDefault();
				setId('c');
			}}>
				c
			</button>

			<button onClick={(event) => {
				event.preventDefault();
				setId('d');
			}}>
				d
			</button>

		</div>
	);

};

export default PracticePage;
