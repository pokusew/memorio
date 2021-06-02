"use strict";

import test from 'ava';

import { isDefined } from '../../app/helpers/common';
import { optionsToDependencies, compareDependencies, findRegister } from '../../app/forms-experimental/helpers';


test('compareDependencies', t => {

	const obj = {};
	const arr = [];
	const regExp = /^x/;

	t.false(compareDependencies([], [5]));

	t.true(compareDependencies([], []));

	t.false(compareDependencies([1], [2]));

	t.false(compareDependencies([{}], [{}]));

	t.true(compareDependencies([obj], [obj]));

	t.false(compareDependencies([obj, arr, /^x/], [obj, arr, regExp]));

	t.false(compareDependencies([obj, arr, regExp, -3], [obj, arr, regExp, 5]));

	t.true(compareDependencies([0, obj, arr, regExp, 5], [0, obj, arr, regExp, 5]));

});
