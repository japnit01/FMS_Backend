let mongoose = require('mongoose');

let competitorSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    competitorName: {
        type: String,
        required: true
    },
    competitorScore: {
        type: Number,
        default: 0
    }
});

module.exports = competitorSchema;