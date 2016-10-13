import Promise from 'bluebird';
import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.
mongoose.Promise = Promise;

import Cohort from '../../api/cohort/cohort.model';
import Squad from '../../api/squad/squad.model';
import User from '../../api/user/user.model';
import Project from '../../api/project/project.model';

export function createTestUsers() {
  let promises = [
    Cohort.findOne({name: 'Test Cohort #1'}),
    Cohort.findOne({name: 'ATL WDI #6'}),
    Squad.findOne({name: 'Test Squad #1'}),
    Squad.findOne({name: 'Test Squad #2'}),
    Squad.findOne({name: 'Test Squad #3'})
  ];

  return Promise.all(promises)
  .spread((testCohort1, atlWDI6Cohort, testSquad1, testSquad2, testSquad3) => {
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
          cohort: testCohort1._id
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
  .then( () => {
    return User.findOne( { name: 'Student1'} );
  })
  .then( (student1) => {
    let project = new Project( {
      num: 1,
      title: 'Duck Hunt',
      info: 'A remake of the classic Nintendo game.',
      githubUrl: 'https://github.com/drmikeh/duck-hunt',
      deploymentUrl: 'http://juggler-horse-43246.bitballoon.com/',
      comments: 'Nice First Project!'
    });
    student1.projects.push(project);
    return student1.save()
  })
  .then((student1) => {
    // console.log('new project added to student1:', student1);
  });
}
