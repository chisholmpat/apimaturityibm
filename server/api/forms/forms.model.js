'use strict';

import mongoose from 'mongoose';

var Questions = new mongoose.Schema({
	question: String,
	date: {
		type: Date,
		default: Date.now
	},
	answerArray: [String],
	category: String,
	grouping: String
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
