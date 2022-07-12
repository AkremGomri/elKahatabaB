const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');
const multer = require('../middlewares/multer');
const auth=require('../middlewares/auth');

router.get('/',auth,userCtrl.getAllUser);
router.get('/:id',userCtrl.getOneUser);
router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login);
router.put('/ques/:id',auth,userCtrl.saveques);
//router.post('/quesphoto/:id',auth,multer,userCtrl.savequesphoto);
router.delete('/:id',auth,userCtrl.deleteUser);
//router.put('/:id',auth,userCtrl.user_update);
//router.get('/edit',aut,userCtrl.editLoad)
module.exports=router;
