"use strict";

import test from 'ava';


test('simple', t => {

	const i: number = 8;

	t.assert(2 * i === 16, '2 * i must be equal to 16');

});
