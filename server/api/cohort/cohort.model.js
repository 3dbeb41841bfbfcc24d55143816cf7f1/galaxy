'use strict';

import mongoose from 'mongoose';

var CohortSchema = new mongoose.Schema({
  name   : { type : String, unique : true, required : true },
  info   : { type : String },
  active : { type : Boolean, default: true }
});

export default mongoose.model('Cohort', CohortSchema);
