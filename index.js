var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

//Routing
var users = require('./api/users');
var requests = require('./api/requests');
var pathways = require('./api/pathways');

app.use('/api/users', users);
app.use('/api/requests', requests);
app.use('/api/pathways',pathways);

//FOR SECURITY
app.disable('x-powered-by');

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
   res.send('poputchick-server');
});

app.listen(app.get('port'), function(){
   console.log("Server start at " + app.get('port')); 
});