"use strict";

import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';

import { isDefined } from '../helpers/common';
import { useStoreValueLocale } from '../helpers/hooks';

import flatten from '../i18n/flatten';
import cs from '../i18n/translations.cs';
import en from '../i18n/translations.en';


const messages: Record<string, Record<string, string>> = {
	cs: flatten(cs),
	en: flatten(en),
};

// TODO: implement dynamic messages loading with cache
const LocaleLoader = ({ children }) => {

	const [locale] = useStoreValueLocale();

	if (!isDefined(locale)) {
		throw new Error(`[LocaleLoader] locale undefined`);
	}

	useEffect(() => {

		const html = document.getElementsByTagName('html')[0];

		const originalLangAttr = html.getAttribute('lang');

		html.setAttribute('lang', locale);

		return () => {

			if (!isDefined(originalLangAttr)) {
				html.removeAttribute('lang');
				return;
			}

			html.setAttribute('lang', originalLangAttr);

		};

	}, [locale]);

	return (
		<IntlProvider locale={locale} key={locale} messages={messages?.[locale] ?? {}}>
			{children}
		</IntlProvider>
	);

};

export default LocaleLoader;
