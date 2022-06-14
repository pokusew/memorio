"use strict";

import React, { ChangeEventHandler, FormEventHandler, useCallback, useState } from 'react';
import { Input, Option, SelectInput, TextArea } from './inputs';
import { Button } from './common';
import { IS_DEVELOPMENT, isDefined } from '../helpers/common';
import { useFormatMessageId } from '../helpers/hooks';
import { Question, QuestionData } from '../types';
import classNames from 'classnames';
import { QuestionsListItem } from './questions';
import IconArrowUpLongRegular
	from '-!svg-react-loader?name=IconArrowUpLongRegular!../images/icons/arrow-up-long-regular.svg';
import IconArrowDownLongRegular
	from '-!svg-react-loader?name=IconArrowDownLongRegular!../images/icons/arrow-down-long-regular.svg';
import IconPlusRegular from '-!svg-react-loader?name=IconPlusRegular!../images/icons/plus-regular.svg';
import IconXMarkRegular from '-!svg-react-loader?name=IconXMarkRegular!../images/icons/xmark-regular.svg';


// TODO: switch to some forms library (preferably finish our forms-experimental)

interface Field<T> {
	value: T | undefined;
	touched: boolean;
	handler: (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, thisField: Field<T>) => boolean;
}

const INTEGER_HANDLER = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, thisField: Field<number>) => {

	let newValue: string | number | undefined = el.value === ''
		? undefined
		: el.value;

	if (newValue !== undefined) {
		newValue = parseInt(newValue);
		if (!Number.isInteger(newValue)) {
			return false;
		}
	}

	if (newValue !== thisField.value) {
		thisField.value = newValue;
		thisField.touched = true;
		return true;
	}

	return false;

};

const STRING_HANDLER = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, thisField: Field<string>) => {

	const newValue: string | undefined = el.value === ''
		? undefined
		: el.value;

	if (newValue !== thisField.value) {
		thisField.value = newValue;
		thisField.touched = true;
		return true;
	}

	return false;

};

const BOOLEAN_HANDLER = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, thisField: Field<boolean>) => {

	if (!(el instanceof HTMLInputElement)) {
		return false;
	}

	const newValue: boolean = el.checked;

	if (newValue !== thisField.value) {
		thisField.value = newValue;
		thisField.touched = true;
		return true;
	}

	return false;

};

interface QuestionChoiceState {
	key: number;
	text: Field<string>;
	correct: Field<boolean>;
}

interface QuestionFormState {
	category: Field<string>;
	number: Field<number>;
	disabled: Field<boolean>;
	text: Field<string>;
	choices: QuestionChoiceState[]; // order matters
	lastChoiceKey: number;
	fields: Map<string, Field<any>>;
	submissionAttempted: boolean;
}

const validateQuestionForm = (state: QuestionFormState): Map<string, string> => {

	const errors = new Map<string, string>();

	const {
		category,
		number,
		text,
		choices,
	} = state;

	if (!isDefined(category.value)) {
		errors.set('category', 'forms.errors.fieldRequired');
	}

	if (!isDefined(number.value)) {
		errors.set('number', 'forms.errors.fieldRequired');
	}

	if (isDefined(number.value) && (!Number.isInteger(number.value) || number.value <= 0)) {
		errors.set('number', 'forms.errors.invalidValue');
	}

	if (!isDefined(text.value)) {
		errors.set('text', 'forms.errors.fieldRequired');
	}

	choices.forEach((choice) => {

		if (!isDefined(choice.text.value)) {
			errors.set(`choices[${choice.key}].text`, 'forms.errors.fieldRequired');
		}

	});

	return errors;

};

export interface QuestionFormProps {
	initialValues?: Partial<Question>;
	categories: Option[];
	onSubmit: (data: Omit<Question, 'id' | 'package'>) => void;
}

const createInitialState = (initialValues: Partial<Question> | undefined): QuestionFormState => {

	const initialCorrectSet = new Set<number>(initialValues?.correct ?? []);

	const category: Field<string> = {
		value: initialValues?.category,
		touched: false,
		handler: STRING_HANDLER,
	};

	const number: Field<number> = {
		value: initialValues?.number,
		touched: false,
		handler: INTEGER_HANDLER,
	};

	const disabled: Field<boolean> = {
		value: initialValues?.disabled ?? false,
		touched: false,
		handler: BOOLEAN_HANDLER,
	};

	const text: Field<string> = {
		value: initialValues?.text,
		touched: false,
		handler: STRING_HANDLER,
	};

	const choices: QuestionChoiceState[] = initialValues?.choices?.map(
		({ id, text }, index) => ({
			key: index,
			text: {
				value: text,
				touched: false,
				handler: STRING_HANDLER,
			},
			correct: {
				value: initialCorrectSet.has(id),
				touched: false,
				handler: BOOLEAN_HANDLER,
			},
		}),
	) ?? [];
	const lastChoiceKey = choices.length - 1;

	const fields = new Map<string, Field<any>>();
	fields.set('category', category);
	fields.set('number', number);
	fields.set('disabled', disabled);
	fields.set('text', text);
	choices.forEach(({ key, text, correct }) => {
		fields.set(`choices[${key}].text`, text);
		fields.set(`choices[${key}].correct`, correct);
	});

	return {
		category,
		number,
		disabled,
		text,
		choices,
		lastChoiceKey,
		fields,
		submissionAttempted: false,
	};

};

