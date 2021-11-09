const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true, // Removes accidental spaces users might have at start or end of the email
        unique: 1 //can only be used for one user
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
})

const User = mongoose.model('User', userSchema);
module.exports = { User }