const { Server } = require("socket.io");
const { Message, Chat, User } = require("./inc/db");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Your frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a specific chat room
    socket.on("joinRoom", (chatId) => {
      if (chatId) {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat room ${chatId}`);
      } else {
        console.warn(`User ${socket.id} attempted to join with an invalid chatId`);
      }
    });

    // Listen for new messages
    socket.on("newMessage", async ({ chatId, content, id }) => {
      // Save the message to the database
      let message = await saveMessage(chatId, content, id);

      // Populate the sender field with the user details (specifically the username)
      message = await message.populate('sender', 'name').then();

      // Prepare the message with the populated username
      const messageWithUsername = {
        ...message.toObject(), // Convert Mongoose document to a plain object
        username: message.sender.name, // Attach the populated username
      };

      // Emit the message to the chat room
      io.to(chatId).emit("message", messageWithUsername);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

// Function to save a message in the database
const saveMessage = async (chatId, content, id) => {
  const message = await Message.create({
    chatId,
    sender: id,
    content,
  });

  // Update the chat with the latest message details
  await Chat.updateOne(
    { _id: chatId },
    { lastMessage: content, lastMessageTime: message.timestamp }
  );

  return message;
};

module.exports = { initializeSocket };
