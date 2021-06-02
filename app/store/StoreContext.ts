"use strict";

import React from 'react';

import Store from './Store';


// @ts-ignore
const StoreContext = React.createContext<Store<StoreData>>(undefined);

StoreContext.displayName = 'StoreContext';

export default StoreContext;
