const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    college: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        // required: true
    },
    age: {
        type: Number,
        // required: true
    },
    isCoordinator: {
        type: Boolean,
        // required: true
        default: false
    }
})

userSchema.index({name: 1, age: 1, college: 1});

module.exports = mongoose.model('users',userSchema);


