"use strict";

import { IntlFormatters, IntlShape, MessageDescriptor, useIntl } from 'react-intl';

import { useStoreValue, useStoreValueSetter } from '../store/hooks';
import { useEffect } from 'react';
import { AppState } from '../types';
import { IS_DEVELOPMENT } from './common';


// ### app state

export const useAppSateValue = <K extends keyof AppState>(path: K) => useStoreValue<AppState, K>(path);

export const useAppStateValueSetter = <K extends keyof AppState>(path: K) => useStoreValueSetter<AppState, K>(path);

export const useStoreValueLocale = () => useAppSateValue('locale');

export const useStoreValueSoundEffects = () => useAppSateValue('soundEffects');


// ### i18n

// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
export const fnToTemplateTag = (fn: (input: string) => string) => (strings: TemplateStringsArray) => fn(strings[0]);

export type MessageId = NonNullable<MessageDescriptor['id']>;

export const createGetRawIntlMessage = (intl: IntlShape) => (id: MessageId, fallbackToId: boolean = true) =>
	intl.messages[id] ?? (fallbackToId ? id : undefined);

export const createFormatMessage = (intl: IntlShape) => (descriptor: MessageDescriptor, values?: Parameters<IntlFormatters['formatMessage']>[1]) =>
	intl.formatMessage(descriptor, values);

export const createFormatMessageId = (intl: IntlShape) => (id: MessageId, values?: Parameters<IntlFormatters['formatMessage']>[1]) =>
	intl.formatMessage({ id }, values);

export const useGetRawIntlMessage = () => {

	const intl = useIntl();

	return createGetRawIntlMessage(intl);

};

export const useFormatMessageId = () => {

	const intl = useIntl();

	return createFormatMessageId(intl);

};

export const useFormatMessageIdAsTagFn = () => {

	const intl = useIntl();

	return fnToTemplateTag(createFormatMessageId(intl));

};

export const useFormatMessage = () => {

	const intl = useIntl();

	return createFormatMessage(intl);

};


// ### common

// custom minimalistic react-helmet (https://github.com/nfl/react-helmet) replacement
// see https://reactjs.org/docs/hooks-effect.html
// see https://github.com/rehooks/document-title/blob/master/index.js
// TODO: add support for meta tags (theme-color, ...)
export type DocumentTitleTemplate = (title: string | undefined) => string;
export const DEFAULT_TITLE_TEMPLATE = title => title === undefined ? `Memorio` : `${title} | Memorio`;
export const useDocumentTitle = (title: string | undefined, template: DocumentTitleTemplate = DEFAULT_TITLE_TEMPLATE) => {

	// const defaultTitle = useRef(document.title);

	useEffect(() => {

		const finalTitle = template(title);

		IS_DEVELOPMENT && console.log(`[useDocumentTitle] setting title to '${finalTitle}'`);

		document.title = finalTitle;

		// return () => {
		// 	if (!retainOnUnmount) {
		// 		document.title = defaultTitle.current;
		// 	}
		// };

	}, [title, template]);

};
