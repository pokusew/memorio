"use strict";

import { useCallback, useContext, useDebugValue, useEffect, useState } from 'react';

import DataManagerContext from './DataManagerContext';
import DataManager from './DataManager';


export const useDataManager = () => useContext<DataManager>(DataManagerContext);

export type QueryExecutor<QueryResult> = (dm: DataManager) => Promise<QueryResult>;

export interface QueryOperationLoading<T> {
	loading: true;
	error: false;
	data: undefined;
}

export interface QueryOperationSuccess<T> {
	loading: false;
	error: false;
	data: T;
}

export interface QueryOperationError<T> {
	loading: false;
	error: true;
	data: undefined;
}

export type QueryOperation<T> = QueryOperationLoading<T> | QueryOperationSuccess<T> | QueryOperationError<T>;


interface QueryHookState<T> {
	dm: DataManager;
	query: QueryExecutor<T>;
	value: QueryOperation<T>;
}

export const useQuery = <T>(query: QueryExecutor<T>): QueryOperation<T> => {

	const dm = useDataManager();

	const [state, setState] = useState<QueryHookState<T>>(() => ({
		dm,
		query,
		value: {
			loading: true,
			error: false,
			data: undefined,
		},
	}));

	let valueToReturn = state.value;

	if (state.dm !== dm || state.query !== query) {

		valueToReturn = {
			loading: true,
			error: false,
			data: undefined,
		};

		setState({
			dm,
			query,
			value: {
				loading: true,
				error: false,
				data: undefined,
			},
		});

	}

	// Display the current value for this hook in React DevTools.
	useDebugValue(valueToReturn);

	// It is important not to subscribe while rendering because this can lead to memory leaks.
	// (Learn more at reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)
	// Instead, we wait until the commit phase to attach our handler.
	//
	// We intentionally use a passive effect (useEffect) rather than a synchronous one (useLayoutEffect)
	// so that we don't stretch the commit phase.
	// This also has an added benefit when multiple components are subscribed to the same source:
	// It allows each of the event handlers to safely schedule work without potentially removing an another handler.
	// (Learn more at https://codesandbox.io/s/k0yvr5970o)
	useEffect(() => {

		let didUnsubscribe = false;

		const executeQuery = async () => {

			// It's possible that this callback will be invoked even after being unsubscribed,
			// if it's removed as a result of a subscription event/update.
			// In this case, React will log a DEV warning about an update from an unmounted component.
			// We can avoid triggering that warning with this check.
			if (didUnsubscribe) {
				return;
			}

			let value: QueryOperation<T>;

			try {
				const data = await query(dm);
				value = {
					loading: false,
					error: false,
					data,
				}
			} catch (err) {
				value = {
					loading: false,
					error: true,
					data: undefined,
				};
			}

			if (didUnsubscribe) {
				console.warn('finished but unsubscribed');
				return;
			}

			setState((prevState) => {

				// Ignore values from stale sources!
				// Since we subscribe an unsubscribe in a passive effect,
				// it's possible that this callback will be invoked for a stale (previous) subscription.
				// This check avoids scheduling an update for that stale subscription.
				if (prevState.dm !== dm || prevState.query !== query) {
					return prevState;
				}

				return {
					...prevState,
					value,
				};

			});

		};

		// Because we're subscribing in a passive effect,
		// it's possible that an update has occurred between render and our effect handler.
		// Check for this and schedule an update if work has occurred.
		// noinspection JSIgnoredPromiseFromCall
		executeQuery();

		return () => {
			console.log('didUnsubscribe = true');
			didUnsubscribe = true;
		};

	}, [dm, query]);

	// Return the current value for our caller to use while rendering.
	return valueToReturn;

};
