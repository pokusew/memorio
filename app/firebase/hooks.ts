"use strict";

import { useContext } from 'react';

import { FirebaseContext, AppUserContext } from './contexts';


export const useConfiguredFirebase = () => useContext(FirebaseContext);

export const useFirebaseUser = () => useContext(AppUserContext);
