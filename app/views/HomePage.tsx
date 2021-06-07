"use strict";

import React, { useMemo, useState } from 'react';

import { useDocumentTitle, useFormatMessageIdAsTagFn } from '../helpers/hooks';
import { packages } from '../db/queries';
import { useDataManager, useQuery } from '../db/hooks';
import { LoadingError, LoadingScreen } from '../components/layout';
import { PackageCard } from '../components/content';


const HomePage = () => {

	const t = useFormatMessageIdAsTagFn();

	useDocumentTitle(t`titles.home`);

	const [id, setId] = useState<string>(() => 'test');

	console.log(`[HomePage] render`, id);

	const dm = useDataManager();

	const query = useMemo(() => packages.findAll(), []);

	const op = useQuery(query);

	if (op.loading) {
		return (
			<LoadingScreen />
		);
	}

	return (
		<>

			<aside className="callout">
				<p>
					{t`homePage.callout.welcome`}
				</p>
				<p>
					{t`homePage.callout.gettingStarted`}
				</p>
			</aside>

			<h1>{t`homePage.packagesHeading`}</h1>

			<div className="card-grid">
				{op.error ? <LoadingError /> : op.data.map(({ id, name }) =>
					<PackageCard
						key={id}
						id={id}
						locale={'cs'}
						// name={name}
						name="Modelové otázky z biologie na 1. LF UK"
						description="Modelové otázky z biologie k přijímacím zkouškám na 1. lékařskou fakultu Univerzity Karlovy v Praze, verze 2010"
						numQuestions={5}
						numCategories={2}
						lastPractice={Date.now()}
						successRate={50}
					/>,
				)}
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

		</>
	);

};

export default HomePage;
