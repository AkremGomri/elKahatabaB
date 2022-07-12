const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');
exports.user_update = (req, res, next) => {
  User.update({date_of_birth: req.body.date_of_birth,
     horoscope: req.body.horoscope,
    city:req.city,
    gender:req.body.gender}).exec().then(result => {
    res.status(200).json({message: 'User updated'});
  }).catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  });
};
exports.savequesphoto =(req,es,next) => {
  User.findOne({_id: req.params.id})
  .then((user) => {
      if (req.params.id != req.auth.userId) {
          res.status(401).json({ message : 'Not authorized'});
      } else {
          User.updateOne({ _id: req.params.id}, { ...{Photo:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`}, _id: req.params.id})
          .then(() => {
            res.status(200).json( 
              {message : 'Objet modifié!'})
              console.log(user);
          } )
          .catch(error => res.status(401).json({ error }));
      }
  })
  .catch((error) => {
      res.status(400).json({ error });
  });
}

exports.saveques= (req,res,next)=>{
  User.findOne({_id: req.params.id})
  .then((user) => {
          User.updateOne({ _id: req.params.id}, { ...req.body, _id: req.params.id})
          .then(() => {
            res.status(200).json( 
              {message : 'Objet modifié!'})
          } )
          .catch(error => res.status(401).json({ error }));
      
  })
  .catch((error) => {
      res.status(400).json({ error });
  });

};
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) 
      .then((hash) => {
        console.log("d5alna lel hash");
        console.log(req.body);
        /* const userObject=req.body.user;
        delete userObject._id; */
        me = {
          email: req.body.email,
          password: hash,
          fullname:req.body.fullname,
          pseudo:req.body.pseudo,
          //photo: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        const user = new User(me);
        user.joiValidate(me);
        user.save()
          .then(() => {
            res.status(201).json({ message: "utilisateur crée!" })})
          .catch(error => {
            console.log("masaretch el creation");
            console.log(error);
            res.status(500).json({ error })
          });

      })
    };
  /* bcrypt.hash(, 10)
    .then( 
      hash => {
       
    }).catch( 
      error => { console.log("mad5alnech lel hash");
      console.log(error);
        res.status(500).json({ error })
      }); */


exports.getAllUser = (req, res, next) => {
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
  User.findOne({ 
    $or: [{
      "email": req.body.email
    }, {
      "pseudo": req.body.email
    }]
   })
    .then(
      user => {
        if (!user) {
           console.log("mal9inech user ", req.body.email);
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        console.log("l9ina user");
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              console.log("mot de passe moch s7i7");
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            console.log("mot de passe s7i7");
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => {
            console.log("mochkla fel compare");
            res.status(500).json({ error })
          });
      })
    .catch(error => res.status(500).json({ error }));
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then(
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
exports.getOneUser =(req,res,next)=> {
  
  User.findOne({ _id: req.params.id }).then(
    user =>res.status(200).json(user)
  ).catch(error =>res.status(404).json({error})
  );

} 