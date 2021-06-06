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

const SUPPORTED_LOCALES = new Set(Object.keys(messages));

const DEFAULT_LOCALE = 'en';

const determineEffectiveLocale = (
	locale: string,
	supportedLocales: Set<string>,
	defaultLocale: string,
	navigatorLanguage: string,
	navigatorLanguagePreferences: readonly string[],
): string => {

	if (locale === 'auto') {

		if (supportedLocales.has(navigatorLanguage)) {
			return navigatorLanguage;
		}

		for (const preferredLocale of navigatorLanguagePreferences) {
			if (supportedLocales.has(preferredLocale)) {
				return preferredLocale;
			}
		}

		return defaultLocale;

	}

	if (supportedLocales.has(locale)) {
		return locale;
	}

	return defaultLocale;

};

// TODO: implement dynamic messages loading (via dynamic import)
const LocaleLoader = ({ children }) => {

	const [locale] = useStoreValueLocale();

	if (!isDefined(locale)) {
		throw new Error(`[LocaleLoader] locale undefined`);
	}

	const effectiveLocale = determineEffectiveLocale(
		locale,
		SUPPORTED_LOCALES,
		DEFAULT_LOCALE,
		navigator.language,
		navigator.languages ?? [],
	);

	useEffect(() => {

		const html = document.getElementsByTagName('html')[0];

		const originalLangAttr = html.getAttribute('lang');

		html.setAttribute('lang', effectiveLocale);

		return () => {

			if (!isDefined(originalLangAttr)) {
				html.removeAttribute('lang');
				return;
			}

			html.setAttribute('lang', originalLangAttr);

		};

	}, [effectiveLocale]);

	return (
		<IntlProvider
			locale={effectiveLocale}
			key={effectiveLocale}
			messages={messages?.[effectiveLocale] ?? {}}
		>
			{children}
		</IntlProvider>
	);

};

export default LocaleLoader;
