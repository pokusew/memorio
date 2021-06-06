"use strict";

import { isDefined } from '../helpers/common';


export interface ObjectStoreDescription {
	name: Parameters<IDBDatabase['createObjectStore']>[0];
	options: Parameters<IDBDatabase['createObjectStore']>[1];
	indices: {
		name: Parameters<IDBObjectStore['createIndex']>[0];
		keyPath: Parameters<IDBObjectStore['createIndex']>[1];
		options: Parameters<IDBObjectStore['createIndex']>[2];
	}[];
}

export interface DatabaseDescription {
	name: string;
	version: number;
	schema: ObjectStoreDescription[]
}

export interface TransactionExecutor<T> {
	(db: IDBDatabase, transaction: IDBTransaction, resolve: (result: T) => void, reject: (error?: any) => void): void;
}

/**
 * A simple wrapper around IndexedDB
 * @see <a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB">Using IndexedDB on MDN</a>
 */
export class Database {

	private readonly ready: Promise<IDBDatabase>;

	constructor(description: DatabaseDescription) {

		const { name, version, schema } = description;

		const openReq = indexedDB.open(name, version);

		openReq.onerror = (event) => {

			console.log(
				`[db] an ${openReq.error?.name ?? 'unknown error'} occurred while opening database ${name}@${version}`,
				openReq.error,
			);

			// if (openReq.error?.name === 'VersionError') {
			// 	// TODO: delete database and recreate
			// }

			// TODO: notify user

		};

		openReq.onblocked = (event) => {
			console.log('[db] the open request with versionchange is blocked by an open connection');
			// TODO: notify user
		};

		openReq.onupgradeneeded = (event: IDBVersionChangeEvent) => {

			console.log(`[db] upgrade from ${event.oldVersion} to ${event.newVersion} needed`);

			if (!isDefined(event.target)) {
				console.error(`[db] onupgradeneeded: event.target is not defined`);
				return;
			}

			const db: IDBDatabase = openReq.result;

			for (const storeName of db.objectStoreNames) {
				db.deleteObjectStore(storeName);
			}

			schema.forEach(({ name, options, indices }) => {

				const store = db.createObjectStore(name, options);

				indices.forEach(({ name, keyPath, options }) => {

					store.createIndex(name, keyPath, options);

				});

			});

		};

		this.ready = new Promise<IDBDatabase>((resolve => {

			openReq.onsuccess = () => {

				const db = openReq.result;

				console.log(`[db] database opened, version = ${db.version}`);

				db.onclose = (event) => {
					console.log(`[db] connection closed unexpectedly`, event);
				};

				db.onclose = (event) => {
					console.log(`[db] an error occurred`, event);
				};

				db.onversionchange = (event: IDBVersionChangeEvent) => {

					// If another tab requests a version change we should close the database.
					// This allows the other page to upgrade the database.

					// If we don't close it then the upgrade won't happen until the user closes the tab.

					console.log(`[db] version change from ${event.oldVersion} to ${event.newVersion} requested by another tab`);

					// TODO: notify UI

					// db.close();

				};

				resolve(db);

			};

		}));


	}

	async getAll<T>(storeName: string): Promise<T[]> {

		const db = await this.ready;

		const t: IDBTransaction = db.transaction([storeName], 'readonly');

		const store: IDBObjectStore = t.objectStore(storeName);

		return new Promise((resolve, reject) => {

			store.getAll().onsuccess = (event) => {
				// @ts-ignore
				resolve(event.target.result as T[]);
			};

		});

	}

	async getOneByKey<T>(storeName: string, key: any): Promise<T | undefined> {

		const db = await this.ready;

		const t: IDBTransaction = db.transaction([storeName], 'readonly');

		const store: IDBObjectStore = t.objectStore(storeName);

		return new Promise((resolve, reject) => {

			store.getKey(key).onsuccess = (event) => {
				// @ts-ignore
				resolve(event.target.result as T);
			};

		});

	}

	runInTransaction<T>(storeNames: string[], mode: IDBTransactionMode, executor: TransactionExecutor<T>): Promise<T> {
		return this.ready.then(db => new Promise<T>((resolve, reject) => {

			const t: IDBTransaction = db.transaction(storeNames, mode);

			t.onerror = () => {
				reject(t.error);
			};

			t.onabort = () => {
				reject();
			};

			executor(db, t, resolve, reject);

		}));
	}

	add<T>(storeName: string, data: T[]): Promise<void> {
		return this.runInTransaction(
			[storeName],
			'readwrite',
			(db, t, resolve, reject) => {

				const store = t.objectStore(storeName);

				data.forEach(item => {

					store.add(item);

				});

				t.oncomplete = () => {
					resolve();
				};

			},
		);
	}

}
