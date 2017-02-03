var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pathwaySchema = new Schema({
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

var pathway = mongoose.model('pathways', pathwaySchema);

module.exports = pathway;
