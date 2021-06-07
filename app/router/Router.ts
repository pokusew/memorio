"use strict";

import { IS_DEVELOPMENT, isDefined, isEmpty } from '../helpers/common';
import {
	Route,
	LocationListener,
	RouteUrlGenerator,
	RoutesMap,
	RouteToUrlMap,
	UrlToRouteMap,
	INVALID_LINK,
	RouteMatcher,
	UnlistenFunction,
} from './common';
import { DOMAttributes } from 'react';


// https://developer.mozilla.org/en-US/docs/Web/API/History
// https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API
// length
// scrollRestoration
// state

export const PATTERN_ANY_PARAMS = /:([A-z0-9]+)/;

export const hasAnyParams = (path: string): boolean => PATTERN_ANY_PARAMS.test(path);

// TODO: test
// TODO: consider eval to speed up?
//       https://stackoverflow.com/questions/7650071/is-there-a-way-to-create-a-function-from-a-string-with-javascript
//       https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
export const createRouteToUrlFn = (name: string, path: string): RouteUrlGenerator => {

	// split by ':' that are followed by paramName
	// note: ?= is positive lookahead that prevents the paramName to be consumed
	const parts: string[] = path.split(/:(?=[A-z0-9]+)/);

	// no params are present
	if (parts.length === 1) {
		return () => path;
	}

	const params: string[] = [];

	for (let i = 1; i < parts.length; i++) {

		const match = parts[i].match(/^[A-z0-9]+/);

		if (!isDefined(match)) {
			throw new Error(`[createRouteToUrlFn] error matching parts[${i}] = '${parts[i]}'`);
		}

		const [paramName] = match;

		parts[i] = parts[i].slice(paramName.length);

		params.push(paramName);

	}

	return (payload?: any) => {

		// TODO: implement support for PayloadTransformer once needed

		let url = parts[0];

		for (let i = 1; i < parts.length; i++) {

			if (isDefined(params[i - 1])) {

				const paramName = params[i - 1];

				const paramValue = payload?.[paramName];

				// payload does not contain required parameter with paramValue
				if (!isDefined(paramValue)) {
					IS_DEVELOPMENT && console.error(`[RouteUrlGenerator][${name}] param '${paramName}' is undefined in payload`);
					return undefined;
				}

				url += paramValue;

			}

			url += parts[i];

		}

		return url;

	};

};

export const createRouteToUrlMap = (routesMap: RoutesMap): RouteToUrlMap => {

	const map = new Map();

	routesMap.forEach((path, name) => {
		map.set(name, createRouteToUrlFn(name, path));
	});

	return map;

};

export const buildRegExpMatcher = (path: string): RegExp => {

	// TODO: check named group support in browsers
	const regexpString = '^' + path.replace(/:([A-z0-9]+)/g, '(?<$1>.+)') + '$';

	return new RegExp(regexpString);

};

export const createRouteMatcher = (name: string, path: string): RouteMatcher => {

	if (!hasAnyParams(path)) {
		return (pathname: string) => {

			if (pathname === path) {
				return { name };
			}

			return undefined;

		};
	}

	const matcher: RegExp = buildRegExpMatcher(path);

	return (pathname: string) => {

		const match = matcher.exec(pathname);

		if (isDefined(match)) {
			// TODO: implement support for PayloadTransformer once needed
			return { name, payload: match.groups ?? {} };
		}

		return undefined;

	};

};

const createUrlToRouteMap = (routesMap: RoutesMap): UrlToRouteMap => {

	const map = new Map<string, RouteMatcher>();

	routesMap.forEach((path, name) => {
		map.set(name, createRouteMatcher(name, path));
	});

	return map;

};

export const areRoutesEqual = (prevRoute: Route | undefined, nextRoute: Route | undefined): boolean => {

	// in case of undefined or null or same object references
	if (prevRoute === nextRoute) {
		return true;
	}

	// either prevRoute is defined and nextRoute is undefined or vice versa
	if (!isDefined(prevRoute) || !isDefined(nextRoute)) {
		return false;
	}

	// names differ
	if (prevRoute.name !== nextRoute.name) {
		return false;
	}

	// in case of undefined or null or same object references
	if (prevRoute.payload === nextRoute.payload) {
		return true;
	}

	// normalize payloads ({} vs undefined)

	const prevPayloadKeys = isDefined(prevRoute.payload) ? Object.keys(prevRoute.payload) : [];
	const nextPayloadKeys = isDefined(nextRoute.payload) ? Object.keys(nextRoute.payload) : [];

	if (prevPayloadKeys.length !== nextPayloadKeys.length) {
		return false;
	}

	if (prevPayloadKeys.length === 0 && nextPayloadKeys.length === 0) {
		return true;
	}

	// note: there is no need to do an analogical check with nextKey
	//       because prevPayloadKeys.length === nextPayloadKeys.length
	for (const prevKey of prevPayloadKeys) {

		if (prevRoute.payload[prevKey] !== nextRoute.payload[prevKey]) {
			return false;
		}

	}

	return true;

};

