var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var seedDB = require('./seeds');
var Comment = require('./models/comment');
// var comment = require('./models/user');

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
app.get('/campgrounds/:id/comments/new', function(req, res) {
    //Find campground by idd
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       } else {
           res.render('comments/new', {campground: campground});
       }
    });
});

app.post('/campgrounds/:id/comments', function(req, res) {
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



//Starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server has started.');
});