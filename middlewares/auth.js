const jwt=require('jsonwebtoken');
const User = require('../models/User');

module.exports= async (req,res ,next)=> {
    try {
        console.log("d5alna lenna ");
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken=jwt.verify(token,'RANDOM_TOKEN_SECRET');
        const userId=decodedToken.userId;
        const user=await User.findOne({_id:userId});
        req.auth = { userId }; 
        req.user=user;
        if(req.body.userId && req.body.userId !== userId){
            throw 'Invalid user ID';
        }else {
            next();
        }
    } catch (error) {
        res.status(401).json({error :error | 'Requete non authentifiée !'})
    }
};