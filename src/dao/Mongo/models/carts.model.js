import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: { type: [
    {status:String,
    payload:{ type:[
      {product:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"products",
      },quantity:Number }
    ],
      default:[]
    },
    totalPages:Number,
    prevPage: Number,
    nextPage: Number,
    page: Number,
    hasPrevPage: Boolean,
    hasNextPage: Boolean,
    prevLink: String,
    nexLink: String
    }
    
  ],
    default:[], index: true},
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
