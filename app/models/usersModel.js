var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    
    local : {
        username : String,
        email : String,
        phone : String,
        password : String
    }
});

//Generating hash
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Checking password
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

var user = mongoose.model('users', userSchema);

module.exports = user;
