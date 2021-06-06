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
	name: string;
}

export interface Category {
	id: number;
	package: number;
	name: string;
}

export interface AbstractQuestion {
	id: number;
	package: number;
	category: number;
	type: string;
}

export interface OpenQuestion {
	type: 'open';
}

// a for lowercase letters
// A for uppercase letters
// i for lowercase Roman numerals
// I for uppercase Roman numerals
// 1 for numbers (default)
// export const NUMBERING_TYPE_LETTERS_LOWER

export interface ChoiceQuestion {
	type: 'choice';
	multiple: boolean;
	// numberingType:
	choices: string[];
}

export type Question = ChoiceQuestion;

