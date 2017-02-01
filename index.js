var express = require('express');
var mongodb = require('mongodb');
var app = express();

var mongoUrl = 'mongodb://androidapp:lyHtCoBv@ds019846.mlab.com:19846/poputchick';
var coll = 'users';

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response){
   response.send("poputchick-server"); 
});

app.get('/getusers', function(request, response){
    var mongoClient = mongodb.MongoClient;
    
    mongoClient.connect(mongoUrl, function(error, db){
        if(error){
            console.log("Unable to connect to the database", error);
        } else{
            console.log("Connection established");
            
            var collection = db.collection(coll);
            
            collection.find({}).toArray(function(error, result){
                if(error){
                    console.log(error);
                } else if(result.length){
                    response.send(result);
                } else{
                    res.send("No documents found");
                }
                
            });
            db.close();
        }
    });
});

app.post('/removeuser', function(request, response){
    var mongoClient = mongodb.MongoClient;
    
    mongoClient.connect(mongoUrl, function(error, db){
        if(error){
            console.log("Unable to connect to the database", error);
        } else{
            console.log("Connection established");
            
            var collection = db.collection(coll);
            
            collection.remove({_id : request.body.id} , function(error, result){
                if(error){
                    console.log("Unable to remove", error);
                } else{
                    console.log(result);
                }
            });
            db.close();
        }
    });
});

app.post('/adduser', function(request, response){
    var mongoClient = mongodb.MongoClient;
    
    mongoClient.connect(mongoUrl, function(error, db){
        if(error){
            console.log("Unable to connect to the database", error);
        } else{
            console.log("Connection established");
            
            var collection = db.collection(coll);
            
            var addUser = {name : request.body.name, email : request.body.email, phone : request.body.phone};
            
            collection.insert([addUser], function(error, result){
                if(error){
                    console.log(error);
                } else{
                    response.send("ok");
                }
                
            });
            db.close();
        }
    });
});

app.post('edituser', function(request, response){
    var mongoClient = mongodb.MongoClient;
    
    mongoClient.connect(mongoUrl, function(error, db){
        if(error){
            console.log("Unable to connect to the database", error);
        } else{
            console.log("Connection established");
            
            var collection = db.collection(coll);
            
            collection.find({_id : request.body.id}, function(error, result){
                if(error){
                    console.log(error);
                } else if(result.length){
                    var editUser = {_id : request.body.id, name : request.body.name, email : request.body.email, phone : request.body.phone};
                    
                    collection.insert([editUser], function(error, result){
                        if(error){
                            console.log(error);
                        } else{
                            response.send("ok");
                        }
                        
                    });
                }
            });
            db.close();
        }
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'), app.get('ip'));
});
