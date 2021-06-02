"use strict";

import { useContext, useEffect, useState } from 'react';

import FormContext, { FormContextShape } from './FormContext';
import FormController from './FormController';
import { withPrefix } from './object-utils';
import { FieldOptions, FieldRegister, FieldValidityState } from './common';


export const useFormContext = <DataShape>(): FormContextShape<DataShape> => useContext(FormContext);

export interface PassiveUncontrolledFormFieldHook {
	id: string;
	fieldName: string;
	register: FieldRegister;
	formName: string;
}

export const usePassiveUncontrolledFormField = <DataShape>(name: string, options: FieldOptions): PassiveUncontrolledFormFieldHook => {

	const { controller, sectionPrefix } = useFormContext<DataShape>();

	const fieldName = withPrefix(sectionPrefix, name);
	const id = `${controller.name}--${fieldName}`;

	const register = controller.register(fieldName, options);

	return {
		id,
		fieldName,
		register,
		formName: controller.name,
	};

};

export interface InternalFieldState<DataShape> {
	controller: FormController<DataShape>;
	fieldName: string;
	fieldValidityState: FieldValidityState;
}

export interface UncontrolledFormFieldHook extends PassiveUncontrolledFormFieldHook, FieldValidityState {
	id: string;
	fieldName: string;
	register: FieldRegister;
	formName: string;
}

export const useUncontrolledFormField = <DataShape>(name: string, options: FieldOptions): UncontrolledFormFieldHook => {

	const { controller, sectionPrefix } = useFormContext<DataShape>();

	const fieldName = withPrefix(sectionPrefix, name);
	const id = `${controller.name}--${fieldName}`;

	const register = controller.register(fieldName, options);

	const [state, setState] = useState<InternalFieldState<DataShape>>(() => ({
		controller,
		fieldName,
		fieldValidityState: controller.getFieldValidityState(fieldName),
	}));

	let fieldValidityStateToReturn: FieldValidityState = state.fieldValidityState;

	// If parameters have changed since our last render, schedule an update with its current value.
	if (state.controller !== controller || state.fieldName !== fieldName) {

		// If the subscription has been updated, we'll schedule another update with React.
		// React will process this update immediately, so the old subscription value won't be committed.
		// It is still nice to avoid returning a mismatched value though, so let's override the return value.
		fieldValidityStateToReturn = controller.getFieldValidityState(fieldName);

		setState({
			controller,
			fieldName,
			fieldValidityState: fieldValidityStateToReturn,
		});

	}

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

			// TODO: or use field argument? any edge cases?

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
			const fieldValidityState = controller.getFieldValidityState(fieldName);

			setState((prevState) => {

				// Ignore values from stale sources!
				// Since we subscribe an unsubscribe in a passive effect,
				// it's possible that this callback will be invoked for a stale (previous) subscription.
				// This check avoids scheduling an update for that stale subscription.
				if (prevState.controller !== controller || prevState.fieldName !== fieldName) {
					return prevState;
				}

				// Some subscriptions will auto-invoke the handler, even if the value hasn't changed.
				// If the value hasn't changed, no update is needed.
				// Return state as-is so React can bail out and avoid an unnecessary render.
				// > That's not our case. So we can safely skip this check.
				// if (
				// 	prevState.fieldValidityState.valid === fieldValidityState.valid
				// 	&& prevState.fieldValidityState.error === fieldValidityState.error
				// 	&& prevState.fieldValidityState.isCustomError === fieldValidityState.isCustomError
				// ) {
				// 	return prevState;
				// }

				return { ...prevState, fieldValidityState };

			});

		};

		const unsubscribe = controller.listenForFieldChange(fieldName, checkForUpdates);

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
	}, [controller, fieldName]);

	return {
		id,
		fieldName,
		register,
		formName: controller.name,
		...fieldValidityStateToReturn,
	};

};
