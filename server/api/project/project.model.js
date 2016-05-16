'use strict';

let mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
  title: String,
  info: String,
  num: Boolean,
  githubUrl: String,
  deploymentUrl: String,
  instructorComments: String
});

module.exports = mongoose.model('Project', ProjectSchema);
