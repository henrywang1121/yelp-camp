var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

//Index Route - Show Campgrounds
router.get('/', function(req, res){
    
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
router.post('/', isLoggedIn, function(req, res){
    var name = req.body.name;
    var image =  req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var  newCampground = {name: name, image: image, description: description, author: author};
    Campground.create(newCampground, function(err, newlyCreate){
        if(err){
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

//New Route - show form to create a new campground
router.get('/new', isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

//Show Route - Show more info
router.get('/:id', function(req,res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log('error');
        } else{
            console.log(foundCampground);
            res.render('campgrounds/show', {campground: foundCampground});     
        }
    });
});

//Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  };
  res.redirect('/login');
};

module.exports = router;