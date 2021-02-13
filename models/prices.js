import mongoose from 'mongoose';

const storeSchema = mongoose.Schema({
    name: String,
    rating: Number,
    url: String,
    address:{
        zip: String,
        street: String
    },
    prices:[{ date: Date, amounts: Number }] // Fix Date
});

const priceSchema = mongoose.Schema({
    item: String,
    stores: [storeSchema],
});

export default mongoose.model('prices', priceSchema);