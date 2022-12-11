const User = require('../models/User');
const jwt = require('jsonwebtoken');
// const {getMyMatchedUsers} = require('../controllers/matchedController')  

module.exports = (io) => {
  io.use( function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, 'RANDOM_TOKEN_SECRET', async function(err, decoded) {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        socket.userId = decoded.userId;
        // console.log(socket);
        const user= await User.findOne({_id:socket.userId});
        socket.user = user;
        next();
      });
    }
    else {
      next(new Error('Authentication error'));
    }    
  })

  io.on("connection", (socket) => {
    const count = io.engine.clientsCount;
    // may or may not be similar to the count of Socket instances in the main namespace, depending on your usage
    const count2 = io.of("/").sockets.size;
      console.log("count: ", count, " count2: ", count2);
      console.log("User connected with socket id : " + socket.id);
      console.log("user id : ",socket.decoded.userId);

      
      
      var connectedUsers = [];
      for (let [id, socket] of io.of("/").sockets) {
        connectedUsers.push({
          socket,
          socketId: id,
          userId: socket.userId,
        });
      }
      
    // tell all my friends that I am connected
    const MyFriendsIds = socket.user.Matches.map((userId) => userId.toString());
    connectedUsers.map((elem) => {
      const test = MyFriendsIds.includes(elem.userId);
      if(test){
        // send him a notif
        socket.to(elem.socketId).emit('new user connected',socket.id);
      }
    })
    connectedUsers.forEach((elem) => console.log("connectedUsers: ",elem.socket.id));
    /*************************************************/

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

    socket.on("join private room", async(data) => {
      // MyFriendsIds = socket.user.Matches.map((userId) => userId.toString()) // MyFriendsIds: list of all the matched yours with this socket
      if (MyFriendsIds.includes(data)){
        roomId = [ data, socket.userId].sort().join("");
        socket.join(roomId);
        console.log("1) rooommm: ",roomId);
        connectedUsers.map((connectedUser) => {
          console.log("1.1) ",connectedUser.userId == data);
          if(connectedUser.userId == data){
            console.log("2) ",socket.id);
            socket.to(connectedUser.socketId).emit("come join", socket.userId)
            // connectedUser.socket.join(roomId);
          }
        })
      }

        // // const sockets = await io.fetchSockets();
        // const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
        // // console.log("sockets: ",sockets);
        // sockets.forEach((item, index) => {

        // })
        // socket.broadcast.emit('user connected')
        // // console.log(sockets[0].decoded);
        // // var clients = io.sockets.clients();
        // // console.log(clients);
        // io.to(socket.id).to(socket.id).emit("room entred", {
        //   message: 'you have entred this room in the data',
        //   data: data
        // });
    });

    socket.on("join room", async(data) => {
      console.log("3) I am also trying to join ",data);
      // MyFriendsIds = socket.user.Matches.map((userId) => userId.toString()) // MyFriendsIds: list of all the matched yours with this socket
      if (MyFriendsIds.includes(data)){
        roomId = [ data, socket.userId].sort().join("");
        socket.join(roomId);
        console.log("4) rom: ",roomId);
        console.log("5) ",socket.id);
        connectedUsers.map((connectedUser) => {
          if(connectedUser.userId == data){
            socket.join(roomId);
          }
        })
      }
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

    socket.on("private message", (result) => {
      console.log("userId: ",result.userId, " socketId: ",socket.userId);
      roomId = [ result.userId, socket.userId].sort().join("");
      console.log("sent to : ",roomId, " message: ",result.msg);
      io.to(roomId).emit("private message", result.msg)
    })
  });

}