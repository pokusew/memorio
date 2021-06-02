"use strict";


export type FlatObject = Record<string, string>;
export type NestedObject = { [key: string]: string | NestedObject };

const flatten = (input: string | NestedObject, prefix: string[] = [], current: FlatObject = {}): FlatObject => {

	if (typeof input === 'object') {
		Object.keys(input).forEach(key => flatten(input[key], prefix.concat(key), current));
	} else {
		current[prefix.join('.')] = input;
	}

	return current;

};

export default flatten;
