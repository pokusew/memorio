"use strict";

import React from 'react';
import { useAuthState } from '../firebase/hooks';
import { LoadingScreen } from '../components/layout';
import { AUTH_STATE_LOADING } from '../firebase/types';


const LoadingBarrier = ({ children }) => {

	const authState = useAuthState();

	if (authState.state === AUTH_STATE_LOADING) {
		return (
			<LoadingScreen />
		);
	}

	return children;

};

export default LoadingBarrier;
