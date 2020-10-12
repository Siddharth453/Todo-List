require('dotenv').config();
const passportLocalMongoose = require('passport-local-mongoose'),
      methodOverride        = require('method-override'),
      localStrategy         = require('passport-local'),
      bodyParser            = require('body-parser'),
      passport              = require('passport'),
      mongoose              = require('mongoose'),
      express               = require('express'),
      sgMail                = require('@sendgrid/mail'),
      flash                 = require('connect-flash'),
      Todo                  = require('./models/todo'),
      User                  = require('./models/user'),
      app                   = express();

//APP CONFIGRATION
mongoose.connect('mongodb://localhost:27017/todo-list', {useUnifiedTopology: true, useNewUrlParser: true})
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
//PASSPORT CONFIGRATION
app.use(require("express-session")({
	secret: "New User Model In Todo List App",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ROUTES
app.get('/', (req, res) => {
    if(req.user){
        res.redirect('/todo')
    }
    else{
        res.render('home', {currentUser: req.user})
    }
});
app.get('/todo', isLoggedIn, (req, res) => {
   Todo.find({}, (error, todos) => {
       if(error){
           console.log(error);
       }else{
           res.render('todo', {currentUser: req.user, todos: todos})
       }
   })
})
app.get('/todo/:id', isLoggedIn, (req, res) => {
    Todo.findById(req.params.id, (error, todo) => {
        if(error){
            console.log(error);
        }else{
            res.render('show', {todo: todo, currentUser: req.user});
        }
    })
 })
 app.post('/todo/:id/complete', (req, res) => {
     Todo.findById(req.params.id, (error, todo) => {
        if(error){
            console.log(error);
        }else{
            todo.isCompleted = true;
            todo.save()
            res.redirect(`/todo/${req.params.id}`)
        }
     })
 })
 app.post('/todo/:id/incomplete', (req, res) => {
    Todo.findById(req.params.id, (error, todo) => {
       if(error){
           console.log(error);
       }else{
           todo.isCompleted = false;
           todo.save()
           res.redirect(`/todo/${req.params.id}`)
       }
    })
})
// AUTH ROUTES
// show register form
app.get("/register", function(req, res){
	res.render("register",{currentUser: req.user});
});
//handle sign up logic
app.post("/register", function(req, res){
   var newUser = new User({username: req.body.username.toLowerCase(), photo: req.body.photo, fullname: req.body.fullname});
   User.register(newUser, req.body.password, function(err, user){
	  if(err){
        //   req.flash("errorinsignup", err.message)
        console.log(err);
		  res.redirect("/register");
	  } 
	  passport.authenticate("local")(req, res, function(){
		//  req.flash("success", "Nice To Meet You " + req.user.username + ", You Have Successfully Signed up!");
		 res.redirect("/todo") 
	  });
   });
});
// show login form
app.get("/login", function(req, res){
	res.render("login", {currentUser: req.user})
});
//handling login logic
app.post("/login", passport.authenticate("local",
{
	successRedirect: "/todo",
	failureRedirect: "/login"
}), function(req, res){
});
//Logout logic
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	// req.flash("error", "You Need To Be Logged In First!!");
	res.redirect("/login");
}
// function checkTodoOwnership(req, res, next){
// 	//is user logged In?
// 	if(req.isAuthenticated()){
// 	   Todo.findById(req.params.id, function(err, updatePost){
// 	    if(err){
// 			res.redirect("back");
// 		}
// 		  else{
// 		   //does the user own the post? 
// 			if(updatePost.author.id.equals(req.user._id)){
// 			     next();
// 			}
// 		   //otherwise, redirect
// 		   else{
// 			    // req.flash("error2", "You Do Not Have Permission to do That!!");
// 	            res.redirect("/posts/" + req.params.id);		   
// 		   }
// 	    }
// 	});
// 	//if not, redirect
// 	}else{
// 	//    req.flash("error1", "You Need To Be Logged In First!!");
//        res.redirect("/posts/" + req.params.id)
// 	}
// };

const port = process.env.PORT || 4003;
app.listen(port, process.env.IP, () => {
    console.log(`The Todo List Server is Started on port ${port}`)
});