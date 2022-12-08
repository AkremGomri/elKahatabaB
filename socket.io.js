const server = require('./server');
const io = require("socket.io")(server, { 
  cors: {    
    origin: "http://127.0.0.1:5502",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on("connection", (socket) => {
    console.log("User connected with the id : " + socket.id);

    // const count = io.engine.clientsCount;
    // console.log("number of engines = " + count);
    // const count2 = io.of("/").sockets.size;
    // console.log("number of sockets = " + count2);

    // const uuid = require("uuid");

    // io.engine.generateId = (req) => {
    //     const x= uuid.v4;
    //     console.log('uuid: ', x());
    //     return x(); // must be unique across all Socket.IO servers
    // }

    // console.log("uuid: ", uuid);
    socket.on("private message", (anotherSocketId, msg) => {
        socket.to(anotherSocketId).emit("private message", socket.id, msg);
    });

    // console.log(socket);

    // console.log(socket.rooms); // Set { <socket.id> }
    // socket.join("room1");
    // console.log(socket.rooms); // Set { <socket.id>, "room1" }

    socket.on("authentification", (userId) => {
        socket.userId = userId;
        console.log('userId: ',userId);
        // console.log("data: ",data);
    });

    socket.on("message", (data, destination) => {
        console.log("data: ",data);
        console.log("destination: ",destination);
        console.log("userId: ",socket.userId);
        socket.to(destination).emit("message","from " + socket.userId + " he said : " + data);
        //socket.broadcast.emit('message', "here is what I got: " + data)
    });

    socket.on("enter room", (data) => {
        console.log(data + " joined by " + socket.userId);
        socket.join(data);
    });

    // in a middleware
// io.use(async (socket, next) => {
//     try {
//       const user = await fetchUser(socket);
//       socket.user = user;
//       console.log("user: ",user);
//     } catch (e) {
//       next(new Error("unknown user"));
//     }
//   });
  
//     console.log(socket.user);
  
//     // in a listener
//     socket.on("set username", (username) => {
//       socket.username = username;
//     });
    

});