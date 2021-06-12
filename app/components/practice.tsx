"use strict";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from '../router/compoments';
import { R_ROOT, R_SETTINGS } from '../routes';
import { useFormatMessageId, useFormatMessageIdAsTagFn } from '../helpers/hooks';
import { AbstractQuestion, Choice, Question } from '../types';
import classNames from 'classnames';
import { isDefined } from '../helpers/common';


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

	return (
		<li
			className={classNames('question-choice', {
				'question-choice--correct': correct === true,
				'question-choice--wrong': correct === false,
				'question-choice--selected': selected,
			})}
			data-value={choice.id}
			onClick={onClick}
		>
			<input
				className="question-choice-checkbox"
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
		</li>
	);

};

export interface QuestionFormProps {
	question: Question;
}

export interface QuestionFormState {
	question: Question;
	choicesCorrect: Map<number, boolean>;
	choicesSelected: Map<number, boolean>;
	validation: {
		correct: boolean;
		choices: Map<number, boolean>;
	} | undefined,
}

export const validate = (prevState: QuestionFormState): QuestionFormState => {

	// already validated
	if (isDefined(prevState.validation)) {
		return prevState;
	}

	console.log(`[validate] validating`);

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

export const toggleChoice = (choiceId: number) => (prevState: QuestionFormState): QuestionFormState => {

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

export const createInitialQuestionFormStateFromQuestion = (question: Question): QuestionFormState => {

	const correct = new Set<number>(question.correct);

	return {
		question,
		choicesCorrect: new Map<number, boolean>(question.choices.map(({ id }) => [id, correct.has(id)])),
		choicesSelected: new Map<number, boolean>(question.choices.map(({ id }) => [id, false])),
		validation: undefined,
	};

};

export const QuestionForm = (
	{
		question,
	}: QuestionFormProps,
) => {

	const t = useFormatMessageId();

	const [state, setState] = useState<QuestionFormState>(createInitialQuestionFormStateFromQuestion(question));

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

	useEffect(() => {

		const handler = (event: KeyboardEvent) => {

			if (event.repeat) {
				return;
			}

			// page wide Enter to submit the form (not only when a input in the form has focus)
			if (event.key === 'Enter') {
				event.preventDefault();
				setState(validate);
				return;
			}

			const choiceId = keyToChoiceId(event.key);

			if (isDefined(choiceId)) {
				setState(toggleChoice(choiceId));
			}

		};

		window.addEventListener('keydown', handler);

		return () => {
			window.removeEventListener('keydown', handler);
		};

	}, [setState]);

	console.log(`[QuestionForm] render`, state);

	return (
		<form
			className="question-form"
			name="question"
			onSubmit={handleSubmit}
		>
			<div className="question-note">
				{t(`questionForm.types.${question.multiple ? 'multiple' : 'single'}Choice`)}
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
						<p className="question-validation-message">
							{t(
								`questionForm.validation.${state.validation.correct ? 'correct' : 'wrong'}`,
								{
									strong: chunks => <strong>{chunks}</strong>,
								},
							)}
						</p>
						<button type="button" name="next" className="btn btn-lg btn-primary">
							{t('questionForm.actions.next')}
						</button>

					</>
				) : (
					<button type="submit" name="submit" className="btn btn-lg btn-primary">
						{t('questionForm.actions.validate')}
					</button>
				)}

		</form>
	);

};
