/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.

let User = require('../api/user/user.model');
let Cohort = require('../api/cohort/cohort.model');
let Squad = require('../api/squad/squad.model');
let Attendance = require('../api/attendance/attendance.model');
let Homework = require('../api/homework/homework.model');

// let config = require('./environment');
// console.log('config.env:', config.env);

// let conn = mongoose.connect('mongodb://username:password@host:port/database?options');
// let conn = mongoose.connect('mongodb://localhost/galaxy-dev');
let conn = mongoose.connect('mongodb://galaxy:GA-laxy1024@ds039175.mlab.com:39175/heroku_pvlm7r3p');

function mapValueToInteger(v) {
  switch (v) {
    case 'present':   return  0;
    case 'late':      return  1;
    case 'excused':   return  2;
    case 'unexcused': return  3;
    case 'dropped':   return  4;
    default:          return -1;
  }
}

let debug = 1;
let promises = [];

console.log('About to get users...');

User.find({})
.then(users => {
  console.log('Found', users.length, 'users.');
  users.forEach(u => {
    // console.log('user.github:', u.github);
    u.attendance.sort(function(a, b) {
      return a.date - b.date;
    });

    let oldAttendance = u.attendance;
    let newAttendance = [];
    let lastDate = null;
    let lastValue = null;
    u.attendance.forEach((a) => {
      if (debug >= 2) {
        console.log('  old:', a.date, ' => ', a.value, '(' + mapValueToInteger(a.value) + ')');
      }
      if (!lastDate || lastDate.getTime() !== a.date.getTime() && mapValueToInteger(a.value) !== -1) {
        // console.log('  Adding:', a.date, ' => ', a.value, '(' + mapValueToInteger(a.value) + ')');
        newAttendance.push(a);
      }
      else {
        if (lastValue && lastValue !== a.value && mapValueToInteger(a.value) > mapValueToInteger(lastValue)) {
          // console.log('    Should we be skipping:', a.date, ' => ', a.value, '(' + mapValueToInteger(a.value) + ')');
          // console.log('    Updating attendance to:', a.value, '(' + mapValueToInteger(a.value) + ')');
          newAttendance[newAttendance.length-1].value = a.value;
        }
      }
      lastDate = a.date;
      lastValue = a.value;
    });
    let login = u.email ? u.email : u.github.login;
    let cohort = u.cohort ? u.cohort.name : '';
    let squad = u.squad ? u.squad.name : '';
    console.log(login, 'has cohort', cohort, 'and squad', squad,
                ' : ', oldAttendance.length, ' => ', newAttendance.length);

    if (debug >= 2) {
      newAttendance.forEach((a) => {
        console.log('  new:', a.date, ' => ', a.value, '(' + mapValueToInteger(a.value) + ')');
      });
    }
    u.attendance = newAttendance;
    promises.push(u.save());
  });

  Promise.all(promises)
  .then((users) => {
    console.log('finished updating %d users', users.length);
    conn.disconnect();
    return null;
  });
}, (err) => {
  console.log('ERROR:', err);
});
