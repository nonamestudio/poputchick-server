var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport')
var session = require('express-session');

var configDB = require('./config/database');

mongoose.connect(configDB.url);

require('./config/passport.js')(passport);

//FOR SECURITY
app.disable('x-powered-by');

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.use(session({
    secret : 'poputchickilove',
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes')(app, passport);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
   console.log("Server start at " + app.get('port')); 
});