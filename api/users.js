var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectId;
var bodyparser = require('body-parser');

router.use(bodyparser.urlencoded({extended: true}));

//MongoDB
var coll = 'users';
var mongourl = 'mongodb://androidapp:lyHtCoBv@ds019846.mlab.com:19846/poputchick';


//Return users list
router.get('/', function(req, res){
    var mongoClient = mongodb.MongoClient;
    
    mongoClient.connect(mongourl, function(err, db){
        if(err){
            console.log("Unable to connect to the database", err);
        } else{
            console.log("Connection established home");
            
            var collection = db.collection(coll);
            
            collection.find({}).toArray(function(err, result){
                if(err){
                    console.log(err);
                } else if(result.length){
                    res.send(result);
                } else{
                    //No documents found
                    res.send("No documents found");
                }
            });
        }
    });
});

router.post('/adduser', function(req, res){
    var mongoClient = mongodb.MongoClient;
    
    mongoClient.connect(mongourl, function(err, db){
        if(err){
            console.log("Unable to connect to server", err);
        } else{
            console.log("Connected to server add");
            
            var collection = db.collection(coll);
            
            var adduser = {name : req.body.name, email : req.body.email, phone : req.body.phone};
            
            collection.insert([adduser], function(err, result){
                if(err){
                    console.log(err);
                } else{
                    res.send(adduser);
                }
                db.close();
            });
        }
    });
});



router.param('user_id', function(req, res, next, id){
    req.user = {id : new ObjectId(id)};
    next();
    
});

router.route('/user/:user_id')
    .all(function(req, res, next){
        next();
    })
    .get(function(req, res, next){
        var mongoClient = mongodb.MongoClient;

        mongoClient.connect(mongourl, function(err, db){
            if(err){
                console.log("Unable to connect to database", err);
            } else{
                console.log("Connection established");

                var collection = db.collection(coll);
                collection.findOne({_id : req.user.id}, function(err, result){
                    if(err){
                        console.log(err);
                    }else if(result == null){
                        res.sendStatus(404);
                    } else{
                        res.send(result);
                    }
                    db.close();
                });
            }
        });
    })
    .put(function(req, res, next){
        var mongoClient = mongodb.MongoClient;
        
        mongoClient.connect(mongourl, function(err, db){
            if(err){
            console.log("Unable to connect to database", err);
            } else{
                console.log("Connection established");
                
                var collection = db.collection(coll);
                
                collection.update({_id : req.user.id}, {$set : {name : req.body.name, email : req.body.email, phone : req.body.phone}} , function(err, result){
                    if(err){
                    console.log("Unable to update", err);
                    } else{
                        console.log("Updated");
                        res.send(result);                
                    }
                    db.close();
                });
            }
        });
    })
    .delete(function(req, res, next){
        var mongoClient = mongodb.MongoClient;

        mongoClient.connect(mongourl, function(err, db){
            if(err){
                console.log("Unable to connect to database", err);
            } else{
                console.log("Connection established");

                var collection = db.collection(coll);
                collection.removeOne({_id : req.user.id}, function(err, result){
                    if(err){
                        console.log(err);
                    } else{
                        res.send(result);
                    }
                    db.close();
                });
            }
        });
    });
    
module.exports = router;
    