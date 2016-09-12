/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Cohort from '../api/cohort/cohort.model';
import Squad from '../api/squad/squad.model';
import Attendance from '../api/attendance/attendance.model';
import Homework from '../api/homework/homework.model';
import Project from '../api/project/project.model';
import GroupProject from '../api/group-project/group-project.model';
import config from './environment';
import Promise from 'bluebird';
import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.

mongoose.Promise = Promise;

// FOR DEBUGGING
// mongoose.set('debug', (coll, method, query, doc) => {
//   console.log(`MONGOOSE DEBUG: ${coll} ${method} ${JSON.stringify(query)} ${JSON.stringify(doc)}`);
// });

console.log('config.env:', config.env);

function createTestCohorts() {
  return Cohort.find({}).remove()
  .then(() => {
    return Cohort.create({
      name: 'Test Cohort #1',
      info: 'Just a test cohort from the seed file.',
      url:  'https://github.com/ATL-WDI-Curriculum/wdi-7',
      startDate: new Date(2016, 2, 21)
    }, {
      name: 'Test Cohort #2',
      info: 'Just a test cohort from the seed file.',
      url:  'https://github.com/ATL-WDI-Curriculum/wdi-7',
      startDate: new Date(2016, 2, 21)
    }, {
      name: 'ATL WDI #6',
      info: 'Atlanta WDI #6 - Spring 2016',
      url:  'https://github.com/ATL-WDI-Curriculum/wdi-7',
      startDate: new Date(2016, 2, 21)
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

  let promises = [
    Cohort.findOne({name: 'Test Cohort #1'}),
    Cohort.findOne({name: 'ATL WDI #6'}),
    Squad.findOne({name: 'Test Squad #1'}),
    Squad.findOne({name: 'Test Squad #2'}),
    Squad.findOne({name: 'Test Squad #3'})
  ];

  return Promise.all(promises)
  .spread((testCohort1, atlWDI6Squad, testSquad1, testSquad2, testSquad3) => {
    let testSquads = [testSquad1, testSquad2, testSquad3];
    return User.find({}).remove()
    .then(() => {
      let users = [
        {
          provider: 'local',
          name: 'Admin',
          role: 'admin',
          email: 'admin@ga.co',
          password: process.env.ADMIN_PASSWORD || 'admin',
          cohort: atlWDI6Squad._id
        }
      ];

      for (let i=1; i<=12; i++) {
        users.push({
          provider: 'local',
          name: 'Student' + i,
          email: 'student' + i + '@ga.co',
          password: 'test',
          cohort: testCohort1._id,
          squad: testSquads[(i-1)%3]._id,
          attendance: []
        });
      }
      return User.create(users);
    });
  })
  .then(() => {
    return User.find({});
  })
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
    return Promise.all(promises)
    .then((users) => {
      console.log('finished populating %d users', users.length);
      return null;
    });
  })
}

function createTestGroupProjects() {
  return GroupProject.find({}).remove()
  .then(() => {
    User.find( { name: { $in: ['Student1', 'Student4', 'Student7'] } } )
    .then( team => {
      console.log('team size:', team.length);
      let project = new Project( {
        num: 13,
        title: 'Sample Group Project',
        info: 'Just another group project',
        score: 9,
        comments: 'Great Job!'
      });
      return GroupProject.create( { project, team } );
    })
    .then( () => {
      return GroupProject.find({}).populate('team');
    })
    .then( groupProjects => {
      console.log('groupProjects:', groupProjects.map( p => {
        return { project: p.project, team: p.team.map( u => u.name ) };
      }));
      return User.findOne({ name: 'Student4' }).fill('groupProjects');
    })
    .then( student4 => {
      console.log(`student4 id = ${student4._id}, groupProjects:`, student4.groupProjects);
      // console.log('student4:', student4);
      return null;
    });
  });
}

function createTestHomework() {
  return Cohort.findOne({name: 'Test Cohort #1'})
  .then((testCohort1) => {
    return Homework.find({}).remove()
    .then(() => {
      return Homework.create({
        title: 'Busy Hands',
        info: 'Just a test homework from the seed file.',
        url: 'https://github.com/ATL-WDI-Exercises/busy-hands',
        cohort: testCohort1._id,
        assignedOnDate: new Date(2016, 2, 21),
        dueDate: new Date(2016, 2, 23)
      }, {
        title: 'CSS Box Model',
        info: 'Just a test homework from the seed file.',
        url: 'https://github.com/ATL-WDI-Exercises/css_boxmodel_lab_wdi6',
        cohort: testCohort1._id,
        assignedOnDate: new Date(2016, 2, 22),
        dueDate: new Date(2016, 2, 24)
      }, {
        title: 'Fashion Blog',
        info: 'Just a test homework from the seed file.',
        url: 'https://github.com/ATL-WDI-Exercises/fashion-blog',
        cohort: testCohort1._id,
        assignedOnDate: new Date(2016, 2, 23),
        dueDate: new Date(2016, 2, 25)
      });
    });
  })
  .then(() => {
    return Homework.find({})
    .then((homeworks) => {
      console.log('finished populating %d homeworks', homeworks.length);
      return null;
    });
  });
}

function counts() {
  return User.aggregate([
    {
      $group: {
        _id: '$cohort',
        count: {$sum: 1}
      }
    }
  ],
  function (err, result) {
    if (err) {
      console.log(err);
    }
    else {
      let ids = result.map( r => r._id );
      Cohort.find( { _id: { $in: ids } } )
      .then( cohorts => {
        result.forEach( r => {
          let cohort = cohorts.filter( c => c._id.equals(r._id) )[0];
          console.log(`Squad ${cohort.name} has ${r.count} students.`);
        });
      })
    }
  });
}

function createTestData() {
  createTestCohorts()
  .then( () => createTestSquads() )
  .then( () => createTestUsers() )
  .then( () => createTestGroupProjects() )
  .then( () => createTestHomework() )
  .then( () => counts() );
}

if (config.env === 'development') {
  createTestData();
}
else {
  createTestData();
}
