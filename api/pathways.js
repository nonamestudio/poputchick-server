var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyparser = require('body-parser');

router.use(bodyparser.urlencoded({extended: true}));

//MongoDB
var pathways = require('../app/models/pathwaysModel');
var mongourl = 'mongodb://androidapp:lyHtCoBv@ds019846.mlab.com:19846/poputchick';

//Get all possible pathways
router.get('/', function(req, res){
    mongoose.connect(mongourl);
    pathways.find({}, function(err, doc){
        if(err){
            console.log('Error', err);
            res.sendStatus(500);
        }else{
            res.send(doc);
        }
        mongoose.connection.close();
    });
});

router.param('pathway_id', function(req, res, next, id){
    req.pathway = {id : mongoose.Types.ObjectId(id)};
    next();
});
router.route('/:pathway_id')
    .all(function(req, res, next){
        next();
    })
    //Get pathway by ID
    .get(function(req,res,next){
        mongoose.connect(mongourl);
        pathways.findById(req.pathway.id, function(err, doc){
            if(err){
                console.error(err);
                res.sendStatus(500);
            } else{
                res.send(doc);
            }
            mongoose.connection.close();
        });
    })
    //Update pathway by ID
    .put(function(req, res, next){
        mongoose.connect(mongourl);
        pathways.findById(req.pathway.id, function(err, findpathway){
            if(err){
                console.error(err);
                res.sendStatus(500);    
            } else{

                console.log(req.body);

                findpathway.status = req.body.status;
                findpathway.startPoint = req.body.startPoint;
                findpathway.endPoint = req.body.endPoint;
                findpathway.freeSeats = req.body.freeSeats;
                findpathway.time = req.body.time;
                findpathway.waitTime = req.body.waitTime;
                findpathway.minPrice = req.body.minPrice;
                findpathway.maxPrice = req.body.maxPrice;
                findpathway.comment = req.body.comment;
                findpathway.partnerID = req.body.partnerID;

                var updpathway = new pathways(findpathway);

                updpathway.save();
                res.sendStatus(200);
            }
            mongoose.connection.close();
        });
    })
    //Delete pathway by ID
    .delete(function(req, res, next){
        mongoose.connect(mongourl);
        pathways.findByIdAndRemove(req.pathway.id, function(err, doc){
            if(err){
                console.error("ERROR");
                res.sendStatus(500);
            }else{
                console.log('REMOVED');
                res.sendStatus(200);
            }
            mongoose.connection.close();
        });
    });


router.param('user_id', function(req, res, next, id){
    req.user = {id : mongoose.Types.ObjectId(id)};
    next();
});

router.route('/user/:user_id')
    .all(function(req, res, next){
        next();
    })
    //Get all users pathways
	.get(function(req, res, next){
        mongoose.connect(mongourl);
        pathways.find({userID : req.user.id}, function(err, doc){
            if(err){
                console.error(err);
                res.sendStatus(500);
            } else{
                res.send(doc);
            }
            mongoose.connection.close();
        });
    })
    //Create new pathway to user
    .post(function(req, res, next){
        mongoose.connect(mongourl);

        var partnerID = req.body.partnerID.length > 0 
            ? mongoose.Types.ObjectId(req.body.partnerID) : null;

        var pathway =  {
            userID : req.user.id,
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
            partnerID : partnerID
        };

        var addpathway = new pathways(pathway);

        addpathway.save();

        res.sendStatus(200);
        mongoose.connection.close();    
        
    });

module.exports = router;
