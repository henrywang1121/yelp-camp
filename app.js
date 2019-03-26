var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')

var campgrounds = [
    {name: 'Walnut Creek', image: 'https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__480.jpg'}, 
    {name: 'Mount Diablo', image: 'https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__480.jpg'},
    {name: 'Pleasant Hill', image: 'https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__480.jpg'},
    {name: 'Walnut Creek', image: 'https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__480.jpg'}, 
    {name: 'Mount Diablo', image: 'https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__480.jpg'},
    {name: 'Pleasant Hill', image: 'https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__480.jpg'},
    {name: 'Walnut Creek', image: 'https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__480.jpg'}, 
    {name: 'Mount Diablo', image: 'https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__480.jpg'},
    {name: 'Pleasant Hill', image: 'https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__480.jpg'}
    ];


app.get('/', function(req, res){
    res.render('landing');
})

app.get('/campgrounds', function(req, res){

    res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image =  req.body.image;
    var  newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect('/campgrounds')
});

app.get('/campgrounds/new', function(req, res){
    res.render('new');
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server has started.');
});