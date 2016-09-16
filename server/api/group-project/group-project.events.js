/**
 * Group Project model events
 */

'use strict';

import {EventEmitter} from 'events';
var GroupProject = require('./group-project.model');
var GroupProjectEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
GroupProjectEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  GroupProject.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    GroupProjectEvents.emit(event + ':' + doc._id, doc);
    GroupProjectEvents.emit(event, doc);
  }
}

export default GroupProjectEvents;
