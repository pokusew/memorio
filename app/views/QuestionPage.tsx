"use strict";

import React, { useCallback, useMemo } from 'react';

import { useDocumentTitle, useFormatMessageId } from '../helpers/hooks';
import { packages } from '../data/queries';
import { useQuery } from '../data/hooks';
import { useRoute } from '../router/hooks';
import { isDefined } from '../helpers/common';
import { LoadingScreen } from '../components/layout';
import NotFoundPage from './NotFoundPage';
import { LocalQuestion } from '../types';
import classNames from 'classnames';
import { R_PACKAGE_QUESTION } from '../routes';
import { Breadcrumbs } from '../components/breadcrumbs';
import { useOnKeyDownEvent } from '../helpers/keyboard';
import { Link } from '../router/compoments';


const QuestionPage = () => {

	const t = useFormatMessageId();

	const { route, router } = useRoute();

	const packageId = route?.payload?.packageId as string;

	const questionId = route?.payload?.questionId as string;

	const query = useMemo(() => packages.findOneById(packageId), [packageId]);

	const op = useQuery(query);

	const questionIndex: number = isDefined(op.data)
		? op.data.questions.findIndex(({ id }) => id === questionId)
		: -1;

	const prevQuestionId: string | undefined =
		isDefined(op.data) && questionIndex !== -1 && 0 <= (questionIndex - 1)
			? op.data.questions[questionIndex - 1].id
			: undefined;

	const nextQuestionId: string | undefined =
		isDefined(op.data) && questionIndex !== -1 && (questionIndex + 1) <= op.data.questions.length - 1
			? op.data.questions[questionIndex + 1].id
			: undefined;

	const question: LocalQuestion | undefined = isDefined(op.data) && questionIndex !== -1
		? op.data.questions[questionIndex]
		: undefined;

	const pageTitle = op.loading ? t(`titles.loading`) : !isDefined(question) ? t(`titles.notFound`) : question.number?.toString() ?? '??';

	useDocumentTitle(pageTitle);

	const handleKeyDownEvent = useCallback((event: KeyboardEvent) => {

		if (event.key === 'ArrowLeft' && isDefined(prevQuestionId)) {
			router.redirect(R_PACKAGE_QUESTION, {
				packageId,
				questionId: prevQuestionId,
			});
		} else if (event.key === 'ArrowRight' && isDefined(nextQuestionId)) {
			router.redirect(R_PACKAGE_QUESTION, {
				packageId,
				questionId: nextQuestionId,
			});
		}

	}, [router, packageId, prevQuestionId, nextQuestionId]);

	useOnKeyDownEvent(handleKeyDownEvent);

	if (op.loading) {
		return (
			<LoadingScreen />
		);
	}

	if (!isDefined(op.data) || !isDefined(question)) {
		return (
			<NotFoundPage />
		);
	}

	const pack = op.data;

	const correctSet = new Set(question.correct);

	return (
		<>

			<Breadcrumbs
				name={R_PACKAGE_QUESTION}
				packageId={pack.id}
				packageName={pack.name}
				questionId={question.id}
				questionName={question.number?.toString() ?? '??'}
			/>

			<h2>{t(`questionPage.heading`)}</h2>

			{isDefined(prevQuestionId) && (
				<Link
					className="btn btn-primary"
					name={R_PACKAGE_QUESTION}
					payload={{
						packageId,
						questionId: prevQuestionId,
					}}
				>
					{t(`questionPage.prevQuestion`)}
				</Link>
			)}

			{isDefined(nextQuestionId) && (
				<Link
					className="btn btn-primary"
					name={R_PACKAGE_QUESTION}
					payload={{
						packageId,
						questionId: nextQuestionId,
					}}
				>
					{t(`questionPage.nextQuestion`)}
				</Link>
			)}

			<ol className="questions-list">
				<li className="question" key={question.id} value={question.number}>

					<span className="question-text">{question.text}</span>

					<ol className="question-choices">
						{question.choices.map(choice => {

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
				</li>
			</ol>

		</>
	);

};

export default QuestionPage;
