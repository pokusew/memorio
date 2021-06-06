"use strict";

import { isDefined } from '../helpers/common';
import { Package } from '../types';
import { Database } from './indexed-db';


class DataManager {

	private readonly db: Database;

	constructor() {

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
		return this.db.getAll('packages');
	}

	public findOnePackageById(id: number): Promise<Package | undefined> {
		return this.db.getOneByKey('packages', id);
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
