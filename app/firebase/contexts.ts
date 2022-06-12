"use strict";

import React from 'react';
import { ConfiguredFirebase, AppUser } from './types';


// @ts-ignore
const FirebaseContext = React.createContext<ConfiguredFirebase>(undefined);

FirebaseContext.displayName = 'FirebaseContext';

const AppUserContext = React.createContext<AppUser | null>(null);

AppUserContext.displayName = 'FirebaseAuthContext';

export { FirebaseContext, AppUserContext };
