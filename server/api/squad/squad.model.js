'use strict';

import mongoose from 'mongoose';

var SquadSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  cohort: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort' }
});

export default mongoose.model('Squad', SquadSchema);
