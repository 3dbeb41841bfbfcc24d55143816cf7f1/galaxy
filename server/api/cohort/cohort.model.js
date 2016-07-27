'use strict';

let mongoose = require('mongoose');

var CohortSchema = new mongoose.Schema({
  name      : { type : String, unique : true, required : true },
  info      : { type : String },
  url       : { type : String },
  startDate : { type : Date },
  active    : { type : Boolean, default: true }
});

(function() {

  /**
   * Virtuals
   */

  // Public profile information
  CohortSchema
    .virtual('numStudents')
    .get(function() {
      return {
        'name': this.name,
        'role': this.role
      };
    });
})();

module.exports = mongoose.model('Cohort', CohortSchema);
