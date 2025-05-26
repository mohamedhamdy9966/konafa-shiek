import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import { createServer } from "http";
import { Server } from "socket.io";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import jwt from "jsonwebtoken";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://kunafasheek.com", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ API routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ Simple home route for test
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// ✅ Socket.IO auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: store info in socket.user
    socket.user = decoded;

    if (!decoded.isAdmin) {
      return next(new Error("Not authorized as admin"));
    }

    next();
  } catch (err) {
    console.error("Socket Auth Error:", err.message);
    return next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  console.log("Admin connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Admin disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
