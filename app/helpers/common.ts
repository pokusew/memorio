"use strict";

// user defined type guard, which guarantees 'object is T', not undefined, not null
// see https://2ality.com/2020/06/type-guards-assertion-functions-typescript.html#user-defined-type-guards
export const isDefined = <T>(object: T | undefined | null): object is T =>
	object !== undefined && object !== null;

export const isEmpty = <T>(value: T | undefined | null | ''): value is undefined | null | '' =>
	!isDefined(value) || value === '';

// just for reference: see fast consistent object keys or st like that on npm
export const sortObjectKeys = (obj: object): object => {

	const sortedObj = {};

	Object.keys(obj).forEach(key => {
		sortedObj[key] = obj[key];
	});

	return sortedObj;

};

// maybe constants are better than  "functions"
// reason: the value of process.env.NODE_ENV is cached, and repeatedly used instead of reading process.env
//         process.env is NOT a regular object and reading it repeatedly is slow
//         see https://github.com/facebook/react/issues/812
export const IS_PRODUCTION: boolean = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT: boolean = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;
export const IS_TEST: boolean = process.env.NODE_ENV === 'test';
// export const isProduction = (): boolean => process.env.NODE_ENV === 'production';
// export const isDevelopment = (): boolean => process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;
// export const isTest = (): boolean => process.env.NODE_ENV === 'test';

export const paddyLeft = (value: string, length: number, char = '0'): string => {

	if (value.length === length) {
		return value;
	}

	if (value.length > length) {
		throw new Error(`Value length ${value.length.toString()} exceeded max length ${length.toString()}.`);
	}

	// value.length < length
	let padded = value;

	while (padded.length < length) {
		padded = char + padded;
	}

	return padded;

};


// interface overriding default Map types for better type hints
// see: https://www.reddit.com/r/typescript/comments/dn2xzd/typing_a_map/
export interface TypedMap<T extends object> extends Map<keyof T, T[keyof T]> {

	forEach<K extends keyof T>(callbackfn: (value: T[K], key: K, map: Map<K, T[K]>) => void, thisArg?: any);

	get<K extends keyof T>(key: K): T[K];

	set<K extends keyof T>(key: K, value: T[K]): this;

}

export const typedMapConstructor = <T extends object>(entries: ReadonlyArray<[keyof T, T[keyof T]]>): TypedMap<T> => {
	return new Map(entries) as TypedMap<T>;
};
