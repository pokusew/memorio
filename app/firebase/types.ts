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

export interface AuthStateLoading {
	loading: true;
}

export interface AuthStateSuccess {
	loading: false;
	error: false;
	data: AppUser | null;
}

export interface AuthStateError {
	loading: false;
	error: true;
}

export type AuthState = AuthStateLoading | AuthStateSuccess | AuthStateError;

