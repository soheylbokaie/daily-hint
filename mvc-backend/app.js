import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http"; // Import http module
import socketIo from "socket.io"; // Import socket.io
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express(); // Define app before using it

// Middleware
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Database Connection
mongoose
  .connect("mongodb://localhost:27017/mvc_example", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to MongoDB at mongodb://localhost:27017/mvc_example"))
  .catch((err) => console.error(err));


// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingInterval: 25000,
  pingTimeout: 60000
});
// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
// Start the server

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;