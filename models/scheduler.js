let mongoose = require('mongoose');

let schedulerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event'
    }, 
    isRegistered : {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Scheduler',schedulerSchema);