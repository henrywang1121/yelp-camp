var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//=============
//Root Routes
//=============
router.get('/', function(req, res){
    res.render('landing');
})


//Authentication Routes
router.get('/register', function(req, res) {
    res.render('register');
});

//Handle sign up logic
router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
      if(err){
          req.flash('error',  err.message);
          return res.render('register');
      } 
      passport.authenticate('local')(req, res, function(){
          req.flash('success',  'Welcome: ' + user.username);
          res.redirect('/campgrounds'); 
      });
    });
});

//Show login form
router.get('/login', function(req, res){
   res.render('login'); 
});

//Handling login logic
router.post('/login', passport.authenticate('local', 
    {
        successRedirect:'/campgrounds',
        failureRedirect: '/login'
    }), function(req, res){
});

//Logut Route
router.get('/logout', function(req, res){
   req.logout();
   req.flash('success', 'Logged you out!');
   res.redirect('/campgrounds');
});

module.exports = router;