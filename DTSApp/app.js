var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var methodOverride = require('method-override');
var port = 5000;
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var {ensureAuthenticated} = require('./helpers/auth');

//Configures routes
var users = require('./routes/users');

//Passportjs Congif route
require('./config/passport')(passport);

//gets id of warning for Mongoose
mongoose.Promise = global.Promise;

//connect to mongodb using mongoose 
mongoose.connect("mongodb://localhost:27017/defects", {
    useMongoClient:true
}).then(function(){
    console.log("Connected to the Monogo Database")
}).catch(function(err){
    console.log(err);
});

require('./models/Entry');
var Entry = mongoose.model('Entries');

app.engine('handlebars', exphbs({
    defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

// functions to use body parser 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Setup Express Session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

//Setup Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//route to index.html
router.get('/', ensureAuthenticated, function(req, res){
    res.render('index');
});

//Route to entries
router.get('/entries', ensureAuthenticated,function(req, res){
    res.render('defects/addgame');
});


//Route to edit entries
router.get('/defects/editgame/:id', function(req,res){
    Entry.findOne({
        _id:req.params.id
    }).then(function(entry){
        res.render('defects/editgame', {entry:entry});
    });
});

//Route to put edited entry
router.put('/editgame/:id', function(req, res){
    Entry.findOne({
        _id:req.params.id
    }).then(function(entry){
        entry.title = req.body.title;
        entry.status = req.body.status;
        entry.assignedTo = req.body.assignedTo;
        entry.description = req.body.description;

        entry.save()
        .then(function(idea){
            res.redirect('/');
        })
    });
});

//Route to login
router.get('/login',function(req, res){
    res.render('login');
});

router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/login'
    })(req,res,next);
});

app.get('/', ensureAuthenticated,function(req,res){
    console.log("Request made from fetch");
    Entry.find({})
    .then(function(entries){
        res.render("index", {
            entries:entries
        })
    });
});

//route to entries.html
router.get('/entries',function(req, res){
    res.sendFile(path.join(__dirname+'/entries.html'));
});



//post for form on index.html
app.post('/addgame', function(req,res){
    console.log(req.body);
    var newEntry = {
        title:req.body.title,
        typeOfBug:req.body.typeOfBug,
        founder:req.body.founder,
        priority:req.body.priority,
        status:req.body.status,
        assignedTo:req.body.assignedTo,
        description:req.body.description
    }

    new Entry(newEntry).save().then(function(entry){
        res.redirect('/');
    });
});

//Delete Game Entry
app.delete('/:id', function(req,res){
    Entry.remove({_id:req.params.id}).then(function(){
        res.redirect('/');
    });
});

//routs for paths
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/scripts'))
app.use('/', router);
app.use('/users', users);

//starts the server 
app.listen(port, function(){
    console.log("server is running on port: " + port);
});