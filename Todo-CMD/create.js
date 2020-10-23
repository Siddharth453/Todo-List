const chalk = require('chalk');
const yargs = require('yargs');
const fs = require('fs');
const notes = require('./todos.js');
yargs.version('1.0.0');

yargs.command({
	command: 'a',
	describe: 'Add a Todo',
	builder: {
		title: {
			describe: "Todo's Title",
			demandOption: true,
			type: 'string'
		},
		description: {
			describe: "Todos's Description",
			demandOption: true,
			type: 'string'
		},
		due: {
			describe: "Todos's Due Date",
			demandOption: false,
			type: 'string'
		},
		urgent: {
			describe: "Todos's is Urgent, answer in true or false.",
			demandOption: true,
			type: 'boolean'
		}
	},
	handler: (argv) => {
		notes.addNote(argv.title, argv.description, argv.due, argv.urgent);
	}
});
yargs.parse();
