"use strict";

import React from 'react';
import { AuthState, ConfiguredFirebase } from './types';


// @ts-ignore
const FirebaseContext = React.createContext<ConfiguredFirebase>(undefined);

FirebaseContext.displayName = 'FirebaseContext';

const AuthStateContext = React.createContext<AuthState>({ loading: true });

AuthStateContext.displayName = 'FirebaseAuthContext';

export { FirebaseContext, AuthStateContext };
