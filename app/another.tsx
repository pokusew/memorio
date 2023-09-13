"use strict";

import './styles/main.scss';
import { isDefined } from './helpers/common';
// import { registerServiceWorker } from './helpers/sw';
import { configureFirebase } from './firebase/config';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';


const { app, auth, db } = configureFirebase();

const provider = new GoogleAuthProvider();

console.log('hey from the page');

// registerServiceWorker();

const b1El = document.getElementById('b1');
const b2El = document.getElementById('b2');

if (isDefined(b1El)) {
	b1El.addEventListener('click', () => {
		// navigator.serviceWorker.controller?.postMessage(1);
		signInWithPopup(auth, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				if (credential === null) {
					console.error('credential === null', result, credential);
					return;
				}
				const token = credential.accessToken;
				// The signed-in user info.
				const user = result.user;

				console.log('success', credential, token, user);

			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.customData.email;
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);

				console.error('error', error);
				// ...
			});
	});
}

if (isDefined(b2El)) {
	b2El.addEventListener('click', () => {
		// navigator.serviceWorker.controller?.postMessage(2);
		signOut(auth).then(() => {
			// Sign-out successful.
			console.log('sign out successful');
		}).catch((error) => {
			// An error happened.
			console.error('sign out error', error);
		});
	});
}


onAuthStateChanged(auth, (user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		const uid = user.uid;
		console.log('auth state changed: user logged in', user);
		// ...
	} else {
		console.log('auth state changed: user logged out');
		// User is signed out
		// ...
	}
});

const run = async () => {

	const querySnapshot = await getDocs(collection(db, 'packages'));
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		console.log(doc.id, " => ", doc.data());
	});

	try {
		const docRef = await addDoc(collection(db, "users"), {
			first: "Ada",
			last: "Lovelace",
			born: 1815,
		});
		console.log("Document written with ID: ", docRef.id);
	} catch (e) {
		console.error("Error adding document: ", e);
	}

};

run();

// // The user object has basic properties such as display name, email, etc.
//   const displayName = user.displayName;
//   const email = user.email;
//   const photoURL = user.photoURL;
//   const emailVerified = user.emailVerified;
//
//   // The user's ID, unique to the Firebase project. Do NOT use
//   // this value to authenticate with your backend server, if
//   // you have one. Use User.getToken() instead.
//   const uid = user.uid;
