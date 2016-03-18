/**
 * Attendance model events
 */

'use strict';

import {EventEmitter} from 'events';
var Attendance = require('./attendance.model');
var AttendanceEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AttendanceEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Attendance.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AttendanceEvents.emit(event + ':' + doc._id, doc);
    AttendanceEvents.emit(event, doc);
  }
}

export default AttendanceEvents;
