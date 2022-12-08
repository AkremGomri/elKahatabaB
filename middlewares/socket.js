const User = require('../models/User');
const jwt = require('jsonwebtoken');
// const {getMyMatchedUsers} = require('../controllers/matchedController')  

module.exports = (io) => {

  io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, 'RANDOM_TOKEN_SECRET', function(err, decoded) {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        socket.userId = decoded;
        next();
      });
    }
    else {
      next(new Error('Authentication error'));
    }    
  })

  io.on("connection", (socket) => {
      console.log("User connected with the id : " + socket.id);
      console.log("decoded : ",socket.decoded.userId);
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        id: id,
        userId: socket.userId,
      });
    }
    socket.emit("users", users);

    socket.on("disconnect", (userId) => {
      socket.broadcast.emit("user disconnected", socket.id);
        User.updateOne({
            _id:userId
        },{
            connected: true,
            }).then(() => {
                console.log(userId + " set to diconnected! ");
        })
        .catch(error => console.log("failed to set user as connected (database) : " + error));
    });

    socket.on('disconnecting', () => {
        console.log(socket.rooms); // the Set contains at least the socket ID
      });

    // console.log("uuid: ", uuid);
    socket.on("private message", (anotherSocketId, msg) => {
        socket.to(anotherSocketId).emit("private message", socket.id, msg);
    });

    socket.on("message", (data, destination) => {
        socket.to(destination).emit("message","from " + socket.userId + " he said : " + data);
    });

    socket.on("enter room", async(data) => {
        roomId = [ data, socket.userId].sort((a,b) => a-b).join("");
        socket.join(roomId);
        console.log("rooms: ",socket.rooms); // the Set contains at least the socket ID
        // const sockets = await io.fetchSockets();
        const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
        console.log("sockets: ",sockets);
        sockets.forEach((item, index) => {

        })
        socket.broadcast.emit('user connected')
        // console.log(sockets[0].decoded);
        // var clients = io.sockets.clients();
        // console.log(clients);
        io.to(socket.id).to(socket.id).emit("room entred", {
          message: 'you have entred this room in the data',
          data: roomId
        });
    });

    socket.on("trying to connect with the new user", (data) => {
      const otherUser = User.findById(data.userId)
        .then((res) => {
          console.log("otherUser: ",res.Matches);
          matchedList = res.Matches;
          if(matchedList.includes(socket.userId.valueOf().userId)){
            roomId = [ data.userId, socket.userId].sort((a,b) => a-b).join("");
            socket.join(roomId);
            console.log("finally done!");
            console.log(roomId);

            console.log("rooms: ",socket.rooms); // the Set contains at least the socket ID
            // const sockets = await io.fetchSockets();
            const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
            console.log("sockets: ",sockets);

          } else {
            console.log("you are not matched ! ");
          }
        })
        .catch( err => console.log(err));
    })

  });
}