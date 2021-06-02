"use strict";

import { isDefined } from '../helpers/common';
import {
	FieldElement,
	FieldOptions,
	MemoizedFieldRegister,
	TYPE_CHECKBOX,
	TYPE_RADIO,
	TYPE_SELECT_ONE,
	TYPE_SELECT_MULTIPLE,
	VALIDATION_ATTRIBUTES,
} from './common';


export const optionsToDependencies = (options: FieldOptions): any[] => {

	const {

		required,
		min,
		max,
		minLength,
		maxLength,
		pattern,

		validate,

		parse,
		format,
		normalize,

	} = options;

	return [

		required,
		min,
		max,
		minLength,
		maxLength,
		pattern,

		validate,

		parse,
		format,
		normalize,

	];

};

export const compareDependencies = (a: any[], b: any[]): boolean => {

	if (a.length !== b.length) {
		return false;
	}

	if (a.length === 0) {
		// it necessarily means that b.length is also 0
		return true;
	}

	for (let i = 0; i < a.length; i++) {

		if (a[i] !== b[i]) {
			return false;
		}

	}

	return true;

};

export const findRegister = (cache: Map<string, MemoizedFieldRegister>, name: string, dependencies: any[]): MemoizedFieldRegister['register'] | undefined => {

	const entry = cache.get(name);

	if (!isDefined(entry)) {
		return undefined;
	}

	return compareDependencies(entry.dependencies, dependencies) ? entry.register : undefined;

};

// input vs change event
//   type=text and similar > input is fired on each value change,
//                         change is fired when the focus is lost and the value changed
//   type=checkbox,radio > input and change are almost same, seem always to be fired in pair (input first, then change)

export const addEventListeners = (
	ref: FieldElement,
	// shouldAttachChangeEvent: boolean,
	handler: EventListenerOrEventListenerObject,
): void => {
	//  shouldAttachChangeEvent = isRadioOrCheckbox && field.options
	//           ? field.options[field.options.length - 1]
	//           : field,
	// ref.addEventListener(
	// 	shouldAttachChangeEvent ? 'change' : 'input',
	// 	handler,
	// );
	ref.addEventListener('input', handler);
	// ref.addEventListener('change', handler);
	ref.addEventListener('blur', handler);
	// ref.addEventListener('invalid', handler);
};

export const removeAllEventListeners = (
	ref: FieldElement,
	handler: EventListenerOrEventListenerObject,
): void => {
	ref.removeEventListener('input', handler);
	// ref.removeEventListener('change', handler);
	ref.removeEventListener('blur', handler);
	// ref.removeEventListener('invalid', handler);
};

export const syncValidationAttributes = (ref: FieldElement, options: FieldOptions) => {
	// TODO: is it good idea?
	//       won't be it overwritten by React?
	//       set directly using input props?
	VALIDATION_ATTRIBUTES.forEach(attrName => {
		const attrValue = options[attrName];
		if (isDefined(attrValue)) {
			ref[attrName] = attrValue;
		} else {
			ref.removeAttribute(attrName);
		}
	});
};

// input.validationMessage = customValidity if set or localized message
// const valid = input.checkValidity(); // just check validity
// const valid = input.reportValidity(); // return valid and if invalid show error bubble and focus the field
// input.setCustomValidity('custom message') // add custom error
// input.setCustomValidity('') // remove custom error
// /**
//  * The validity states that an element can be in, with respect to constraint validation.
//  * Together, they help explain why an element's value fails to validate, if it's not valid.
//  */
// interface ValidityState {
// 	readonly badInput: boolean;
// 	readonly customError: boolean;
// 	readonly patternMismatch: boolean;
// 	readonly rangeOverflow: boolean;
// 	readonly rangeUnderflow: boolean;
// 	readonly stepMismatch: boolean;
// 	readonly tooLong: boolean;
// 	readonly tooShort: boolean;
// 	readonly typeMismatch: boolean;
// 	readonly valid: boolean;
// 	readonly valueMissing: boolean;
// }

export const isCheckbox = (ref: FieldElement): ref is HTMLInputElement =>
	ref.type === TYPE_CHECKBOX;

export const isRadio = (ref: FieldElement): ref is HTMLInputElement =>
	ref.type === TYPE_RADIO;

export const isSelectMultiple = (ref: FieldElement): ref is HTMLSelectElement =>
	ref.type === TYPE_SELECT_MULTIPLE;

export const isSelectOne = (ref: FieldElement): ref is HTMLSelectElement =>
	ref.type === TYPE_SELECT_ONE;

export const isSelect = (ref: FieldElement): ref is HTMLSelectElement =>
	// alternatively we can use ref instanceof HTMLSelectElement
	isSelectMultiple(ref) || isSelectOne(ref);

export type FieldValue = boolean | string | string[];

export const getFieldValue = (ref: FieldElement): FieldValue => {

	if (isCheckbox(ref)) {
		return ref.checked;
	}

	if (isSelectMultiple(ref)) {
		return Array.from(ref.selectedOptions, (option) => option.value);
	}

	return ref.value;

};

export const setFieldValue = (ref: FieldElement, value: FieldValue | undefined) => {

	if (!isDefined(value)) {
		return;
	}

	// TODO: what is value's type does not match?

	if (isCheckbox(ref)) {
		ref.checked = value as boolean;
		return;
	}

	// if (isSelectMultiple(ref)) {
	// 	const values
	// 	for (const option of ref.options) {
	// 		if (option.value )
	// 	}
	// 	return Array.from(ref.selectedOptions, (option) => option.value);
	// }

	ref.value = (value ?? '') as string;

};
