const yargs = require('yargs');
const notes = require('./command/todos.js');

yargs.command({
	command: 'r',
	describe: 'Read a Todo!',
	builder: {
		title: {
			describe: "Todo's Title",
			demandOption: true,
			type: 'string'
		}
	},
	handler: (argv) => {
		notes.readNote(argv.title);
	}
});
yargs.parse();