const formStateToQuestion = (formState: QuestionFormState): QuestionData => ({
	category: formState.category.value ?? '',
	number: formState.number.value,
	disabled: formState.disabled.value ?? false,
	type: 'choice',
	text: formState.text.value ?? '',
	multiple: true,
	correct: formState.choices
		.reduce(
			(correctIds, choice, index) =>
				choice.correct.value ? [...correctIds, index + 1] : correctIds,
			[],
		),
	choices: formState.choices
		.map(({ text }, index) => ({ id: index + 1, text: text.value ?? '' })),
});

const createIsValid = (formState: QuestionFormState, errors: Map<string, string>) => (fieldName: string): boolean => {

	const field = formState.fields.get(fieldName);

	if (!isDefined(field)) {
		return false;
	}

	return (!formState.submissionAttempted && !field.touched) || !isDefined(errors.get(fieldName));

};

const createGetError = (formState: QuestionFormState, errors: Map<string, string>) => (fieldName: string): string | undefined => {

	const field = formState.fields.get(fieldName);

	if (!isDefined(field)) {
		return undefined;
	}

	if (formState.submissionAttempted || field.touched) {
		return errors.get(fieldName);
	}

	return undefined;

};

const CHOICE_ACTIONS = new Set<string>(['moveUp', 'moveDown', 'delete', 'addNew']);

