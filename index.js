const express = require('express');
const app =express();
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./modules/User');
const bcrypt = require('bcryptjs')

//database connection
const uri = process.env.DB_URI;
mongoose.set('strictQuery',false)
mongoose.connect(uri, err => {
    if(err) throw (err)
})
const connection = mongoose.connection;
connection.once('open',() => {
    console.log("Database connect successfully")
})


app.use(express.json());

//Register
app.post('/register', async (req,res) => {
    try {
        var hash = await bcrypt.hash(req.body.password, 10)
        const user =await new User({
            username:req.body.username,
            email:req.body.email,
            password:hash
        });
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error) {
        res.send(error)
    }
})


//login
app.post('/login',async(req,res) => {
    try {
        const oldUser =await User.findOne({email:req.body.email});
        if(!oldUser) {
            res.send("Please enter the Correct email address")
        }

        var validPass = await bcrypt.compare(req.body.password, oldUser.password)

        if(!validPass) {
             res.send("please enter correct password")
        }
        res.send("login success")
    } catch (error) {
        res.send(error)
    }
})


app.listen(8080,() => {
    console.log("Server running on port 8080");
})