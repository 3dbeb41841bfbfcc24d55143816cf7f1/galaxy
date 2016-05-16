'use strict';

let mongoose = require('mongoose');

var SquadSchema = new mongoose.Schema({
  name   : String,
  info   : String,
  active : { type : Boolean, default: true },
  cohort : { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort' }
});

module.exports = mongoose.model('Squad', SquadSchema);
