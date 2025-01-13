import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from "axios";
import Joi from "joi";
import Moyasar from "moyasar";

// Define the schema for updating the order status
const updateStatusSchema = Joi.object({
  orderId: Joi.string().required(), // Ensure the ID is a string and is required
  status: Joi.string()
    .valid("Order Placed", "Packing", "Ready", "Delivered") // Define valid statuses
    .required(),
});

// global variables
const currency = "SAR";
const deliveryCharge = 1;

// moyasar initialize
const moyasar = new Moyasar(process.env.MOYASAR_SECRET_KEY);

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

const placeOrderMoyasar = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the request body
    console.log("Request Headers:", req.headers); // Log the request headers

    const { userId, amount, items, address } = req.body;
    const { origin } = req.headers;

    // Validate required fields
    if (!userId || !amount || !items || !address || !origin) {
      console.error("Missing required fields");
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "moyasar",
      payment: false,
      date: Date.now(),
    };

    console.log("Order Data:", orderData); // Log the order data

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    console.log("Order saved successfully:", newOrder); // Log the saved order

    // Prepare the payment request for Moyasar
    const paymentData = {
      amount: amount * 100, // Convert to smallest currency unit (e.g., cents)
      currency: "SAR",
      description: `Order ID: ${newOrder._id}`,
      callback_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      metadata: {
        orderId: newOrder._id,
        userId: userId,
      },
      source: {
        type: "creditcard", // You can change this to "applepay" or "stcpay" if needed
      },
    };

    // Make a POST request to Moyasar's payment API
    const moyasarResponse = await axios.post(
      "https://api.moyasar.com/v1/payments",
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(process.env.MOYASAR_SECRET_KEY + ":").toString("base64")}`,
        },
      }
    );

    console.log("Moyasar Payment Response:", moyasarResponse.data);

    // Redirect the user to the payment URL
    const paymentUrl = moyasarResponse.data.source.transaction_url;
    res.json({ success: true, payment_url: paymentUrl });
  } catch (error) {
    console.error("Error in placeOrderMoyasar:", error); // Log the full error
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyMoyasarWebhook = async (req, res) => {
  try {
    const { id, status, metadata } = req.body;

    if (status === "paid") {
      const orderId = metadata.orderId;
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(metadata.orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error in verifyMoyasarWebhook:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// placing order using paytabs
const placeOrderPaytabs = async (req, res) => {};

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
    const userId = req.userId;
    console.log("User ID from token:", userId);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Login please To Your Account To see Your orders !",
      });
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
    res.status(500).json({
      success: false,
      message: "Internal Server Error in displaying orders for user",
    });
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
  verifyMoyasarWebhook
};
