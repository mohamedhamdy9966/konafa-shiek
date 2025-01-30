import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Add product
const addProduct = async (req, res) => {
  try {
    const { name, description, category, sizes, bestSeller } = req.body;
    console.log("Received Category:", category); // Log received category
    console.log("Received Sizes:", sizes); // Log received sizes

    // Ensure sizes is a valid JSON string
    let parsedSizes;
    try {
      parsedSizes = JSON.parse(sizes);
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid sizes format" });
    }

    // Validate sizes
    if (!parsedSizes || typeof parsedSizes !== "object") {
      return res.status(400).json({ success: false, message: "Invalid sizes" });
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      sizes: parsedSizes,
      bestSeller: bestSeller === "true" || bestSeller === true,
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();
    console.log("Saved Product:", product);

    res
      .status(201)
      .json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add product" });
  }
};

// List products with pagination and filtering
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { productId, name, description, category, sizes, bestSeller } = req.body;

    // Parse sizes JSON if needed
    let parsedSizes;
    try {
      parsedSizes = JSON.parse(sizes);
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid sizes format" });
    }

    // Validate sizes
    if (!parsedSizes || typeof parsedSizes !== "object") {
      return res.status(400).json({ success: false, message: "Invalid sizes" });
    }

    // Handle images if new ones are uploaded
    let updatedImages = [];
    if (req.files) {
      const imageKeys = ["image1", "image2", "image3", "image4"];
      const uploadedImages = imageKeys
        .map((key) => req.files[key] && req.files[key][0])
        .filter(Boolean);

      updatedImages = await Promise.all(
        uploadedImages.map(async (file) => {
          let result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
          return result.secure_url;
        })
      );
    }

    // Update product in the database
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        category,
        sizes: parsedSizes,
        bestSeller: bestSeller === "true" || bestSeller === true,
        ...(updatedImages.length > 0 && { image: updatedImages }),
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

// Remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Fetch single product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, singleProduct, removeProduct, addProduct, updateProduct };
