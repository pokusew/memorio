"use strict";

import { LocalQuestion, Score } from '../types';
import { isDefined } from './common';


/**
 * Returns an integer in range [0, 100] (number of percents)
 * @param score
 */
export const scoreToSuccessRate = (score: Score | undefined): number | undefined =>
	isDefined(score) ? Math.round((score.correct * 100) / (score.correct + score.wrong)) : undefined;

// TODO: improve
export const shuffleArray = (o: Array<any>) => {
	// noinspection StatementWithEmptyBodyJS
	for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
};

export const sortByRandom = (questions: LocalQuestion[]) => {
	shuffleArray(questions);
};

/**
 * First the ones without score, then from the lowest score (success rate) to the highest
 * @param questions
 */
export const sortByScore = (questions: LocalQuestion[]) => {

	// question id => score as an integer in range [0, 100] (number of percents)
	const scores = new Map<string, number>(
		questions.map(
			({ id, userPracticeData: { score } }) =>
				[id, scoreToSuccessRate(score) ?? -1],
		),
	);

	questions.sort((a, b) =>
		(scores.get(a.id) ?? 0) - (scores.get(b.id) ?? 0),
	);

};

export const sortByOrder = (questions: LocalQuestion[]) => {
	questions.sort((a, b) =>
		(a.number ?? 0) - (b.number ?? 0),
	);
};
