const messageService =require("../services/messageService")
const groupService =require("../services/groupService");
const userService =require("../services/userService");

exports.getMessage = async (req,res)=>{
    try {
        const messages = await messageService.getMany();
        res.status(200).json({message:'messages ',messages})
    } catch (err) {
        console.log(err)
    }
}

exports.addMessage = async (req,res)=>{
    try {
        const {sender, receiver,content}= req.body;
        const isRoomExists= await groupService.isExists({members:{$all: [sender, receiver]}});
        console.log("check ======>"+isRoomExists)
        if(!isRoomExists){

            const senderDetails = await userService.isExists({_id:sender});
            const receiverDetails = await userService.isExists({_id:receiver});
            const name=senderDetails.fullname +","+receiverDetails.fullname;
            const isRoomCreate= await groupService.create({
                name,
                members:[senderDetails,receiverDetails]
            });
            const room_id= isRoomCreate._id;
            console.log("room datails =====>",isRoomCreate);
            const messages= await messageService.create({
                sender,
                room_id,
                content
            });
            res.status(200).json({message:"message send successfully",room:isRoomExists})
        }else{

            const room_id= isRoomExists._id;
            const messages= await messageService.create({
                sender,
                room_id,
                content
            });
            res.status(200).json({message:"message send successfully",room:isRoomExists})
        }
        
    } catch (err) {
        console.log(err)
    }
}

exports.deleteMessage= async(req,res)=>{
    try {
        const {messageId}= req.params;
        const messages = await messageService.update(messageId,{isActive:false});
        res.status(200).json({message:"message delete successfully",messages})
    } catch (err) {
        console.log(err)
    }
}

exports.getMessagesByUserId =async (req,res)=>{
    try {
        const {userId} =req.params;
        const messages= await messageService.getById(userId);
        res.status(200).json({message:"user messages",messages})
    } catch (err) {
        console.log(err)
    }
}