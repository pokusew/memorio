"use strict";


const memoizeOne = <Input, Output>(fn: (key: Input) => Output): ((key: Input) => Output) => {

	const cache = new Map<Input, Output>();

	return (key: Input) => {

		if (cache.has(key)) {
			return cache.get(key) as Output;
		}

		const value = fn(key);

		cache.set(key, value);

		return value;

	};

};
