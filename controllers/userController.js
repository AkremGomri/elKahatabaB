const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('../models/User');
const { Validator } = require('node-input-validator');
const fs = require('fs');

exports.resetPassword = async (req, res, next) => {
  
  try{
		const v = new Validator(req.body, {
			old_password: 'required',
			new_password: 'required',
			confirm_password: 'required|same:new_password',
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
};

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

  User.find({_id: {$ne: req.auth.userId}}, { "Photo":1, "pseudo":1, "gender": 1, "city": 1}).then(
    (Users) => {
      Users = Users.map((user) => {
        if(me.Matches.includes(user._id)){
          return
        } else if(me.I_like_users_list.includes(user._id)){
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
  console.log(req.body);
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
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              console.log("invalid");
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
            console.log("error");
            res.status(500).json({ error })
          });
      })
    .catch(error => {      
      res.status(500).json({ error })});
};

exports.userLogout= async(req,res,next) =>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
};


exports.getOneUser = (req, res, next) => {
  User.findOne({ _id: req.params.id }).then(
    user => res.status(200).json(user)
  ).catch(error => res.status(404).json({ error }));
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
  const otherUser = await User.findById(req.params.id);

  // 1) (I already dislike him) ? remove him from disliked users, then next()
  if(me.I_dislike_users_list.includes(otherUser._id)){
    me.I_dislike_users_list = me.I_dislike_users_list.filter((likedUserId) => {
      return likedUserId != otherUser._id;
    });      
    await me.save();
    response.message +="\nchanged from Refused Suggestion to a hearted one";
  }
  // 2) he is a matched user allready, do nothing, return response message
  if(me.Matches.includes(otherUser._id)){
    return res.status(203).json({ message: "\n you are already matched you can start chatting" })
  }
  // 3) (he already likes me) ? 1) remove me from his liked users, 2) remove him from my liked users, 3) match both 4) send him a notification 
  if(otherUser.I_like_users_list.includes(me._id)){
    otherUser.I_like_users_list = otherUser.I_like_users_list.filter((elem) => {
      console.log("elem: ",elem.toString());
      console.log("me: ", me._id.toString());
      console.log(elem.toString() == me._id.toString());
      return elem.toString() != me._id.toString();
    })

    me.I_like_users_list = me.I_like_users_list.filter((elem) => {
      console.log(elem.toString() == otherUser._id.toString());
      return elem.toString() != otherUser._id.toString();
    })

    me.Matches.push(otherUser._id);
    otherUser.Matches.push(me._id);
    
    otherUser.Notifs.push({
      senderId: me._id,
      senderPhoto: me.Photo,
      message: me.fullname + " \nhas accepted your invitation, you are now matched, you can start chatting",
      type: "matched" 
    })
      await otherUser.save();
      await me.save();
      return res.status(200).json({ message: "\nyou are now matched! you can start a conversation.", type: "matched" 
    })
  }
  // 4) (I have already sent him an anvitation)? do nothing
  if(me.I_like_users_list.includes(otherUser._id)){
    return res.status(203).json({ message: "\n invitation is allready pending" })
  }
  // 5) add him in my liked users list, send him a notification
  else {
    me.I_like_users_list.push(otherUser._id);
    await me.save();
    otherUser.Notifs.push({
      senderId: me._id,
      senderPhoto: me.Photo,
      message: me.fullname + " \n has sent you an invitation request",
      type: "invitation" 
    })
    await otherUser.save();
  }
  response.message += " \nlike react has been sent";
  return res.status(201).json(response)
};

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
};

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
};

exports.retrieveDislike = async (req, res, next) => {
  const me = await User.findById(req.auth.userId);
  me.I_dislike_users_list = me.I_dislike_users_list.filter((likedUserId) => {
    return likedUserId != req.params.id;
  });
  me.save();


  res.status(201).json({ message: "retrived like successfully"})
};

exports.getMyNotifications = async (req, res) => {
  const me = await User.findById(req.auth.userId);
  const notifs = me.Notifs;
  res.status(201).json(notifs);
};

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
};

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
};