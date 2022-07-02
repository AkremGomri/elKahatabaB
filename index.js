const express = require('express');
const userRoutes=require('./routes/userRoutes');
const app= express();
const mongoose=require('mongoose');
const dotenv=require('dotenv').config();;
const helmet=require('helmet');
const morgan =require("morgan");
const path = require('path');

//port
const port = process.env.port;
const url = process.env.MONGODB_URL;

mongoose.connect(url,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => {console.log('Connexion à MongoDB échouée !')});
    app.use(express.json());
    app.use(helmet());
    app.use(morgan("common"));
    
    app.use((req, res, next) => { 
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
    });
  app.use('/images', express.static(path.join(__dirname, 'images')));
  
app.use('/',userRoutes);
app.listen(port,()=> {
    console.log("Backend server is running on "+ port);
})
