import mongoose from "mongoose";
import moongosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  tittle: { type: String, require: true, index: true },
  description: { type: String, require: true },
  code: { type: Number, unique: true, require: true },
  status: { type: String, require: true, index: true },
  stock: { type: Number, require: true },
  category: { type: String, require: true },
  price: { type: Number, require: true, index: true },
  thumbnail: String,
});

productsSchema.plugin(moongosePaginate);
export const productsModel = mongoose.model(productsCollection, productsSchema);
