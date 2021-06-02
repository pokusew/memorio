"use strict";

import test from 'ava';

import { areRoutesEqual, createRouteToUrlFn, createRouteToUrlMap, hasAnyParams } from '../../app/router/Router';
import { RoutesMap, RouteToUrlMap, RouteUrlGenerator } from '../../app/router/common';
import { isDefined } from '../../app/helpers/common';


const ROUTE_1 = 'ROUTE_1';
const ROUTE_2 = 'ROUTE_2';
const ROUTE_3 = 'ROUTE_3';

const ROUTES_MAP: RoutesMap = new Map([
	[ROUTE_1, '/abc'],
	[ROUTE_2, '/:eventId/monitor/places/:placeId'],
	[ROUTE_3, '/events/:eventId/maintenance'],
]);

const testCreateRouteToUrlFn = (name: string) => {

	const path = ROUTES_MAP.get(name);

	if (!isDefined(path)) {
		throw new Error(`[testCreateRouteToUrlFn] undefined route '${name}'`);
	}

	return createRouteToUrlFn(name, path);

};

test('createRouteToUrlFn 1', t => {

	const generateUrl: RouteUrlGenerator = testCreateRouteToUrlFn(ROUTE_1);

	t.is(
		generateUrl(),
		`/abc`,
		`correct payload must produce correct url`,
	);

});

test('createRouteToUrlFn 2', t => {

	const generateUrl: RouteUrlGenerator = testCreateRouteToUrlFn(ROUTE_2);

	t.is(
		generateUrl({
			eventId: '2r',
			placeId: '2r-8',
		}),
		`/2r/monitor/places/2r-8`,
		`correct payload must produce correct url`,
	);

});

test('createRouteToUrlFn 3', t => {

	const generateUrl: RouteUrlGenerator = testCreateRouteToUrlFn(ROUTE_3);

	t.is(
		generateUrl(),
		undefined,
		`missing payload param must produce undefined (a)`,
	);
	t.is(
		generateUrl({}),
		undefined,
		`missing payload param must produce undefined (b)`,
	);
	t.is(
		generateUrl({ eventId: '2x' }),
		`/events/2x/maintenance`,
		`correct payload must produce correct url`,
	);


});

test('createRouteToUrlMap', t => {

	const routeToUrlMap: RouteToUrlMap = createRouteToUrlMap(ROUTES_MAP);

	t.assert(routeToUrlMap.size === ROUTES_MAP.size);
	t.assert([...ROUTES_MAP.keys()].every((name) => routeToUrlMap.has(name)));
	t.assert([...routeToUrlMap.entries()].every(([name, fn]) => ROUTES_MAP.has(name) && typeof fn === 'function'));

});

test('areRoutesEqual', t => {

	t.assert(areRoutesEqual(undefined, undefined));
	t.assert(areRoutesEqual({ name: '1' }, { name: '1' }));
	t.assert(!areRoutesEqual({ name: '1' }, { name: '2' }));
	t.assert(areRoutesEqual({ name: '1', payload: {} }, { name: '1' }));
	t.assert(!areRoutesEqual({ name: '1', payload: { t: '8' } }, { name: '1' }));
	t.assert(!areRoutesEqual({ name: '1', payload: { t: '8' } }, { name: '1', payload: { t: '9' } }));
	t.assert(!areRoutesEqual({ name: '1', payload: { t: '8' } }, { name: '1', payload: { t: '9' } }));
	t.assert(!areRoutesEqual({ name: '1', payload: { t: '8', s: '2' } }, { name: '1', payload: { t: '8' } }));
	t.assert(!areRoutesEqual({ name: '1', payload: { t: '8' } }, { name: '1', payload: { t: '8', s: '2' } }));

});

test('hasAnyParams', t => {

	t.true(!hasAnyParams('/test'));
	t.true(hasAnyParams('/:p1'));
	t.true(hasAnyParams('/test/:p1'));
	t.true(hasAnyParams('/:p1/:p2'));

});
