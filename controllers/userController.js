const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const cookieParser = require('cookie-parser');
const User = require('../models/User');
const { Validator } = require('node-input-validator');
const fs = require('fs');
/* 
exports.savequesphoto = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (req.params.id != req.auth) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        User.updateOne({ _id: req.params.id }, 
           { Photo: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` , _id: req.params.id })
          .then(() => {
            res.status(200).json(
              { message: 'Photo modifiée!' })
            console.log(user);
          })
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
} */
exports.resetPassword = async (req, res, next) => {
  
  try{
		const v = new Validator(req.body, {
			old_password: 'required',
			new_password: 'required',
			confirm_password: 'required|same:new_password'
		});

		const matched = await v.check();

		if (!matched) {
			return res.status(422).send(v.errors);
		}
    User.findOne({ _id:req.params.id  })
    .then((user) => {
      if(bcrypt.compareSync(req.body.old_password,user.password)){

        let hashPassword=bcrypt.hashSync(req.body.new_password,10);
         User.updateOne({
          _id:req.params.id
        },{
          password:hashPassword,_id:req.params.id
        }).then(() => {
          res.status(200).json(
            { message: 'Mot de passe modifié!' ,
          data:user})
        })
        .catch(error => res.status(401).json({ error }));
  
        
      }else{
        return res.status(400).send({
          message:'Old password does not matched',
          data:{}
        });
      }

    })
    .catch((error) => {
      res.status(402).json({ error });
    });
     
		
	}catch(err){
		return res.status(400).send({
			message:err.message,
			data:err
		});
	}
}
exports.saveques = (req, res, next) => {
  const userObject = req.file ? {
    ...JSON.parse(req.body.user),
    Photo: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
} : { ...req.body };
delete userObject._userId;
  User.findOne({ _id: req.params.id })
    .then((user) => {
      User.updateOne({ _id: req.params.id }, {  ...userObject, _id: req.params.id })
        .then(() => {
          res.status(200).json(
            { message: 'Objet modifié!' })
        })
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
        fullname: req.body.fullname,
        pseudo: req.body.pseudo,
        //photo: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
      const user = new User(me);
      user.joiValidate(me);
      user.save()
        .then(() => {
          res.status(201).json({ message: "utilisateur crée!" })
        })
        .catch(error => {
          console.log("masaretch el creation");
          console.log(error);
          res.status(500).json({ error })
        });

    })
};

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
            const token=jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
            res.status(200)
            .json({
              userId: user._id,
              token: token
            });
          })
          .catch(error => {
            console.log("mochkla fel compare");
            res.status(500).json({ error })
          });
      })
    .catch(error => res.status(500).json({ error }));
};
exports.userLogout= async(req,res,next) =>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
  
  }


exports.getOneUser = (req, res, next) => {

  User.findOne({ _id: req.params.id }).then(
    user => res.status(200).json(user)
  ).catch(error => res.status(404).json({ error })
  );

}

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
exports.deletePhoto=(req,res,next )=>{
  User.findOne({ _id: req.params.id})
      .then(user => {
        user.removeData([Photo]);
              console.log('successfully deleted');
            return res.status(200).json('Successfully! Image has been Deleted')
      })
      .catch( error => {
          res.status(500).json({ error :error});
      });
}