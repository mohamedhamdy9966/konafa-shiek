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
    const { userId, amount, items, address } = req.body;
    const { origin } = req.headers;

    // Create order record
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "moyasar",
      payment: false,
      date: Date.now(),
    };

    const newOrder = await orderModel.create(orderData);

    // Create payment request with Moyasar
    const paymentResponse = await axios.post(
      "https://api.moyasar.com/v1/payment-requests",
      {
        amount: amount * 100,
        currency: "SAR",
        description: `Order #${newOrder._id}`,
        callback_url: `${origin}/verify?orderId=${newOrder._id}`,
        metadata: {
          orderId: newOrder._id.toString(),
          userId: userId.toString(),
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.MOYASAR_SECRET_KEY + ":"
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      payment_url: paymentResponse.data.url,
      orderId: newOrder._id, // Add this line
    });
  } catch (error) {
    console.error("Payment error:", error.response?.data || error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || "Payment processing failed",
    });
  }
};

const verifyMoyasarWebhook = async (req, res) => {
  try {
    // Get payment data from Moyasar webhook
    const { id, status, metadata } = req.body;
    
    // Fetch full payment details
    const payment = await moyasar.payment.fetch(id);

    if (payment.status === 'paid') {
      await orderModel.findByIdAndUpdate(
        metadata.orderId, 
        { payment: true, status: "Payment Completed" }
      );
      return res.json({ success: true });
    }
    
    // Handle failed payments
    await orderModel.findByIdAndDelete(metadata.orderId);
    return res.json({ success: false });

  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Payment verification failed"
    });
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
  verifyMoyasarWebhook,
};
