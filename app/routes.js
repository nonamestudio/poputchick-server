module.exports = function(app, passport){

    var users = require('../api/users');
    var requests = require('../api/requests');
    var pathways = require('../api/pathways');
    var unlink = require('../config/unlink');

    app.use('/api/users', isLoggedIn, users);
    app.use('/api/requests', isLoggedIn, requests);
    app.use('/api/pathways', isLoggedIn, pathways);
    app.use('/unlink', isLoggedIn, unlink);

    app.get('/', function(req, res){
        res.send('poputchick-server');
    });

    //////////////
    //LOCAL SCOPE
    /////////////
    //Local sign up
    app.post('/signup', passport.authenticate('local-signup'), function(req, res){
        res.send("Signed up");
    });

    //Local login
    app.post('/login', passport.authenticate('local-login'),function(req, res){
        res.send("Loged in");
    });

    //Connect local account
    app.post('/connect/local', passport.authenticate('local-signup'), function(req, res){
        res.send("Local connected");
    });

    /////////////////////////////////////////


    ///////////////
    ///FACEBOOK SCOPE
    /////////////////

    //Authenticate via Facebook
    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', passport.authenticate('facebook'), function(req, res){
        res.send("Logged in via Facebook");
    });

    //Connect Facebook account
    app.get('/connect/facebook', passport.authorize('facebook'));

    app.get('/connect/facebook/callback', passport.authorize('facebook'), function(req, res){
        res.send("Facebook connected");
    });

    ///////////////////////////////////////


    //////////////
    ///TWITTER SCOPE
    ///////////////////

    //Authenticate via Twitter
    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter'), function(req, res){
        res.send("Logged in via Twitter");
    });

    //Connect Twitter account
    app.get('/connect/twitter', passport.authorize('twitter'));

    app.get('/connect/twitter/callback', passport.authorize('twitter'), function(req, res){
        res.send("Twitter connected");
    });

    //////////////////////////////////////////////////


    /////////////////
    //GOOGLE SCOPE
    //////////////////////

    //Authenticate via Google
    app.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}));   

    app.get('/auth/google/callback', passport.authenticate('google'), function(req, res){
        res.send("Logged in via Google");
    });

    //Connect Google account
    app.get('/connect/google', passport.authorize('google', {scope : ['profile', 'email']}));   

    app.get('/connect/google/callback', passport.authorize('google'), function(req, res){
        res.send("Google connected");
    });

    ///////////////////////////////////////////////////


    ///////////////
    ///VK SCOPE
    ///////////////////////

    //Authenticate via VK
    app.get('/auth/vkontakte', passport.authenticate('vkontakte'));   

    app.get('/auth/vkontakte/callback', passport.authenticate('vkontakte'), function(req, res){
        res.send("Logged in via Vkontakte");
    });

    //Connect VK account
    app.get('/connect/vkontakte', passport.authorize('vkontakte'));   

    app.get('/connect/vkontakte/callback', passport.authorize('vkontakte'), function(req, res){
        res.send("Vkontakte connected");
    });

    ////////////////////////////////////////////////


    app.get('/logout', function(req, res){
        req.logout();
        res.send("Logged out");
    });

    function isLoggedIn(req, res, next){
        if(req.isAuthenticated())
            return next();
        res.send("Please, login");
    }
}