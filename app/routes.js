module.exports = function(app, passport){

    var users = require('../api/users');
    var requests = require('../api/requests');
    var pathways = require('../api/pathways');

    app.use('/api/users', users);
    app.use('/api/requests', requests);
    app.use('/api/pathways',pathways);

    app.get('/', function(req, res){
        res.send('poputchick-server');
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/api/users',
        failureRedirect : '/'
    }));
}