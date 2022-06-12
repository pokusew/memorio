"use strict";

import React from 'react';
import { AUTH_STATE_LOADING, AuthState, ConfiguredFirebase } from './types';


// @ts-ignore
const FirebaseContext = React.createContext<ConfiguredFirebase>(undefined);

FirebaseContext.displayName = 'FirebaseContext';

const AuthStateContext = React.createContext<AuthState>({ state: AUTH_STATE_LOADING });

AuthStateContext.displayName = 'FirebaseAuthContext';

export { FirebaseContext, AuthStateContext };
