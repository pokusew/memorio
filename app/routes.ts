"use strict";

import { LinkArgs } from './router/common';


// TODO: maybe use symbols?
export const R_ROOT = 'R_ROOT';
export const R_SETTINGS = 'R_SETTINGS';
export const R_DATASET = 'R_DATASET';
export const R_DATASET_PRACTICE = 'R_DATASET_PRACTICE';

// note: ORDER MATTERS, the routes are matched from top to bottom
export const routesMap = new Map([
	[R_DATASET_PRACTICE, '/set/:setId/practice'],
	[R_DATASET, '/set/:setId'],
	[R_SETTINGS, '/settings'],
	[R_ROOT, '/'],
	// [R_SOMETHING, '/some/route/:param/deep'],
]);
