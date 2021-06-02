"use strict";


export interface AppState {
	locale: string;
}


export interface Dataset {
	id: string;
	name: string;
}

export interface AbstractQuestion {
	type: string;
}

export interface OpenQuestion {
	type: 'open';
}

export interface ChoiceQuestion {
	type: 'choice';
	multiple: boolean;
	choices: string[];
}

export type Question = ChoiceQuestion;

