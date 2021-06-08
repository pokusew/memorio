"use strict";

import React, { useMemo, useState } from 'react';

import { useDocumentTitle, useFormatMessageIdAsTagFn } from '../helpers/hooks';
import { packages } from '../db/queries';
import { useQuery } from '../db/hooks';
import { LoadingError, LoadingScreen } from '../components/layout';
import { PackageCard } from '../components/content';


const HomePage = () => {

	const t = useFormatMessageIdAsTagFn();

	useDocumentTitle(t`titles.home`);

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
				{op.error ? <LoadingError /> : (
					op.data.map((
						{
							id,
							locale,
							name,
							description,
							numQuestions,
							numCategories,
						},
						) =>
							<PackageCard
								key={id}
								id={id}
								locale={locale}
								name={name}
								description={description}
								numQuestions={numQuestions}
								numCategories={numCategories}
								lastPractice={Date.now()}
								successRate={50}
							/>,
					)
				)}
			</div>

		</>
	);

};

export default HomePage;
