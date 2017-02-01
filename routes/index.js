var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/allusers', function(req,res){
    var MongoClient = mongodb.MongoClient;
    
    var url = 'mongodb://androidapp:lyHtCoBv@ds019846.mlab.com:19846/poputchick';
    
    MongoClient.connect(url, function(err, db){
       if (err) {
           console.log("Unable to connect to the server", err);
       } else {
           console.log("Connection Established");
           
           var collection = db.collection('users');
           
           collection.find({}).toArray(function(err, result){
              if(err){
                console.log(err);
              } else if(result.length){
                  res.render('userlist', {
                     "userlist" : result 
                  });
              }else {
                  res.send("No documents found");
              }
               
            db.close();
           });
       }
    });
});

router.get('/newuser', function(req,res){
   res.render('newuser', {title:'Add user'}); 
});

router.post('/adduser', function(req, res){
    console.log(req.body);
    var MongoClient = mongodb.MongoClient;
    
        var url = 'mongodb://androidapp:lyHtCoBv@ds019846.mlab.com:19846/poputchick';

    
    MongoClient.connect(url, function(err,db){
       if(err){
           console.log("Unable to connect to server", err);
       } else {
           console.log("Connected to server add");
           
           var collection = db.collection('users');
           
           var user1 = {name: req.body.name, email: req.body.email, phone:req.body.phone};
           
           collection.insert([user1], function(err, result){
              if(err){
                  console.log(err);
              } else{
                  res.send(user1);
              }
               db.close();
           });
       }
    });
});

module.exports = router;
