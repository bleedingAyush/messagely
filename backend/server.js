const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");
const messageRoute = require("./routes/messageRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const server = require("http").createServer(app);

dotenv.config();
connectDB(); // connect to the database.

app.use(express.json());

app.use(cors());

app.use("/", authRoute);
app.use("/", userRoute);
app.use("/", chatRoute);
app.use("/", messageRoute);

// --------------------------deployment------------------------------

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT;

const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("chat", (payload) => {
    io.emit("chat", payload);
  });

  socket.on("setup", (_id) => {
    socket.join(_id);
  });
  socket.off("setup", (_id) => {
    socket.leave(_id);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("user_joined", (data) => {
    socket.to(data.id).emit("user_joined", data);
  });

  socket.on("new message", (newMessageRecieved) => {
    const newMessage = newMessageRecieved;
    let chat = newMessage.chat;
    if (!chat.users) return console.log("chat.users is not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) {
      } else {
        const userId = user._id.toString();
        socket.in(userId).emit("message recieved", newMessage);
      }
    });
  });

  socket.on("user_joined", (data) => {
    socket.to(data.id).emit("user_joined", data);
  });
});

server.listen(PORT, () => {
  console.log("server is running on port 5000");
});
