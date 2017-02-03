var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var requestSchema = new Schema({
    userID : Schema.Types.ObjectId,
    status : String,
    startPoint : String,
    endPoint : String,
    freeSeats : Number,
    time : String,
    waitTime : String,
    minPrice : Number,
    maxPrice : Number,
    comment : String,
    accepted : Boolean,
    partnerID : {
        type : Schema.Types.ObjectId,
        required : false
    } 
});

var request = mongoose.model('requests', requestSchema);

module.exports = request;
