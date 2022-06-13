"use strict";

import { useEffect } from 'react';
import { IS_DEVELOPMENT } from './common';


export const useOnKeyDownEvent = (onKeyDown: (event: KeyboardEvent) => void) => {

	useEffect(() => {

		let didUnsubscribe = false;

		const handler = (event: KeyboardEvent) => {

			if (didUnsubscribe) {
				return;
			}

			onKeyDown(event);

		};

		IS_DEVELOPMENT && console.log(`[useOnKeyDownEvent] setup`);

		window.addEventListener('keydown', handler);

		return () => {
			didUnsubscribe = true;
			IS_DEVELOPMENT && console.log(`[useOnKeyDownEvent] cleanup`);
			window.removeEventListener('keydown', handler);
		};

	}, [onKeyDown]);

};
