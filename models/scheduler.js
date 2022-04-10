let mongoose = require('mongoose');

let schedulerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    events: {
        type: [
            new mongoose.Schema({
                event_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'events'
                },
                isRegistered: {
                    type: Boolean,
                    default: false
                }
            })
        ],
        default: []
    },
    fest_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fests'
    }
})

module.exports = mongoose.model('scheduler',schedulerSchema);