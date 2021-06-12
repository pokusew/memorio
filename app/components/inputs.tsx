"use strict";

import React, { Ref } from 'react';
import classNames from 'classnames';

import { isDefined, isEmpty } from '../helpers/common';
import { useFormatMessageId } from '../helpers/hooks';


export interface Option {
	value: string;
	label: string;
}

export interface SelectInputProps
	extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, 'ref'> {
	id: string;
	name: string;
	label: string;
	valid?: boolean;
	error?: string;
	isCustomError?: boolean;
	helpBlock?: React.ReactNode;
	inputRef?: Ref<HTMLSelectElement>;
	options: Option[];
	prompt?: string;
}


export const SelectInput = (
	{

		id,
		name,
		type,
		label,

		placeholder,
		helpBlock,

		valid,
		error,
		isCustomError,

		inputRef,

		options,
		prompt,

		...otherInputProps

	}: SelectInputProps,
) => {

	// TODO: consider datalist once it is more supported or with an appropriate fallback
	//       see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist
	//       see https://caniuse.com/#search=datalist

	// TODO: consider sth like react-select but lightweight (possibly custom)

	const t = useFormatMessageId();

	return (
		<div className={classNames({
			'form-group': true,
			'has-error': valid === false,
		})}>
			<label className="form-control-label" htmlFor={id}>{t(label)}</label>
			<select
				id={id}
				name={name}
				ref={inputRef}
				className="form-control"
				{...otherInputProps}
			>
				{isDefined(prompt) && <option value="">{t(prompt)}</option>}
				{options.map(({ value, label }) =>
					<option key={value} value={value}>{t(label)}</option>)
				}
			</select>
			{!isEmpty(error) && <p className="form-control-feedback">{isCustomError === true ? t(error) : error}</p>}
			{helpBlock}
		</div>
	);
};

export interface ChangeHandler {
	(newValue: string): void
}

export interface InputProps
	extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'ref'> {
	name: string;
	label: string;
	valid?: boolean;
	error?: string;
	isCustomError?: boolean;
	helpBlock?: React.ReactNode;
	inputRef?: Ref<HTMLInputElement>;
}

export const Input = (
	{

		id,
		name,
		type,
		label,

		placeholder,
		helpBlock,

		valid,
		error,
		isCustomError,

		inputRef,

		...otherInputProps

	}: InputProps,
) => {

	const t = useFormatMessageId();

	const finalPlaceholder = placeholder ?? label;

	return (
		<div className={classNames({
			'form-group': true,
			'has-error': valid === false,
		})}>
			<label className="form-control-label" htmlFor={id}>{t(label)}</label>
			<input
				id={id}
				type={type ?? 'text'}
				name={name}
				ref={inputRef}
				className="form-control"
				placeholder={isDefined(finalPlaceholder) ? t(finalPlaceholder) : undefined}
				{...otherInputProps}
			/>
			{!isEmpty(error) && <p className="form-control-feedback">{isCustomError === true ? t(error) : error}</p>}
			{helpBlock}
		</div>
	);
};

export interface ToggleInputProps extends InputProps {

}

export const ToggleInput = (
	{

		id,
		name,
		label,

		placeholder,
		helpBlock,

		valid,
		error,
		isCustomError,

		inputRef,

		...otherInputProps

	}: InputProps,
) => {

	const t = useFormatMessageId();

	const finalPlaceholder = placeholder ?? label;

	return (
		<div className={classNames({
			'form-group': true,
			'has-error': valid === false,
		})}>
			<label className="form-control-label" htmlFor={id}>{t(label)}</label>
			<input
				id={id}
				type="checkbox"
				name={name}
				ref={inputRef}
				className="toggle-checkbox-input"
				placeholder={isDefined(finalPlaceholder) ? t(finalPlaceholder) : undefined}
				{...otherInputProps}
			/>
			<label className="toggle-checkbox-label" htmlFor={id} />
			{!isEmpty(error) && <p className="form-control-feedback">{isCustomError === true ? t(error) : error}</p>}
			{helpBlock}
		</div>
	);
};

