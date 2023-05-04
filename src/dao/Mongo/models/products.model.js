import mongoose from "mongoose";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  tittle: { type: String, require: true },
  description: { type: String, require: true },
  code: { type: Number, unique: true, require: true },
  status: { type: Boolean, require: true },
  stock: { type: Number, require: true },
  category: { type: String, require: true },
  price: { type: Number, require: true },
  thumbnail: { type: String },
});

export const productsModel = mongoose.model(productsCollection, productsSchema);
