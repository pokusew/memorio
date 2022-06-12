"use strict";

import { FirebaseApp } from 'firebase/app';
import { Auth, User } from 'firebase/auth';
import { Firestore } from '@firebase/firestore';


export interface ConfiguredFirebase {
	app: FirebaseApp;
	auth: Auth;
	db: Firestore;
}

export interface AppUser {
	data: User;
	admin: boolean;
}
