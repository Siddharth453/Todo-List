const mongoose = require('mongoose');

//SCHEMA SETUP
const todoSchema = new mongoose.Schema({
	title: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		fullname: String
	},
	dueDate: Date,
	created: { type: Date, default: Date.now() },
	isCompleted: { type: Boolean, default: false },
	isUrgent: String
});
module.exports = mongoose.model('Todo', todoSchema);
