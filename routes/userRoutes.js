const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');
const multer = require('../middlewares/multer');
const auth=require('../middlewares/auth');

router.get('/',userCtrl.getAllUser);
router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login);
router.post('/ques/:id',auth,userCtrl.saveques);
//router.post('/quesphoto/:id',auth,multer,userCtrl.savequesphoto);
router.delete('/:id',userCtrl.deleteUser);
//router.get('/edit',aut,userCtrl.editLoad)
module.exports=router;
