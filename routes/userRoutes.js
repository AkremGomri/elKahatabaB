const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');
const multer = require('../middlewares/multer');
const auth=require('../middlewares/auth');

router.get('/', userCtrl.getAllUser);
router.post('/signup',userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/ques/:id',auth,userCtrl.saveques);
//router.post('/quesphoto/:id',auth,multer,userCtrl.savequesphoto);
router.delete('/:id',userCtrl.deleteUser);
router.get('/recommanded', auth,  userCtrl.getRecommandedUsers)
router.post('/like/:id', auth,  userCtrl.sendLike)
router.post('/unlike/:id', auth,  userCtrl.retrieveLike)
router.post('/declineSuggestion/:id', auth,  userCtrl.declineSuggestion)
router.post('/undislike/:id', auth,  userCtrl.retrieveDislike)
router.get('/getMyNotifs', auth, userCtrl.getMyNotifications)
router.post('/notificationsSeen', auth, userCtrl.NotificationsSeen)
router.post('/notificationsRead/:id', auth, userCtrl.NotificationsRead)
//router.get('/edit',aut,userCtrl.editLoad)
module.exports=router;
