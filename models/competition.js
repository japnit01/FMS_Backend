const mongoose = require('mongoose');
let guestsSchema = require('./guests');
let resultsSchema = require('./results.js')

let competitionSchema = new mongoose.Schema({
    fest_id: {
        type: String,
    },
    // comp_id : {
    //     type: String
    // }, 
    comp_type: {
        type: String,
        // required: true
    },
    comp_name: {
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
    date: {
        type: Date,
        // required: true
    },
    guests: {
        type: [guestsSchema]
    },
    venue: {
        type: String,
        // required: true
    },
    results: {
        type: [resultsSchema]
    },
    isCompFinished: {
        type: Boolean,
        default: false
    },
    fee: {
        type: Number,
        default: 0
    }
});

competitionSchema.index({comp_type: 1, comp_name: 1});

module.exports = mongoose.model("Competitions",competitionSchema);