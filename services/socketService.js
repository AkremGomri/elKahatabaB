const app = require("../app");
const userService = require("./userService");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const userSocket = require("./userSocket");


io.on("connection", (socket) => {
  //user connecting the socket
  console.log("a user connected", socket.id);

  // register user
  socket.on("register", (userId) => {
    userSocket.addUser(userId, socket.id);
  });
  // disconnect user
  socket.on("disconnect", () => {
    userSocket.removeUser(socket.id);
  });
});

exports.incomingMessage = async (sid, rid, msg) => {
  try {
    // console.log("mgs",msg)
    const { sender, room_id, content, file, time } = msg;
    const senderDetails = await userService.getById(sender, {
      select: "fullname pseudo gender Photo",
    });
    const { _id, fullname, pseudo, Photo, gender } = senderDetails;
    const responseMessage = {
      sender_id: _id,
      sender_name: fullname,
      pseudo,
      photo: Photo,
      gender,
      time,
      content: content ? content : "",
      file: file ? file : "",
      room_id,
    };
    io.to(sid).emit("incomingMessage", responseMessage);
    io.to(rid).emit("incomingMessage", responseMessage);
  } catch (err) {
    console.log("error ==>", err);
  }
};


module.exports = {
  server,
};
