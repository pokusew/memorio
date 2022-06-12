"use strict";

import React, { useCallback } from 'react';

import {
	createFormatMessageId,
	createGetRawIntlMessage,
	fnToTemplateTag,
	useDocumentTitle,
	useStoreValueLocale,
	useStoreValueSoundEffects,
} from '../helpers/hooks';
import { Option, SelectInput, ToggleInput } from '../components/inputs';
import { isDefined } from '../helpers/common';
import { useIntl } from 'react-intl';
import { useAppUser, useConfiguredFirebase } from '../firebase/hooks';
import { deleteAllScores } from '../data/queries';


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

	const { db } = useConfiguredFirebase();
	const user = useAppUser();

	const intl = useIntl();
	const getRawIntlMessage = createGetRawIntlMessage(intl);
	const t = fnToTemplateTag(createFormatMessageId(intl));

	useDocumentTitle(t`titles.settings`);

	const [locale, setLocale] = useStoreValueLocale();
	const [soundEffects, setSoundEffects] = useStoreValueSoundEffects();

	if (!isDefined(locale)) {
		throw new Error(`[LocaleLoader] locale undefined`);
	}

	const handleDeleteScores = useCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {

		event.preventDefault();

		if (!isDefined(user)) {
			return;
		}

		// TODO: implement custom non-blocking app modals
		if (confirm(t`settingsPage.deleteScoresConfirmation`)) {
			// TODO: provide feedback to the UI
			deleteAllScores(db, user)
				.then(() => {
					console.log(`[handleDeleteScores] successfully deleted`);
				})
				.catch(err => {
					console.log(`[handleDeleteScores] an error`, err);
				});
		}

	}, [t, db, user]);

	const handleDeleteAllLocalData = useCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {

		event.preventDefault();

		// TODO: implement custom non-blocking app modals
		if (confirm(t`settingsPage.deleteAllLocalDataConfirmation`)) {
			// TODO: provide feedback to the UI
			// TODO: implement once we start using Firebase's offline features
		}

	}, [t]);

	const handleLocaleChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>((event) => {
		setLocale(event.target.value);
	}, [setLocale]);

	const handleSoundEffectsChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
		setSoundEffects(event.target.checked);
	}, [setSoundEffects]);

	return (
		<>

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

			<h2>{t`settingsPage.dataManagementHeading`}</h2>

			<div className="btn-group">

				<button
					className="btn btn-danger"
					type="button"
					onClick={handleDeleteScores}
				>
					{t`settingsPage.deleteScores`}
				</button>

				<button
					className="btn btn-danger"
					type="button"
					onClick={handleDeleteAllLocalData}
				>
					{t`settingsPage.deleteAllLocalData`}
				</button>

			</div>

		</>
	);

};

export default SettingsPage;
