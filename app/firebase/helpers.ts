"use strict";

import { Auth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { IS_DEVELOPMENT } from '../helpers/common';
import { AppUser } from './types';


export const doSignIn = (auth: Auth) => {

	const provider = new GoogleAuthProvider();

	signInWithPopup(auth, provider)
		.then((result) => {

			// This gives you a Google Access Token. You can use it to access the Google API.
			// const credential = GoogleAuthProvider.credentialFromResult(result);
			// const token = credential.accessToken;

			// The signed-in user info.
			// const user = result.user;

			IS_DEVELOPMENT && console.log('[signIn] success', result);

		})
		.catch((error) => {

			// Handle Errors here.
			// const errorCode = error.code;
			// const errorMessage = error.message;
			// The email of the user's account used.
			// const email = error.customData.email;
			// The AuthCredential type that was used.
			// const credential = GoogleAuthProvider.credentialFromError(error);

			console.error('[signIn] error', error);

		});

};

export const doSignOut = (auth: Auth) => {

	signOut(auth).then(() => {
		// Sign-out successful.
		IS_DEVELOPMENT && console.log('[signOut] success');
	}).catch((error) => {
		console.error('[signOut] error', error);
	});

};

export const isAdmin = (user: AppUser) => user.admin;
