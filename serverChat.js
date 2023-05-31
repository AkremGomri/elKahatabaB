var express = require("express");
// var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var cors = require("cors");

var apiRouter = require("./routes/apiRoutes");

// DB connection
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    //don't show the log when it is test
    // if (process.env.NODE_ENV !== "test") {
    console.log("Connected to %s", MONGODB_URL);
    console.log("App is running on Port");
    console.log("Press CTRL + C to stop the process. \n");
    // }
  })
  .catch((err) => {
    console.error("App starting error:", err.message);
    process.exit(1);
  });
mongoose.connection;

const app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

//To allow cross-origin requests

// import message services

const messageService = require("./services/messageService");
const groupService = require("./services/groupService");
const userService = require("./services/userService");
app.use("/api", apiRouter);
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.conn.id);
  // create the room
  socket.on('createRoom', async (room) => {
    // const {sender, receiver}=room;
    // console.log(roomId)
    // const isRoomExists = await groupService.isExists({ members: { $all: [sender, receiver] }});
    // Join the room
    socket.join(room);

    // Send a confirmation message to the client
    socket.emit('roomCreated', room);
  })

// send the messages
  socket.on('sendMessage', async (roomId, body) => {
    // Emit the message to all clients in the room
       console.log("message in room ",roomId,body)
       const {sender,content} = body;
       const messages = await messageService.create({sender,room_id:roomId,content});
        io.to(roomId).emit('message', messages);
  });

});

server.listen(process.env.PORT, "127.0.0.1",() => {
  console.log(`Server started on Port: ${process.env.PORT}`);
});

// throw 404 if URL not found
app.all("*", function (req, res) {
  return res, "Page not found";
});

module.exports = app;




// socket.on("message", async (body) => {
//   console.log("data: ", body);
//   const { sender, receiver, content, room_id } = body;
//   if (!room_id) {
//     const isRoomExists = await groupService.isExists({
//       members: { $all: [sender, receiver] },
//     });
//     console.log("check ======>" + isRoomExists);
//     if (!isRoomExists) {
//       const senderDetails = await userService.isExists({ _id: sender });
//       const receiverDetails = await userService.isExists({ _id: receiver });
//       const name = senderDetails.fullname + "," + receiverDetails.fullname;
//       const isRoomCreate = await groupService.create({
//         name,
//         members: [senderDetails, receiverDetails],
//       });
//       const room_id = isRoomCreate._id;
//       socket.join(isRoomExists._id);
//       console.log("room datails =====>", isRoomCreate);
//       const messages = await messageService.create({
//         sender,
//         room_id,
//         content,
//       });
//       io.to(isRoomExists._id).emit("message", { messages });
//     } else {
//       const room_id = isRoomExists._id;
//       socket.join(isRoomExists._id);
//       const messages = await messageService.create({
//         sender,
//         room_id,
//         content,
//       });
//       io.to(isRoomExists._id).emit("message", { messages });
//     }
//   } else {
//     // const room_id = isRoomExists._id;
//     const messages = await messageService.create({
//       sender,
//       room_id,
//       content,
//     });
//     socket.join(isRoomExists._id);
//     io.to(isRoomExists._id).emit("message", { messages });
//   }

//   // console.log("destination: ",destination);
//   // console.log("userId: ",socket.userId);
//   // socket.to(destination).emit("message","from " + socket.userId + " he said : " + data);
//   //socket.broadcast.emit('message', "here is what I got: " + data)
// });