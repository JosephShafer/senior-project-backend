const mongoose = require('mongoose');

const searchSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        unique: true,
        minlength: 5,
        maxlength: 320
    },
    searchTerms:{
        type: [{type: String}],
        required: [true, 'search term is required'],
        trim: true,
        minlength: 4,
        maxlength: 20
    },
});

module.exports = mongoose.model('search', searchSchema);
