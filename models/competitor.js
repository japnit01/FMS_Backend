let mongoose = require('mongoose');

let competitorSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events'
    },
    round_no: {
        type: Number,
        default: 0
    },
    competitorScore: {
        type: Array,
        default: []
    }
});

// competitorSchema.index({competitorScore: 1})

module.exports = mongoose.model('competitor',competitorSchema);