"use strict";

import React, { useCallback, useMemo, useState } from 'react';

import {
	R_ROOT,
	R_DATASET,
} from '../routes';
import { useDocumentTitle, useFormatMessageIdExperimental } from '../helpers/hooks';
import { datasets } from '../db/queries';
import { useQuery } from '../db/hooks';
import { Dataset } from '../types';
import { Link } from '../router/compoments';


const DatasetCard = ({ id, name }) => {

	return (
		<div className="dataset-card">
			<div className="dataset-card-heading">{name}</div>
			<Link name={R_DATASET} payload={{ setId: id }}>{name}</Link>
		</div>
	);

};

const HomePage = () => {

	const t = useFormatMessageIdExperimental();

	useDocumentTitle(t`titles.home`);

	const [id, setId] = useState<string>(() => 'test');

	const query = useMemo(() => datasets.findAll(), []);

	const op = useQuery(query);

	return (
		<div>
			<nav className="navbar">
				<ul>
					<a href="/">xxx</a>
				</ul>
			</nav>

			HomePage

			{op.loading || op.error
				? <div>loading || error</div>
				: op.data.map(({ id, name }) => <DatasetCard key={id} id={id} name={name} />)
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

export default HomePage;
