"use strict";

import React, { useCallback, useEffect, useState } from 'react';
import { useFormatMessageId } from '../helpers/hooks';
import { Choice, Question } from '../types';
import classNames from 'classnames';
import { IS_DEVELOPMENT, isDefined } from '../helpers/common';
import { useOnKeyDownEvent } from '../helpers/keyboard';


export interface ChoiceBoxProps {
	choice: Choice;
	correct: undefined | boolean;
	selected: boolean;
	onClick: React.MouseEventHandler<HTMLLIElement>;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const ChoiceBox = (
	{
		choice,
		correct,
		selected,
		onClick,
		onChange,
	}: ChoiceBoxProps,
) => {

	// validation styles logic
	//
	// - if the question answer is *correct* and it is *selected*
	//   (i.e. the correct answer means that the choice is checked)
	//   => add .question-choice--correct (green background)
	//
	// - if the question answer is *correct* and it is NOT *selected*
	//   (i.e. the correct answer means that the choice is unchecked)
	//   => no styles are added (default gray background)
	//
	// - if the question answer is *wrong*
	//   (it should have been selected and it is NOT,
	//    or it should have NOT been selected and it is)
	//   => add .question-choice--wrong (red background)

	const letterKey = choiceIdToLetterKey(choice.id);


	return (
		<li
			className={classNames('question-choice', {
				'question-choice--correct': selected && correct === true,
				'question-choice--wrong': correct === false,
				'question-choice--selected': selected,
			})}
			data-value={choice.id}
			onClick={onClick}
		>
			<input
				className="question-choice-checkbox option-checkbox"
				id={`question--choice-${choice.id}`}
				name="choice"
				type="checkbox"
				value={choice.id}
				checked={selected}
				onChange={onChange}
				disabled={isDefined(correct)}
			/>
			<label
				className="question-choice-label"
				htmlFor={`question--choice-${choice.id}`}
			>
				{choice.text}
			</label>
			{letterKey && <kbd>{letterKey}</kbd>}
			<kbd>{choice.id}</kbd>
		</li>
	);

};

export interface QuestionPracticeFormState {
	question: Question;
	choicesCorrect: Map<number, boolean>;
	choicesSelected: Map<number, boolean>;
	validation: {
		correct: boolean;
		choices: Map<number, boolean>;
	} | undefined,
}

export const validate = (prevState: QuestionPracticeFormState): QuestionPracticeFormState => {

	// already validated
	if (isDefined(prevState.validation)) {
		return prevState;
	}

	IS_DEVELOPMENT && console.log(`[QuestionPracticeForm/validate] validating`);

	const { question, choicesCorrect, choicesSelected } = prevState;

	return {
		...prevState,
		validation: {
			correct: question.choices.every(({ id }) => choicesCorrect.get(id) === choicesSelected.get(id)),
			choices: new Map<number, boolean>(question.choices.map(({ id }) => [
				id, choicesCorrect.get(id) === choicesSelected.get(id),
			])),
		},
	};

};

export const toggleChoice = (choiceId: number) => (prevState: QuestionPracticeFormState): QuestionPracticeFormState => {

	// state is immutable after the question is validated
	if (isDefined(prevState.validation)) {
		return prevState;
	}

	if (!prevState.choicesSelected.has(choiceId)) {
		return prevState;
	}

	// console.log(`[toggleChoice] choiceId =`, choiceId);

	// copy choicesSelected (in React, state should not be mutated)
	const choicesSelected = new Map<number, boolean>(prevState.choicesSelected);

	// always defined because of !prevState.choicesSelected.has(choiceId)
	const currentValue = choicesSelected.get(choiceId)!;

	choicesSelected.set(choiceId, !currentValue);

	return {
		...prevState,
		choicesSelected,
	};

};

export const keyToChoiceId = (key: string): number | undefined => {

	if (key.length !== 1) {
		return undefined;
	}

	const charCode = key.charCodeAt(0);

	// map characters 1 ... 9 to numbers 1 ... 9
	if (49 <= charCode && charCode <= 57) {
		return charCode - 48;
	}

	// map characters A ... Z to numbers 1 ... 26
	if (65 <= charCode && charCode <= 90) {
		return charCode - 64;
	}

	// map characters a ... z to numbers 1 ... 26
	if (97 <= charCode && charCode <= 122) {
		return charCode - 96;
	}

	// otherwise
	return undefined;

};

export const choiceIdToLetterKey = (choiceId: number): string | undefined => {

	// choiceId === 1 => charCode = 65 => letter A
	const charCode = 64 + choiceId;

	// map characters A ... Z to numbers 1 ... 26
	if (charCode > 90) {
		return undefined;
	}

	return String.fromCharCode(charCode);

};

export const createInitialQuestionPracticeFormStateFromQuestion = (question: Question): QuestionPracticeFormState => {

	const correct = new Set<number>(question.correct);

	return {
		question,
		choicesCorrect: new Map<number, boolean>(question.choices.map(({ id }) => [id, correct.has(id)])),
		choicesSelected: new Map<number, boolean>(question.choices.map(({ id }) => [id, false])),
		validation: undefined,
	};

};

export type UpdateScoreHandler = (correct: boolean) => void;
export type NextQuestionHandler = () => void;


export interface QuestionPracticeFormProps {
	question: Question;
	onUpdateScore: UpdateScoreHandler;
	onNextQuestion: NextQuestionHandler;
}

export const QuestionPracticeForm = (
	{
		question,
		onUpdateScore,
		onNextQuestion,
	}: QuestionPracticeFormProps,
) => {

	const t = useFormatMessageId();

	const [state, setState] = useState<QuestionPracticeFormState>(createInitialQuestionPracticeFormStateFromQuestion(question));

	useEffect(() => {

		if (isDefined(state.validation)) {
			IS_DEVELOPMENT && console.log(`[QuestionPracticeForm] updating score correct = `, state.validation.correct);
			onUpdateScore(state.validation.correct);
		}

	}, [onUpdateScore, state.validation]);

	const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(event => {

		event.preventDefault();

		setState(validate);

	}, [setState]);

	const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(event => {

		// console.log('change');

		const choiceId = parseInt(event.target.value);

		if (Number.isInteger(choiceId)) {
			setState(toggleChoice(choiceId));
		}

	}, [setState]);

	const handleClick = useCallback<React.MouseEventHandler<HTMLLIElement>>(event => {

		// the click event happened on a child of the li element
		if (event.target !== event.currentTarget) {
			return;
		}

		const value = event.currentTarget.getAttribute('data-value');

		// console.log('click', value);

		if (!isDefined(value)) {
			return;
		}

		const choiceId = parseInt(value);

		if (Number.isInteger(choiceId)) {
			setState(toggleChoice(choiceId));
		}

	}, [setState]);

	const handleKeyDownEvent = useCallback((event: KeyboardEvent) => {

		// it may be useful
		// if (event.repeat && event.key !== 'Enter') {
		// 	return;
		// }

		// page wide Enter to submit the form (not only when a input in the form has focus)
		if (event.key === 'Enter') {

			event.preventDefault();

			if (isDefined(state.validation)) {
				onNextQuestion();
				return;
			}

			setState(validate);
			return;

		}

		const choiceId = keyToChoiceId(event.key);

		if (isDefined(choiceId)) {
			setState(toggleChoice(choiceId));
		}

	}, [setState, state.validation, onNextQuestion]);

	useOnKeyDownEvent(handleKeyDownEvent);

	// console.log(`[QuestionPracticeForm] render`, state);

	return (
		<form
			className="question-practice-form"
			name="question"
			onSubmit={handleSubmit}
		>
			<div className="question-note">
				{t(`questionPracticeForm.types.${question.multiple ? 'multiple' : 'single'}Choice`)}
			</div>
			<div className="question-text">
				{question.text}
			</div>
			<ol className="question-choices">
				{question.choices.map(choice => (
					<ChoiceBox
						key={choice.id}
						choice={choice}
						correct={state.validation?.choices.get(choice.id)}
						selected={state.choicesSelected.get(choice.id) ?? false}
						onClick={handleClick}
						onChange={handleChange}
					/>
				))}
			</ol>
			{isDefined(state.validation)
				? (
					<>
						<button
							type="button"
							name="next"
							className="btn btn-lg btn-primary btn-flex"
							onClick={event => {
								event.preventDefault();
								onNextQuestion();
							}}
						>
							{t('questionPracticeForm.actions.next')} <kbd>Enter</kbd>
						</button>
						<p className="question-validation-message">
							{t(
								`questionPracticeForm.validation.${state.validation.correct ? 'correct' : 'wrong'}`,
								{
									strong: chunks => <strong>{chunks}</strong>,
								},
							)}
						</p>
					</>
				) : (
					<button
						type="submit"
						name="submit"
						className="btn btn-lg btn-primary btn-flex"
					>
						{t('questionPracticeForm.actions.validate')} <kbd>Enter</kbd>
					</button>
				)}

		</form>
	);

};
