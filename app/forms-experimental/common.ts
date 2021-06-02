"use strict";

import { DOMAttributes, InputHTMLAttributes, RefCallback } from 'react';


export type FieldElement =
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLTextAreaElement;

export type FieldRegister = RefCallback<FieldElement>;

export interface ValidationProps {
	// standard HTML validation attributes
	// see https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
	// see https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation
	required?: boolean;
	min?: number;
	max?: number;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
}

export interface FieldOptions extends ValidationProps {

	// TODO: maybe remove ValidationProps from register options (FieldOptions)
	//       and let the developer define it directly on input JSX

	validate?: (ref: FieldElement) => string | undefined;

	parse?: (value: string, ref: FieldElement) => any;
	format?: (value: any, ref: FieldElement) => string | boolean | undefined;
	normalize?: (value: string, ref: FieldElement) => string;

}

export interface FieldValidityState {
	valid: boolean;
	error: string;
	isCustomError: boolean;
}

export interface FieldRegistration extends FieldValidityState {

	// the name here is a bit unnecessary as it is known
	// when we work with fields map where keys are names
	// bot for better DX (no need to pass name as separate param) it may be useful
	name: string;

	options: FieldOptions;
	ref: FieldElement;

	value: any;

	// dirty: boolean;

	touched: boolean;

}

export interface MemoizedFieldRegister {
	dependencies: any[];
	register: FieldRegister;
}

export type InputOnChangeHandler = NonNullable<InputHTMLAttributes<FieldElement>['onChange']>;
export type InputOnBlurHandler = NonNullable<InputHTMLAttributes<FieldElement>['onBlur']>;
export type FormOnSubmitHandler = NonNullable<DOMAttributes<HTMLFormElement>['onSubmit']>;

export type OnSubmitHandler<DataShape> = (values: DataShape) => void;

export type FieldChangeListener = (field: FieldRegistration) => void;

export const VALIDATION_ATTRIBUTES = ['required', 'min', 'max', 'minLength', 'maxLength', 'pattern'];

export const TYPE_SELECT_ONE = 'select-one'; // <select /> (<select multiple={false} />)
export const TYPE_SELECT_MULTIPLE = 'select-multiple'; // <select multiple={true} />
export const TYPE_CHECKBOX = 'checkbox'; // <input type={...} />
export const TYPE_RADIO = 'radio';
export const TYPE_TEXTAREA = 'textarea'; // <textarea />
