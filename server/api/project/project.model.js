'use strict';

import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.

var ProjectSchema = new mongoose.Schema({
  num: Number,
  title: String,
  info: String,
  githubUrl: String,
  deploymentUrl: String
  // , instructorComments: [String]
});

module.exports = mongoose.model('Project', ProjectSchema);
