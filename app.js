//jshint esversion:6
require("dotenv").config();
const md5 = require("md5");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

mongoose.connect("mongodb://localhost:27017/UserDB");
const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});



const User = new mongoose.model("User",UserSchema)


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.render("Home");
});


app.get("/login",function(req,res){
    res.render("Login");
});


app.get("/register",function(req,res){
    res.render("Register");
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email: username}, function(err, foundUser){
        if(err)
            console.log(err);
        else
        {
            if(foundUser.password === password)
                res.render("secrets");
            else{
                console.log("wrong email or Password\nplease check it and try again.");
            }
        }
    });
})


app.post("/register",function(req,res){
    const newUser = new User(
    {
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(function(err){
        if(err) 
            console.log(err);
        else
            res.render('secrets');
    });
});

app.listen("3000",function(){
    console.log("server is running at port 3000");
});