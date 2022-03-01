let mongoose = require('mongoose');

let guestsSchema = new mongoose.Schema({
    name: {
        type: String
    },
    designation: {
        type: String
    }
})

module.exports = guestsSchema;