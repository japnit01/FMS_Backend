let mongoose = require('mongoose');

let competitorSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    competitorScore: {
        type: Number,
        default: 0
    }
});

module.exports = competitorSchema;