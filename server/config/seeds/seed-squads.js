import Promise from 'bluebird';
import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.
mongoose.Promise = Promise;

import Cohort from '../../api/cohort/cohort.model';
import Squad from '../../api/squad/squad.model';

export function createTestSquads() {
  return Cohort.findOne({name: 'Test Cohort #1'})
  .then((testCohort1) => {
    console.log('Removing Squads');
    return Squad.find({}).remove()
    .then(() => {
      console.log('Creating Squads');
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
