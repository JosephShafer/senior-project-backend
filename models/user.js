const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        unique: true
    },
    username:{
        type: String,
        required: [true, 'user name is required'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    reset_password_token: String,
    reset_password_expires: {type: Date, default: Date.now}
});

module.exports = mongoose.model('user', userSchema);