"use strict";

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useDocumentTitle, useFormatMessageId } from '../helpers/hooks';
import { packages, updateQuestion } from '../data/queries';
import { useQuery } from '../data/hooks';
import { useRoute } from '../router/hooks';
import { IS_DEVELOPMENT, isDefined } from '../helpers/common';
import { LoadingScreen } from '../components/layout';
import NotFoundPage from './NotFoundPage';
import { LocalQuestion, QuestionData } from '../types';
import { R_PACKAGE_QUESTION } from '../routes';
import { Breadcrumbs } from '../components/breadcrumbs';
import { Link } from '../router/compoments';
import QuestionForm from '../components/question-form';
import { Button } from '../components/common';
import { useConfiguredFirebase } from '../firebase/hooks';
import { useOnKeyDownEvent } from '../helpers/keyboard';
import IconArrowLeftLongRegular
	from '-!svg-react-loader?name=IconArrowLeftLongRegular!../images/icons/arrow-left-long-regular.svg';
import IconArrowRightLongRegular
	from '-!svg-react-loader?name=IconArrowRightLongRegular!../images/icons/arrow-right-long-regular.svg';


interface UpdateOperationRunning {
	state: 'running';
	questionId: string;
}

interface UpdateOperationSuccess {
	state: 'success';
	questionId: string;
}

interface UpdateOperationError {
	state: 'error';
	questionId: string;
}

type UpdateOperationState = UpdateOperationRunning | UpdateOperationSuccess | UpdateOperationError;

const QuestionPage = () => {

	const t = useFormatMessageId();

	const { db } = useConfiguredFirebase();

	const { route, router } = useRoute();

	const packageId = route?.payload?.packageId as string;

	const questionId = route?.payload?.questionId as string;

	const query = useMemo(() => packages.findOneById(packageId), [packageId]);

	const [op, updateData] = useQuery(query);

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

		console.log(event);
		if (event.key === 'p' && event.ctrlKey && isDefined(prevQuestionId)) {
			router.redirect(R_PACKAGE_QUESTION, {
				packageId,
				questionId: prevQuestionId,
			});
		} else if (event.key === 'n' && event.ctrlKey && isDefined(nextQuestionId)) {
			router.redirect(R_PACKAGE_QUESTION, {
				packageId,
				questionId: nextQuestionId,
			});
		} else if (event.key === 's' && event.ctrlKey && isDefined(question)) {
			const questionForm = document.getElementById('question-form');
			if (questionForm instanceof HTMLFormElement) {
				questionForm.requestSubmit();
			}
		}

	}, [router, packageId, prevQuestionId, nextQuestionId]);

	useOnKeyDownEvent(handleKeyDownEvent);

	const [lastUpdateOperationResult, setLastUpdateOperationResult] = useState<UpdateOperationState | undefined>(undefined);

	useEffect(() => {

		let didCleanup = false;
		let timeout: number | null = null;

		if (isDefined(lastUpdateOperationResult) && lastUpdateOperationResult.state !== 'running') {
			timeout = window.setTimeout(() => {
				if (didCleanup) {
					return;
				}
				timeout = null;
				setLastUpdateOperationResult(undefined);
			}, 2000);
		}

		return () => {
			didCleanup = true;
			if (isDefined(timeout)) {
				window.clearTimeout(timeout);
			}
		};

	}, [lastUpdateOperationResult, setLastUpdateOperationResult]);

	const handleSubmit = useCallback((data: QuestionData) => {
		if (!isDefined(question)) {
			return;
		}
		IS_DEVELOPMENT && console.log('[QuestionPage][handleSubmit]', data);
		setLastUpdateOperationResult({ state: 'running', questionId: question.id });
		updateQuestion(db, question.id, question.package, data)
			.then(() => {
				console.log(`[handleSubmit] successfully updated`);
				setLastUpdateOperationResult({ state: 'success', questionId: question.id });
				updateData((prevData => {

					if (!isDefined(prevData)) {
						return prevData;
					}

					return {
						...prevData,
						questions: prevData.questions.map(q => q.id !== question.id ? q : ({
							...q,
							...data,
						})),
					};

				}));
			})
			.catch(err => {
				console.log(`[handleSubmit] an error during updateQuestion`, err);
				setLastUpdateOperationResult({ state: 'error', questionId: question.id });
			});
	}, [db, question, updateData]);

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

	return (
		<>

			<Breadcrumbs
				name={R_PACKAGE_QUESTION}
				packageId={pack.id}
				packageName={pack.name}
				questionId={question.id}
				questionName={question.number?.toString() ?? '??'}
			/>

			<span className="sr-only">{t(`questionPage.heading`)}</span>

			<div className="question-editor-toolbar">
				{isDefined(prevQuestionId) && (
					<Link
						className="btn btn-flex btn-prev"
						name={R_PACKAGE_QUESTION}
						payload={{
							packageId,
							questionId: prevQuestionId,
						}}
					>
						<IconArrowLeftLongRegular className="icon" />
						<span className="sr-only">{t(`questionPage.prevQuestion`)}</span>
						<kbd>Ctrl + P</kbd>
					</Link>
				)}

				<Button
					form="question-form"
					style="success"
					className="btn-flex"
					type="submit"
				>
					{t('questionPage.save')} <kbd>Ctrl + S</kbd>
				</Button>

				{isDefined(lastUpdateOperationResult) && (
					<div className="last-update-operation">
						{t(`questionPage.lastUpdateOperation.${lastUpdateOperationResult.state}`, {
							questionId: lastUpdateOperationResult.questionId,
						})}
					</div>
				)}

				{isDefined(nextQuestionId) && (
					<Link
						className="btn btn-flex btn-next"
						name={R_PACKAGE_QUESTION}
						payload={{
							packageId,
							questionId: nextQuestionId,
						}}
					>
						<kbd>Ctrl + N</kbd>
						<span className="sr-only">{t(`questionPage.nextQuestion`)}</span>
						<IconArrowRightLongRegular className="icon" />
					</Link>
				)}
			</div>

			<QuestionForm
				key={question.id}
				initialValues={question}
				categories={op.data.categories.map(c => ({ value: c.id, label: c.name, raw: true }))}
				onSubmit={handleSubmit}
			/>

		</>
	);

};

export default QuestionPage;
