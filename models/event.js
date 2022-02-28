const mongoose = require("mongoose");
const {Schema} = mongoose;

const EventSchema = new Schema({
    fest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'fests'
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    category:{
        type:String,
    },
    startdate:{
        type:Date,
    },
    enddate:{
        type:Date,
    },
    timestamp:{
        type:String,
        default:Date.now
    }
});

module.exports = mongoose.model("events",FestSchema);