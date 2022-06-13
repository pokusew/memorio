"use strict";

import React from 'react';
import { useFormatMessageId } from '../helpers/hooks';
import { isDefined } from '../helpers/common';
import classNames from 'classnames';


export interface ButtonProps
	extends Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'style'> {
	style?: string;
	label?: string;
	className?: any;
}

export const Button = ({ type, style, label, children, className, ...otherProps }: ButtonProps) => {

	const t = useFormatMessageId();

	return (
		<button
			type={type ?? 'button'}
			className={classNames('btn', className, {
				...isDefined(style) && { [`btn-${style}`]: true },
			})}
			{...otherProps}
		>
			{isDefined(label) ? t(label) : children}
		</button>
	);

};
