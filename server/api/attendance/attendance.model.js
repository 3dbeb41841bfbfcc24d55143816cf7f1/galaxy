'use strict';

import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.

let AttendanceSchema = new mongoose.Schema({
  date: Date,
  value: String
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
