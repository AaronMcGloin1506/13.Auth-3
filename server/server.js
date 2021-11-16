const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();

const mongoUri = 'mongodb+srv://AdminMcGloin:MongoAaron123@cluster0.omxue.mongodb.net/authApp?retryWrites=true&w=majority';
mongoose.connect(mongoUri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useCreateIndex',true)

///// Middlewares /////
app.use(bodyParser.json());
app.use(cookieParser());

///// Models /////
const { User } = require('./models/user');

///// Routes /////
app.post('/api/user',(req,res)=>{
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save((err,doc)=>{
        if(err){
            res.status(400).send(err)
        }
        res.status(200).send(doc)
    })
})

app.post('/api/user/login',(req,res)=> {
    // 1-find the user -> if good move forward
    User.findOne({'email': req.body.email},(err, user)=>{
        if(!user) res.json({message:"User not found"});

        // 2-compare the string with the hash -> move forward
        user.comparePasswords(req.body.password, (err,isMatch)=>{
            if(err) throw err;
            if(!isMatch) return res.status(400).json({message:"bad password"});
            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err);
                res.cookie('auth', user.token).send('ok')
            })
        })
        // bcrypt.compare(req.body.password,user.password, (err, isMatch)=>{
        //     if(err) res.json({message:'password incorrect'})
        //     // 3-send respose
        //     res.status(200).send(isMatch)
        // })  
    }) 
})

app.get('/api/books',(req,res)=>{
    let token = req.cookies.auth;
    //methods are dependents of the user object, but the statics dont 
    User.findByToken(token,(err,user)=>{
        if(err) throw err
        if(!user) return res.status(200).send({message:'bad token'});
        res.status(200).send(user)
    })
})



const port = process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`Started on port ${port}`)
});;