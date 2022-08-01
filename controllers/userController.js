const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');
const user = require('../models/User');

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
      if (req.params.id != req.auth.userId) {
          res.status(401).json({ message : 'Not authorized'});
      } else {
          User.updateOne({ _id: req.params.id}, { ...req.body, _id: req.params.id})
          .then(() => {
            res.status(200).json( 
              {message : 'Objet modifié!'})
          } )
          .catch(error => res.status(401).json({ error }));
      }
  })
  .catch((error) => {
      res.status(400).json({ error });
  });

};
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) 
      .then((hash) => {
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

exports.getRecommandedUsers = async (req, res, next) => {
  const me = await User.findById(req.auth.userId);

  User.find({_id: {$ne: req.auth.userId}}).then(
    (Users) => {
      Users = Users.map((user) => {
        if(me.I_like_users_list.includes(user._id)){
          return { ...user._doc, allreadyLiked: true, allreadyRefused: false}
        } else if (me.I_dislike_users_list.includes(user._id)){
          return { ...user._doc, allreadyRefused: true, allreadyLiked: false}
        }
         else {
          return { ...user._doc, allreadyLiked: false, allreadyRefused: false}
        }
      })
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
          .catch(error => {
            res.status(500).json({ error })
          });
      })
    .catch(error => {      
      res.status(500).json({ error })});
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

exports.sendLike = async ( req, res, next ) => { 
  console.log("sending..."); 
  var today = new Date();
  var response = {}
  const me = await User.findById(req.auth.userId);
  if(me.I_dislike_users_list.includes(req.params.id)){
    me.I_dislike_users_list = me.I_dislike_users_list.filter((likedUserId) => {
      return likedUserId != req.params.id;
    });      
    response.message +="changed from Refused Suggestion to a hearted one";
  }
  if(me.I_like_users_list.includes(req.params.id))
    res.status(409).json({ message: "invitation is allready pending" })
  else {
    me.I_like_users_list.push(req.params.id);
    await me.save();
    const user = await User.findById(req.params.id);
    if(!user.they_like_me_list.includes(req.auth.userId)){
      user.they_like_me_list.push(req.auth.userId);
      user.Notifs.push({
        senderId: me._id,
        senderPhoto: me.Photo,
        message: me.fullname + " has sent you an invitation request",
        type: "invitation" 
      })
      await user.save();
    }
  }
  response.message += " like react has been sent";
  res.status(201).json(response)
}

exports.declineSuggestion = async ( req, res, next ) => {  
  const declinedUserID = req.params.id;
  const me = await User.findById(req.auth.userId);
  const user = await User.findById(req.params.id);

  if(me.I_like_users_list.includes(declinedUserID)){
    me.I_like_users_list = me.I_like_users_list.filter((likedUserId) => {
      return likedUserId != declinedUserID;
    });
    user.Notifs = user.Notifs.filter((notif) => {
      return notif.type != "invitation" && notif.senderId != me._id
    })

  }

  if(!me.I_dislike_users_list.includes(declinedUserID)){
    me.I_dislike_users_list.push(declinedUserID);
    await me.save();
    res.status(200).json({ message: "successfully refused" });
  }
  if(!user.they_dislike_meList.includes(req.auth.userId)){
    user.they_dislike_meList = user.they_dislike_meList.push(req.auth.userId);
    await user.save();
  }

  res.status(401).json({ message: "a problem accured" });
}

exports.retrieveLike = async (req, res, next) => {
  console.log("retrieving");
  const me = await User.findById(req.auth.userId);
  me.I_like_users_list = me.I_like_users_list.filter((likedUserId) => {
    return likedUserId != req.params.id;
  });
  
  const user = await User.findById(req.params.id);
  user.they_like_me_list = user.they_like_me_list.filter((likeMeUserId) => {
    return likeMeUserId != req.auth.userId;
  });
  user.Notifs = await user.Notifs.filter((notif) => {
    if(notif.type != "invitation" || notif.senderId.toString() != me._id.toString())
      return notif;
  })
  await me.save();
  await user.save();
  res.status(201).json({ message: "retrived like successfully"})
}

exports.retrieveDislike = async (req, res, next) => {
  const me = await User.findById(req.auth.userId);
  me.I_dislike_users_list = me.I_dislike_users_list.filter((likedUserId) => {
    return likedUserId != req.params.id;
  });
  me.save();


  res.status(201).json({ message: "retrived like successfully"})
}

exports.getMyNotifications = async (req, res) => {
  const me = await User.findById(req.auth.userId);
  const notifs = me.Notifs;
  res.status(201).json(notifs);
}

exports.NotificationsSeen = async (req, res) => {
  console.log("checking notificationSeen");
  const me = await User.findById(req.auth.userId);
  me.Notifs = me.Notifs.map((notif) => {
    if(notif.isNew == true){
      notif.isNew = false;
      notif.last_modified = new Date();
    }
    return notif;
  })
  me.markModified('Notifs'); //so important so that mongoDB detects changes in the nested object (me.Notifs)
  me.save();
  res.status(201).json({ message: "all notifications got successfully updated", success:true})
}

exports.NotificationsRead = async (req, res) => {
  const me = await User.findById(req.auth.userId);
  console.log("id: ",req.params.id);
  /* better perfomace but not sure it works*/
  // for(let notif of me.notifs){
  //   if(notif._id == req.params.id){
  //     notif.isRead = true;
  //     notif.last_modified = new Date();
  //     break;
  //   }
  // }
  /*****************************************/
  let futurChangedNotif;
  let previouslyChangedNotif;
  me.Notifs = me.Notifs.map((notif) => {
    if(notif._id == req.params.id){
      previouslyChangedNotif = notif.isRead
      notif.isRead = true;
      notif.last_modified = new Date();
      futurChangedNotif = notif;
    }
    return notif;
  })

  console.log("notiiiifs: ",me.Notifs);
  me.markModified('Notifs'); //so important so that mongoDB detects changes in the nested object (me.Notifs)
  me.save();
  res.status(201).json({ message: "notification.isRead successfully updated", afterChange: futurChangedNotif.isRead, beforeChange:  previouslyChangedNotif})
}