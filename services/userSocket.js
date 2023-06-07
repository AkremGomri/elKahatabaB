
const users = {}; // Define the users object

const addUser = (userId, socketId) => {
  users[userId] = socketId;
  console.log(`User ${userId} registered with socket ID: ${socketId}`);
  console.log("users in list ===>", users);
};

const removeUser = (socketId) => {
  const userId = Object.keys(users).find((key) => users[key] === socketId);
  if (userId) {
    delete users[userId];
    console.log(`User ${userId} disconnected`);
    console.log("users in list ===>", users);
  }
  //   delete users[userId];
};

const getUserSocketId = (userId) => {
  return users[userId];
};

module.exports = {
  addUser,
  removeUser,
  getUserSocketId,
  users,
};
