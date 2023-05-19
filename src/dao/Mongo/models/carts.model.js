import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: { type: Array,default:[], index: true },
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
