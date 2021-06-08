"use strict";

import React, { useCallback, useMemo, useState } from 'react';

import { useDocumentTitle, useFormatMessageIdAsTagFn } from '../helpers/hooks';
import { packages } from '../db/queries';
import { useQuery } from '../db/hooks';
import { useRoute } from '../router/hooks';
import { isDefined } from '../helpers/common';
import { LoadingScreen } from '../components/layout';
import NotFoundPage from './NotFoundPage';
import { CategoryCard, PackageHeader } from '../components/content';


const PackagePage = () => {

	const t = useFormatMessageIdAsTagFn();

	const { route } = useRoute();

	const idStr = route?.payload?.packageId as string;

	const id = parseInt(idStr);

	const query = useMemo(() => packages.findOneById(id), [id]);

	const op = useQuery(query);

	const pageTitle = op.loading ? t`titles.loading` : !isDefined(op.data) ? t`titles.notFound` : op.data.name;

	useDocumentTitle(pageTitle);

	if (op.loading) {
		return (
			<LoadingScreen />
		);
	}

	if (!isDefined(op.data)) {
		return (
			<NotFoundPage />
		);
	}

	const pack = op.data;

	return (
		<>

			<PackageHeader
				id={pack.id}
				locale={pack.locale}
				name={pack.name}
				description={pack.description}
				numQuestions={pack.numQuestions}
				numCategories={pack.numCategories}
				lastPractice={0}
				successRate={50}
			/>

			<h2>{t`packagePage.categoriesHeading`}</h2>

			<div className="card-grid">
				{pack.categories.map((
					{
						id,
						name,
						numQuestions,
					},
					) =>
						<CategoryCard
							key={id}
							packageId={pack.id}
							id={id}
							locale={pack.locale}
							name={name}
							numQuestions={numQuestions}
							lastPractice={Date.now()}
							successRate={50}
						/>,
				)}
			</div>

		</>
	);

};

export default PackagePage;
