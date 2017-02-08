var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');

router.use(bodyparser.urlencoded({extended: true}));

//MongoDB
var users = require('../app/models/usersModel');

router.get('/', function(req, res){
    res.send(req.user);
});

module.exports = router;
