const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
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
    type:boolean,
    default:true,
  }
});

module.exports = mongoose.model("Message",MessageSchema);