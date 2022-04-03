let mongoose = require('mongoose');

let schedulerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events'
    },
    fest_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fests'
    }, 
    isRegistered : {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('scheduler',schedulerSchema);