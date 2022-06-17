const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const User=require('../models/User')

exports.signup= (req,res,next) => {
    bcrypt.hash(req.body.password,10)
    .then(hash=> {
        const user=new User({
            email:req.body.email,
            password:hash
        });
        user.save()
        .then(()=>res.status(201).json({message:"utilisateur crée!"}))
        .catch(error=>res.status(500).json({error}));
    }).catch(error=>res.status(500).json({error}));    
   
};
exports.getAllUser= (req, res,next) => {
    User.find().then(
      (Users) => {
        res.status(200).json(Users);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
 
exports.deleteUser = (req, res, next) => {
    User.deleteOne({_id: req.params.id}).then(
      () => {
        res.status(200).json({
          message: 'Deleted!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };
  