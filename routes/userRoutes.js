const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');
const matchesCtrl=require('../controllers/matchedController');
const multer = require('../middlewares/multer');
const auth=require('../middlewares/auth');

//router.post('/quesphoto/:id',auth,multer,userCtrl.savequesphoto);
router.get('/', userCtrl.getAllUser);
router.get('/:id',userCtrl.getOneUser);
router.delete('/:id',userCtrl.deleteUser);
router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login);

router.get('/recommanded', auth,  userCtrl.getRecommandedUsers)
router.post('/like/:id', auth,  userCtrl.sendLike)
router.post('/unlike/:id', auth,  userCtrl.retrieveLike)
router.post('/declineSuggestion/:id', auth,  userCtrl.declineSuggestion)
router.post('/undislike/:id', auth,  userCtrl.retrieveDislike)
router.get('/getMyNotifs', auth, userCtrl.getMyNotifications)
router.post('/notificationsSeen', auth, userCtrl.NotificationsSeen)
router.post('/notificationsRead/:id', auth, userCtrl.NotificationsRead)
router.put('/ques/:id',auth,multer,userCtrl.saveques);
//router.put('/quesphoto/:id',auth,multer,userCtrl.savequesphoto);
//router.delete('/photo/:id', auth,userCtrl.deletePhoto);
router.put('/password-reset/:id',auth,userCtrl.resetPassword);
router.post('/logout',auth,userCtrl.userLogout);
//router.get('/edit',aut,userCtrl.editLoad)

/*           matches            */
router.post('/getMyMatches', auth, matchesCtrl.getMyMatchedUsers)


//************************************//
module.exports=router;
