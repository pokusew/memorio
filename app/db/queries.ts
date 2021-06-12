"use strict";

import DataManager from './DataManager';
import { LocalFullPackage, LocalPackage} from '../types';


const DEFAULT_DELAY = 1000;

const delay = (ms: number = DEFAULT_DELAY) => new Promise<void>((resolve => {
	setTimeout(() => {
		resolve(undefined);
	}, ms);
}));

export const packages = {
	findAll: () => (dm: DataManager): Promise<LocalPackage[]> => dm.findAllPackages(),
	findOneById: (id: number) => (dm: DataManager): Promise<LocalFullPackage | undefined> => dm.findOnePackageById(id),
};

