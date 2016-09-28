'use strict';

import mongoose from 'mongoose';
var Forms = mongoose.model('Forms').schema;

var Assessments = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	assessment: [Forms]
});

var ClientsSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: ''
	},
	industry: {
		type: String,
		default: ''
	},
	contact: {
		type: String,
		default: ''
	},
	email: {
		type: String,
		default: ''
	},
	phone: {
		type: String,
		default: ''
	},
	country: {
		type: String,
		default: ''
	},
	revenue: {
		type: Number,
		default: 0
	},
	industry_segment: {
		type: String,
		default: ''
	},
	market_share: {
		type: Number,
		default: 0
	},
	market_capitalization: {
		type: Number,
		default: 0
	},
	competitors: {
		type: String, 
		default: ''
	},
	active: {
		type: Boolean,
		default: true
	},
	assessments: [Assessments]
});

export default mongoose.model('Clients', ClientsSchema);
