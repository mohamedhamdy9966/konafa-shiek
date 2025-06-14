import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Routers
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();

// Connect to database and Cloudinary
connectDB();
connectCloudinary();

// Update CORS origin list
// Update CORS origin list
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://kunafasheek.com",
      "capacitor://localhost",
      "http://localhost",
      "http://10.0.2.2",
      "http://192.168.*",
      "android-app://com.konafasheek.app", // Required for native Android app
      "https://com.konafasheek.app", // Optional fallback
      "https://com.kunafasheek.app", // Optional typo protection
      "https://*.kunafasheek.com", // Optional if using subdomains
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse JSON requests
app.use(express.json());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }
//   next();
// });

// API Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Test route
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Export app for Vercel (no app.listen!)
export default app;
