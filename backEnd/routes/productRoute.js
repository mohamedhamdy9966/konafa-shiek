import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  listProducts,
  singleProduct,
  removeProduct,
  addProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";

const productRouter = express.Router();

// Admin: Add a new product
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

// Admin: Remove a product
productRouter.post("/remove", adminAuth, removeProduct);

// Get a single product
productRouter.post("/single", singleProduct); // GET method for fetching a single product by ID

// Get a list of products
productRouter.get("/list", listProducts); // GET method for listing products

export default productRouter;
