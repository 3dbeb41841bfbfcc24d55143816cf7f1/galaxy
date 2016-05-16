'use strict';

let mongoose = require('mongoose');

var CohortSchema = new mongoose.Schema({
  name      : { type : String, unique : true, required : true },
  info      : { type : String },
  startDate : { type : Date },
  active    : { type : Boolean, default: true }
});

module.exports = mongoose.model('Cohort', CohortSchema);
