import Promise from 'bluebird';
import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.
mongoose.Promise = Promise;

import Cohort from '../../api/cohort/cohort.model';
import Homework from '../../api/homework/homework.model';

export function createTestHomework() {
  return Cohort.findOne({name: 'Test Cohort #1'})
  .then((testCohort1) => {
    console.log('Removing Homeworks');
    return Homework.find({}).remove()
    .then(() => {
      console.log('Creating a Homework');
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
