require('dotenv').config();
const passportLocalMongoose = require('passport-local-mongoose'),
	methodOverride = require('method-override'),
	localStrategy = require('passport-local'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	mongoose = require('mongoose'),
	express = require('express'),
	flash = require('connect-flash'),
	Todo = require('./models/todo'),
	User = require('./models/user'),
	app = express();
//APP CONFIGRATION
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());
app.use(express.static('assets'));
app.locals.moment = require('moment');
//PASSPORT CONFIGRATION
app.use(
	require('express-session')({
		secret: 'New User Model In Todo List App',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ROUTES
app.get('/', (req, res) => {
	if (req.user) {
		res.redirect('/todo');
	} else {
		res.render('home', { currentUser: req.user });
	}
});
app.get('/todo', isLoggedIn, (req, res) => {
	Todo.find({}, (error, todos) => {
		if (error) {
			console.log(error);
		} else {
			res.render('todo', {
				currentUser: req.user,
				todos: todos,
				success: req.flash('success'),
				error: req.flash('noTask')
			});
		}
	});
});
app.get('/todo/new', isLoggedIn, (req, res) => {
	res.render('new', { currentUser: req.user });
});
app.post('/todo/new', isLoggedIn, (req, res) => {
	const newTodo = {
		title: req.body.title,
		description: req.body.description,
		dueDate: req.body.duedate,
		author: req.body.author,
		isCompleted: false,
		isUrgent: req.body.isurgent
	};
	Todo.create(newTodo, (error, newTask) => {
		if (error) {
			console.log(error);
		} else {
			newTask.author.id = req.user.id;
			newTask.author.fullname = req.user.fullname;
			newTask.save();
			res.redirect('/todo');
		}
	});
});
app.get('/todo/:id/edit', isLoggedIn, (req, res) => {
	Todo.findById(req.params.id, (error, editTodo) => {
		if (error) {
			console.log(error);
		} else {
			if (editTodo.author.id == req.user.id) {
				res.render('edit', { currentUser: req.user, todo: editTodo });
			} else {
				res.redirect('/todo');
			}
		}
	});
});
app.put('/todo/:id/edit', isLoggedIn, (req, res) => {
	const updateTask = {
		title: req.body.title,
		description: req.body.description,
		dueDate: req.body.duedate,
		isUrgent: req.body.isurgent
	};
	Todo.findByIdAndUpdate(req.params.id, updateTask, (error, updateTodo) => {
		if (error) {
			console.log(error);
		} else {
			if (updateTodo.author.id == req.user.id) {
				res.redirect(`/todo/${req.params.id}`);
			} else {
				res.redirect('/todo');
			}
		}
	});
});
app.delete('/todo/:id/remove', isLoggedIn, (req, res) => {
	Todo.findByIdAndRemove(req.params.id, (error, removeTodo) => {
		if (error) {
			console.log(error);
		} else {
			if (removeTodo.author.id == req.user.id) {
				res.redirect('/todo');
			} else {
				res.redirect('/todo');
			}
		}
	});
});
app.post('/todo/new', isLoggedIn, (req, res) => {
	const newTodo = {
		title: req.body.title,
		description: req.body.description,
		dueDate: req.body.duedate,
		author: req.body.author,
		isCompleted: false,
		isUrgent: req.body.isurgent
	};
	Todo.create(newTodo, (error, newTask) => {
		if (error) {
			console.log(error);
		} else {
			newTask.author.id = req.user.id;
			newTask.author.fullname = req.user.fullname;
			newTask.save();
			res.redirect('/todo');
		}
	});
});
app.get('/todo/:id', isLoggedIn, (req, res) => {
	Todo.findById(req.params.id, (error, todo) => {
		if (error) {
			req.flash('noTask', 'No Todo Found with this ID!');
			res.redirect('/todo');
		} else {
			if (todo.author.id == req.user.id) {
				res.render('show', { todo: todo, currentUser: req.user });
			} else {
				res.redirect('/todo');
			}
		}
	});
});
app.post('/todo/:id/complete', (req, res) => {
	Todo.findById(req.params.id, (error, todo) => {
		if (error) {
			console.log(error);
		} else {
			todo.isCompleted = true;
			todo.save();
			res.redirect(`/todo/${req.params.id}`);
		}
	});
});
app.post('/todo/:id/incomplete', (req, res) => {
	Todo.findById(req.params.id, (error, todo) => {
		if (error) {
			console.log(error);
		} else {
			todo.isCompleted = false;
			todo.save();
			res.redirect(`/todo/${req.params.id}`);
		}
	});
});
// AUTH ROUTES
// show register form
app.get('/register', function(req, res) {
	res.render('register', { currentUser: req.user, error: req.flash('errorinsignup') });
});
//handle sign up logic
app.post('/register', function(req, res) {
	var newUser = new User({ username: req.body.username.toLowerCase(), fullname: req.body.fullname });
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			req.flash('errorinsignup', err.message);
			console.log(err);
			res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function() {
			req.flash('success', 'Nice To Meet You ' + req.user.fullname + ', You Have Successfully Signed up!');
			res.redirect('/todo');
		});
	});
});
// show login form
app.get('/login', function(req, res) {
	res.render('login', { currentUser: req.user, error: req.flash('error') });
});
//handling login logic
app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/todo',
		failureFlash: 'Incorrect Username or Password',
		failureRedirect: '/login'
	}),
	function(req, res) {}
);
//Logout logic
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
// 404
app.get('*', (req, res) => {
	res.render('404', { currentUser: req.user });
});
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You Need To Be Logged In First!!');
	res.redirect('/login');
}

const port = process.env.PORT || 4003;
app.listen(port, process.env.IP, () => {
	console.log(`The Todo List Server is Started on port ${port}`);
});
