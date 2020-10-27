const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
	title: String,
	description: String,
	dueDate: Date,
	created: { type: Date, default: Date.now() },
	isCompleted: { type: Boolean, default: false },
	isUrgent: String
});

module.exports = mongoose.model('Todo', todoSchema);
