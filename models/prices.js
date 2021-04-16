const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    strName: String,
    rating: Number,
    url: String,
    address:{
        zip: String,
        street: String
    },
    prices:[{ date: {type: Date, default: Date.now}, amounts: {type: Number, min: 0} }]
});

const priceSchema = mongoose.Schema({
    item: String,
    stores: [storeSchema],
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true
    }
});

module.exports = mongoose.model('prices', priceSchema);
