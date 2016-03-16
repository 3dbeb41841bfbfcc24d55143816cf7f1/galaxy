/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Cohort from '../api/cohort/cohort.model';
import config from './environment';

console.log('config.env:', config.env);

function createTestCohorts() {
  return Cohort.find({}).remove()
  .then(() => {
    return Cohort.create({
      name: 'Test Cohort #1',
      info: 'Just a test cohort from the seed file.'
    }, {
      name: 'Test Cohort #2',
      info: 'Just a test cohort from the seed file.'
    });
  })
  .then(() => {
    return Cohort.find({})
    .then((cohorts) => {
      console.log('finished populating %d cohorts:', cohorts.length);
      return null;
    });
  });
}

function createAdminUser() {
  return User.find({name: 'Admin'})
  .then((admin) => {
    if (!admin) {
      return User.create({
        provider: 'local',
        name: 'Admin',
        role: 'admin',
        email: 'admin@example.com',
        password: 'admin'
      })
    }
    else {
      console.log('admin user already exists.');
      return null;
    }
  })
  .then(() => {
    console.log('finished adding the admin user');
  });
}

function createTestUsers() {
  return Cohort.findOne({name: 'Test Cohort #1'})
  .then((testCohort1) => {
    console.log('testCohort1:', testCohort1);
    return User.find({}).remove()
    .then(() => {
      return User.create({
        provider: 'local',
        name: 'Joe Hacker',
        email: 'joe@hacker.com',
        password: 'test',
        cohort: testCohort1._id
      }, {
        provider: 'local',
        name: 'Admin',
        role: 'admin',
        email: 'admin@example.com',
        password: 'admin'
      })
    })
  })
  .then(() => {
    return User.find({})
    .then((users) => {
      console.log('finished populating users:', users);
      return null;
    });
  });
}

if (config.env === 'development') {
  createTestCohorts()
  .then(() => {
    createTestUsers();
  });
}
else {
  createAdminUser();
}
