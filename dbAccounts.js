import mongoose from 'mongoose';

const createAccountSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

export default mongoose.model('accounts', createAccountSchema);