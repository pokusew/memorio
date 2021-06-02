"use strict";

import React from 'react';

import FormController from './FormController';


export interface FormContextShape<DataShape> {
	controller: FormController<DataShape>;
	sectionPrefix: string;
}

// @ts-ignore
const FormContext = React.createContext<FormContextShape>(undefined);

export default FormContext;
