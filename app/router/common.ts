"use strict";

/**
 * note: order matters, the routes are matched from top to bottom
 */
export type RoutesMap = Map<string, string>;

export type RouteParams = Record<string, string> | undefined;
export type RoutePayload = any;

export interface Route {
	name: string;
	payload?: RoutePayload;
}

export interface PayloadTransformer {
	toParams: (payload: RoutePayload) => RouteParams;
	fromParams: (params: RouteParams) => RoutePayload;
}

export interface LocationListener {
	(route?: Route | undefined): void
}

export type UnlistenFunction = () => void;

export interface RouteUrlGenerator {
	(payload?: any): string | undefined
}

export interface RouteMatcher {
	(pathname: string): Route | undefined
}

export type RouteToUrlMap = Map<string, RouteUrlGenerator>;

export type UrlToRouteMap = Map<string, RouteMatcher>;

export const INVALID_LINK = '#invalidLink';

export type LinkArgs = (Route | { url: string }) & { exact?: boolean };
