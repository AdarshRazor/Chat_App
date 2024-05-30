const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    }
},{
    timestamps: true
});

// This will create a collection of users
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;