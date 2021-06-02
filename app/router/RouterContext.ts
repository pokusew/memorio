"use strict";

import React from 'react';
import Router from './Router';


// @ts-ignore
const RouterContext: React.Context<Router> = React.createContext<Router>(undefined);

export default RouterContext;
