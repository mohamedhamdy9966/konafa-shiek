import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true},
  sizes: {
    type: Map,
    of: {
      enabled: { type: Boolean, default: false },
      price: { type: Number, min: 0 },
      calories: { type: Number, min: 0},
      offer: { type: Number, min: 0, default: null},
    },
    required: true,
  },
  bestSeller: { type: Boolean },
  date: { type: Date, required: true },
});


const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
