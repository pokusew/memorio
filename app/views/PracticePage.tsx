"use strict";

import React, { useCallback, useMemo, useState } from 'react';
import {
	useDocumentTitle,
	useFormatMessageId,
	useFormatMessageIdAsTagFn,
	useStoreValueSoundEffects,
} from '../helpers/hooks';
import { packages, updateScore } from '../data/queries';
import { useQuery } from '../data/hooks';
import { LocalFullPackage, LocalQuestion, PracticeMode } from '../types';
import { useRoute } from '../router/hooks';
import { isDefined } from '../helpers/common';
import { LoadingScreen } from '../components/layout';
import NotFoundPage from './NotFoundPage';
import { NextQuestionHandler, QuestionPracticeForm, UpdateScoreHandler } from '../components/question-practice-form';
import { PracticeSetupForm, PracticeSetupFormSubmitHandler } from '../components/practice-setup-form';
import { R_PACKAGE, R_PACKAGE_PRACTICE, R_SETTINGS } from '../routes';
import { Breadcrumbs } from '../components/breadcrumbs';
import { Link } from '../router/compoments';
import { SoundPlayer } from '../sounds/sound-player';
import { sortByOrder, sortByRandom, sortByScore } from '../helpers/score';
import { useAppUser, useConfiguredFirebase } from '../firebase/hooks';

const STATE_INITIAL = 'initial';
const STATE_PRACTICE = 'practice';

interface PracticePageStateInitial {
	pack: LocalFullPackage;
	state: typeof STATE_INITIAL;
}

interface PracticePageStatePractice {
	pack: LocalFullPackage;
	state: typeof STATE_PRACTICE;
	mode: PracticeMode;
	categories: Set<string>;
	questions: LocalQuestion[];
	index: number;
}

type PracticePageState = (PracticePageStateInitial | PracticePageStatePractice) & { player: SoundPlayer };

interface PracticePageProps {
	package: LocalFullPackage;
}

export const createPracticeQuestions = (mode: PracticeMode, categories: Set<string>, allQuestions: LocalQuestion[]) => {

	const questions = allQuestions.filter(({ category }) => categories.has(category));

	switch (mode) {
		case 'progress':
			sortByScore(questions);
			break;
		case 'random':
			sortByRandom(questions);
			break;
		case 'order':
			sortByOrder(questions);
			break;
	}

	return questions;

};

const PracticePage = (props: PracticePageProps) => {

	const t = useFormatMessageId();

	const { db } = useConfiguredFirebase();
	const user = useAppUser();

	const [soundEffects] = useStoreValueSoundEffects();

	const [state, setState] = useState<PracticePageState>(() => ({
		player: new SoundPlayer(),
		pack: props.package,
		state: STATE_INITIAL,
	}));

	const handleSetup = useCallback<PracticeSetupFormSubmitHandler>((mode, categories) => {

		setState(prevState => {

			if (prevState.state !== STATE_INITIAL) {
				return prevState;
			}

			return {
				...prevState,
				state: STATE_PRACTICE,
				mode,
				categories,
				questions: createPracticeQuestions(mode, categories, prevState.pack.questions),
				index: 0,
			};

		});

	}, [setState]);

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

		if (state.state !== STATE_PRACTICE) {
			return;
		}

		const packageId = state.questions[state.index].package;
		const categoryId = state.questions[state.index].category;
		const questionId = state.questions[state.index].id;

		console.log(`[handleUpdateScore]`, questionId, correct);

		if (isDefined(user)) {
			updateScore(
				db,
				user,
				user.data.practiceDataVersion,
				packageId,
				categoryId,
				questionId,
				new Date(),
				correct,
			)
				.then(() => {
					console.log('[handleUpdateScore] successfully updated');
				})
				.catch(err => {
					console.error(`[handleUpdateScore] updateScore failed`, err);
				});
		}

		if (soundEffects) {
			if (correct) {
				state.player.playCorrectAnswer();
			} else {
				state.player.playWrongAnswer();
			}
		}


	}, [state, db, user, soundEffects]);

	if (state.state == STATE_INITIAL) {
		return (

			<>

				<Breadcrumbs
					name={R_PACKAGE_PRACTICE}
					packageId={state.pack.id}
					packageName={state.pack.name}
				/>

				<h1>{t(`titles.practice`)}</h1>

				<PracticeSetupForm
					package={state.pack}
					onSubmit={handleSetup}
				/>

				<h2>{t(`practicePage.tipsHeading`)}</h2>

				<ul>
					{t(`practicePage.tips`, {
						li: chunks => <li>{chunks}</li>,
						kbd: chunks => <kbd className="dark">{chunks}</kbd>,
						settings: chunks => <Link name={R_SETTINGS}>{chunks}</Link>,
					})}
				</ul>

			</>

		);
	}

	if (state.index >= state.questions.length) {
		return (
			<>

				<Breadcrumbs
					name={R_PACKAGE_PRACTICE}
					packageId={state.pack.id}
					packageName={state.pack.name}
				/>

				<h1>{t(`practicePage.finishedHeading`)}</h1>

				<p>{t(`practicePage.finished`)}</p>

				<Link
					className="btn btn-lg btn-primary"
					name={R_PACKAGE}
					payload={{ packageId: state.pack.id }}
				>
					{t(`practicePage.backToPackage`)}
				</Link>

			</>
		);
	}

	const question = state.questions[state.index];

	return (
		<>

			{/* NOTE: The key is needed to trigger new component creation instead of just update
			          (needed because of the question form internal state) */}
			<QuestionPracticeForm
				key={question.id}
				question={question}
				onUpdateScore={handleUpdateScore}
				onNextQuestion={handleNextQuestion}
			/>

		</>
	);

};

const PracticePageWrapper = () => {

	const t = useFormatMessageIdAsTagFn();

	const { route } = useRoute();

	const id = route?.payload?.packageId as string;

	const query = useMemo(() => packages.findOneById(id), [id]);

	const [op] = useQuery(query);

	useDocumentTitle(t`titles.practice`);

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

	// console.log(`[PracticePageWrapper] render`);

	return (
		<PracticePage
			key={pack.id}
			package={pack}
		/>
	);

};

export default PracticePageWrapper;
