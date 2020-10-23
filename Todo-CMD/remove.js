const chalk = require('chalk');
const yargs = require('yargs');
const fs = require('fs');
const notes = require('./command/todos.js');
yargs.version('1.0.0');

yargs.command({
	command: 'r',
	describe: 'Remove a Todo!',
	builder: {
		title: {
			describe: "Todo's Title",
			demandOption: true,
			type: 'string'
		}
	},
	handler: (argv) => {
		notes.removeNote(argv.title);
	}
});
yargs.parse();
