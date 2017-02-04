module.exports = function(app, passport){
    
    //Routing
    var users = require('../api/users');
    var requests = require('../api/requests');
    var pathways = require('../api/pathways');

    app.use('/api/users', users);
    app.use('/api/requests', requests);
    app.use('/api/pathways',pathways);

    //Home page
    app.get('/', function(req, res){
        res.render('index.ejs');
    });

    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.post('/login', function(req, res){

    });

    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/api/users',
        failureRedirect : '/signup'
    }));

    app.get('/logout', function(req, res){
        req.logout();
        res.send("Logged out");
    });

    
}