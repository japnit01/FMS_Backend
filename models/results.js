let mongoose = require('mongoose');
let competitorSchema = require('./competitor');

let resultsSchema = new mongoose.Schema({
    fest_id: {
        type: String
    },
    comp_id: {
        type: String
    },
    roundNo: {
        type: Number
    },
    competitors: {
        type: [competitorSchema]
    }
});

module.exports = resultsSchema;