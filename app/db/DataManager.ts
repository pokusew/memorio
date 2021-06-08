"use strict";

import { isDefined } from '../helpers/common';
import { Package, FullPackage } from '../types';
import { Database } from './indexed-db';
import { callApi } from '../helpers/api';


export interface DataManagerOptions {
	serverUrl: string;
}

class DataManager {

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

	}

	public findAllPackages(): Promise<Package[]> {

		// TODO: fuse with score data, handle offline

		// return this.db.getAll('packages');

		return callApi(`${this.serverUrl}/packages.json`).then(({ json }) => json);

	}

	public findOnePackageById(id: number): Promise<FullPackage | undefined> {

		// return this.db.getOneByKey('packages', id);

		return callApi(`${this.serverUrl}/packages/${id}.json`).then(({ json }) => json);

	}

	public addPackages(data: Package[]): Promise<void> {
		return this.db.add('packages', data);
	}

	public addOfflinePackage(id: number) {

	}

	public removeOffline(id: number) {

	}


}

export default DataManager;
