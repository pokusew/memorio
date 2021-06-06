"use strict";

import React, { useCallback } from 'react';

import {
	createFormatMessageId,
	createGetRawIntlMessage, fnToTemplateTag,
	useDocumentTitle,
	useStoreValueLocale, useStoreValueSoundEffects,
} from '../helpers/hooks';
import { App } from '../components/layout';
import { Option, SelectInput, ToggleInput } from '../components/inputs';
import { isDefined } from '../helpers/common';
import { useIntl } from 'react-intl';


const LOCALE_OPTIONS: Option[] = [
	{
		value: 'auto',
		label: 'locales.auto',
	},
	{
		value: 'en',
		label: 'locales.en',
	},
	{
		value: 'cs',
		label: 'locales.cs',
	},
];

const SettingsPage = () => {

	const intl = useIntl();
	const getRawIntlMessage = createGetRawIntlMessage(intl);
	const t = fnToTemplateTag(createFormatMessageId(intl));

	useDocumentTitle(t`titles.settings`);

	const [locale, setLocale] = useStoreValueLocale();
	const [soundEffects, setSoundEffects] = useStoreValueSoundEffects();

	if (!isDefined(locale)) {
		throw new Error(`[LocaleLoader] locale undefined`);
	}

	const handleLocaleChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>((event) => {
		setLocale(event.target.value);
	}, [setLocale]);

	const handleSoundEffectsChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
		setSoundEffects(event.target.checked);
	}, [setSoundEffects]);

	return (
		<App>

			<h1>{t`titles.settings`}</h1>

			<SelectInput
				id="settings-form--locale"
				name="locale"
				options={LOCALE_OPTIONS}
				label="settingsForm.labels.locale"
				value={locale}
				onChange={handleLocaleChange}
				helpBlock={
					<p className="help-block">
						{t`settingsForm.labels.effectiveLocale`}: {getRawIntlMessage(`locales.${intl.locale}`)}
					</p>
				}
			/>

			<ToggleInput
				id="settings-form--sounds"
				name="sounds"
				label="settingsForm.labels.soundEffects"
				checked={soundEffects}
				onChange={handleSoundEffectsChange}
			/>

		</App>
	);

};

export default SettingsPage;
