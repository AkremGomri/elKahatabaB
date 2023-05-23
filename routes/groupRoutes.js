
const express =require("express");
const groupController =require("../controllers/groupController");
const router = express.Router();

router.get('/',groupController.getGroups);

router.get('/:groupId',groupController.getGroupById);

router.post('/',groupController.createGroup);

router.patch('/:groupId',groupController.updateGroup);

router.delete('/:groupId',groupController.deleteGroup);



module.exports = router;