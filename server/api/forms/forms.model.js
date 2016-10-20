'use strict';

import mongoose from 'mongoose';

var Questions = new mongoose.Schema({
	question: String,
	date: {
		type: Date,
		default: Date.now
	},
	category: String,
	weight: {
		type: Number,
		default: 0
	},
	answer: {
		type: Number,
		default: 1
	},
	response: {
		type: String,
		default: ''
	}
})

var FormsSchema = new mongoose.Schema({
  name: String,
  date: {
  	type: Date,
  	default: Date.now
  },
  questions: [Questions]
});

export default mongoose.model('Forms', FormsSchema);
