let mongoose = require('mongoose');

let schedulerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    // comp_list: {
    //     type: Array,
    //     default: []
    // }
    comp_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Competitions'
    }, 
    isRegistered : {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Scheduler',schedulerSchema);