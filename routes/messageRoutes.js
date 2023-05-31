
const express =require("express");
const messageController =require("../controllers/messageController");
const router = express.Router();


router.get('/',messageController.getMessage);
router.post('/room/chat',messageController.getRoomChat)
router.get('/user/:id',messageController.getMessagesByUserId);
router.get('/room/:id',messageController.getMessagesByRoomId);

router.post('/',messageController.addMessage);

router.delete("/:messageId",messageController.deleteMessage);





module.exports = router;