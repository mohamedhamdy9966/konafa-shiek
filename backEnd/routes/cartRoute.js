import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const cartRouter = express.Router();

// RESTful routes
cartRouter.get("/:userId", authUser, getUserCart); // Retrieve user cart
cartRouter.post("/", authUser, addToCart); // Add items to cart
cartRouter.put("/", authUser, updateCart); // Update cart items

export default cartRouter;