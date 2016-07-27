'use strict';

import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.

var SquadSchema = new mongoose.Schema({
  name   : String,
  info   : String,
  active : { type : Boolean, default: true },
  cohort : { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort' }
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

  SquadSchema.fill('studentCount')
  .value(function(callback) {
    // `this` is current (found) instance
    this.db.model('User')
    .count({squad: this.id, role: 'student'})
    .exec(function(err, studentCount) {
      console.log('calling callback 1 with studentCount:', studentCount);
      return callback(err, studentCount);
    });
  })
  .multi(function(squads, ids, callback) {  // multi is used for queries with multiple fields
  // query studentCount for all found parents with single db query
    this.db.model('User')
    .aggregate([
      { $match : { role : 'student' } },
      { $group: {
          _id: '$squad',
          studentCount: {$sum: 1}
        }
      },
      { $match: {'_id': {$in: ids}} }
    ],
      function(err, studentCounts) {
        console.log('calling callback 2 with studentCounts:', studentCounts);

        // connect our studentCounts with the squad docs
        squads.forEach(function(squad) {
          let studentCount = studentCounts.filter(function(c) { return c._id.equals(squad._id); })[0];
          squad.studentCount = studentCount ? studentCount.studentCount : 0;
        });
        return callback(err, squads);
      }
    );
  });
})();

module.exports = mongoose.model('Squad', SquadSchema);
