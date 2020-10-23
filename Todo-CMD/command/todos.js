const fs = require('fs');
const chalk = require('chalk');
const getNotes = function() {
	listNotes();
};
const addNote = function(title, description, due, urgent) {
	const notes = loadNotes();
	const duplicateNote = notes.find((note) => note.title === title);
	if (!duplicateNote) {
		notes.push({
			title: title,
			description: description,
			due: due,
			urgent: urgent
		});
		saveNotes(notes);
		console.log(chalk.bold.green('Success!'));
		console.log(chalk.bold.inverse('Added your Todo:'));
		console.log(chalk.bold.inverse('Title: '), title);
		console.log(chalk.bold.inverse('Description: '), description);
		console.log(chalk.bold.inverse('Due Date: '), due);
		console.log(chalk.bold.inverse('Is Urgent: '), urgent);
	} else {
		console.log(chalk.bgRed.white.bold('Error! Todo Title has been Taken!'));
	}
};
const removeNote = function(title) {
	const notes = loadNotes();
	const notesToKeep = notes.filter(function(note) {
		return note.title !== title;
	});
	if (notes.length > notesToKeep.length) {
		saveNotes(notesToKeep);
		console.log(chalk.bold.green('Success!'));
		console.log(chalk.bold.inverse('Removed your Todo:'));
		console.log(chalk.bold.inverse('Title: '), title);
	} else {
		console.log(chalk.bgRed.white('Error! No Todo Found!'));
	}
};
const listNotes = function() {
	const notes = loadNotes();
	console.log(chalk.inverse('Your Todos..'));
	console.log('-------------');
	notes.forEach((note) => {
		console.log(chalk.inverse('Title: '), note.title);
		console.log(chalk.inverse('Description: '), note.description);
		console.log(chalk.inverse('Due Date: '), note.due);
		console.log(chalk.inverse('Is Urgent: '), note.urgent);
		console.log('-------------------------------------------------------------------');
	});
};
const readNote = (title) => {
	const notes = loadNotes();
	const note = notes.find((note) => note.title === title);
	if (note) {
		console.log(chalk.inverse('Title: '), note.title);
		console.log(chalk.inverse('Description: ', note.description));
		console.log(chalk.inverse('Due Date: ', note.due));
		console.log(chalk.inverse('Is Urgent: ', note.urgent));
	} else {
		console.log(chalk.bgRed.white('Error! No Todo Found!'));
	}
};
const saveNotes = function(notes) {
	const dataJson = JSON.stringify(notes);
	fs.writeFileSync('todos.json', dataJson);
};
const loadNotes = function() {
	try {
		const dataBuffer = fs.readFileSync('todos.json');
		const dataJson = dataBuffer.toString();
		return JSON.parse(dataJson);
	} catch (e) {
		return [];
	}
};
module.exports = {
	getNotes: getNotes,
	addNote: addNote,
	removeNote: removeNote,
	readNote: readNote
};
