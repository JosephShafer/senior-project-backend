const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first name is required'],
        trim: true,
        minlength: 2,
        maxlength: 25
    },
    lastName: {
        type: String,
        required: [true, 'last name is required'],
        trim: true,
        minlength: 2,
        maxlength: 25
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        unique: true,
        minlength: 5,
        maxlength: 320
    },
    username:{
        type: String,
        required: [true, 'user name is required. At least 4 characters, no more than 20.'],
        trim: true,
        unique: true,
        minlength: 4,
        maxlength: 20
    },
    password: {
        type: String,
        required: [true, 'a password is required with at least 8 characters, and no more than 100.'],
        minlength: 8,
        maxlength: 100
    },
    reset_password_token: String,
    reset_password_expires: {type: Date, default: Date.now}
});

module.exports = mongoose.model('user', userSchema);
