"use strict";

import React, { useCallback, useState } from 'react';
import { useFormatMessageId } from '../helpers/hooks';
import {
	LocalFullPackage,
	PRACTICE_MODE_ORDER,
	PRACTICE_MODE_PROGRESS,
	PRACTICE_MODE_RANDOM,
	PracticeMode,
} from '../types';
import { CheckboxListInput, Option, SelectInput } from './inputs';


export type PracticeSetupFormSubmitHandler = (mode: PracticeMode, categories: Set<string>) => void;

export interface PracticeSetupFormProps {
	package: LocalFullPackage;
	onSubmit: PracticeSetupFormSubmitHandler;
}

export interface PracticeSetupFormState {
	pack: LocalFullPackage;
	mode: PracticeMode;
	categoryOptions: Option[];
	categoriesAll: Set<string>;
	categoriesSelected: Set<string>;
}

export const setMode = (mode: PracticeMode) => (prevState: PracticeSetupFormState): PracticeSetupFormState => {

	return {
		...prevState,
		mode,
	};

};

export const toggleNone = (prevState: PracticeSetupFormState): PracticeSetupFormState => ({
	...prevState,
	categoriesSelected: new Set<string>(),
});

export const toggleAll = (prevState: PracticeSetupFormState): PracticeSetupFormState => ({
	...prevState,
	categoriesSelected: new Set<string>(prevState.categoriesAll),
});

export const createInitialPracticeSetupFormState = (pack: LocalFullPackage): PracticeSetupFormState => {

	const categories = pack.categories.map(({ id, name, _numQuestions }) => ({
		label: `${name} (${_numQuestions})`,
		value: `${id}`,
	}));

	return {
		pack,
		mode: PRACTICE_MODE_PROGRESS,
		categoryOptions: categories,
		categoriesAll: new Set<string>(pack.categories.map(({ id }) => id.toString())),
		categoriesSelected: new Set<string>(pack.categories.map(({ id }) => id.toString())),
	};

};

export const toggleCategory = (categoryId: string) => (prevState: PracticeSetupFormState): PracticeSetupFormState => {

	if (!prevState.categoriesAll.has(categoryId)) {
		// attempted to select an invalid category
		return prevState;
	}

	// in React, state should not be mutated
	const categoriesSelected = new Set<string>(prevState.categoriesSelected);

	if (categoriesSelected.has(categoryId)) {
		categoriesSelected.delete(categoryId);
	} else {
		categoriesSelected.add(categoryId);
	}

	return {
		...prevState,
		categoriesSelected,
	};

};

const MODE_OPTIONS: Option[] = [
	{
		value: PRACTICE_MODE_PROGRESS,
		label: 'practiceSetupForm.values.mode.progress',
	},
	{
		value: PRACTICE_MODE_RANDOM,
		label: 'practiceSetupForm.values.mode.random',
	},
	{
		value: PRACTICE_MODE_ORDER,
		label: 'practiceSetupForm.values.mode.order',
	},
];

export const PracticeSetupForm = (props: PracticeSetupFormProps) => {

	const t = useFormatMessageId();

	const { package: pack, onSubmit } = props;

	const [state, setState] = useState<PracticeSetupFormState>(createInitialPracticeSetupFormState(pack));

	const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>((event) => {

		event.preventDefault();

		if (state.categoriesSelected.size > 0) {
			const categories = new Set([...state.categoriesSelected.values()]);
			onSubmit(state.mode, categories);
		}

	}, [state, onSubmit]);

	const handleModeChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>((event) => {
		setState(setMode(event.target.value as PracticeMode));
	}, [setState]);

	const handleCategoryChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
		const categoryId = event.target.value;
		setState(toggleCategory(categoryId));
	}, [setState]);

	const handleSelectAll = useCallback<React.MouseEventHandler<HTMLButtonElement>>(event => {
		event.preventDefault();
		setState(toggleAll);
	}, [setState]);

	const handleSelectNone = useCallback<React.MouseEventHandler<HTMLButtonElement>>(event => {
		event.preventDefault();
		setState(toggleNone);
	}, [setState]);

	return (
		<form
			name="practice-setup"
			className="practice-setup-form"
			onSubmit={handleSubmit}
		>

			<SelectInput
				id="practice-setup--mode"
				name="mode"
				options={MODE_OPTIONS}
				label="practiceSetupForm.labels.mode"
				value={state.mode}
				onChange={handleModeChange}
			/>

			<CheckboxListInput
				id="practice-setup--category"
				name="category"
				label="practiceSetupForm.labels.category"
				options={state.categoryOptions}
				value={state.categoriesSelected}
				onChange={handleCategoryChange}
				onSelectAll={handleSelectAll}
				onSelectNone={handleSelectNone}
				valid={state.categoriesSelected.size !== 0}
				error={state.categoriesSelected.size === 0 ? `practiceSetupForm.errors.atLeastOneCategory` : undefined}
			/>

			<button
				type="submit"
				name="submit"
				className="btn btn-lg btn-primary"
			>
				{t(`practiceSetupForm.submit`)}
			</button>

		</form>
	);

};
