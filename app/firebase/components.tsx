"use strict";

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, DocumentSnapshot, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { useConfiguredFirebase } from './hooks';
import { IS_DEVELOPMENT, isDefined } from '../helpers/common';
import { AuthStateContext } from './contexts';
import { AUTH_STATE_LOADING, AUTH_STATE_UNAUTHENTICATED, AUTH_STATE_USER, AuthState, UserData } from './types';


const userDataFromFirebase = (doc: DocumentSnapshot): UserData => {
	const data = doc.exists() ? doc.data() : {};
	return {
		practiceDataVersion: Number.isInteger(data?.practiceDataVersion) ? data.practiceDataVersion : 0,
	};
};

export const FirebaseUserProvider = ({ children }) => {

	const { auth, db } = useConfiguredFirebase();

	const [state, setState] = useState<AuthState>({ state: AUTH_STATE_LOADING });

	useEffect(() => {

		IS_DEVELOPMENT && console.log(`[FirebaseUserProvider] running effect`);

		let uid: string | null = null;
		let unsubscribePreviousUserDoc: Unsubscribe | null = null;

		const unsubscribe = onAuthStateChanged(auth, (newUser) => {
			if (isDefined(newUser)) {

				IS_DEVELOPMENT && console.log(
					`[FirebaseUserProvider] auth state changed: user signed in`,
					// newUser,
					Date.now(),
				);

				uid = newUser.uid;
				if (isDefined(unsubscribePreviousUserDoc)) {
					unsubscribePreviousUserDoc();
				}

				setState(
					prevState => prevState.state !== AUTH_STATE_LOADING
						? { state: AUTH_STATE_LOADING }
						: prevState,
				);

				newUser.getIdTokenResult()
					.then(idTokenResult => {
						if (uid !== newUser.uid) {
							IS_DEVELOPMENT && console.log(`[FirebaseUserProvider] ignoring stale idTokenResult`);
							return;
						}
						IS_DEVELOPMENT && console.log(
							`[FirebaseUserProvider] got idTokenResult`,
							// idTokenResult,
							Date.now(),
						);
						unsubscribePreviousUserDoc = onSnapshot(doc(db, 'users', newUser.uid), (doc) => {
							IS_DEVELOPMENT && console.log(
								`[FirebaseUserProvider] got user data`,
								// doc,
								Date.now(),
							);
							if (uid !== newUser.uid) {
								IS_DEVELOPMENT && console.log(`[FirebaseUserProvider] ignoring stale user data`);
								return;
							}
							setState({
								state: AUTH_STATE_USER,
								data: {
									uid: newUser.uid,
									displayName: newUser.displayName,
									raw: newUser,
									// custom claims: see https://firebase.google.com/docs/auth/admin/custom-claims
									// @ts-ignore (because ParsedToken has invalid TypeScript schema definition)
									admin: idTokenResult.claims?.admin === true,
									data: userDataFromFirebase(doc),
								},
							});
						});
					})
					.catch(err => {
						console.error(`[FirebaseUserProvider] getIdTokenResult failed`, err);
						// TODO: setState
					});

			} else {
				IS_DEVELOPMENT && console.log(`[FirebaseUserProvider] auth state changed: user signed out`);
				uid = null;
				if (isDefined(unsubscribePreviousUserDoc)) {
					unsubscribePreviousUserDoc();
				}
				setState({
					state: AUTH_STATE_UNAUTHENTICATED,
				});
			}
		});

		return () => {
			unsubscribe();
			if (isDefined(unsubscribePreviousUserDoc)) {
				unsubscribePreviousUserDoc();
			}
		};

	}, [auth, db]);

	IS_DEVELOPMENT && console.log(`[FirebaseUserProvider] rendering with value`, state);

	return (
		<AuthStateContext.Provider value={state}>
			{children}
		</AuthStateContext.Provider>
	);

};
