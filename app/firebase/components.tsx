"use strict";

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useConfiguredFirebase } from './hooks';
import { IS_DEVELOPMENT, isDefined } from '../helpers/common';
import { AuthStateContext } from './contexts';
import { AuthState } from './types';


export const FirebaseUserProvider = ({ children }) => {

	const { auth } = useConfiguredFirebase();

	const [state, setState] = useState<AuthState>({ loading: true });

	useEffect(() => {

		const unsubscribe = onAuthStateChanged(auth, (newUser) => {
			if (isDefined(newUser)) {
				newUser.getIdTokenResult()
					.then(idTokenResult => {
						IS_DEVELOPMENT && console.log(
							`[FirebaseUserProvider] auth state changed: user signed in`,
							newUser,
							idTokenResult,
						);
						setState({
							loading: false,
							error: false,
							data: {
								data: newUser,
								// custom claims: see https://firebase.google.com/docs/auth/admin/custom-claims
								// @ts-ignore (because ParsedToken has invalid TypeScript schema definition)
								admin: idTokenResult.claims?.admin === true,
							},
						});
					})
					.catch(err => {
						console.error(`[FirebaseUserProvider] getIdTokenResult failed`, err);
						// TODO: setState
					});
			} else {
				IS_DEVELOPMENT && console.log(`[FirebaseUserProvider] auth state changed: user signed out`);
				setState({
					loading: false,
					error: false,
					data: null,
				});
			}
		});

		return () => {
			unsubscribe();
		};

	}, [auth]);


	return (
		<AuthStateContext.Provider value={state}>
			{children}
		</AuthStateContext.Provider>
	);

};
