// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://kunafasheek.com", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const port = process.env.PORT || 4000;

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return next(new Error("Not authorized as admin"));
    }
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  console.log("Admin connected:", socket.id);

  // Just for test - can be triggered from your Vercel backend
  socket.emit("new_order", {
    _id: Date.now(),
    address: {
      firstName: "Test",
      lastName: "Order",
      street: "",
      phone: "",
      state: "",
    },
    amount: 10,
    deliveryMethod: "delivery",
    items: [],
    date: new Date(),
    status: "Order Placed",
    paymentMethod: "COD",
    payment: false,
  });

  socket.on("disconnect", () => {
    console.log("Admin disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`✅ Socket.IO server running on port ${port}`);
});
export { io };