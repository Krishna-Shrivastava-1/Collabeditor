import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
  },
});




let documentContent = ""; // Shared document content

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send current document content to newly connected user
  socket.emit("load-document", documentContent);

  // Listen for text changes from client
  socket.on("send-changes", (delta) => {
    documentContent += delta;
    socket.broadcast.emit("receive-changes", delta); // Broadcast changes to other users
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const port = process.env.PORT || 2220;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
