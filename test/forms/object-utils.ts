"use strict";

import test from 'ava';

import { isDefined } from '../../app/helpers/common';
import { deepClone, getValue, setValue } from '../../app/forms-experimental/object-utils';


// returns new object on every call
const createInitialValues = (): any => ({
	name: 'Best event 2020',
	currency: {
		base: {
			id: 'CZK',
		},
		virtual: {
			text: {
				cs: 'Ahoj',
				en: 'Hello',
			},
		},
	},
});

test('getValue', t => {

	const initialValues = createInitialValues();

	t.is(getValue(initialValues, ''), initialValues);
	t.is(getValue(initialValues, 'name'), 'Best event 2020');
	t.is(getValue(initialValues, 'currency'), initialValues.currency);
	t.is(getValue(initialValues, 'currency.base'), initialValues.currency.base);
	t.is(getValue(initialValues, 'currency.base.id'), initialValues.currency.base.id);
	t.is(getValue(initialValues, 'currency.this.does.not.exists'), undefined);

});

test('setValue', t => {

	const t1 = createInitialValues();
	t.true(setValue(t1, 'name', 'Colours of Ostrava 2021'));
	t.is(t1.name, 'Colours of Ostrava 2021');
	t.false(setValue(t1, 'name.cs', 'Colours of Ostrava 2021'));
	t.true(setValue(t1, 'currency.virtual.text.de', 'Hallo'));
	t.is(t1.currency.virtual.text.de, 'Hallo');
	t.true(setValue(t1, 'currency.virtual', undefined));

});

test('deepClone', t => {

	// TODO: test arrays and Dates

	const original = createInitialValues();

	const clone = deepClone(original);

	t.true(original !== clone);
	t.deepEqual(original, clone);

	clone.currency = 5;

	t.notDeepEqual(original, clone);

});
