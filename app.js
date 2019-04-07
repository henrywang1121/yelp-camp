var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Campground = require('./models/campground');
var User = require('./models/user');
var seedDB = require('./seeds');
var Comment = require('./models/comment');
// var comment = require('./models/user');

//Setup
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

//Add data into the database
seedDB();

//Passport Config
app.use(require('express-session')({
    secret: 'Henry',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

//=============
//Routes
//=============

app.get('/', function(req, res){
    res.render('landing');
})

//Index Route - Show Campgrounds
app.get('/campgrounds', function(req, res){
    
    //Get all campground from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

//Create Route - Add new campground to DB
app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image =  req.body.image;
    var description = req.body.description;
    var  newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, function(err, newlyCreate){
        if(err){
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

//New Route - show form to create a new campground
app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

//Show Route - Show more info
app.get('/campgrounds/:id', function(req,res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log('error');
        } else{
            console.log(foundCampground);
            res.render('campgrounds/show', {campground: foundCampground});     
        }
    });
});

//Comments Route
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
    //Find campground by id
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       } else {
           res.render('comments/new', {campground: campground});
       }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
    //Lookup  campground using ID
    
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect('/campgrounds');
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect('/campgrounds/'+ campground._id);
               }
           });
        //Create new comment
        //Connect new comment to campground
        //Redirect to show page       
        }
    });
    
});

//Authentication Routes
app.get('/register', function(req, res) {
    res.render('register');
});

//Handle sign up logic
app.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render('register');
      } 
      passport.authenticate('local')(req, res, function(){
          res.redirect('/campgrounds'); 
      });
    });
});

//Show login form
app.get('/login', function(req, res){
   res.render('login'); 
});

//Handling login logic
app.post('/login', passport.authenticate('local', 
    {
        successRedirect:'/campgrounds',
        failureRedirect: '/login'
    }), function(req, res){
});

//Logut Route
app.get('/logout', function(req, res){
   req.logout();
   res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  };
  res.redirect('/login');
};

//Starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server has started.');
});