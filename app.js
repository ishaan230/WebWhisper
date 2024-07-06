//jshint esversion:6


const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const { title } = require('process')
const { error } = require('console')
const encrypt = require('mongoose-encryption')
require('dotenv').config()

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    username:String,
    password:String
})

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})

const User = new mongoose.model("User",userSchema)

app = express()

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))


app.get("/login",function(req,res){
    res.render("login")
})
app.get("/register",function(req,res){
    res.render("register")
})
app.get("/",function(req,res){
    res.render("home")
})

app.post("/register",function(req,res){
    const userDetails = new User({
        username:req.body.username,
        password:req.body.password
    })
    userDetails.save()
    console.log('Done!')
    res.render("login")
})

app.post("/login",function(req,res){
    User.find({username: req.body.username}).then((data) => {
        if(data[0]){
            if(data[0].password == req.body.password){
                res.render("secrets")
            }
            else{
                // console.log("error")
                res.send("Error")
            }
        }else{
            res.send("Error")
        }
    })
})



app.listen(3000,function(){
    console.log('Server started!')
})