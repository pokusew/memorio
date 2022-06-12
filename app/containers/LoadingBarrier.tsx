"use strict";

import React from 'react';
import { useAuthState } from '../firebase/hooks';
import { LoadingScreen } from '../components/layout';


const LoadingBarrier = ({ children }) => {

	const authState = useAuthState();

	if (authState.loading) {
		return (
			<LoadingScreen />
		);
	}

	return children;

};

export default LoadingBarrier;
