'use strict';

import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.

var CohortSchema = new mongoose.Schema({
  name      : { type : String, unique : true, required : true },
  info      : { type : String },
  url       : { type : String },
  startDate : { type : Date },
  active    : { type : Boolean, default: true }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

(function() {

  /**
   * Virtuals and Fills
   */

  CohortSchema.fill('studentCount')
  .value(function(callback) {
    // `this` is current (found) instance
    this.db.model('User')
    .count({cohort: this.id, role: 'student'})
    .exec(function(err, studentCount) {
      console.log('calling callback 1 with studentCount:', studentCount);
      return callback(err, studentCount);
    });
  })
  .multi(function(cohorts, ids, callback) {  // multi is used for queries with multiple fields
  // query studentCount for all found parents with single db query
    this.db.model('User')
    .aggregate([{
        $group: {
          _id: '$cohort',
          studentCount: {$sum: 1}
        }},
        {$match: {'_id': {$in: ids}}}
    ],
      function(err, studentCounts) {
        console.log('calling callback 2 with studentCounts:', studentCounts);

        // connect our studentCounts with the cohort docs

        /*
        cohorts = [
          { _id: 5798d53dfd94beb45382faa0, name: 'ATL WDI #6', ... },
          { _id: 5798d53dfd94beb45382fa9e, name: 'Test Cohort #1', ... },
          { _id: 5798d53dfd94beb45382fa9f, name: 'Test Cohort #2', ... }
        ]
        studentCounts = [
             { _id: 5798d53dfd94beb45382faa0, studentCount: 1 },
             { _id: 5798d53dfd94beb45382fa9e, studentCount: 12 }
           ]
        */

        cohorts.forEach(function(cohort) {
          let studentCount = studentCounts.filter(function(c) { return c._id.equals(cohort._id); })[0];
          cohort.studentCount = studentCount ? studentCount.studentCount : 0;
        });
        return callback(err, cohorts);
      }
    );
  });
})();

module.exports = mongoose.model('Cohort', CohortSchema);
