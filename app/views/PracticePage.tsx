"use strict";

import React, { useCallback, useMemo, useState } from 'react';

import { R_PACKAGE, R_PACKAGE_PRACTICE, R_ROOT } from '../routes';
import { useDocumentTitle, useFormatMessageIdAsTagFn } from '../helpers/hooks';
import { packages } from '../db/queries';
import { useQuery } from '../db/hooks';
import { LocalFullPackage, LocalQuestion } from '../types';
import { useRoute } from '../router/hooks';
import { isDefined } from '../helpers/common';
import { LoadingScreen } from '../components/layout';
import NotFoundPage from './NotFoundPage';
import { NextQuestionHandler, QuestionForm, UpdateScoreHandler } from '../components/practice';
import { Link } from '../router/compoments';
import { Breadcrumbs } from '../components/breadcrumbs';


interface PracticeBoxProps {
	package: LocalFullPackage;
}

const STATE_INITIAL = 'initial';
const STATE_PRACTICE = 'practice';

const MODE_PROGRESS = 'progress';
const MODE_RANDOM = 'random';
const MODE_ORDER = 'order';

interface PracticePageStateInitial {
	state: typeof STATE_INITIAL;
}

interface PracticePageStatePractice {
	state: typeof STATE_PRACTICE;
	mode: typeof MODE_PROGRESS | typeof MODE_RANDOM | typeof MODE_ORDER;
	categories: number[];
	questions: LocalQuestion[];
	index: number;
}

type PracticePageState = PracticePageStateInitial | PracticePageStatePractice;

const PracticePage = () => {

	const t = useFormatMessageIdAsTagFn();

	const { route } = useRoute();

	const idStr = route?.payload?.packageId as string;

	const id = parseInt(idStr);

	const query = useMemo(() => packages.findOneById(id), [id]);

	const op = useQuery(query);

	useDocumentTitle(t`titles.practice`);

	const [state, setState] = useState<PracticePageState>({
		// state: STATE_INITIAL,
		state: STATE_PRACTICE,
		mode: MODE_PROGRESS,
		categories: [],
		questions: [],
		index: 0,
	});

	const handleNextQuestion = useCallback<NextQuestionHandler>(() => {

		setState(prevState => {

			if (prevState.state !== STATE_PRACTICE) {
				return prevState;
			}

			return {
				...prevState,
				index: prevState.index + 1,
			};

		});

	}, [setState]);

	const handleUpdateScore = useCallback<UpdateScoreHandler>(correct => {

		console.log(`[handleUpdateScore]`, state, correct);

	}, [state]);


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

	const pack: LocalFullPackage = op.data;

	if (state.state == STATE_INITIAL) {
		return (

			<>

				<nav className="breadcrumbs">
					<ol>
						<li><Link name={R_ROOT}>{t`titles.home`}</Link></li>
						<li><Link name={R_PACKAGE} payload={{ packageId: id }}>{pack.name}</Link></li>
						<li><Link name={R_PACKAGE_PRACTICE} payload={{ packageId: id }}>{t`titles.practice`}</Link></li>
					</ol>
				</nav>

				<h1>{t`titles.practice`}</h1>

				<button
					type="button"
					className="btn btn-lg btn-primary"
				>
					Začít
				</button>

			</>

		);
	}

	const question = pack.questions[state.index];

	return (
		<>

			<Breadcrumbs
				name={R_PACKAGE_PRACTICE}
				packageId={pack.id}
				packageName={pack.name}
			/>

			<h1>{t`titles.practice`}</h1>

			{/* NOTE: The key is needed to trigger new component creation instead of just update
			          (needed because of the question form internal state) */}
			<QuestionForm
				key={question.id}
				question={question}
				onUpdateScore={handleUpdateScore}
				onNextQuestion={handleNextQuestion}
			/>

		</>
	);

};

export default PracticePage;
