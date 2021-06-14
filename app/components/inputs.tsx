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
			{!isEmpty(error) && <p className="form-control-feedback">{isCustomError === true ? error : t(error)}</p>}
			{helpBlock}
		</div>
	);
};


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
			{!isEmpty(error) && <p className="form-control-feedback">{isCustomError === true ? error : t(error)}</p>}
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
			{!isEmpty(error) && <p className="form-control-feedback">{isCustomError === true ? error : t(error)}</p>}
			{helpBlock}
		</div>
	);
};


export interface CheckboxOptionBoxProps {
	name: string;
	id: string;
	label: string;
	value: string;
	selected: boolean;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const CheckboxOptionBox = (
	{
		name,
		id,
		label,
		value,
		selected,
		onChange,
	}: CheckboxOptionBoxProps,
) => {

	return (
		<li
			className={classNames('option', {
				'option--selected': selected,
			})}
			data-value={value}
		>
			<label
				className="option-label"
				htmlFor={id}
			>
				<input
					className="option-checkbox"
					id={id}
					name={name}
					type="checkbox"
					value={value}
					checked={selected}
					onChange={onChange}
				/>
				{label}
			</label>
		</li>
	);

};


export interface CheckboxListInputProps {

	id: string;
	name: string;
	label: string;

	helpBlock?: React.ReactNode;

	valid?: boolean;
	error?: string;
	isCustomError?: boolean;

	options: Option[];
	value: Set<string>;
	onChange: React.ChangeEventHandler<HTMLInputElement>;

	onSelectAll?: React.MouseEventHandler<HTMLButtonElement> | undefined;
	onSelectNone?: React.MouseEventHandler<HTMLButtonElement> | undefined;

}

export const CheckboxListInput = (
	{

		id,
		name,
		label,

		helpBlock,

		valid,
		error,
		isCustomError,

		options,
		value,
		onChange,

		onSelectAll,
		onSelectNone,

	}: CheckboxListInputProps,
) => {

	const t = useFormatMessageId();

	return (
		<div className={classNames({
			'form-group': true,
			'has-error': valid === false,
		})}>

			<label className="form-control-label">{t(label)}</label>

			{isDefined(onSelectAll) && (
				<button
					type="button"
					className="btn btn-sm btn-action"
					onClick={onSelectAll}
				>
					{t(`forms.selectAll`)}
				</button>
			)}

			{isDefined(onSelectNone) && (
				<button
					type="button"
					className="btn btn-sm btn-action"
					onClick={onSelectNone}
				>
					{t(`forms.selectNone`)}
				</button>

			)}

			<ol className="checkbox-list">
				{options.map(({ value: v, label: l }) =>
					<CheckboxOptionBox
						key={v}
						name={name}
						id={`${id}--${v}`}
						label={l}
						value={v}
						selected={value.has(v)}
						onChange={onChange}
					/>,
				)}
			</ol>

			{!isEmpty(error) && <p className="form-control-feedback">{isCustomError === true ? error : t(error)}</p>}

			{helpBlock}

		</div>
	);

};
