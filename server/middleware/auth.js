
const { User } = require('../models/user')

let authenticate = (req,res,next) => {
    let token = req.cookies.auth;
    //methods are dependents of the user object, but the statics dont 
    User.findByToken(token,(err,user)=>{
        if(err) throw err
        if(!user) return res.status(200).send({message:'bad token'});

        req.email = user.email;
        req.token = token;
        next();
    })
}

module.exports = { authenticate }