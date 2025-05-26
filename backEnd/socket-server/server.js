// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

// Add this before your socket.io initialization
app.use(express.json());

// Add this endpoint
app.post("/trigger-new-order", async (req, res) => {
  try {
    const { order } = req.body;

    // Verify the request is from your Vercel backend
    if (req.headers.authorization !== `Bearer ${process.env.SOCKET_SECRET}`) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Emit to all connected admin clients
    io.emit("new_order", order);
    res.json({ success: true });
  } catch (error) {
    console.error("Error triggering new order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://kunafasheek.com", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
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
