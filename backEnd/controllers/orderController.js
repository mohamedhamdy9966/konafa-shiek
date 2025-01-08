import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from 'axios';
import Joi from "joi";

// Define the schema for updating the order status
const updateStatusSchema = Joi.object({
  orderId: Joi.string().required(), // Ensure the ID is a string and is required
  status: Joi.string()
    .valid("Order Placed", "Packing", "Ready", "Delivered") // Define valid statuses
    .required(),
});


const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    console.log("Items being saved:", items);
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} }); // Clear user cart
    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing order using moyasar method
const placeOrderMoyasar = async (req, res) => {
  try {
    console.log("Request received:", req.body);
    const { userId, amount, items, address } = req.body;
    const newOrder = await orderModel.create({
      userId,
      amount,
      items,
      address,
      paymentMethod: "Moyasar",
      paymentStatus: false,
      date: Date.now(),
    });

    res.status(201).json({
      success: true,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error in placeOrderMoyasar:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// placing order using paytabs
const placeOrderPaytabs = async (req,res) => {

}

// Fetch all orders (Admin)
const allOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const orders = await orderModel
      .find({})
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalOrders = await orderModel.countDocuments({});
    res.json({ success: true, orders, totalOrders, page, limit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Fetch user-specific orders
const userOrders = async (req, res) => {
  try {
    const userId  = req.userId;
    console.log("User ID from token:", userId);
    if (!userId) {
      return res.status(400).json({ success: false, message: "Login please To Your Account To see Your orders !"})
    }
    const { page = 1, limit = 10 } = req.query;

    const orders = await orderModel
      .find({ userId })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    console.log("Orders found:", orders);
    res.json({ success: true, orders, page, limit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error in displaying orders for user" });
  }
};

// Update order status (Admin)
const updateStatus = async (req, res) => {
  try {
    await updateStatusSchema.validateAsync(req.body);

    const { orderId, status } = req.body;
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  placeOrderMoyasar,
  placeOrder,
  placeOrderPaytabs,
  allOrders,
  userOrders,
  updateStatus,
};
