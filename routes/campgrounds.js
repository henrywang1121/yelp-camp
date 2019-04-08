var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware/index.js');

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
router.post('/', middleware.isLoggedIn, function(req, res){
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
router.get('/new', middleware.isLoggedIn, function(req, res){
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

//Edit Campground Route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
            Campground.findById(req.params.id, function(err, foundCampground){
                res.render('campgrounds/edit', {campground: foundCampground});    
            });
});

//Update Campground Route
router.put('/:id',  middleware.checkCampgroundOwnership,function(req, res){
   //find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect('/campgrounds');
       } else{
           res.redirect('/campgrounds/' + req.params.id);
       }
   });
   
   //redirect somewhere (show page)
});

//Destroy Campground Route
router.delete('/:id', middleware.checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          console.log(err);
          res.redirect('/campgrounds');
      } else {
          res.redirect('/campgrounds');
      }
   });
});

module.exports = router;