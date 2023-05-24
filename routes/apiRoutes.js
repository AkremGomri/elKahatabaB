const express = require("express");
const userRoutes= require("./userRoutes");
const groupRoutes=require("./groupRoutes");
const messageRoute =require("./messageRoutes");

const app = express();


app.use('/user',userRoutes);
app.use('/group',groupRoutes);
app.use('/message',messageRoute);



module.exports = app;