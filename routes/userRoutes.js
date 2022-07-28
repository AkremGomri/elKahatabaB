const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');
const multer = require('../middlewares/multer');
const auth=require('../middlewares/auth');

router.get('/',auth,userCtrl.getAllUser);
router.get('/:id',userCtrl.getOneUser);
router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login);
router.put('/ques/:id',auth,multer,userCtrl.saveques);
//router.put('/quesphoto/:id',auth,multer,userCtrl.savequesphoto);
router.delete('/:id',userCtrl.deleteUser);
//router.delete('/photo/:id', auth,userCtrl.deletePhoto);
router.put('/password-reset/:id',auth,userCtrl.resetPassword);
router.post('/logout',auth,userCtrl.userLogout);
//router.get('/edit',aut,userCtrl.editLoad)
module.exports=router;
