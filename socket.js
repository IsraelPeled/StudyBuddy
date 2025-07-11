const { Server } = require("socket.io");
const Message = require("./models/Message");
const GroupMessage = require("./models/GroupMessage"); // חדש

const connectUsers = new Map();

module.exports = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // הצטרפות משתמש אישי
    socket.on("join", (userId) => {
      connectUsers.set(userId, socket.id);
      console.log(`User ${userId} connected`);
    });

    // הצטרפות לחדר קבוצתי
    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);
      console.log(`Socket ${socket.id} joined group ${groupId}`);
    });

    // שליחת הודעה פרטית
    socket.on("sendMessage", async ({ from, to, message }) => {
      await Message.create({ from, to, content: message });

      const recipientSocket = connectUsers.get(to);
      if (recipientSocket) {
        io.to(recipientSocket).emit("reciveMessage", { from, message });
      }

      // החזר גם לשולח
      const senderSocket = connectUsers.get(from);
      if (senderSocket) {
        io.to(senderSocket).emit("reciveMessage", { from, message });
      }
    });

    // שליחת הודעה קבוצתית
    socket.on("groupMessage", async ({ from, groupId, message }) => {
      const newMessage = await GroupMessage.create({
        from,
        groupId,
        content: message,
      });

      io.to(groupId).emit("groupMessage", newMessage);
    });

    // ניתוק משתמש
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
