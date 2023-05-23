const groupServices =require("../services/groupService");

exports.createGroup = async(req,res)=>{
    try {
        const group= await groupServices.create(req.body);
        res.status(200).json({message:"group created",group})
    } catch (err) {
        console.log(err)
    }
}

exports.getGroups =async (req,res)=>{
    try {
        const groups = await groupServices.getMany();
        res.status(200).json({message:"groups list",groups})
    } catch (err) {
        console.log(err)
    }
}

exports.updateGroup = async(req,res)=>{
    try {
        const {groupId} =req.params;
        const group= await groupServices.update(Id,req.body);
        res.status(200).json({message:"group updated",group})
    } catch (err) {
        console.log(err)
    }
}

exports.deleteGroup =async(req,res)=>{
    try {
        const {groupId} =req.params;
        const group =await groupServices.update(Id,{isActive:false});
        res.status(200).json({message:"group deleted",group})
    } catch (err) {
        console.log(err)
    }
}

exports.getGroupById =async (req,res)=>{
    try {
        const {groupId} = req.params;
        const group= await groupServices.getById(Id);
        res.status(200).json({message:"group details",group})
        
    } catch (err) {
        console.log(err)
    }
}