'use strict';

import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.

let Project = require('../project/project.model');

var GroupProjectSchema = new mongoose.Schema({
  project: { type: Project.schema, required: true},
  team: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ]
});

module.exports = mongoose.model('GroupProject', GroupProjectSchema);
