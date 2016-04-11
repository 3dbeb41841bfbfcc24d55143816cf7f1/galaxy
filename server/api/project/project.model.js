'use strict';

import mongoose from 'mongoose';

var ProjectSchema = new mongoose.Schema({
  title: String,
  info: String,
  num: Boolean,
  githubUrl: String,
  deploymentUrl: String,
  instructorComments: String
});

export default mongoose.model('Project', ProjectSchema);
