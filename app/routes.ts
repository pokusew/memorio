"use strict";

import { LinkArgs } from './router/common';


export const R_ROOT = 'R_ROOT';
export const R_SETTINGS = 'R_SETTINGS';
export const R_PACKAGE = 'R_PACKAGE';
export const R_PACKAGE_PRACTICE = 'R_PACKAGE_PRACTICE';

// note: ORDER MATTERS, the routes are matched from top to bottom
export const routesMap = new Map([
	[R_PACKAGE_PRACTICE, '/pack/:packageId/practice'],
	[R_PACKAGE, '/pack/:packageId'],
	[R_SETTINGS, '/settings'],
	[R_ROOT, '/'],
	// [R_SOMETHING, '/some/route/:param/deep'],
]);
