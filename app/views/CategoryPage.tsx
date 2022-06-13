"use strict";

import React, { useMemo } from 'react';

import { useDocumentTitle, useFormatMessageId } from '../helpers/hooks';
import { packages } from '../data/queries';
import { useQuery } from '../data/hooks';
import { useRoute } from '../router/hooks';
import { isDefined } from '../helpers/common';
import { LoadingScreen } from '../components/layout';
import NotFoundPage from './NotFoundPage';
import { CategoryHeader } from '../components/content';
import { LocalCategory } from '../types';
import classNames from 'classnames';
import { R_PACKAGE_CATEGORY, R_PACKAGE_QUESTION } from '../routes';
import { Breadcrumbs } from '../components/breadcrumbs';
import { useAppUser } from '../firebase/hooks';
import { Link } from '../router/compoments';
import { isAdmin } from '../firebase/helpers';


const CategoryPage = () => {

	const t = useFormatMessageId();

	const user = useAppUser();

	const { route } = useRoute();

	const packageId = route?.payload?.packageId as string;

	const categoryId = route?.payload?.categoryId as string;

	const query = useMemo(() => packages.findOneById(packageId), [packageId]);

	const op = useQuery(query);

	const category: LocalCategory | undefined = isDefined(op.data)
		? op.data.categories.find(({ id }) => id === categoryId)
		: undefined;

	const pageTitle = op.loading ? t(`titles.loading`) : !isDefined(category) ? t(`titles.notFound`) : category.name;

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

	// note: questions are already sorted by their number

	return (
		<>

			<Breadcrumbs
				name={R_PACKAGE_CATEGORY}
				packageId={pack.id}
				packageName={pack.name}
				categoryId={category.id}
				categoryName={category.name}
			/>

			<CategoryHeader
				locale={pack.locale}
				category={category}
			/>

			<h2>{t(`categoryPage.questionsHeading`)}</h2>

			<ol className="questions-list">

				{questions.map(({ id, number, text, choices, correct }) => {

					const correctSet = new Set<number>(correct);

					return (
						<li className="question" key={id} value={number}>

							<span className="question-text">{text}</span>

							<ol className="question-choices">
								{choices.map(choice => {

									const isCorrect = correctSet.has(choice.id);

									return (
										<li
											key={choice.id}
											value={choice.id}
											className={classNames('question-choice', {
												'question-choice--correct': isCorrect,
											})}
										>
											{choice.text}
											<span className="sr-only">
												{' '}{t(`questionsList.srHints.${isCorrect ? 'correct' : 'wrong'}`)}
											</span>
										</li>
									);

								})}
							</ol>

							{isDefined(user) && isAdmin(user) && (
								<Link
									className="question-edit-btn"
									name={R_PACKAGE_QUESTION}
									payload={{
										packageId,
										questionId: id,
									}}
								>
									{t(`questionsList.edit`)}
								</Link>
							)}

						</li>
					);

				})}

			</ol>

		</>
	);

};

export default CategoryPage;
