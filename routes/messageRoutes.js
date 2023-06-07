
const express =require("express");
const messageController =require("../controllers/messageController");
const router = express.Router();
var multer =require('multer');
const storage = multer.diskStorage({
    destination:'files',
    filename:function(req,file,cb){
        console.log('file info ',file)
        cb(null,file.originalname)
    }
})

var uploadFiles =multer({storage:storage});


router.get('/',messageController.getMessage);
router.post('/room/chat',messageController.getRoomChat)
router.get('/user/:id',messageController.getMessagesByUserId);
router.get('/room/:id',messageController.getMessagesByRoomId);

router.post('/',uploadFiles.single('file'),messageController.addMessage);

router.delete("/:messageId",messageController.deleteMessage);





module.exports = router;