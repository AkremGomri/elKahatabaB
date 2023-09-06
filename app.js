// const express = require('express');
// const passport=  require("passport")
// const userRoutes=require('./routes/userRoutes');
// const app= express();
// const mongoose=require('mongoose');
// const dotenv=require('dotenv').config();;
// const helmet=require('helmet');
// const morgan =require("morgan");
// const path = require('path');

// //port
// const url = process.env.MONGODB_URL;
// const session = require('express-session');
// connect_mongoDB = () => mongoose.connect(url,
//   { useNewUrlParser: true,
//     useUnifiedTopology: true,
//     // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
//     // reconnectInterval: 500, // Reconnect every 500ms
//     // bufferMaxEntries: 0,
//     // connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
//     // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//   })
//     .then(() => {
//       console.log('Connexion à MongoDB réussie !');
//     })
//       .catch(() => {console.log('Connexion à MongoDB échouée !')});

   
//     // After you declare "app"
//     app.use(session({ secret: 'kus is my spirit animal' }));
//     app.use(passport.initialize());
//     app.use(passport.session());
//     app.use(express.json());
//     app.use(helmet());
//     app.use(morgan("common"));
    
//     app.use((req, res, next) => { 
//       res.setHeader('Access-Control-Allow-Origin', '*');
//       res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//       next();
//     });

//     connect_mongoDB();

//   app.use(async (req, res, next) => {
//     if (!mongoose.connection.readyState) {
//       await connect_mongoDB();
//     }
//     next();
//   })
//   app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use('/',userRoutes);

// module.exports = app;


var express = require("express");
// var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var cors = require("cors");

var apiRouter = require("./routes/apiRoutes");

// DB connection
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    //don't show the log when it is test
    // if (process.env.NODE_ENV !== "test") {
    console.log("Connected to %s", MONGODB_URL);
    console.log("App is running on Port");
    console.log("Press CTRL + C to stop the process. \n");
    // }
  })
  .catch((err) => {
    console.error("App starting error:", err.message);
    process.exit(1);
  });
mongoose.connection;

const app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}
app.use(cors());
app.use(express.json({limit: 30000000000} ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


// 


app.use('/files', express.static('files'));
app.use('/profiles', express.static('profiles'));
// api routs
app.use("/api", apiRouter);

app.all("*", function (req, res) {
  return res, "Page not found";
});


module.exports=app;