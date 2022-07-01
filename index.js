const express = require('express');
const userRoutes=require('./routes/userRoutes');
const app= express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const helmet=require('helmet');
const morgan =require("morgan");

dotenv.config();

mongoose.connect(process.env.MONGODB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use('/api/auth',userRoutes);
app.listen(8800,()=> {
    console.log("Backend server is running !");
})
