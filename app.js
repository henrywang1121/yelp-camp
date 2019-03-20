var express = require('express');
var app = express();

app.set('view engine', 'ejs')

app.get('/', function(req, res){
    res.render('landing');
})

app.get('/campgrounds', function(req, res){
    let campgrounds = [
        {name: 'Walnut Creek', image: 'https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104490f2c870a7e5b7be_340.jpg'}, 
        {name: 'Mount Diablo', image: 'https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104490f2c870a7e5b7be_340.jpg'},
        {name: 'Pleasant Hill', image: 'https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f2c870a7e5b7be_340.jpg'}];

    res.render('campgrounds', {campgrounds: campgrounds});
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server has started.');
});