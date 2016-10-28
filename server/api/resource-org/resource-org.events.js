/**
 * ResourceOrg model events
 */

'use strict';

import {EventEmitter} from 'events';
import ResourceOrg from './resource-org.model';
var ResourceOrgEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ResourceOrgEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  ResourceOrg.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ResourceOrgEvents.emit(event + ':' + doc._id, doc);
    ResourceOrgEvents.emit(event, doc);
  };
}

export default ResourceOrgEvents;
