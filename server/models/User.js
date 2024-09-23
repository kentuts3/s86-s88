const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    username: {
        type: String,
        required: [true, 'First Name is Required'],
        unique: true
    },

    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'Password is Required']
    },

    isAdmin: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('User', userSchema);