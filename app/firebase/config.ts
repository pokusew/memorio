"use strict";

// see https://firebase.google.com/docs/web/setup?sdk_version=v9
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { ConfiguredFirebase } from './types';

export const configureFirebase = (): ConfiguredFirebase => {

	const firebaseConfig: FirebaseOptions = {
		apiKey: 'AIzaSyABSkIUBvc-7onoq6E2qvnX_wLfcyxP-1A',
		authDomain: 'testbook-ocr.firebaseapp.com',
		projectId: 'testbook-ocr',
		storageBucket: 'testbook-ocr.appspot.com',
		messagingSenderId: '61070782384',
		appId: '1:61070782384:web:a18cdff7673580fdc23075',
		measurementId: 'G-PZZLBXBGH7',
	};

	const app = initializeApp(firebaseConfig);

	// const analytics = getAnalytics(app);

	const auth = getAuth(app);

	// TODO: respect app's settings
	auth.languageCode = 'cs_CZ';
	// To apply the default browser preference instead of explicitly setting it.
	// firebase.auth().useDeviceLanguage();

	const db = getFirestore(app);

	return {
		app,
		auth,
		db,
	};

};
