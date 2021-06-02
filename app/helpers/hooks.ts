"use strict";

import { IntlShape, MessageDescriptor, useIntl } from 'react-intl';

import { useStore, useStoreValue, useStoreValueSetter } from '../store/hooks';
import { useEffect } from 'react';
import { AppState } from '../types';


// ### app state

export const useAppSateValue = <K extends keyof AppState>(path: K) => useStoreValue<AppState, K>(path);

export const useAppStateValueSetter = <K extends keyof AppState>(path: K) => useStoreValueSetter<AppState, K>(path);

export const useStoreValueLocale = () => useAppSateValue('locale');


// ### i18n

// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
export const fnToTemplateTag = (fn: (input: string) => string) => (strings: TemplateStringsArray) => fn(strings[0]);

interface Test {
	id: string;
}

export type MessageId = NonNullable<MessageDescriptor['id']>;

export const createGetRawIntlMessage = (intl: IntlShape) => (id: MessageId, fallbackToId: boolean = true) =>
	intl.messages[id] ?? (fallbackToId ? id : undefined);

// TODO: consider usage in way t`messageId` instead of t('messageId')
// TODO: any
export const createFormatMessageId = (intl: IntlShape) => (id: MessageId, values?: any) => intl.formatMessage({ id }, values);

export const useGetRawIntlMessage = () => {

	const intl = useIntl();

	return createGetRawIntlMessage(intl);

};

export const useFormatMessageId = () => {

	const intl = useIntl();

	return createFormatMessageId(intl);

};

export const useFormatMessageIdExperimental = () => {

	const intl = useIntl();

	return fnToTemplateTag(createFormatMessageId(intl));

};

export const useFormatMessage = () => {

	const intl = useIntl();

	// TODO: consider usage in way t`messageId` instead of t('messageId')
	return (descriptor: MessageDescriptor, values?) => intl.formatMessage(descriptor, values);

};


// ### common

// custom minimalistic react-helmet (https://github.com/nfl/react-helmet) replacement
// see https://reactjs.org/docs/hooks-effect.html
// see https://github.com/rehooks/document-title/blob/master/index.js
// TODO: add support for meta tags (theme-color, ...)
export type DocumentTitleTemplate = (title: string | undefined) => string;
// TODO: supply app name
export const DEFAULT_TITLE_TEMPLATE = title => title === undefined ? `Memorio` : `${title} | Memorio`;
export const useDocumentTitle = (title: string | undefined, template: DocumentTitleTemplate = DEFAULT_TITLE_TEMPLATE) => {

	// const defaultTitle = useRef(document.title);

	useEffect(() => {

		const finalTitle = template(title);

		console.log(`[useDocumentTitle] setting title to '${finalTitle}'`);

		document.title = finalTitle;

		// return () => {
		// 	if (!retainOnUnmount) {
		// 		document.title = defaultTitle.current;
		// 	}
		// };

	}, [title, template]);

};
