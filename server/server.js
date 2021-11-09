const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const app = express();

const mongoUri = 'mongodb+srv://x:x@cluster0.omxue.mongodb.net/awesomeapp?retryWrites=true&w=majority';
mongoose.connect(mongoUri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useCreateIndex',true)

///// Middlewares /////
app.use(bodyParser.json());

///// Models /////
const { User } = require('./models/user');

const port = process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`Started on port ${port}`)
});;