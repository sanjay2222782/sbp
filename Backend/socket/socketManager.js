const { Server } = require("socket.io");

let io;
const activeUsers = new Map(); // Store active users

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    // User joins with userId
    socket.on("join", (userId) => {
      activeUsers.set(userId, socket.id);
      console.log(`User ${userId} connected`);
    });

    // Send & Receive Messages
    socket.on("sendMessage", ({ sender, receiver, message }) => {
      const receiverSocket = activeUsers.get(receiver);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", { sender, message });
      }
    });

    // User disconnects
    socket.on("disconnect", () => {
      for (let [key, value] of activeUsers.entries()) {
        if (value === socket.id) {
          activeUsers.delete(key);
          console.log(`User ${key} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

module.exports = setupSocket;
