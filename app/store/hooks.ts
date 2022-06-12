"use strict";

import { useCallback, useContext, useDebugValue, useEffect, useState } from 'react';

import StoreContext from './StoreContext';
import Store from './Store';


export const useStore = <DataModel extends object>() => useContext<Store<DataModel>>(StoreContext);

export type StoreValueSetter<V> = (nextValue: V) => void;

// based on: useSubscription from react/packages
//           Hook used for safely managing subscriptions in concurrent mode.
//           https://github.com/facebook/react/blob/master/packages/use-subscription/src/useSubscription.js
export const useStoreValue = <DataModel extends object, K extends keyof DataModel>(path: K): [DataModel[K] | undefined, StoreValueSetter<DataModel[K]>] => {

	const store = useStore<DataModel>();

	// // (Synchronously) returns the current value of our subscription.
	// getCurrentValue,
	//
	// // This function is passed an event handler to attach to the subscription.
	// // It should return an unsubscribe function that removes the handler.
	// subscribe,

	// Read the current value from our subscription.
	// When this value changes, we'll schedule an update with React.
	// It's important to also store the hook params so that we can check for staleness.
	// (See the comment in checkForUpdates() below for more info.)
	const [state, setState] = useState<{ store: Store<DataModel>; path: K; value: DataModel[K] | undefined }>(() => ({
		store,
		path,
		value: store.get(path),
	}));

	// TODO: maybe it should be part of the state?
	const setStoreValue = useCallback<StoreValueSetter<DataModel[K]>>(
		nextValue => store.update(path, nextValue),
		[path, store],
	);

	let valueToReturn: DataModel[K] | undefined = state.value;

	// If parameters have changed since our last render, schedule an update with its current value.
	if (state.store !== store || state.path !== path) {

		// If the subscription has been updated, we'll schedule another update with React.
		// React will process this update immediately, so the old subscription value won't be committed.
		// It is still nice to avoid returning a mismatched value though, so let's override the return value.
		valueToReturn = store.get(path);

		setState({
			store,
			path,
			value: valueToReturn,
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

		const checkForUpdates = () => {

			// It's possible that this callback will be invoked even after being unsubscribed,
			// if it's removed as a result of a subscription event/update.
			// In this case, React will log a DEV warning about an update from an unmounted component.
			// We can avoid triggering that warning with this check.
			if (didUnsubscribe) {
				return;
			}

			// We use a state updater function to avoid scheduling work for a stale source.
			// However it's important to eagerly read the currently value,
			// so that all scheduled work shares the same value (in the event of multiple subscriptions).
			// This avoids visual "tearing" when a mutation happens during a (concurrent) render.
			const value: DataModel[K] | undefined = store.get(path);

			setState((prevState) => {

				// Ignore values from stale sources!
				// Since we subscribe an unsubscribe in a passive effect,
				// it's possible that this callback will be invoked for a stale (previous) subscription.
				// This check avoids scheduling an update for that stale subscription.
				if (prevState.store !== store || prevState.path !== path) {
					return prevState;
				}

				// Some subscriptions will auto-invoke the handler, even if the value hasn't changed.
				// If the value hasn't changed, no update is needed.
				// Return state as-is so React can bail out and avoid an unnecessary render.
				if (prevState.value === value) {
					return prevState;
				}

				return { ...prevState, value };

			});

		};

		const unsubscribe = store.listen(path, checkForUpdates);

		// Because we're subscribing in a passive effect,
		// it's possible that an update has occurred between render and our effect handler.
		// Check for this and schedule an update if work has occurred.
		checkForUpdates();

		return () => {
			didUnsubscribe = true;
			unsubscribe();
		};

		// it seems that react-hooks/exhaustive-deps does not play nice with TypeScript
		// it complains about missing dependency V but V is just a TS type, not a variable
		// eslint-disable-next-line
	}, [store, path]);

	// Return the current value for our caller to use while rendering.
	return [valueToReturn, setStoreValue];

};


export const useStoreValueUnsafe = <DataModel extends object, K extends keyof DataModel>(path: K): [DataModel[K] | undefined, StoreValueSetter<DataModel[K]>] => {

	// TODO: better approach without using increment counter to forceUpdate?

	const store: Store<DataModel> = useStore();

	const [version, setVersion] = useState<number>(1);

	const setValue = useCallback<StoreValueSetter<DataModel[K]>>(
		nextValue => store.update(path, nextValue),
		[path, store],
	);

	useEffect(() => {

		console.log(`[useStoreValue] listen ${path.toString()}`);

		const handleValueChange = nextValue => {
			console.log(`[useStoreValue] handleValueChange`, nextValue);
			setVersion(v => v === Number.MAX_SAFE_INTEGER ? 1 : v + 1);
		};

		const unlisten = store.listen(path, handleValueChange);

		return () => {

			console.log(`[useStoreValue] cleanup ${path.toString()}`);

			unlisten();

		};

	}, [store, path, setVersion]);

	return [store.getState().get(path), setValue];

};

export const useStoreValueSetter = <DataModel extends object, K extends keyof DataModel>(path: K): StoreValueSetter<DataModel[K]> => {

	const store: Store<DataModel> = useStore();

	return useCallback<StoreValueSetter<DataModel[K]>>(
		nextValue => store.update(path, nextValue),
		[path, store],
	);

};
