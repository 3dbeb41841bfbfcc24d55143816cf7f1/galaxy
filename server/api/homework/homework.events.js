/**
 * Homework model events
 */

'use strict';

import {EventEmitter} from 'events';
var Homework = require('./homework.model');
var HomeworkEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
HomeworkEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Homework.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    HomeworkEvents.emit(event + ':' + doc._id, doc);
    HomeworkEvents.emit(event, doc);
  }
}

export default HomeworkEvents;
