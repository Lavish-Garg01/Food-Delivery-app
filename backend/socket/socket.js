let io;

const initSocket = (socketIO) => {
  io = socketIO;

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // Admin joins admin room
    socket.on("join-admin", () => {
      socket.join("admin-room");
      console.log("Admin joined admin room");
    });

    // User joins their personal room for order updates
    socket.on("join-user", (userId) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };