const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const SALT_I = 10;

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
    },
    token: {
        type: String
    }
});

userSchema.pre('save',function(next){
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(SALT_I, function(err,salt){
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err,hash){
                if(err) return next(err)
                user.password = hash
                next();
            })
        })
    } else {
        next();
    }    
})

userSchema.methods.comparePasswords = function(candidatePassword,cb){
    bcrypt.compare(candidatePassword,this.password, function(err, isMatch){
        if(err) cb(err)
        cb(null,isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    let token = jwt.sign(user._id.toHexString(),'supersecretpassword');

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user)

    })
}

userSchema.statics.findByToken = function(token, cb){
    const user = this;
    jwt.verify(token,'supersecretpassword',(err, decode)=>{
        user.findOne({'_id':decode, 'token': token},(err, user)=>{
            if(err) return cb(err)
            cb(null,user)
        })
    })
}


const User = mongoose.model('User', userSchema);
module.exports = { User }