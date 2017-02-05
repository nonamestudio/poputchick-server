var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');

router.use(bodyparser.urlencoded({extended: true}));

//Unlink local account
router.get('/local', function(req, res){
    var user = req.user;
    user.local.username = undefined;
    user.local.email = undefined;
    user.local.phone = undefined;
    user.local.password = undefined;

    user.save(function(err){
        if(err) throw err;
        res.sendStatus(200);
    });

});

//Unlink Facebook account
router.get('/facebook', function(req, res){
    var user = req.user;
    user.facebook.token = undefined;
    user.save(function(err){
        if(err) throw err;
        res.sendStatus(200);
    });
});

//Unlink Twitter account
router.get('/twitter', function(req, res){
    var user = req.user;
    user.twitter.token = undefined;
    user.save(function(err){
        if(err) throw err;
        res.sendStatus(200);
    });
});

//Unlink Google account
router.get('/google', function(req, res){
    var user = req.user;
    user.google.token = undefined;
    user.save(function(err){
        if(err) throw err;
        res.sendStatus(200);
    });
});

//Unlink Vkontakte account
router.get('/vkontakte', function(req, res){
    var user = req.user;
    user.vkontakte.token = undefined;
    user.save(function(err){
        if(err) throw err;
        res.sendStatus(200);
    });
});