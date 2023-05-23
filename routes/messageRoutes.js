
const express =require("express");
const messageController =require("../controllers/messageController");
const router = express.Router();


router.get('/',messageController.getMessage);
router.get('/:userId',messageController.getMessagesByUserId);

router.post('/',messageController.addMessage);

router.delete("/:messageId",messageController.deleteMessage);





module.exports = router;