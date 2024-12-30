import Joi from "joi";
import userModel from "../models/userModel.js";

// Validation schemas
const validateData = (schema, data) => schema.validateAsync(data);

const addToCartSchema = Joi.object({
  userId: Joi.string().required(),
  itemId: Joi.string().required(),
  size: Joi.string().required(),
});

const updateCartSchema = Joi.object({
  userId: Joi.string().required(),
  itemId: Joi.string().required(),
  size: Joi.string().required(),
  quantity: Joi.number().integer().min(0).required(),
});

// Add products to cart
const addToCart = async (req, res) => {
  try {
    await validateData(addToCartSchema, req.body);

    const { userId, itemId, size } = req.body;
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = JSON.parse(JSON.stringify(userData.cartData || {}));

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update user cart
const updateCart = async (req, res) => {
  try {
    await validateData(updateCartSchema, req.body);

    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = JSON.parse(JSON.stringify(userData.cartData || {}));

    if (!cartData[itemId] || !cartData[itemId][size]) {
      return res.status(400).json({ success: false, message: "Item not in cart" });
    }

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get user cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { addToCart, updateCart, getUserCart };
