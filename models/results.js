let mongoose = require('mongoose');
// let competitorSchema = require('./competitor');

let resultsSchema = new mongoose.Schema({
    fest_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'fest'
    },
    event_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'competition'
    },
    roundNo: {
        type: Number
    },
    winners: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('results',resultsSchema);