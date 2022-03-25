let mongoose = require('mongoose');

let competitorSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        // unique: true
    },
    competitorScore: {
        type: Number,
        default: 0
    }
});

module.exports = competitorSchema;