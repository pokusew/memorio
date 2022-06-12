"use strict";

import { useContext } from 'react';

import { AuthStateContext, FirebaseContext } from './contexts';
import { AppUser, AUTH_STATE_USER } from './types';


export const useConfiguredFirebase = () => useContext(FirebaseContext);

export const useAuthState = () => useContext(AuthStateContext);

export const useAppUser = (): AppUser | null => {
	const authState = useAuthState();
	if (authState.state === AUTH_STATE_USER) {
		return authState.data;
	}
	return null;
};
