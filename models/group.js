const mongoose =require("mongoose");



const GroupSchema = mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        is_Active:{
            type:boolean,
            default:false
        }
    }],
    isActive:{
        type:boolean,
        default:true
    }
})



module.exports =mongoose.model("Group",GroupSchema)