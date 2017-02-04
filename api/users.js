var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');

router.use(bodyparser.urlencoded({extended: true}));

//MongoDB
var users = require('../app/models/usersModel');

//Return users list
router.get('/', function(req, res){
    users.find({}, function(err, doc){
        if(err){
            console.log('Error', err);
            res.sendStatus(500);
        }else{
            res.send(doc);
        }
    });    
});

router.post('/', function(req, res){
    var user = {
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone
    };

    var adduser = new users(user);
    adduser.save();
    res.send(200);
});

router.param('user_id', function(req, res, next, id){
    req.user = {userid : id};
    next();
});

router.route('/:user_id')
    .all(function(req, res, next){
        next();
    })
    .get(function(req, res, next){
        users.findById(req.user.userid, function(err, findUser){
            if(err){
                console.log('Not founded', err);
                res.sendStatus(500);
            } else{
                res.send(findUser);
            }
        });
    })
    .put(function(req, res, next){
        users.findById(req.user.userid, function(err, findUser){
            if(err){
                console.log('Not founded', err);
                res.sendStatus(500);
            } else{
                findUser.name = req.body.name;
                findUser.email = req.body.email;
                findUser.phone = req.body.phone;

                findUser.save();
                res.sendStatus(200);
            }
        });
    })
    .delete(function(req, res, next){
        users.findByIdAndRemove(req.user.userid, function(err, doc){
            if(err){
                console.error("ERROR");
                res.sendStatus(500);
            }else{
                console.log('REMOVED');
                res.sendStatus(200);
            }
        });
    });
    
    
module.exports = router;
    