export const createLinkOnClickHandler = (onHistoryPush: (href: string) => void): NonNullable<DOMAttributes<HTMLAnchorElement>['onClick']> =>
	(event) => {

		event.preventDefault();

		const href = event.currentTarget.href;

		// TODO: better handling of invalid links
		if (isEmpty(href) || href === INVALID_LINK) {
			return;
		}

		onHistoryPush(href);

	};

class Router {

	// url generator
	private readonly routeToUrlMap: RouteToUrlMap;
	// route matcher
	private readonly urlToRouteMap: UrlToRouteMap;

	private readonly listeners: Set<LocationListener>;
	private readonly popstateHandler: (event: PopStateEvent) => void;

	public readonly listenForRoute: (onChange: LocationListener) => UnlistenFunction =
		(onChange) => this.listen(onChange);

	public readonly currentRouteGetter: () => Route | undefined = () => this.route;

	public pathname: string;
	public route: Route | undefined;
	public readonly defaultLinkOnClickHandler: NonNullable<DOMAttributes<HTMLAnchorElement>['onClick']>;

	/***
	 * @param routesMap order matters, the routes are matched from top to bottom
	 */
	constructor(routesMap: RoutesMap) {

		this.routeToUrlMap = createRouteToUrlMap(routesMap);
		this.urlToRouteMap = createUrlToRouteMap(routesMap);
		this.listeners = new Set();
		this.popstateHandler = event => {
			console.log('[Router] popstate', location, event);
			this.updateRoute(event);
		};

		this.updateRoute(); // sets this.pathname and this.route
		this.defaultLinkOnClickHandler = createLinkOnClickHandler((href) => this.historyPush(href));

		window.addEventListener('popstate', this.popstateHandler);

	}

	public destroy(): void {
		window.removeEventListener('popstate', this.popstateHandler);
		// TODO: more cleaning?
	}

	public convertRouteToUrl(name: string, payload?): string | undefined {
		return this.routeToUrlMap.get(name)?.(payload);
	}

	// TODO: implement abstraction over route matching - interface RouteMatcher, this would be DefaultRouteMatcher
	public convertUrlToRoute(pathname: string): Route | undefined {

		for (const [name, matcher] of this.urlToRouteMap) {

			const match = matcher(pathname);

			if (isDefined(match)) {
				return match;
			}

		}

		return undefined;

	}

	private updateRoute(event?: PopStateEvent): void {

		console.log(`[Router] updateRoute ${isDefined(event) ? '(due to a PopStateEvent)' : '(manual)'}`);

		this.pathname = location.pathname;

		const route = this.convertUrlToRoute(this.pathname);

		if (areRoutesEqual(this.route, route)) {
			console.log('[Router] areRoutesEqual === true', route);
			return;
		}

		console.log('[Router] updating route', route);
		this.route = route;
		this.notify();

	}

	// TODO: data support
	private historyPush(url: string | null, data?: any) {

		if (location.href === url /* && history.state === data */) {
			console.log(`[Router] ignoring historyPush`, url);
			return;
		}

		history.pushState(/* data */ undefined, '', url);

		// Calling history.pushState() or history.replaceState() won't trigger a popstate event.
		// The popstate event is only triggered by performing a browser action,
		// such as clicking on the back button (or calling history.back() in JavaScript),
		// when navigating between two history entries for the same document.
		this.updateRoute();

	}

	// TODO: data support
	private historyReplace(url: string | null, data?: any) {

		if (location.href === url /* && history.state === data */) {
			console.log(`[Router] ignoring historyReplace`, url);
			return;
		}

		history.replaceState(/* data */ undefined, '', url);

		// Calling history.pushState() or history.replaceState() won't trigger a popstate event.
		// The popstate event is only triggered by performing a browser action,
		// such as clicking on the back button (or calling history.back() in JavaScript),
		// when navigating between two history entries for the same document.
		this.updateRoute();

	}

	public redirectUsingUrl(url: string) {
		this.historyReplace(url);
	}

	public redirect(name: string, payload?: any) {

		const url = this.convertRouteToUrl(name, payload);

		if (!isDefined(url)) {
			IS_DEVELOPMENT && console.error(`[Router] redirect no route`, name, payload);
			return;
		}

		this.historyReplace(url);

	}

	public pushUsingUrl(url: string) {
		this.historyPush(url);
	}

	public push(name: string, payload?: any) {

		const url = this.convertRouteToUrl(name, payload);

		if (!isDefined(url)) {
			IS_DEVELOPMENT && console.error(`[Router] push no route`, name, payload);
			return;
		}

		this.historyPush(url);

	}

	private notify() {
		this.listeners.forEach(fn => fn(this.route));
	}

	public listen(onChange: LocationListener): UnlistenFunction {

		this.listeners.add(onChange);

		return () => {
			this.listeners.delete(onChange);
		};

	}

}

export default Router;
