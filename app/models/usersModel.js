var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    local : {
        username : String,
        email : String,
        phone : String,
        password : String
    },
    facebook : {
        id : String,
        token : String,
        email : String,
        name : String
    },
    twitter : {
        id : String,
        token : String,
        displayName : String,
        username : String
    },
    google : {
        id : String,
        token : String,
        email : String,
        name : String
    }
});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('users', userSchema);
