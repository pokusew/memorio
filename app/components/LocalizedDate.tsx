"use strict";

import React from 'react';

import { FormatDateOptions, useIntl } from 'react-intl';


export interface LocalizedDateProps extends FormatDateOptions {
	value: Date | number;
}

const LocalizedDate = (
	{
		value: rawDate,
		weekday = 'short', year = 'numeric', month = 'numeric', day = 'numeric',
		hour = 'numeric', minute = 'numeric', second = 'numeric',
		hour12,
		timeZone, // = 'Europe/Prague',
		timeZoneName,
		...otherProps // such as className
	}: LocalizedDateProps, // TODO
) => {

	const intl = useIntl();

	const date = rawDate instanceof Date ? rawDate : new Date(rawDate);

	return (
		<time dateTime={date.toISOString()} {...otherProps}>
			{intl.formatDate(date, {
				weekday, year, month, day,
				hour, minute, second,
				hour12,
				timeZone,
				timeZoneName,
			})}
		</time>
	);

};

export default LocalizedDate;
