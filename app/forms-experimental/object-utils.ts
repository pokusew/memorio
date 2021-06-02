"use strict";

// ''
// 'name'
// 'variants[0].name'
// 'text.cs'
// 'text.en'

import { isDefined, isEmpty } from '../helpers/common';


export const getValue = (obj: any, path: string): any | undefined => {

	if (path === '') {
		return obj;
	}

	const parts = path.split('.');

	let root = obj;

	for (const part of parts) {

		root = root?.[part];

		if (!isDefined(root)) {
			return root;
		}

	}

	return root;

};

/**
 * NOTE: it mutates the obj
 */
export const setValue = (obj: any, path: string, value: any, recursive: boolean = true): boolean => {

	if (path === '' || typeof obj !== 'object') {
		return false;
	}

	const allParts = path.split('.');
	const pathParts = allParts.slice(0, -1);
	const name = allParts[allParts.length - 1];

	let parent = obj;

	for (const part of pathParts) {

		const node = parent?.[part];

		if (!isDefined(node)) {

			if (!recursive) {
				return false;
			}

			parent[part] = {};
			parent = parent[part];

		}

		if (typeof node !== 'object') {
			// TODO: optional argument to allow overwriting values
			return false;
		}

		parent = node;

	}

	// TODO: make configurable
	if (value === undefined) {
		delete parent[name];
		return true;
	}

	parent[name] = value;
	return true;

};

// NOTE: only simple objects, arrays and Dates are supported
// TODO: more efficient way?
//       see also https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
export const deepClone = (obj: any): any => {

	if (typeof obj === 'object') {
		return Object.fromEntries(Object.entries(obj).map(([key, value]) => ([key, deepClone(value)])));
	}

	if (Array.isArray(obj)) {
		return obj.map((value) => deepClone(value));
	}

	if (obj instanceof Date) {
		return new Date(obj.getTime());
	}

	// number, string
	return obj;

};

export const withPrefix = (prefix: string, value: string, separator: string = '.') =>
	isEmpty(prefix) ? value : `${prefix}${separator}${value}`;
