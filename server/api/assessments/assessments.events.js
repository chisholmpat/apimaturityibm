/**
 * Assessments model events
 */

'use strict';

import {EventEmitter} from 'events';
import Assessments from './assessments.model';
var AssessmentsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AssessmentsEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Assessments.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AssessmentsEvents.emit(event + ':' + doc._id, doc);
    AssessmentsEvents.emit(event, doc);
  };
}

export default AssessmentsEvents;
