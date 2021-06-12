"use strict";

import React, { useCallback, useMemo, useState } from 'react';

import {
	R_ROOT,
} from '../routes';
import { useDocumentTitle, useFormatMessageIdAsTagFn } from '../helpers/hooks';
import { packages } from '../db/queries';
import { useQuery } from '../db/hooks';
import { LocalFullPackage, Package } from '../types';
import { useRoute } from '../router/hooks';
import { isDefined } from '../helpers/common';
import { LoadingScreen } from '../components/layout';
import NotFoundPage from './NotFoundPage';
import { QuestionForm } from '../components/practice';


const PracticePage = () => {

	const t = useFormatMessageIdAsTagFn();

	const { route } = useRoute();

	const idStr = route?.payload?.packageId as string;

	const id = parseInt(idStr);

	const query = useMemo(() => packages.findOneById(id), [id]);

	const op = useQuery(query);

	useDocumentTitle(t`titles.practice`);

	if (op.loading) {
		return (
			<LoadingScreen />
		);
	}

	if (!isDefined(op.data)) {
		return (
			<NotFoundPage />
		);
	}

	const pack: LocalFullPackage = op.data;

	const question = pack.questions[0];

	return (
		<>

			<h1>{t`titles.practice`}</h1>

			<QuestionForm
				question={question}
			/>

		</>
	);

};

export default PracticePage;
