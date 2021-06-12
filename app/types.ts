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
	id: number;
	version: number;
	locale: string;
	name: string;
	description: string;
	numCategories: number; // precomputed by API
	numQuestions: number; // precomputed by API
}

export interface Category {
	id: number;
	package: number;
	name: string;
	number?: number | undefined;
	numQuestions: number; // precomputed by API
}

export interface AbstractQuestion {
	id: number;
	package: number;
	category: number;
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

export interface LocalData {
	lastPractice?: Date | undefined;
	score?: Score | undefined;
}

export type LocalPackage = Package & LocalData;

export type LocalCategory = Category & LocalData;

export type LocalQuestion = Question & LocalData;

export type LocalFullPackage = LocalPackage & {
	categories: LocalCategory[];
	questions: LocalQuestion[];
};
