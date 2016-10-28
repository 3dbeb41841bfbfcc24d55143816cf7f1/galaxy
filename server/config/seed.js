/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Cohort from '../api/cohort/cohort.model';

import config from './environment';
import Promise from 'bluebird';
import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.

mongoose.Promise = Promise;

// FOR DEBUGGING
// mongoose.set('debug', (coll, method, query, doc) => {
//   console.log(`MONGOOSE DEBUG: ${coll} ${method} ${JSON.stringify(query)} ${JSON.stringify(doc)}`);
// });

console.log('config.env:', config.env);

import {createTestCohorts} from './seeds/seed-cohorts';
import {createTestSquads} from './seeds/seed-squads';
import {createTestUsers} from './seeds/seed-users';
import {createTestGroupProjects} from './seeds/seed-group-projects';
import {createTestHomework} from './seeds/seed-homework';
import {removeResourceOrgs, createResourceOrgs} from './seeds/seed-resource-orgs';
import {removeResources, createResources} from './seeds/seed-resources';
import {counts} from './seeds/counts';

function createTestData() {
  createTestCohorts()
  .then( () => createTestSquads() )
  .then( () => createTestUsers() )
  .then( () => createTestGroupProjects() )
  .then( () => removeResourceOrgs() )
  .then( () => createResourceOrgs() )
  .then( () => removeResources() )
  .then( () => createResources('./data/external-resources.json') )
  .then( () => createResources('./data/atl-wdi-curriculum.json') )
  .then( () => createResources('./data/atl-wdi-exercises.json') )
  .then( () => createResources('./data/ga-wdi-lessons.json') )
  .then( () => createResources('./data/ga-wdi-exercises.json') )
  .then( () => createResources('./data/ga-wdi-boston.json') )
  .then( () => createResources('./data/den-wdi-1.json') )
  .then( () => createResources('./data/den-wdi-2.json') )
  .then( () => createResources('./data/generalassembly-atx.json') )
  .then( () => createResources('./data/wdi-sea.json') )
  .then( () => createTestHomework() )
  .then( () => counts() );
}

if (config.env === 'development') {
  createTestData();
}
else {
  createTestData();
}
