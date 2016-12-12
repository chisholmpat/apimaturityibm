'use strict';

import mongoose from 'mongoose';
var Forms = mongoose.model('Forms').schema;

var AssessmentsSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
  	name: String,
  	description: String,
  	tempName: String,
  	master: Boolean,
	created: {
		type: Date,
		default: Date.now
	},
	assessment: [Forms]
});

export default mongoose.model('Assessments', AssessmentsSchema);
