require('dotenv').config();
const mongoose = require('mongoose');
const Todo = require('./models/todo');
const yargs = require('yargs');
const chalk = require('chalk');
const moment = require('moment');

mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

yargs.version('v1.0.2');

yargs.command({
	command: 'find',
	describe: 'Find all Todos',
	handler: () => {
		Todo.find({}, (error, todos) => {
			if (error) console.log('Something went Wrong, please try again!');
			else {
				console.log(chalk.white('----------------'));
				console.log(chalk.yellow('Your Todos: '));
				console.log(chalk.white('----------------'));
				for (i = 0; i < todos.length; i++) {
					console.log(`${chalk.inverse('Title:')} ${todos[i].title}`);
					console.log(`${chalk.inverse('Description:')} ${todos[i].description}`);
					console.log(
						`${chalk.inverse('Due Date:')} ${moment(todos[i].dueDate).format('L')} - ${moment(
							todos[i].dueDate
						).format('LT')}`
					);
					console.log(
						`${chalk.inverse('Created:')} ${moment(todos[i].created).format('L')} - ${moment(
							todos[i].created
						).format('LT')}`
					);
					if (todos[i].isCompleted == false) {
						console.log(`${chalk.inverse('Completed:')} ${chalk.red(todos[i].isCompleted)}`);
					} else {
						console.log(`${chalk.inverse('Completed:')} ${chalk.green(todos[i].isCompleted)}`);
					}
					console.log(`${chalk.inverse('Urgent:')} ${todos[i].isUrgent}`);
					console.log('----------------');
					console.log('----------------');
				}
			}
		});
	}
});
yargs.command({
	command: 'create',
	describe: 'Create a Todo.',
	builder: {
		title: {
			describe: "Todo's Title",
			demandOption: true,
			type: 'string'
		},
		description: {
			describe: "Todo's Description",
			demandOption: true,
			type: 'string'
		},
		due: {
			describe: "Todo's Due Date",
			demandOption: false,
			type: 'string'
		},
		completed: {
			describe: 'Todo is Completed, answer in true or false.',
			demandOption: false,
			type: 'boolean'
		},
		urgent: {
			describe: 'Todo is Urgent, answer in true or false.',
			demandOption: true,
			type: 'string'
		}
	},
	handler: (todo) => {
		Todo.create(
			{
				title: todo.title,
				description: todo.description,
				dueDate: todo.due,
				completed: false,
				isUrgent: todo.urgent
			},
			(error, newTodo) => {
				if (error) console.log('Something went Wrong, please try again!');
				else {
					console.log(
						chalk.green(
							`Created your Todo, '${todo.title}'. Type node app.js read --title="${todo.title}" to see your newly created todo!😊`
						)
					);
				}
			}
		);
	}
});
yargs.command({
	command: 'remove',
	describe: 'Remove a Todo.',
	builder: {
		title: {
			describe: "Todo's Title",
			demandOption: true,
			type: 'string'
		}
	},
	handler: (todo) => {
		Todo.findOneAndRemove({ title: todo.title }, (error, removed) => {
			if (error) console.log(error);
			else {
				console.log(chalk.green(`Removed your Todo, '${todo.title}'`));
			}
		});
	}
});
yargs.command({
	command: 'complete',
	describe: 'Complete a Todo.',
	builder: {
		title: {
			describe: "Todo's Title",
			demandOption: true,
			type: 'string'
		}
	},
	handler: (todo) => {
		Todo.findOne({ title: todo.title }, (error, complete) => {
			if (error) console.log(error);
			else {
				complete.isCompleted = true;
				complete.save();
				console.log(chalk.green(`Completed todo, '${complete.title}'`));
			}
		});
	}
});
yargs.command({
	command: 'incomplete',
	describe: 'Incomplete a Todo.',
	builder: {
		title: {
			describe: "Todo's Title",
			demandOption: true,
			type: 'string'
		}
	},
	handler: (todo) => {
		Todo.findOne({ title: todo.title }, (error, complete) => {
			if (error) console.log(error);
			else {
				complete.isCompleted = false;
				complete.save();
				console.log(chalk.red(`Incompleted todo, '${complete.title}'`));
			}
		});
	}
});
yargs.command({
	command: 'read',
	describe: 'Read a specific Todo.',
	builder: {
		title: {
			describe: "Todo's Title",
			demandOption: true,
			type: 'string'
		}
	},
	handler: (todo) => {
		Todo.findOne({ title: todo.title }, (error, todos) => {
			if (error) console.log('Something went Wrong, please try again!');
			else {
				console.log(chalk.green('Your Todo:'));
				console.log('----------------');
				console.log(`${chalk.inverse('Title:')} ${todos.title}`);
				console.log(`${chalk.inverse('Description:')} ${todos.description}`);
				console.log(
					`${chalk.inverse('Due Date:')} ${moment(todos.dueDate).format('L')} - ${moment(
						todos.dueDate
					).format('LT')}`
				);
				console.log(
					`${chalk.inverse('Created:')} ${moment(todos.created).format('L')} - ${moment(todos.created).format(
						'LT'
					)}`
				);
				if (todos.isCompleted == false) {
					console.log(`${chalk.inverse('Completed:')} ${chalk.red(todos.isCompleted)}`);
				} else {
					console.log(`${chalk.inverse('Completed:')} ${chalk.green(todos.isCompleted)}`);
				}
				console.log(`${chalk.inverse('Urgent:')} ${todos.isUrgent}`);
				console.log('----------------');
			}
		});
	}
});
yargs.command({
	command: 'edit',
	describe: 'Edit a Todo.',
	builder: {
		title: {
			describe: 'The Title of the Todo which you want to Edit.',
			demandOption: false,
			type: 'string'
		},
		editTitle: {
			describe: "Todo's Title.",
			demandOption: false,
			type: 'string'
		},
		editDescription: {
			describe: "Todo's Description.",
			demandOption: false,
			type: 'string'
		},
		editDue: {
			describe: "Todo's Due Date.",
			demandOption: false,
			type: 'string'
		},
		editUrgent: {
			describe: 'Todo Is Urgent?',
			demandOption: false,
			type: 'string'
		}
	},
	handler: (todo) => {
		Todo.findOneAndUpdate(
			todo.title,
			{
				title: todo.editTitle,
				description: todo.editDescription,
				dueDate: todo.editDue,
				isUrgent: todo.editUrgent
			},
			(error, updateTodo) => {
				if (error) console.log('Something went Wrong, please try again!');
				else {
					console.log(chalk.green(`Succesfully Edited Your Todo, ${todo.title}`));
				}
			}
		);
	}
});
yargs.parse();
