import mongoose from 'mongoose';

const priceSchema = mongoose.Schema({
    item: String,
    stores: [{ 
        name: String, rating: Number, url: String,
        zip: String, street: String,
        prices: [{ date: Date, amount: Number }]
    }]
});

export default mongoose.model('prices', priceSchema);