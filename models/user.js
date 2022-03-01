const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    // user_id: {
    //     type: String
    // },
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
    },
    registered_events: {
        type: Array
    }
})

userSchema.index({name: 1, age: 1, college: 1});

let Users = mongoose.model('Users',userSchema,'Users');

module.exports = Users;

