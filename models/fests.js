const mongoose = require("mongoose");
const {Schema} = mongoose;

const FestSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    name:{
        type:String,
        // required:true
    },
    description:{
        type:String,
    },
    organisation:{
        type:String,
        // required:true
    },
    startdate:{
        type:Date,
    },
    enddate:{
        type:Date,
    },
    city:{
        type:String,
        // required:true
    },
    state:{
        type:String,
        // required:true
    },
    coordinators:{
        type:Array,
    },
    timestamp:{
        type:String,
        default:Date.now
    }
});

module.exports = mongoose.model("fests",FestSchema);