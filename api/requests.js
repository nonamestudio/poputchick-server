var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectId;
var bodyparser = require('body-parser');

router.use(bodyparser.urlencoded({extended: true}));

//MongoDB
var coll = 'requests';
var mongourl = 'mongodb://androidapp:lyHtCoBv@ds019846.mlab.com:19846/poputchick';


router.param('user_id', function(req, res, next, id){
    req.user = {id : new ObjectId(id)};
    next();
    
});

router.route('/:user_id')
    .all(function(req, res, next){
        next();
    })
	.get(function(req, res, next){
        var mongoClient = mongodb.MongoClient;
        
        mongoClient.connect(mongourl, function(err, db){
            if(err){
                console.log("Unable to connect to the database", err);
            } else{
                console.log("Connection established home");
                
                var collection = db.collection(coll);
                
                collection.find({userID : req.user.id}).toArray(function(err, result){
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
    })
    .post(function(req, res, next){
        var mongoClient = mongodb.MongoClient;
        
        mongoClient.connect(mongourl, function(err, db){
            if(err){
                console.log("Unable to connect to the database", err);
            } else{
                console.log("Connection established home");
                
                var collection = db.collection(coll);
                
                var addrequest = {
                    userID : req.user.id,
                    type : req.body.type,
                    status : req.body.status,
                    startPoint : req.body.startPoint,
                    endPoint : req.body.endPoint,
                    freeSeats : req.body.freeSeats,
                    time : req.body.time,
                    waitTime : req.body.waitTime,
                    minPrice : req.body.minPrice,
                    maxPrice : req.body.maxPrice,
                    comment : req.body.comment,
                    accepted : req.body.accepted,
                    partnerID : req.body.partnerID
                };
                
                collection.insert([addrequest], function(err, result){
                    if(err){
                        console.log("Unable to add request", err);
                    } else{
                        console.log("Inserted");
                        res.send(result);
                    }
                });
            }
        });  
    })
    .put(function(req, res, next){
        var mongoClient = mongodb.MongoClient;
        
        mongoClient.connect(mongourl, function(err, db){
            if(err){
                console.log("Unable to connect to the database", err);
            } else{
                console.log("Connection established home");
                
                var collection = db.collection(coll);
                
                collection.update({_id : req.user.id}, {$set : {
                    type : req.body.type,
                    status : req.body.status,
                    startPoint : req.body.startPoint,
                    endPoint : req.body.endPoint,
                    freeSeats : req.body.freeSeats,
                    time : req.body.time,
                    waitTime : req.body.waitTime,
                    minPrice : req.body.minPrice,
                    maxPrice : req.body.maxPrice,
                    comment : req.body.comment,
                    accepted : req.body.accepted,
                    partnerID : req.body.partnerID
                }}, function(err, result){
                    if(err){
                        console.log("Unable to update request", err);
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
