var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../app/models/usersModel');
var configAuth = require('./auth');

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    //Local login
    passport.use('local-login', new LocalStrategy(
    function(username, password, done){
        
        User.findOne({'local.email' : username}, function(err, user){
            if(err) {
                return done(err);
            }
            if(!user) {
                return done(null, false);
            }
            if(!user.validPassword(password)){
                return done(null, false);
            }

            return done(null, user);
        });
    }));


    //Local signup
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done){
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function(){
            User.findOne({'local.email' : req.body.email}, function(err, user){
                if(err){
                    return done(err);
                }               

                if (user){
                    return done(null, false);
                } else {
                    var newUser = User();
                    newUser.local.username = username;
                    newUser.local.email = req.body.email;
                    newUser.local.phone = req.body.phone;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    //Facebook
    passport.use(new FacebookStrategy({
        clientID : configAuth.facebookAuth.clientID,
        clientSecret : configAuth.facebookAuth.clientSecret,
        callbackURL : configAuth.facebookAuth.callbackURL
    },
    function(token, refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({'facebook.id' : profile.id}, function(err, user){
                if(err){
                    return done(err);
                }
                if(user){
                    return done(null, user);
                } else{

                    console.log(profile);

                    var newUser = new User();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.displayName;

                    newUser.save(function(err){
                        if(err){
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
    
}