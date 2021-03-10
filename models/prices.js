import mongoose from 'mongoose';

const storeSchema = mongoose.Schema({
    strName: String,
    rating: Number,
    url: String,
    address:{
        zip: String,
        street: String
    },
    prices:[{ date: {type: Date, default: Date.now}, amounts: Number }]
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

export default mongoose.model('prices', priceSchema);