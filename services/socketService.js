var express = require("express");

const messageService = require("./services/messageService");
const groupService = require("./services/groupService");
const userService = require("./services/userService");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const app = express();
const users = {};

const socket = io.on("connection");


// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);
  
//   // register user
//   socket.on("register", (userId) => {
//     users[userId] = socket.id;
//     console.log(`User ${userId} registered with socket ID: ${socket.id}`);
//     console.log("users in list ===>", users);
//   });
//   // send the messages
//   socket.on("sendMessage", async (roomId, message) => {
//     // Emit the message to all clients in the room
//     console.log("roomID===",roomId,"message===",message);
//     console.log("message ==>", message);
//     const { sender, receiver, content } = message;
//     const recipientSocketId = users[receiver];
//     const senderDetails =await userService.getById(sender,{select: 'fullname pseudo gender Photo'})
//     const {_id,fullname,pseudo,Photo,gender}=senderDetails;
//     // const receiverDetails =await userService.getById(receiver,{select: 'fullname pseudo '})
//     if (recipientSocketId) {
//       const messages = await messageService.create({
//         sender,
//         room_id: roomId,
//         content,
//       });
//       const {time,room_id}=messages;
//       const responseMessage={
//         sender_id:_id,
//         sender_name:fullname,
//         pseudo,
//         photo:Photo,
//         gender,
//         time,
//         content,
//         room_id
//       }
//       io.to(recipientSocketId).emit("incomingMessage", responseMessage);
//       io.to(socket.id).emit("incomingMessage", responseMessage);
//       console.log(`Message sent from ${socket.id} to ${receiver}`);
//     } else {
//       const messages = await messageService.create({
//         sender,
//         room_id: roomId,
//         content,
//       });
//       console.log(`Recipient user ${receiver} not found`);
//     }
//     console.log("users in list ===>", users);
//   });

//   socket.on("disconnect", () => {
//     const userId = Object.keys(users).find((key) => users[key] === socket.id);
//     if (userId) {
//       delete users[userId];
//       console.log(`User ${userId} disconnected`);
//       console.log("users in list ===>", users);
//     }
//   });
// });



// server.listen(process.env.PORT, "127.0.0.1", () => {
//     console.log(`Socket Server started on Port: ${process.env.PORT}`);
// });
  

module.exports = server;