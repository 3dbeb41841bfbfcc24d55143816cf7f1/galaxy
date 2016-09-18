'use strict';

import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.

let Project = require('../project/project.model');

var GroupProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cohort: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort' },
  project: { type: Project.schema, required: true },
  team: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

module.exports = mongoose.model('GroupProject', GroupProjectSchema);
