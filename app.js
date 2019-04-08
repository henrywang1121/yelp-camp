var express             = require('express');
var app                 = express();
var bodyParser          = require('body-parser');
var mongoose            = require('mongoose');
var passport            = require('passport');
var LocalStrategy       = require('passport-local');
var methodOverride      = require('method-override');
var Campground          = require('./models/campground');
var User                = require('./models/user');
var seedDB              = require('./seeds');
var Comment             = require('./models/comment');

//Require routes
var commentRoutes       = require('./routes/comments');
var campgroundRoutes    = require('./routes/campgrounds');
var indexRoutes         = require('./routes/index');

//Setup
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

//Add data into the database
//seedDB();

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

//Use route files
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


//Starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server has started.');
});