module.exports = function(app, passport){

    var users = require('../api/users');
    var requests = require('../api/requests');
    var pathways = require('../api/pathways');

    app.use('/api/users', isLoggedIn, users);
    app.use('/api/requests', isLoggedIn, requests);
    app.use('/api/pathways', isLoggedIn, pathways);

    app.get('/', function(req, res){
        res.send('poputchick-server');
    });

    app.post('/signup', passport.authenticate('local-signup'), function(req, res){
        res.send("Signed up");
    });

    app.post('/login', passport.authenticate('local-login'),function(req, res){
        res.send("Loged in");
    });

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', passport.authenticate('facebook'), function(req, res){
        res.send("Logged in via facebook");
    });

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