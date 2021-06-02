"use strict";

import DataManager from './DataManager';
import { Dataset } from '../types';


const DEFAULT_DELAY = 1000;

const delay = (ms: number = DEFAULT_DELAY) => new Promise<void>((resolve => {
	setTimeout(() => {
		resolve(undefined);
	}, ms);
}));

export const datasets = {
	findAll: () => async (dm: DataManager): Promise<Dataset[]> => {

		await delay();

		return [
			{
				id: 'a',
				name: 'A',
			},
			{
				id: 'b',
				name: 'B',
			},
		];

	},
	findOneById: (id: string) => async (dm: DataManager): Promise<Dataset> => {

		await delay();

		return {
			id,
			name: id.toUpperCase(),
		};

	},
};

