var express = require('express');
var bodyparser = require('body-parser');
var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectId;

var app = express();

var coll = 'users';
var mongourl = 'mongodb://androidapp:lyHtCoBv@ds019846.mlab.com:19846/poputchick';

//FOR SECURITY
app.disable('x-powered-by');

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
   res.send('poputchick-server');
});

app.get('/api/getusers', function(req, res){
    var mongoClient = mongodb.MongoClient;
    
    mongoClient.connect(mongourl, function(err, db){
        if(err){
            console.log("Unable to connect to the database", err);
        } else{
            console.log("Connection established");
            
            var collection = db.collection(coll);
            
            collection.find({}).toArray(function(err, result){
                if(err){
                    console.log(err);
                } else if(result.length){
                    res.send(result);
                } else{
                    res.send("No documents found");
                }
                db.close();
            });
        }
    });
});

app.post('/api/adduser', function(req, res){
    
    var MongoClient = mongodb.MongoClient;
    console.log(req.body);
    MongoClient.connect(mongourl, function(err,db){
       if(err){
           console.log("Unable to connect to server", err);
       } else {
           console.log("Connected to server add");
           
           var collection = db.collection(coll);
           
           var adduser = {name: req.body.name, email: req.body.email, phone:req.body.phone};
           
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

app.post('/api/removeuser', function(req, res){
    var mongoClient = mongodb.MongoClient;
    console.log(req.body);
    var id = req.body._id;
    var o_id = new ObjectId(id);
    
    mongoClient.connect(mongourl, function(err, db){
        if(err){
            console.log("Unable to connect to the database", err);
        } else{
            console.log("Connection established");
            
            var collection = db.collection(coll);
            
            collection.removeOne({_id : o_id} , function(err, result){
                if(err){
                    console.log("Unable to remove", err);
                } else{
                    console.log("Removed");
                    res.send(result);                }
                db.close();
            });
            
        }
    });
});

app.post('/api/getuser', function(req, res){
    var mongoClient = mongodb.MongoClient;
    console.log(req.body);
    var id = req.body._id;
    var o_id = new ObjectId(id);
    
    mongoClient.connect(mongourl, function(err, db){
        if(err){
            console.log("Unable to connect to the database", err);
        } else{
            console.log("Connection established");
            
            var collection = db.collection(coll);
            
            collection.findOne({_id : o_id} , function(err, result){
                if(err){
                    console.log("Unable to find", err);
                } else{
                    console.log("Finded");
                    res.send(result);                }
            });
            db.close();
        }
    });
});

app.post('/api/updateuser', function(req, res){
    var mongoClient = mongodb.MongoClient;
    console.log(req.body);
    var id = req.body._id;
    var o_id = new ObjectId(id);
    
    mongoClient.connect(mongourl, function(err, db){
        if(err){
            console.log("Unable to connect to the database", err);
        } else{
            console.log("Connection established");
            
            var collection = db.collection(coll);
            
            collection.update({_id : o_id}, {$set : {name : req.body.name, email : req.body.email, phone : req.body.phone}} , function(err, result){
                if(err){
                    console.log("Unable to update", err);
                } else{
                    console.log("Updated");
                    res.send(result);                
                }
            });
            db.close();
        }
    });
});

app.listen(app.get('port'), function(){
   console.log("Server start at " + app.get('port')); 
});