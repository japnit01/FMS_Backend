const mongoose = require('mongoose');

let eventSchema = new mongoose.Schema({
    fest_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fests'
    }, 
    type: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        // required: true
    },
    startTime: {
        type: String,
        default:Date.now,
        // required: true
    },
    endTime: {
        type: String,
        default:Date.now,
        // required: true
    },
    description: {
        type: String
    },
    startdate: {
        type: Date,
        // required: true
    },
    venue: {
        type: String,
        // required: true
    },
    fee: {
        type: Number,
        default: 0
    }
});

eventSchema.index({comp_type: 1, comp_name: 1});

module.exports = mongoose.model("events",eventSchema);