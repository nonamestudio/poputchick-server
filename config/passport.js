var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var VkontakteStrategy = require('passport-vkontakte').Strategy;

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
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done){
        
        User.findOne({'local.email' : username}, function(err, user){
            if(err) {
                console.log("DB error local");
                return done(err);
            }
            if(!user) {
                console.log("Local user not found");
                return done(null, false, {message : 'user not found'});
            }
            if(!user.validPassword(password)){
                console.log("Local invalid password");
                return done(null, false, {message : 'invalid password'});
            }
            console.log("Local ok");
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
            console.log("signup");
            if(!req.user){
                console.log(req.body);
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
            } else{
                console.log(req.user);
                var user = req.user;
                user.local.username = username;
                user.local.email = req.body.email;
                user.local.phone = req.body.phone;
                user.local.password = user.generateHash(password);
                user.save(function(err){
                    if(err)
                        throw err;
                    return done(null, user);
                });
            }
        });
    }));

    //FacebookStrategy
    passport.use(new FacebookStrategy({
        clientID : configAuth.facebookAuth.clientID,
        clientSecret : configAuth.facebookAuth.clientSecret,
        callbackURL : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true
    },
    function(req, token, refreshToken, profile, done){
        process.nextTick(function(){
            if(!req.user){
                User.findOne({'facebook.id' : profile.id}, function(err, user){
                    if(err){
                        return done(err);
                    }
                    if(user){
                        if(!user.facebook.token){
                            user.facebook.token = token;
                            user.facebook.name = profile.displayName;

                            user.save(function(err){
                                if(err) throw err;
                                return done(null, user);
                            });
                        }
                        return done(null, user);
                    } else{
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
            } else{
                var user = req.user;
                user.facebook.id = profile.id;
                user.facebook.token = token;
                user.facebook.name = profile.displayName;

                user.save(function(err){
                    if(err) throw err;
                    return done(null, user);
                });
            }
        });
    }));

    //TwitterStrategy
    passport.use(new TwitterStrategy({
        consumerKey : configAuth.twitterAuth.consumerKey,
        consumerSecret : configAuth.twitterAuth.consumerSecret,
        callbackURL : configAuth.twitterAuth.callbackURL,
        passReqToCallback : true
    },
    function(req, token, tokenSecret, profile, done){
        process.nextTick(function(){
            if(!req.user){
                User.findOne({'twitter.id' : profile.id}, function(err, user){
                    if(err){
                        return done(err);
                    }
                    if(user){
                        if(!user.twitter.token){
                            user.twitter.token = token;
                            user.twitter.displayName = profile.displayName;
                            user.twitter.username = profile.username;

                            user.save(function(err){
                                if(err) throw err;
                                return done(null, user);
                            });
                        }
                        return done(null, user);
                    } else{
                        var newUser = new User();

                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        newUser.save(function(err){
                            if(err){
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            } else{
                var user = req.user;

                user.twitter.id = profile.id;
                user.twitter.token = token;
                user.twitter.username = profile.username;
                user.twitter.displayName = profile.displayName;

                user.save(function(err){
                    if(err){
                        throw err;
                    }
                    return done(null, user);
                });
            }
        });
    }));

    //GoogleStrategy
    passport.use(new GoogleStrategy({
    clientID : configAuth.googleAuth.clientID,
    clientSecret : configAuth.googleAuth.clientSecret,
    callbackURL : configAuth.googleAuth.callbackURL,
    passReqToCallback : true
    },
    function(req, token, refreshToken, profile, done){
        process.nextTick(function(){
            if(!req.user){
                User.findOne({'google.id' : profile.id}, function(err, user){
                    if(err){
                        return done(err);
                    }
                    if(user){
                        if(!user.google.token){
                            user.google.token = token;
                            user.google.displayname = profile.displayName;
                            user.google.email = profile.emails[0].value;

                            user.save(function(err){
                                if(err) throw err;
                                return done(null, user);
                            });
                        }
                        return done(null, user);
                    } else{
                        var newUser = new User();

                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.displayName = profile.displayName;
                        newUser.google.email = profile.emails[0].value;


                        newUser.save(function(err){
                            if(err){
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            } else{
                var user = req.user;

                user.google.id = profile.id;
                user.google.token = token;
                user.google.displayName = profile.displayName;
                user.google.email = profile.emails[0].value;


                user.save(function(err){
                    if(err){
                        throw err;
                    }
                    return done(null, user);
                });
            }
        });
    }));

    //VkontakteStrategy
    passport.use(new VkontakteStrategy({
        clientID : configAuth.vkontakteAuth.clientID,
        clientSecret : configAuth.vkontakteAuth.clientSecret,
        callbackURL : configAuth.vkontakteAuth.callbackURL,
        passReqToCallback : true
    },
    function(req, accessToken, refreshToken, profile, done){
        process.nextTick(function(){
            if(!req.user){
                User.findOne({'vkontakte.id' : profile.id}, function(err, user){
                    if(err){
                        return done(err);
                    }
                    if(user){
                        if(!user.vkontakte.token){
                            user.vkontakte.token = token;
                            user.vkontakte.username = profile.username;
                            user.vkontakte.displayname = profile.displayname;
                            user.vkontakte.gender = profile.gender;
                            user.vkontakte.profileURL = profile.profileURL

                            user.save(function(err){
                                if(err) throw err;
                                return done(null, user);
                            });
                        }
                        return done(null, user);
                    } else{
                        var newUser = new User();

                        newUser.vkontakte.id = profile.id;
                        newUser.vkontakte.token = accessToken;
                        newUser.vkontakte.username = profile.username;
                        newUser.vkontakte.displayName = profile.displayName;
                        newUser.vkontakte.gender = profile.gender;
                        newUser.vkontakte.profileURL = profile.profileURL;

                        newUser.save(function(err){
                            if(err){
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            } else{
                var user = req.user;

                user.vkontakte.id = profile.id;
                user.vkontakte.token = accessToken;
                user.vkontakte.username = profile.username;
                user.vkontakte.displayName = profile.displayName;
                user.vkontakte.gender = profile.gender;
                user.vkontakte.profileURL = profile.profileURL;

                user.save(function(err){
                    if(err){
                        throw err;
                    }
                    return done(null, user);
                });
            }
        });
    }));
}