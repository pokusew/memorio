"use strict";

import { isDefined } from './common';


export type AutoMapFallback<K, V> = ((key: K) => V) | V

export const isFunctionalFallback = <K, V>(fallback: AutoMapFallback<K, V>): fallback is ((key: K) => V) => typeof fallback === 'function';

// see https://medium.com/front-end-hacking/es6-map-vs-object-what-and-when-b80621932373
export class AutoMap<K, V> {

	private _store: Map<K, { count: number; value: V }>;
	private _usages: number;
	private readonly fallback: AutoMapFallback<K, V>;

	constructor(fallback: AutoMapFallback<K, V>) {
		this._store = new Map();
		this._usages = 0;
		this.fallback = fallback;
	}

	static resolveFallback<K, V>(fallback: AutoMapFallback<K, V>, key: K): V {
		return isFunctionalFallback(fallback) ? fallback(key) : fallback;
	}

	use(key: K, fallback?: AutoMapFallback<K, V>): V {

		const record = this._store.get(key);

		if (!isDefined(record)) {

			const value = AutoMap.resolveFallback(fallback ?? this.fallback, key);

			// if (!isDefined(value)) {
			// 	throw new Error(`[AutoMap] record for key '${key}' does not exists and value fallback resolved to ${value}`);
			// }

			this._store.set(key, {
				count: 1,
				value,
			});

			this._usages++;

			return value;

		}

		record.count++;
		this._usages++;

		return record.value;

	}

	unuse(key: K): V | undefined {

		const record = this._store.get(key);

		if (!isDefined(record)) {
			return undefined;
		}

		record.count--;
		this._usages--;

		return record.value;

	}

	safeDelete(key): number | undefined {

		const record = this._store.get(key);

		if (!isDefined(record)) {
			return undefined;
		}

		record.count--;
		this._usages--;

		if (record.count < 1) {
			this._store.delete(key);
		}

		return record.count;

	}

	delete(key): boolean {
		return this._store.delete(key);
	}

	has(key): boolean {
		return this._store.has(key);
	}

	get(key): V | undefined {
		return this._store.get(key)?.value;
	}

	forEach(cb: (key: K, value: V, count: number) => void) {
		return this._store.forEach((v, k) => cb(k, v.value, v.count));
	}

	get size(): number {
		return this._store.size;
	}

	get usages(): number {
		return this._usages;
	}

}
