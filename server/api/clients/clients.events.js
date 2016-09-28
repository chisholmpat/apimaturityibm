/**
 * Clients model events
 */

'use strict';

import {EventEmitter} from 'events';
import Clients from './clients.model';
var ClientsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ClientsEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Clients.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ClientsEvents.emit(event + ':' + doc._id, doc);
    ClientsEvents.emit(event, doc);
  };
}

export default ClientsEvents;
