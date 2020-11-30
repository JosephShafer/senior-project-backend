import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT = 10;

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true,'The first name field is required!'],
        trim: true, // remove whitespace
        maxlength: 50
    },
    lastName: {
        type: String,
        required: [true,'The last name field is required!'],
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true,'The email field is required!'],
        trim: true,
        unique: true
    },
    username:{
        type: String,
        required: [true,'The username field is required!'],
        trim: true,
        unique: true,
        minlength: 5
    },
    password: {
        type: String,
        required: [true,'The password field is required!'],
        minlength: 5
    }
});

//saving user data
userSchema.pre('save', (next) => {
    var user = this;
    //checking if password field is available and modified
    if (user.isModified('password')) {
        // generate SALT for password for encryption 
        bcrypt.genSalt(SALT, (err, salt) => {
            if (err) return next(err)
    
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err)
            user.password = hash;
            next();
        });
        });
    } else {
        next();
    }
});

//for comparing the users entered password with DB duing login 
userSchema.methods.comparePassword = (candidatePassword, callBack) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callBack(err);
        callBack(null, isMatch);
   });
}

export default mongoose.model('user', userSchema);