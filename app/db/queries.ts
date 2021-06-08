"use strict";

import DataManager from './DataManager';
import { FullPackage, Package } from '../types';


const DEFAULT_DELAY = 1000;

const delay = (ms: number = DEFAULT_DELAY) => new Promise<void>((resolve => {
	setTimeout(() => {
		resolve(undefined);
	}, ms);
}));

export const packages = {
	findAll: () => (dm: DataManager): Promise<Package[]> => dm.findAllPackages(),
	findOneById: (id: number) => (dm: DataManager): Promise<FullPackage | undefined> => dm.findOnePackageById(id),
};

