"use strict";

import { isDefined } from './common';


export const METHOD_POST = 'POST';
export const CONTENT_TYPE_JSON = 'application/json';

export type CallApiOptions = Omit<RequestInit, 'body'> & {
	token?: string;
	body?: any;
}

export const callApi = (url: RequestInfo, { headers, token, body, ...options }: CallApiOptions = {}) =>
	fetch(
		url,
		{
			...options,
			headers: {
				...headers,
				'Accept': CONTENT_TYPE_JSON,
				...isDefined(token) && { 'Authorization': `Bearer ${token}` },
				...isDefined(body) && { 'Content-Type': CONTENT_TYPE_JSON },
			},
			...isDefined(body) && { body: JSON.stringify(body) },
		},
	)
		.then(response => response.json()
			.catch(err => Promise.reject({
				code: 'parse_error',
				message: `An error occurred while parsing JSON: ${err.message}. Content-Type: ${response.headers.get('Content-Type')}`,
				status: response.status,
			}))
			.then(json => ({ json, response })),
		)
		.then(({ json, response }) => {

			if (!response.ok) {
				return Promise.reject({ json, response });
			}

			return { json, response };

		});
