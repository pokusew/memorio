"use strict";

import React from 'react';

import {
	R_ROOT,
} from '../routes';
import { useDocumentTitle, useFormatMessageIdExperimental } from '../helpers/hooks';


const SettingsPage = () => {

	const t = useFormatMessageIdExperimental();

	useDocumentTitle(t`titles.settings`);

	return (
		<div>
			SettingsPage
		</div>
	);

};

export default SettingsPage;
