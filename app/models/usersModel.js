var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name : String,
    email : String,
    phone : String
});

var user = mongoose.model('users', userSchema);

module.exports = user;
