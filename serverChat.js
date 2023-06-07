const ServerChat= require("./services/socketService");


ServerChat.server.listen(process.env.PORT, "127.0.0.1", () => {
  console.log(`Server started on Port: ${process.env.PORT}`);
});


module.exports = ServerChat.server;

