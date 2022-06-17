const express=require('express');
const router =express.Router();
const userCtrl=require('../controllers/userController');

router.get('/',userCtrl.getAllUser);
router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login);
router.delete('/:id',userCtrl.deleteUser)

module.exports=router;
