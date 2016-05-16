'use strict';

let mongoose = require('mongoose');

let AttendanceSchema = new mongoose.Schema({
  date: Date,
  value: String
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
