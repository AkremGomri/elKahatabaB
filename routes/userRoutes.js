const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');
const roomController=require('../controllers/roomController');
const matchesCtrl=require('../controllers/matchedController');
const multer = require('../middlewares/multer');
const auth=require('../middlewares/auth');

//router.post('/quesphoto/:id',auth,multer,userCtrl.savequesphoto);
router.get('/recommanded', auth,  userCtrl.getRecommandedUsers)
router.get('/getMyNotifs', auth, userCtrl.getMyNotifications)
router.get('/conversations', roomController.getAllConversations);
router.get('/', userCtrl.getAllUser);
router.get('/:id',userCtrl.getOneUser);
router.delete('/:id',userCtrl.deleteUser);

router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login);
router.post('/notificationsSeen', auth, userCtrl.NotificationsSeen)
router.post('/logout',auth,userCtrl.userLogout);
router.post('/getMyMatches', auth, matchesCtrl.getMyMatchedUsers)
router.post('/undislike/:id', auth,  userCtrl.retrieveDislike)
router.post('/like/:id', auth,  userCtrl.sendLike)
router.post('/unlike/:id', auth,  userCtrl.retrieveLike)
router.post('/declineSuggestion/:id', auth,  userCtrl.declineSuggestion)
router.post('/notificationsRead/:id', auth, userCtrl.NotificationsRead)
//router.put('/quesphoto/:id',auth,multer,userCtrl.savequesphoto);
//router.delete('/photo/:id', auth,userCtrl.deletePhoto);
//router.get('/edit',aut,userCtrl.editLoad)
router.put('/ques/:id',auth,multer,userCtrl.saveques);
router.put('/password-reset/:id',auth,userCtrl.resetPassword);

router.delete('/delete-conversation/:roomId', roomController.deleteConversation);
/*           matches            */


//************************************//
module.exports=router;