const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",//at this stage we use group scheme
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  file: {
    type: String,
  },
  isActive:{
    type:Boolean,
    default:true,
  }
});

module.exports = mongoose.model("Message",MessageSchema);