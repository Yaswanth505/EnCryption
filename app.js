//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const session = require('express-session')
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: "process.env.SECRET",
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/UserDB");
const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User",UserSchema)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
    res.render("Home");
});


app.get("/login",function(req,res){
    res.render("Login");
});

// error in logout.......
// app.get('/logout', function(req, res){
//     req.logout();
//     res.redirect('/');
//   });
app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

app.get("/register",function(req,res){
    res.render("Register");
});

app.get("/secret",function(req,res){
    if(req.isAuthenticated()){
        res.render("Secrets");
    }
    else{
        res.redirect("/login");
    }
}); 



app.post("/login",function(req,res){
   const user = new User({username: req.body.username, password: req.body.password});
    req.login(user,function(err){
       if(err){
           console.log(err);
       }
       else{
           passport.authenticate("local")(req, res, function(){
               res.redirect("/secret");
           });
       }
   });
});


app.post("/register",function(req,res){
    User.register({username: req.body.username}, req.body.password, function(err,user){
       if(err)
       {
            console.log(err);
            res.redirect("/register");
       }
       else{
           passport.authenticate("local")(req , res, function(){
               res.redirect("/secret");
           });
       }
   });
});

app.listen("3000",function(){
    console.log("server is running at port 3000");
});