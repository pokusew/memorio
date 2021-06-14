"use strict";

import { isDefined } from '../helpers/common';
import { FullPackage, LocalCategory, LocalFullPackage, LocalPackage, LocalQuestion, Package, Score } from '../types';
import { Database } from './indexed-db';
import { callApi } from '../helpers/api';


export interface DataManagerOptions {
	serverUrl: string;
}

export const updatedScore = (score: Score | undefined, correct: boolean) => {
	return {
		correct: (score?.correct ?? 0) + (correct ? 1 : 0),
		wrong: (score?.wrong ?? 0) + (!correct ? 1 : 0),
	};
};

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

		const handleNavigatorOnLineChange = (event) => {

			console.log(`[dm] navigator.onLine =`, navigator.onLine);

			this.offline = !navigator.onLine;

		};

		window.addEventListener('online', handleNavigatorOnLineChange);
		window.addEventListener('offline', handleNavigatorOnLineChange);

		this.offline = !navigator.onLine;

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

		// do not attempt load data from the network if we know that the browser is offline
		// return the local data immediately
		if (this.offline) {

			const localData = await localDataOp;

			return [...localData.values()];

		}

		// TODO: rethink non-matching version data (come up with synchronization)

		const [localDataResult, remoteDataResult] = await Promise.allSettled([
			localDataOp,
			callApi(`${this.serverUrl}/packages.json`).then(({ json }) => json) as Promise<Package[]>,
		]);

		// both ways failed
		if (localDataResult.status === 'rejected' && remoteDataResult.status === 'rejected') {
			throw new Error('Data could lot be loaded (neither from local storage nor the network).');
		}

		const localData = localDataResult.status === 'fulfilled'
			? localDataResult.value
			: new Map<number, LocalPackage>();

		if (remoteDataResult.status === 'fulfilled') {
			remoteDataResult.value.forEach(pack => {

				if (!localData.has(pack.id)) {
					localData.set(pack.id, pack);
				}

			});
		}

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

	public updateScore(questionId: number, correct: boolean) {
		return this.db.runInTransaction<void>(
			['packages', 'categories', 'questions'],
			'readwrite',
			(db, transaction, resolve, reject) => {

				transaction.oncomplete = () => {
					resolve();
				};

				const pStore = transaction.objectStore('packages');
				const cStore = transaction.objectStore('categories');
				const qStore = transaction.objectStore('questions');

				// TODO: use promises within the transaction

				qStore.get(questionId).onsuccess = event => {

					const question: LocalQuestion | undefined =
						(event.target as IDBRequest).result as LocalQuestion | undefined;

					if (!isDefined(question)) {
						reject(`question not found`);
						return;
					}

					cStore.get(question.category).onsuccess = event => {

						const category: LocalCategory | undefined =
							(event.target as IDBRequest).result as LocalCategory | undefined;

						if (!isDefined(category)) {
							reject(`category not found`);
							return;
						}

						pStore.get(category.package).onsuccess = event => {

							const pack: LocalPackage | undefined =
								(event.target as IDBRequest).result as LocalPackage | undefined;

							if (!isDefined(pack)) {
								reject(`package not found`);
								return;
							}

							const d = new Date();

							question.lastPractice = d;
							question.score = updatedScore(question.score, correct);

							category.lastPractice = d;
							category.score = updatedScore(category.score, correct);

							pack.lastPractice = d;
							pack.score = updatedScore(pack.score, correct);

							qStore.put(question);
							cStore.put(category);
							pStore.put(pack);

						};


					};

				};

			},
		);

	}

}

export default DataManager;
