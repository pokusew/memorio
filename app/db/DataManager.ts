"use strict";

import { isDefined } from '../helpers/common';
import { Package, FullPackage, LocalPackage, LocalFullPackage, LocalCategory, LocalQuestion } from '../types';
import { Database } from './indexed-db';
import { callApi } from '../helpers/api';


export interface DataManagerOptions {
	serverUrl: string;
}

class DataManager {

	private offline: boolean;
	private readonly serverUrl: string;
	private readonly db: Database;

	constructor({ serverUrl }: DataManagerOptions) {

		this.serverUrl = serverUrl;

		this.db = new Database({
			name: 'memorio',
			version: 1,
			schema: [
				{
					name: 'packages',
					options: {
						keyPath: 'id',
						autoIncrement: false,
					},
					indices: [],
				},
				{
					name: 'categories',
					options: {
						keyPath: 'id',
						autoIncrement: false,
					},
					indices: [
						{
							name: 'package',
							keyPath: 'package',
							options: {
								unique: false,
								multiEntry: false,
							},
						},
					],
				},
				{
					name: 'questions',
					options: {
						keyPath: 'id',
						autoIncrement: false,
					},
					indices: [
						{
							name: 'package',
							keyPath: 'package',
							options: {
								unique: false,
								multiEntry: false,
							},
						},
						{
							name: 'category',
							keyPath: 'category',
							options: {
								unique: false,
								multiEntry: false,
							},
						},
					],
				},
			],
		});

		this.offline = false;

		const handleNavigatorOnLineChange = (event) => {

			console.log(`[dm] navigator.onLine =`, navigator.onLine);

			this.offline = !navigator.onLine;

		};

		window.addEventListener('online', handleNavigatorOnLineChange);
		window.addEventListener('offline', handleNavigatorOnLineChange);

	}

	public async findAllPackages(): Promise<LocalPackage[]> {

		const localDataOp: Promise<Map<number, LocalPackage>> = this.db.runInTransaction(
			['packages'],
			'readonly',
			(db, transaction, resolve, reject) => {

				const result: Map<number, LocalPackage> = new Map<number, LocalPackage>();

				transaction.oncomplete = () => {
					resolve(result);
				};

				const packagesStore = transaction.objectStore('packages');

				const openCursorReq = packagesStore.openCursor();

				openCursorReq.onsuccess = (event) => {

					const cursor = openCursorReq.result;

					if (!isDefined(cursor)) {
						// that's all data
						return;
					}

					result.set(cursor.key as number, cursor.value);

					cursor.continue();

				};

			},
		);

		if (this.offline) {

			const localData = await localDataOp;

			return [...localData.values()];

		}

		// TODO: rethink non-matching version data (come up with synchronization)

		const [localData, remoteData] = await Promise.all([
			localDataOp,
			callApi(`${this.serverUrl}/packages.json`).then(({ json }) => json) as Promise<Package[]>,
		]);

		remoteData.forEach(pack => {

			if (!localData.has(pack.id)) {
				localData.set(pack.id, pack);
			}

		});

		return [...localData.values()];

	}

	private async downloadPackage(id: number) {

		const fullPack: FullPackage = await callApi(`${this.serverUrl}/packages/${id}.json`).then(({ json }) => json);

		await this.db.runInTransaction<void>(
			['packages', 'categories', 'questions'],
			'readwrite',
			(db, transaction, resolve, reject) => {

				transaction.oncomplete = () => {
					resolve();
				};

				const pStore = transaction.objectStore('packages');
				const cStore = transaction.objectStore('categories');
				const qStore = transaction.objectStore('questions');

				const { categories, questions, ...pack } = fullPack;

				pStore.put(pack);

				categories.forEach(category => cStore.put(category));

				questions.forEach(question => qStore.put(question));

			},
		);

	}

	public async findOnePackageById(id: number): Promise<LocalFullPackage | undefined> {

		const localPackage = await this.db.getOneByKey('packages', id);

		if (!isDefined(localPackage)) {
			await this.downloadPackage(id);
		}

		return await this.db.runInTransaction<LocalFullPackage | undefined>(
			['packages', 'categories', 'questions'],
			'readonly',
			(db, transaction, resolve, reject) => {

				const pStore = transaction.objectStore('packages');
				const cStore = transaction.objectStore('categories');
				const qStore = transaction.objectStore('questions');

				let pack: LocalPackage | undefined;
				const categories: LocalCategory[] = [];
				const questions: LocalQuestion[] = [];

				transaction.oncomplete = () => {

					if (!isDefined(pack)) {
						resolve(undefined);
						return;
					}

					const fullPack: LocalFullPackage = {
						...pack,
						categories,
						questions,
					};

					resolve(fullPack);

				};

				pStore.get(id).onsuccess = (event) => {
					pack = (event.target as IDBRequest).result;
				};

				cStore.index('package').openCursor(id).onsuccess = (event) => {

					const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;

					if (!isDefined(cursor)) {
						// that's all data
						return;
					}

					categories.push(cursor.value);

					cursor.continue();

				};

				qStore.index('package').openCursor(id).onsuccess = (event) => {

					const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;

					if (!isDefined(cursor)) {
						// that's all data
						return;
					}

					questions.push(cursor.value);

					cursor.continue();

				};


			},
		);

	}

}

export default DataManager;
