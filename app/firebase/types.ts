"use strict";

import { FirebaseApp } from 'firebase/app';
import { Auth, User } from 'firebase/auth';
import { Firestore } from '@firebase/firestore';


export interface ConfiguredFirebase {
	app: FirebaseApp;
	auth: Auth;
	db: Firestore;
}

export interface UserData {
	practiceDataVersion: number;
}

export interface AppUser {
	uid: string;
	displayName: string | null;
	admin: boolean;
	data: UserData;
	raw: User;
}

// AUTH_STATE_LOADING can mean two different state:
// 1. initializing (first-time)
// 2. loading user details (token, document)
export const AUTH_STATE_LOADING = 'loading';
export const AUTH_STATE_USER = 'user';
export const AUTH_STATE_UNAUTHENTICATED = 'unauthenticated';
export const AUTH_STATE_ERROR = 'error';


export interface AuthStateLoading {
	state: typeof AUTH_STATE_LOADING;
}

export interface AuthStateUser {
	state: typeof AUTH_STATE_USER;
	data: AppUser;
}

export interface AuthStateUnauthenticated {
	state: typeof AUTH_STATE_UNAUTHENTICATED;
}

export interface AuthStateError {
	state: typeof AUTH_STATE_ERROR;
}

export type AuthState = AuthStateLoading | AuthStateUser | AuthStateUnauthenticated | AuthStateError;
