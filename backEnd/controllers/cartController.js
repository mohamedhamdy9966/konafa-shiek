import Joi from "joi";
import userModel from "../models/userModel.js";

// Validation schemas
const validateData = (schema, data) => schema.validateAsync(data);

const addToCartSchema = Joi.object({
  userId: Joi.string().required(),
  itemId: Joi.string().required(),
  size: Joi.string().required(),
  quantity: Joi.number().optional(),
  sauceSize: Joi.number().optional(),
  selectedSauce: Joi.array().items(Joi.string()).optional().default([]),
});

const updateCartSchema = Joi.object({
  userId: Joi.string().required(),
  itemId: Joi.string().required(),
  size: Joi.string().required(),
  quantity: Joi.number().integer().min(0).required(),
  sauceSize: Joi.number().optional(),
  selectedSauce: Joi.array().items(Joi.string()).optional().default([]),
});

// Add products to cart
const addToCart = async (req, res) => {
  try {
    await validateData(addToCartSchema, req.body);

    const { userId, itemId, size, sauceSize, selectedSauce } = req.body;
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = JSON.parse(JSON.stringify(userData.cartData || {}));
    if (sauceSize && typeof sauceSize !== "number") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid sauceSize" });
    }
    if (selectedSauce && !Array.isArray(selectedSauce)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid selectedSauce" });
    }
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    // Ensure cartData[itemId][size] is an object
    if (!cartData[itemId][size] || typeof cartData[itemId][size] !== "object") {
      cartData[itemId][size] = {
        quantity: 0,
        sauceSize: 0,
        selectedSauce: [],
      };
    }

    // Update the quantity, sauceSize, and selectedSauce
    cartData[itemId][size].quantity += 1;
    cartData[itemId][size].sauceSize = sauceSize;
    cartData[itemId][size].selectedSauce = selectedSauce;

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

    const { userId, itemId, size, quantity, sauceSize, selectedSauce } =
      req.body;
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = JSON.parse(JSON.stringify(userData.cartData || {}));

    if (!cartData[itemId] || typeof cartData[itemId][size] !== "object") {
      return res
        .status(400)
        .json({ success: false, message: "Item not in cart" });
    }

    // Update the object properties
    cartData[itemId][size] = {
      quantity,
      sauceSize,
      selectedSauce,
    };

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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { addToCart, updateCart, getUserCart };
