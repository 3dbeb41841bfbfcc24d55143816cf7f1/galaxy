import Promise from 'bluebird';
import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.
mongoose.Promise = Promise;

import Cohort from '../../api/cohort/cohort.model';

export function createTestCohorts() {
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
