
const express =require("express");
const messageController =require("../controllers/messageController");
const router = express.Router();


router.get('/',(req,res)=>{res.send("message listen")});
router.get('/:userId',messageController.getMessagesByUserId);

router.post('/',messageController.addMessage);

router.delete("/:messageId",messageController.deleteMessage);





module.exports = router;