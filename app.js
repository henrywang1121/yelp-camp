var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var seedDB = require('./seeds');
// Var comment = require('./models/comment');
// Var comment = require('./models/user');

//Setup
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')

//Add data into the database
seedDB();



//Routing
app.get('/', function(req, res){
    res.render('landing');
})

//Index Route - Show Campgrounds
app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('index', {campgrounds: allCampgrounds});
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
    res.render('new');
});

//Show Route - Show more info
app.get('/campgrounds/:id', function(req,res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log('error');
        } else{
            console.log(foundCampground);
            res.render('show', {campground: foundCampground});     
        }
    });
});



//Starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server has started.');
});