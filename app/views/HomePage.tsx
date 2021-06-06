"use strict";

import React, { useCallback, useMemo, useState } from 'react';

import {
	R_ROOT,
	R_PACKAGE,
} from '../routes';
import { useDocumentTitle, useFormatMessageIdAsTagFn } from '../helpers/hooks';
import { packages } from '../db/queries';
import { useDataManager, useQuery } from '../db/hooks';
import { Package } from '../types';
import { Link } from '../router/compoments';
import { App } from '../components/layout';


const PackageCard = ({ id, name }) => {

	return (
		<section className="card">
			<header className="card-heading">
				<h2 className="heading">Modelové otázky z biologie na 1. LF UK</h2>
				{/*<h3>{name}</h3>*/}
				<p className="description">
					Modelové otázky z biologie k přijímacím zkouškám na 1. lékařskou fakultu Univerzity Karlovy v Praze, verze 2010
				</p>
			</header>
			<div className="card-content">
				<strong className="number">1800</strong> otázek v <strong className="number">5</strong> kateogriích
			</div>
			<div className="card-progress progress">
				<div
					className="progress-bar bg-danger"
					role="progressbar"
					style={{ width: '15%' }}
					aria-valuenow={15}
					aria-valuemin={0}
					aria-valuemax={100}
				/>
			</div>
			<div className="card-actions">
				<Link name={R_PACKAGE} payload={{ packageId: id }}>Detail balíčku</Link>
				<Link name={R_PACKAGE} payload={{ packageId: id }}>Provičovat</Link>
				<Link name={R_PACKAGE} payload={{ packageId: id }}>Test</Link>
			</div>
		</section>
	);

};

const HomePage = () => {

	const t = useFormatMessageIdAsTagFn();

	useDocumentTitle(t`titles.home`);

	const [id, setId] = useState<string>(() => 'test');

	console.log(`[HomePage] render`, id);

	const dm = useDataManager();

	const query = useMemo(() => packages.findAll(), []);

	const op = useQuery(query);

	return (
		<App>

			<h1>Statistky</h1>

			<p>TODO</p>


			<h1>Přehled balíčků</h1>

			HomePage {id}

			<div className="card-grid">
				{op.loading || op.error
					? <div>loading || error</div>
					: op.data.map(({ id, name }) => <PackageCard key={id} id={id} name={name} />)
				}
			</div>

			<button onClick={(event) => {
				event.preventDefault();
				setId('a');
				dm.addPackages([
					{
						id: 1,
						name: 'Test',
					},
				])
					.then(() => {
						console.log('added');
					})
					.catch(err => {
						console.log('error', err);
					})
				;
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

		</App>
	);

};

export default HomePage;
