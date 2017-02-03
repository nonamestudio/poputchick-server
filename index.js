var express = require('express');
var bodyparser = require('body-parser');
var app = express();

//Routing
var users = require('./api/users');
var requests = require('./api/requests');

app.use('/api/users', users);
app.use('/api/requests', requests);

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