var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyparser = require('body-parser');

router.use(bodyparser.urlencoded({extended: true}));

//MongoDB
var requests = require('../app/models/requestsModel');

//Get all possible requests
router.get('/', function(req, res){

    requests.find({}, function(err, doc){
        if(err){
            console.log('Error', err);
            res.sendStatus(500);
        }else{
            res.send(doc);
        }

    });
});

router.param('request_id', function(req, res, next, id){
    req.request = {id : mongoose.Types.ObjectId(id)};
    next();
});
router.route('/:request_id')
    .all(function(req, res, next){
        next();
    })
    //Get request by ID
    .get(function(req,res,next){
        requests.findById(req.request.id, function(err, doc){
            if(err){
                console.error(err);
                res.sendStatus(500);
            } else{
                res.send(doc);
            }
        });
    })
    //Update request by ID
    .put(function(req, res, next){
        requests.findById(req.request.id, function(err, findRequest){
            if(err){
                console.error(err);
                res.sendStatus(500);    
            } else{

                console.log(req.body);

                findRequest.status = req.body.status;
                findRequest.startPoint = req.body.startPoint;
                findRequest.endPoint = req.body.endPoint;
                findRequest.freeSeats = req.body.freeSeats;
                findRequest.time = req.body.time;
                findRequest.waitTime = req.body.waitTime;
                findRequest.minPrice = req.body.minPrice;
                findRequest.maxPrice = req.body.maxPrice;
                findRequest.comment = req.body.comment;
                findRequest.partnerID = req.body.partnerID;

                var updRequest = new requests(findRequest);

                updRequest.save();
                res.sendStatus(200);
            }
        });
    })
    //Delete request by ID
    .delete(function(req, res, next){
        requests.findByIdAndRemove(req.request.id, function(err, doc){
            if(err){
                console.error("ERROR");
                res.sendStatus(500);
            }else{
                console.log('REMOVED');
                res.sendStatus(200);
            }
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
    //Get all users requests
	.get(function(req, res, next){
        requests.find({userID : req.user.id}, function(err, doc){
            if(err){
                console.error(err);
                res.sendStatus(500);
            } else{
                res.send(doc);
            }
        });
    })
    //Create new request to user
    .post(function(req, res, next){

        var partnerID = req.body.partnerID == undefined 
            ? mongoose.Types.ObjectId(req.body.partnerID) : null;

        var request =  {
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

        var addrequest = new requests(request);

        addrequest.save();

        res.sendStatus(200);       
    });

module.exports = router;
