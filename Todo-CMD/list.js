const yargs = require('yargs');
const notes = require('./command/todos.js');

yargs.command({
	command: 'l',
	describe: 'List all Todos!',
	handler: () => {
		notes.getNotes();
	}
});
yargs.parse();
