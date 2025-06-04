const { Server } = require("socket.io");
const Message = require("./models/Message");

const connectUsers = new Map();

module.exports = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      connectUsers.set(userId, socket.id);
      console.log(`User ${userId} connected`);
    });

    socket.on("sendMessage", async ({ from, to, message }) => {
      await Message.create({ from, to, content: message });

      const recipientSocket = connectUsers.get(to);
      if (recipientSocket) {
        io.to(recipientSocket).emit("reciveMessage", { from, message });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of connectUsers.entries()) {
        if (socketId === socket.id) {
          connectUsers.delete(userId);
          break;
        }
      }
      console.log("User disconnected: ", socket.id);
    });
  });
};
