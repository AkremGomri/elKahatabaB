const messageService =require("../services/messageService")

exports.getMessage = async (req,res)=>{
    try {
        const messages = await messageService.getMany();
        res.status(200).json({message:'messages ',messages})
    } catch (err) {
        console.log(err)
    }
}

exports.addMessage = async ()=>{
    try {
        const {sender,room_id,content}=req.body;
        const messages= await messageService.create({
            sender,
            room_id,
            content
        });
        res.status(200).json({message:"message send successfully",messages})
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