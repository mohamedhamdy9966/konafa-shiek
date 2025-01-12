import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import {
  placeOrderMoyasar,
  placeOrder,
  placeOrderPaytabs,
  userOrders,
  allOrders,
  updateStatus,
  verifyMoyasarWebhook,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Admin Routes
orderRouter.get("/", adminAuth, allOrders); // Get all orders
orderRouter.put("/status", adminAuth, updateStatus); // Update order status

// Payment Routes
orderRouter.post("/place", authUser, placeOrder); // COD payment
orderRouter.post("/moyasar", authUser, placeOrderMoyasar); // Moyasar payment
orderRouter.post("/paytabs", authUser, placeOrderPaytabs); // Moyasar payment

// verify pay
orderRouter.post("/verifyMoyasarWebhook", verifyMoyasarWebhook);

// User Routes
orderRouter.get("/userorders", authUser, userOrders); // Get user's orders

export default orderRouter;
