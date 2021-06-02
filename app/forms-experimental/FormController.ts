"use strict";

import React from 'react';

import { isDefined } from '../helpers/common';
import {
	MemoizedFieldRegister,
	FieldOptions,
	FieldRegistration,
	FieldElement,
	FieldRegister,
	FormOnSubmitHandler,
	OnSubmitHandler,
	FieldValidityState,
	FieldChangeListener,
} from './common';
import {
	optionsToDependencies,
	findRegister,
	addEventListeners,
	removeAllEventListeners,
	syncValidationAttributes,
	isRadio,
	getFieldValue,
	setFieldValue,
} from './helpers';
import { deepClone, getValue, setValue } from './object-utils';
import { AutoMap } from '../helpers/maps';


export interface FormControllerOptions<DataShape> {
	name: string;
	initialValues?: DataShape;
	// validate?: FormValidator;
	onSubmit: OnSubmitHandler<DataShape>;
}

export default class FormController<DataShape> {

	private readonly memoizedFieldRegister: Map<string, MemoizedFieldRegister>;

	private readonly fields: Map<string, FieldRegistration>;

	private readonly fieldChangeListeners: AutoMap<string, Set<FieldChangeListener>>;

	readonly nativeInputEventHandler: (event: Event) => void;
	readonly formSubmitHandler: FormOnSubmitHandler;

	private _name: string;
	private _initialValues: DataShape | undefined;
	private _onSubmit: OnSubmitHandler<DataShape>;

	private readonly values: DataShape;

	// private readonly dirty: boolean;
	// private readonly touched: boolean;
	// private readonly valid: boolean;
	// private readonly errors: any;

	constructor({ name, initialValues, onSubmit }: FormControllerOptions<DataShape>) {

		this._name = name;

		this._initialValues = initialValues;
		this.values = deepClone(initialValues ?? {});
		this._onSubmit = onSubmit;

		this.memoizedFieldRegister = new Map<string, MemoizedFieldRegister>();
		this.fields = new Map<string, FieldRegistration>();
		this.fieldChangeListeners = new AutoMap(() => new Set());

		this.nativeInputEventHandler = (event: Event) => {
			this.handleNativeInputEvent(event);
		};

		this.formSubmitHandler = (event) => {
			this.handleSubmit(event);
		};

	}

	get name(): string {
		return this._name;
	}

	set name(name: string) {

		if (this._name === name) {
			return;
		}

		console.log(`[FormController:${this._name}] name change from '${this._name}' to '${name}'`);
		this._name = name;
		// TODO: notify

	}

	get initialValues(): DataShape | undefined {
		return this._initialValues;
	}

	set initialValues(initialValues: DataShape | undefined) {

		if (this._initialValues === initialValues) {
			return;
		}

		console.log(`[FormController:${this._name}] initialValues change`);
		this._initialValues = initialValues;
		// TODO: make this behaviour configurable via enableReinitialize
		// TODO: reset and notify

	}

	get onSubmit(): OnSubmitHandler<DataShape> {
		return this._onSubmit;
	}

	set onSubmit(onSubmit: OnSubmitHandler<DataShape>) {

		if (this._onSubmit === onSubmit) {
			return;
		}

		console.log(`[FormController:${this._name}] onSubmit change`);
		this._onSubmit = onSubmit;
		// no need to notify

	}

	public getValid(fieldName: string): boolean {
		return this.fields.get(fieldName)?.valid ?? true;
	}

	public getError(fieldName: string): string {
		return this.fields.get(fieldName)?.error ?? '';
	}

	public getIsCustomError(fieldName: string): boolean {
		return this.fields.get(fieldName)?.isCustomError ?? false;
	}

	public getFieldValidityState(fieldName: string): FieldValidityState {
		return {
			valid: this.getValid(fieldName),
			error: this.getError(fieldName),
			isCustomError: this.getIsCustomError(fieldName),
		};
	}

	public getFieldValidityStateFromField(field: FieldRegistration): FieldValidityState {
		const { valid, error, isCustomError } = field;
		return {
			valid,
			error,
			isCustomError,
		};
	}

	public listenForFieldChange(name: string, onChange: FieldChangeListener): () => void {

		// console.log(`[FormController:${this._name}] listen for field change ${name}`);

		this.fieldChangeListeners.use(name).add(onChange);

		return () => {
			// console.log(`[FormController:${this._name}] unlisten for field change ${name}`);
			this.fieldChangeListeners.get(name)?.delete(onChange);
			this.fieldChangeListeners.safeDelete(name);
		};

	}

	private notify(field: FieldRegistration): void {

		console.log(`[FormController:${this._name}] notify ${field.name}`);

		const fieldListeners = this.fieldChangeListeners.get(field.name);

		if (!isDefined(fieldListeners)) {
			return;
		}

		fieldListeners.forEach((fn) => fn(field));

	}

	private revalidate(field: FieldRegistration, force: boolean = false): boolean {

		// console.log(`revalidate ${field.name}`);

		// TODO: support custom validation

		// let result: ValidationResult;
		//
		// if (isDefined(field.options.validate)) {
		//
		// 	const error: string | undefined = field.options.validate(field.ref);
		//
		// 	if (isDefined(error)) {
		// 		result = {
		// 			valid: false,
		// 			error,
		// 			isCustomError: true,
		// 		};
		// 	} else {
		// 		result = {
		// 			valid: true,
		// 		};
		// 	}
		//
		// }

		let notify: boolean = false;

		const validity: ValidityState = field.ref.validity;
		const validationMessage: string = field.ref.validationMessage;

		if (!field.touched) {

			if (!force) {
				return validity.valid;
			}

			notify = true;
			field.touched = true;

		}

		if (field.valid !== validity.valid) {
			notify = true;
			field.valid = validity.valid;
		}

		if (field.error !== validationMessage) {
			notify = true;
			field.error = validationMessage;
		}

		if (field.isCustomError !== validity.customError) {
			notify = true;
			field.isCustomError = validity.customError;
		}

		if (notify) {
			console.log(`[FormController:${this._name}][revalidate] validity change of`, field);
			this.notify(field);
		}

		return field.valid;

	}

