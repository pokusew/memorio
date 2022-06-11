"use strict";

import { useContext } from 'react';

import FirebaseContext from './FirebaseContext';
import { ConfiguredFirebase } from './types';


export const useConfiguredFirebase = () => useContext<ConfiguredFirebase>(FirebaseContext);
