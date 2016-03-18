/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Cohort from '../api/cohort/cohort.model';
import Squad from '../api/squad/squad.model';
import Attendance from '../api/attendance/attendance.model';
import config from './environment';
import Promise from 'bluebird';
import mongoose from 'mongoose';

mongoose.Promise = Promise;

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
      console.log('finished populating %d cohorts', cohorts.length);
      return null;
    });
  });
}

function createTestSquads() {
  return Cohort.findOne({name: 'Test Cohort #1'})
  .then((testCohort1) => {
    return Squad.find({}).remove()
    .then(() => {
      return Squad.create({
        name: 'Test Squad #1',
        info: 'Just a test squad from the seed file.',
        cohort: testCohort1._id
      }, {
        name: 'Test Squad #2',
        info: 'Just a test squad from the seed file.',
        cohort: testCohort1._id
      }, {
        name: 'Test Squad #3',
        info: 'Just a test squad from the seed file.',
        cohort: testCohort1._id
      });
    });
  })
  .then(() => {
    return Squad.find({})
    .then((squads) => {
      console.log('finished populating %d squads', squads.length);
      return null;
    });
  });
}

function createTestUsers() {
  Promise.delay(100).then(() => {
    return [
      Cohort.findOne({name: 'Test Cohort #1'}),
      Squad.findOne({name: 'Test Squad #1'}),
      Squad.findOne({name: 'Test Squad #2'}),
      Squad.findOne({name: 'Test Squad #3'})
    ];
  })
  .spread((testCohort1, testSquad1, testSquad2, testSquad3) => {
    return User.find({}).remove()
    .then(() => {
      return User.create({
        provider: 'local',
        name: 'Student1',
        email: 'student1@ga.com',
        password: 'test',
        cohort: testCohort1._id,
        squad: testSquad1._id,
        attendance: []
      }, {
        provider: 'local',
        name: 'Student2',
        email: 'student2@ga.com',
        password: 'test',
        cohort: testCohort1._id,
        squad: testSquad2._id,
        attendance: []
      }, {
        provider: 'local',
        name: 'Student3',
        email: 'student3@ga.com',
        password: 'test',
        cohort: testCohort1._id,
        squad: testSquad3._id,
        attendance: []
      }, {
        provider: 'local',
        name: 'Admin',
        role: 'admin',
        email: 'admin@example.com',
        password: 'admin'
      });
    });
  })
  .then(() => {
    return User.find({})
    .then((users) => {
      let promises = [];
      users.forEach((user) => {
        // console.log('user:', user);
        if (user.role === 'student') {
          user.attendance.push({ date: new Date(2016, 2, 21), value: 'present'   });
          user.attendance.push({ date: new Date(2016, 2, 22), value: 'late'      });
          user.attendance.push({ date: new Date(2016, 2, 23), value: 'excused'   });
          user.attendance.push({ date: new Date(2016, 2, 24), value: 'unexcused' });
          user.attendance.push({ date: new Date(2016, 2, 25), value: undefined   });
          promises.push(user.save());
        }
      });
      Promise.all(promises)
      .then((users) => {
        console.log('finished populating %d users', users.length);
        return null;
      });
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

if (config.env === 'development') {
  createTestCohorts()
  .then(() => {
    return createTestSquads();
  })
  .then(() => {
    return createTestUsers();
  });
}
else {
  createAdminUser();
}
