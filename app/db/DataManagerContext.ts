"use strict";

import React from 'react';

import DataManager from './DataManager';


// @ts-ignore
const DataManagerContext = React.createContext<DataManager>(undefined);

DataManagerContext.displayName = 'DataManagerContext';

export default DataManagerContext;
