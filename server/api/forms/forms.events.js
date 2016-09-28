/**
 * Forms model events
 */

'use strict';

import {EventEmitter} from 'events';
import Forms from './forms.model';
var FormsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FormsEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Forms.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    FormsEvents.emit(event + ':' + doc._id, doc);
    FormsEvents.emit(event, doc);
  };
}

export default FormsEvents;
