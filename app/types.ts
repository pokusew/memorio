"use strict";


export interface AppState {
	locale: string;
	soundEffects: boolean;
}

export interface Score {
	correct: number;
	wrong: number;
}

export interface Package {
	id: string;
	locale: string;
	name: string;
	description: string;
	_numCategories: number;
	_numQuestions: number;
}

export interface Category {
	id: string;
	package: string;
	name: string;
	number: number;
	_numQuestions: number;
}

export interface AbstractQuestion {
	id: string;
	package: string;
	category: string;
	number?: number | undefined;
	type: string;
}

// export interface OpenQuestion {
// 	type: 'open';
// }

// a for lowercase letters
// A for uppercase letters
// i for lowercase Roman numerals
// I for uppercase Roman numerals
// 1 for numbers (default)
// export const NUMBERING_TYPE_LETTERS_LOWER

export interface Choice {
	id: number;
	text: string;
}

export interface ChoiceQuestion extends AbstractQuestion {
	type: 'choice';
	text: string;
	multiple: boolean;
	// numberingType: 'a' | 'A' | 'i' | 'I' | 1;
	correct: number[];
	choices: Choice[];
}

export type Question = ChoiceQuestion;

export interface FullPackage extends Package {
	categories: Category[];
	questions: Question[];
}

export interface UserPracticeData {
	lastPractice?: Date | undefined;
	score?: Score | undefined;
}

export interface WithUserPracticeData {
	userPracticeData: UserPracticeData;
}

export type LocalPackage = Package & WithUserPracticeData;

export type LocalCategory = Category & WithUserPracticeData;

export type LocalQuestion = Question & WithUserPracticeData;

export type LocalFullPackage = LocalPackage & {
	categories: LocalCategory[];
	questions: LocalQuestion[];
};

export const PRACTICE_MODE_PROGRESS = 'progress';
export const PRACTICE_MODE_RANDOM = 'random';
export const PRACTICE_MODE_ORDER = 'order';

export type PracticeMode =
	| typeof PRACTICE_MODE_PROGRESS
	| typeof PRACTICE_MODE_RANDOM
	| typeof PRACTICE_MODE_ORDER;
