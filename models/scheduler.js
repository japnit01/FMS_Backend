let mongoose = require('mongoose');

let schedulerSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    comp_list: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Scheduler',schedulerSchema);