"use strict";

import React, { useEffect, useState } from 'react';

import { OnSubmitHandler } from './common';
import FormContext, { FormContextShape } from './FormContext';
import FormController from './FormController';
import { IS_DEVELOPMENT } from '../helpers/common';


export interface FormProps<DataShape>
	extends Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onSubmit'> {
	name: string;
	onSubmit: OnSubmitHandler<DataShape>;
	nativeErrorReporting?: boolean; // TODO: add support to FormController
}

export const Form = <DataShape extends any>({ name, onSubmit, nativeErrorReporting = false, children, ...otherProps }: FormProps<DataShape>) => {

	const [context] = useState<FormContextShape<DataShape>>(() => ({
		controller: new FormController<DataShape>({
			name,
			onSubmit,
		}),
		sectionPrefix: '',
	}));

	context.controller.name = name;
	context.controller.onSubmit = onSubmit;

	IS_DEVELOPMENT && console.log(`[Form] rendering`, name);

	useEffect(() => {

		IS_DEVELOPMENT && console.log(`[Form] useEffect`, name);

		return () => {
			IS_DEVELOPMENT && console.log(`[Form] useEffect:cleanup`, name);
		};

	}, [name]);

	return (
		<FormContext.Provider value={context}>
			<form name={name} noValidate={!nativeErrorReporting} onSubmit={context.controller.formSubmitHandler} {...otherProps}>
				{children}
			</form>
		</FormContext.Provider>
	);

};