const QuestionForm = ({ initialValues, categories, onSubmit }: QuestionFormProps) => {

	const t = useFormatMessageId();

	const [formState, setFormState] = useState<QuestionFormState>(createInitialState(initialValues));

	const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>((event) => {
		event.preventDefault();

		const errors = validateQuestionForm(formState);

		if (errors.size > 0) {
			if (!formState.submissionAttempted) {
				setFormState(prevState => ({
					...prevState,
					submissionAttempted: true,
				}));
			}
			return;
		}

		onSubmit(formStateToQuestion(formState));

	}, [formState, onSubmit]);

	const handleInputChange = useCallback<ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>>((event) => {

		const currentTarget = event.currentTarget;
		const name = currentTarget.name;

		setFormState(prevState => {

			const field = prevState.fields.get(name);

			// field does not exist or this event did not change its value
			if (!isDefined(field) || !field.handler(currentTarget, field)) {
				return prevState;
			}

			// fields was changed (during field.handler call, return new state)
			return { ...prevState };

		});

	}, [setFormState]);

	const errors = validateQuestionForm(formState);

	const isValid = createIsValid(formState, errors);
	const getError = createGetError(formState, errors);

	const question = formStateToQuestion(formState);

	const handleAction = useCallback<React.MouseEventHandler<HTMLButtonElement>>(event => {

		event.preventDefault();

		const btnEl = event.currentTarget;
		const action = btnEl.name;

		if (!CHOICE_ACTIONS.has(action)) {
			return;
		}

		let index: number | undefined = undefined;

		if (action !== 'addNew') {
			const choiceEl = btnEl.closest('.question-choice');
			if (!(choiceEl instanceof HTMLLIElement) || choiceEl.value <= 0) {
				return;
			}
			index = choiceEl.value - 1;
		}

		setFormState(prevState => {

			const fields = prevState.fields;

			if (action === 'addNew') {
				const newChoiceId = prevState.lastChoiceKey + 1;
				const newChoice: QuestionChoiceState = {
					key: newChoiceId,
					text: {
						value: undefined,
						touched: false,
						handler: STRING_HANDLER,
					},
					correct: {
						value: false,
						touched: false,
						handler: BOOLEAN_HANDLER,
					},
				};
				// we should not mutate state...
				fields.set(`choices[${newChoiceId}].text`, newChoice.text);
				fields.set(`choices[${newChoiceId}].correct`, newChoice.correct);
				return {
					...prevState,
					choices: [
						...prevState.choices,
						newChoice,
					],
					lastChoiceKey: newChoiceId,
				};
			}

			// the rest of the actions require a valid index
			if (!isDefined(index) || index >= prevState.choices.length) {
				return prevState;
			}

			if (action === 'delete') {
				const choice = prevState.choices[index];
				// we should not mutate state...
				fields.delete(`choices[${choice.key}].text`);
				fields.delete(`choices[${choice.key}].correct`);
				return {
					...prevState,
					choices: prevState.choices.filter(c => c.key !== choice.key),
				};
			}

			if (action === 'moveUp') {
				if (index === 0) {
					// this choice is already the upper-most one
					return prevState;
				}
				const newChoices = [...prevState.choices];
				const choiceBeingMoved = newChoices[index];
				newChoices[index] = newChoices[index - 1];
				newChoices[index - 1] = choiceBeingMoved;
				return {
					...prevState,
					choices: newChoices,
				};
			}

			if (action === 'moveDown') {
				if (index === prevState.choices.length - 1) {
					// this choice is already the down-most one
					return prevState;
				}
				const newChoices = [...prevState.choices];
				const choiceBeingMoved = newChoices[index];
				newChoices[index] = newChoices[index + 1];
				newChoices[index + 1] = choiceBeingMoved;
				return {
					...prevState,
					choices: newChoices,
				};
			}

			// this should not happen unknown action
			return prevState;

		});

	}, [setFormState]);

	IS_DEVELOPMENT && console.log(`[QuestionForm] rendering`, formState, errors);

	return (
		<form
			id="question-form"
			className="question-form"
			name="question"
			onSubmit={handleSubmit}
		>

			<div className="question-form-editor">

				<div className="question-form-editor-meta">
					<SelectInput
						id="question--category"
						label="questionForm.labels.category"
						name="category"
						prompt="forms.prompt"
						options={categories}
						value={formState.category.value ?? ''}
						onChange={handleInputChange}
						valid={isValid('category')}
						error={getError('category')}
					/>

					<Input
						type="number"
						id="question--number"
						label="questionForm.labels.number"
						name="number"
						value={formState.number.value ?? ''}
						onChange={handleInputChange}
						valid={isValid('number')}
						error={getError('number')}
					/>

					<input
						className="question-disabled-checkbox option-checkbox"
						id="question--disabled"
						name="disabled"
						type="checkbox"
						checked={formState.disabled.value ?? false}
						onChange={handleInputChange}
					/>
				</div>

				<TextArea
					type="text"
					id="question--text"
					label="questionForm.labels.questionText"
					name="text"
					value={formState.text.value ?? ''}
					onChange={handleInputChange}
					valid={isValid('text')}
					error={getError('text')}
					rows={6}
				/>

				<ol className="question-editable-choices">
					{formState.choices.map((choice, index) => {

						const withPrefix = (name: string) => `choices[${choice.key}].${name}`;

						return (
							<li
								key={choice.key}
								value={index + 1}
								className={classNames('question-choice', {
									'question-choice--correct': choice.correct.value ?? false,
								})}
							>
								<div className="question-choice-correct-toggle">
									<input
										className="question-choice-checkbox option-checkbox"
										id={`question--${withPrefix('text')}-correct`}
										name={withPrefix('correct')}
										type="checkbox"
										checked={choice.correct.value ?? false}
										onChange={handleInputChange}
									/>
								</div>
								<div className="question-choice-actions">
									<Button name="moveUp" onClick={handleAction} className="btn-action btn-primary">
										<IconArrowUpLongRegular className="icon" />
									</Button>
									<Button name="moveDown" onClick={handleAction} className="btn-action btn-warning">
										<IconArrowDownLongRegular className="icon" />
									</Button>
									<Button name="delete" onClick={handleAction} className="btn-action btn-danger">
										<IconXMarkRegular className="icon" />
									</Button>
								</div>
								<TextArea
									id={`question--${withPrefix('text')}-text`}
									label="questionForm.labels.choiceText"
									name={withPrefix('text')}
									value={choice.text.value ?? ''}
									onChange={handleInputChange as any}
									valid={isValid(withPrefix('text'))}
									error={getError(withPrefix('text'))}
									rows={4}
								/>
							</li>
						);

					})}
				</ol>

				<Button name="addNew" onClick={handleAction} className="btn-add-choice btn-with-icon">
					<IconPlusRegular className="icon" /> {t('questionForm.addChoice')}
				</Button>

				<div className="btn-group">
					<Button
						label="questionForm.submit"
						style="primary"
						type="submit"
					/>
				</div>

			</div>

			<div className="question-form-preview">
				<ol className="questions-list">
					<QuestionsListItem
						question={question}
						showEditButton={false}
					/>
				</ol>
			</div>

		</form>
	);

};

export default QuestionForm;
