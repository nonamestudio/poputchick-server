var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/usersModel');

module.exports = function(passport){

    passport.serializeUser(function(user, done){
        console.log('hello from serializeUser');
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        console.log('hello from deserializeUser');
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

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
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
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

}