	private revalidateAll(force: boolean = false): boolean {

		let valid: boolean = true;

		for (const field of this.fields.values()) {
			valid = this.revalidate(field, force) && valid;
		}

		return valid;

	}

	private handleNativeInputEvent(event: Event) {

		// input, select, textarea
		const input: FieldElement = event.target as FieldElement;

		const name = input.name;

		const field = this.fields.get(name);

		if (!isDefined(field)) {
			console.log(`[FormController:${this._name}][handleNativeInputEvent] undefined field '${name}'`, event);
			return;
		}

		if (field.ref !== input) {
			console.error(`[FormController:${this._name}][handleNativeInputEvent] field.ref !== input`, field.ref, input);
			return;
		}

		const type = event.type;

		if (type === 'blur') {
			this.handleBlur(field);
			return;
		}

		if (type === 'input') {
			this.handleChange(field);
			return;
		}

		console.error(`[FormController:${this._name}][handleNativeInputEvent] unknown event type=${type} name=${name}`, event);

	}

	private handleBlur(field: FieldRegistration) {

		field.touched = true;

		this.revalidate(field);

	}

	private handleChange(field: FieldRegistration) {

		// field.touched = true; // TODO: pros and cons of this behavior
		field.value = getFieldValue(field.ref);

		setValue(this.values, field.name, field.value);

		this.revalidate(field);

	}

	private handleSubmit(event: React.FormEvent<HTMLFormElement>) {

		event.preventDefault();
		event.stopPropagation();

		console.log(`[FormController:${this._name}][handleSubmit] values=%o fields=%o`, this.values, this.fields);

		// const formRef: HTMLFormElement = event.currentTarget;

		if (this.revalidateAll(true)) {
			this._onSubmit(this.values);
		}

		// if (!formRef.checkValidity()) {
		// 	formRef.reportValidity();
		// }

		// const values = new Map<string, any>();
		//
		// for (const [name, { ref }] of this.fields.entries()) {
		// 	values.set(name, ref.value);
		// }

		// console.log(values);

		// see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/formdata_event
		// const data: FormData = new FormData(event.currentTarget);
		//
		// console.log([...data]);
		//
		// for (const [key, value] of data) {
		// 	console.log(`key='${key}' has value='${value}'`);
		// }

	}

	private registerField(
		name: string,
		options: FieldOptions,
		dependencies: any[],
		register: FieldRegister,
		node: FieldElement,
	): void {

		if (isRadio(node)) {
			throw new Error('input type=radio is not supported via register, use controlled component');
		}

		console.log(`[FormController:${this._name}][refCallback:${name}] registerField`, name);

		const initialValue = getValue(this.values, name);

		const field: FieldRegistration = {
			name,
			options: options,
			ref: node,
			value: initialValue,
			touched: false,
			// TODO
			valid: true,
			error: '',
			isCustomError: false,
		};

		this.fields.set(name, field);
		this.memoizedFieldRegister.set(name, {
			dependencies,
			register,
		});

		// TODO: is it good idea?
		//       won't be it overwritten by React?
		//       set directly using input props?
		syncValidationAttributes(node, options);

		setFieldValue(field.ref, field.value);

		addEventListeners(node, this.nativeInputEventHandler);

	}

	private deregisterField(name: string, field: FieldRegistration): void {

		// assert name === field.name

		console.log(`[FormController:${this._name}][refCallback:${name}] deregisterField`, name);

		removeAllEventListeners(field.ref, this.nativeInputEventHandler);

		this.memoizedFieldRegister.delete(name);
		this.fields.delete(name);

	}

	public register(name: string, options: FieldOptions = {}): FieldRegister {

		const dependencies = optionsToDependencies(options);

		const memoizedRegister = findRegister(this.memoizedFieldRegister, name, dependencies);

		if (isDefined(memoizedRegister)) {
			console.log(`[FormController:${this._name}][register] HIT ${name}`);
			return memoizedRegister;
		}

		let register: FieldRegister;

		// It seems that React calls this method in the following order:
		//   (mount)
		//   1. register(non-null node)
		//   (unmount, register identity change)
		//   2. old register(node = null)
		//   3. new register(non-null node) (if any)
		// But I do NOT know if we can always rely on the order.
		register = (node: FieldElement | null) => {

			// console.log(`[FormController:${this._name}][refCallback:${name}]`);

			const field: FieldRegistration | undefined = this.fields.get(name);

			// field removed
			if (isDefined(field) && !isDefined(node)) {
				this.deregisterField(name, field);
				return;
			}

			// field added
			if (!isDefined(field) && isDefined(node)) {
				this.registerField(name, options, dependencies, register, node);
				return;
			}

			console.log(`[FormController:${this._name}][refCallback:${name}] unexpected field/node combination`, field, node);
			throw new Error(`[FormController:${this._name}][refCallback:${name}] unexpected field/node combination`);

		};

		console.log(`[FormController:${this._name}][register] MISS ${name}`);

		return register;

	}

}
