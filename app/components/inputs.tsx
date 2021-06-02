"use strict";

import React, { Ref } from 'react';
import classNames from 'classnames';

import { isDefined, isEmpty } from '../helpers/common';
import { useFormatMessageId } from '../helpers/hooks';


export interface Option {
	value: string;
	label: string;
}

export interface SelectInputProps {
	name: string;
	options: Option[];
	label: string;
	prompt?: string;
	autoFocus?: boolean;
	error?: string;
	value?: string;
	onChange: ChangeHandler;
}

export const SelectInput = ({ name, options, label, prompt, autoFocus, error, value, onChange }: SelectInputProps) => {

	// TODO: consider datalist once it is more supported or with an appropriate fallback
	//       see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist
	//       see https://caniuse.com/#search=datalist

	// TODO: consider sth like react-select but lightweight (possibly custom)

	const t = useFormatMessageId();

	return (
		<div className={classNames({
			'form-group': true,
			'has-error': isDefined(error),
		})}>
			<label className="form-control-label" htmlFor={name}>{t(label)}</label>
			<select
				id={name}
				name={name}
				value={value}
				onChange={(event) => {
					onChange(event.target.value);
				}}
				autoFocus={autoFocus ?? false}
				className="form-control"
			>
				<option value="">{isDefined(prompt) ? t(prompt) : ''}</option>
				{options.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
			</select>
			{isDefined(error) && <p className="form-control-feedback">{t(error)}</p>}
		</div>
	);
};

export interface ChangeHandler {
	(newValue: string): void
}

export interface InputProps
	extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'ref'> {
	id: string;
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

export const MemoInput = React.memo(Input);

export interface RadioInputsProps {
	name: string;
	options: Option[];
	label: string;
	placeholder?: string;
	autoFocus?: boolean;
	error?: string;
	value?: string;
	onChange: ChangeHandler;
	helpBlock?: React.ReactNode;
}

export const RadioInputs = ({ name, options, label, autoFocus, error, value, onChange, helpBlock }: RadioInputsProps) => {

	const t = useFormatMessageId();

	// TODO: use fieldset and legend for the top-level label
	//       see https://stackoverflow.com/questions/13273806/using-the-html-label-tag-with-radio-buttons

	return (
		<div className={classNames({
			'form-group': true,
			'has-error': isDefined(error),
		})}>
			<label className="form-control-label">{t(label)}</label>
			<div className="form-radio-options">
				{options.map(({ value: v, label: l }) =>
					<div key={v} className="form-radio-option">
						<input
							id={v}
							type="radio"
							name={name}
							value={v}
							onChange={(event) => {
								onChange(event.target.value);
							}}
							autoFocus={autoFocus ?? false}
							className="form-radio"
							checked={v === value}
						/>
						<label className="form-radio-label" htmlFor={v}>
							<span className="form-radio-mark" />
							{t(l)}
						</label>
					</div>,
				)}
			</div>
			{isDefined(error) && <p className="form-control-feedback">{t(error)}</p>}
			{helpBlock}
		</div>
	);

};
