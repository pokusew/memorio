"use strict";

import React, { useCallback, useMemo, useState } from 'react';

import { useDocumentTitle, useFormatMessageIdAsTagFn } from '../helpers/hooks';
import { packages } from '../db/queries';
import { useQuery } from '../db/hooks';
import { useRoute } from '../router/hooks';
import { isDefined } from '../helpers/common';
import { LoadingScreen } from '../components/layout';
import NotFoundPage from './NotFoundPage';
import { CategoryCard, CategoryHeader, PackageHeader } from '../components/content';
import { Category } from '../types';


const CategoryPage = () => {

	const t = useFormatMessageIdAsTagFn();

	const { route } = useRoute();

	const packageIdStr = route?.payload?.packageId as string;
	const packageId = parseInt(packageIdStr);

	const categoryIdStr = route?.payload?.categoryId as string;
	const categoryId = parseInt(categoryIdStr);

	const query = useMemo(() => packages.findOneById(packageId), [packageId]);

	const op = useQuery(query);

	const category: Category | undefined = isDefined(op.data)
		? op.data.categories.find(({ id }) => id === categoryId)
		: undefined;

	const pageTitle = op.loading ? t`titles.loading` : !isDefined(category) ? t`titles.notFound` : category.name;

	useDocumentTitle(pageTitle);

	if (op.loading) {
		return (
			<LoadingScreen />
		);
	}

	if (!isDefined(op.data) || !isDefined(category)) {
		return (
			<NotFoundPage />
		);
	}

	const pack = op.data;

	const questions = op.data.questions.filter(({ category: c }) => c === category.id);

	questions.sort(({ number: a }, { number: b }) => (a ?? 0) - (b ?? 0));

	return (
		<>

			<CategoryHeader
				packageId={pack.id}
				id={category.id}
				locale={pack.locale}
				name={category.name}
				numQuestions={category.numQuestions}
				lastPractice={0}
				successRate={50}
			/>

			<h2>{t`categoryPage.questionsHeading`}</h2>

			<ol className="questions-list">

				{questions.map(({ id, number, text, choices, correct }) => (
					<li className="question" key={id} value={number}>

						<span className="question-text">{text}</span>

						<ol className="question-choices">
							{choices.map(choice => (
								<li key={choice.id} value={choice.id} className="question-choice">
									{choice.text}
								</li>
							))}
						</ol>

					</li>
				))}


			</ol>

		</>
	);

};

export default CategoryPage;
