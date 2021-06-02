"use strict";

import React, { useState } from 'react';

import { useUncontrolledFormField } from './hooks';

import { Input, InputProps } from '../components/inputs';
import { ValidationProps } from './common';


export interface FormInputProps extends Omit<InputProps, keyof ValidationProps | 'id' | 'ref'>, ValidationProps {
}

export const FormInput = React.memo((
	{

		name,
		label,

		required,
		min,
		max,
		minLength,
		maxLength,
		pattern,

		...otherInputProps

	}: FormInputProps,
) => {

	const { id, fieldName, register, valid, error, isCustomError } = useUncontrolledFormField(name, {
		required,
		min,
		max,
		minLength,
		maxLength,
		pattern,
	});

	return (
		<Input
			id={id}
			name={fieldName}
			label={label}
			valid={valid}
			error={error}
			isCustomError={isCustomError}
			inputRef={register}
			{...otherInputProps}
		/>
	);

});
