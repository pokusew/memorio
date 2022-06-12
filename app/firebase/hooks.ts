"use strict";

import { useContext } from 'react';

import { AuthStateContext, FirebaseContext } from './contexts';
import { AppUser } from './types';


export const useConfiguredFirebase = () => useContext(FirebaseContext);

export const useAuthState = () => useContext(AuthStateContext);

export const useAppUser = (): AppUser | null => {
	const authState = useAuthState();
	if (!authState.loading && !authState.error) {
		return authState.data;
	}
	return null;
};
