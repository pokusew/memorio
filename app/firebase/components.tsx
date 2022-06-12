"use strict";

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useConfiguredFirebase } from './hooks';
import { IS_DEVELOPMENT, isDefined } from '../helpers/common';
import { AppUserContext } from './contexts';
import { AppUser } from './types';


export const FirebaseUserProvider = ({ children }) => {

	const { auth } = useConfiguredFirebase();

	const [user, setUser] = useState<AppUser | null>(null);

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
						// custom claims: see https://firebase.google.com/docs/auth/admin/custom-claims
						setUser({
							data: newUser,
							// @ts-ignore (ParsedToken has invalid schema)
							admin: idTokenResult.claims?.admin === true,
						});
					})
					.catch(err => {
						console.error(`[FirebaseUserProvider] getIdTokenResult failed`, err);
					});
			} else {
				IS_DEVELOPMENT && console.log(`[FirebaseUserProvider] auth state changed: user signed out`);
				setUser(null);
			}
		});

		return () => {
			unsubscribe();
		};

	}, [auth]);


	return (
		<AppUserContext.Provider value={user}>
			{children}
		</AppUserContext.Provider>
	);

};
