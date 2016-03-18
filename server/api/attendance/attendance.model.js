'use strict';

import mongoose from 'mongoose';

var AttendanceSchema = new mongoose.Schema({
  date: Date,
  value: String
});

export default mongoose.model('Attendance', AttendanceSchema);
