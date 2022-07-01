const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');
const multer = require('../middlewares/multer');

router.get('/',userCtrl.getAllUser);
router.post('/signup',multer,userCtrl.signup);
router.post('/login',userCtrl.login);
router.delete('/:id',userCtrl.deleteUser)

module.exports=router;
