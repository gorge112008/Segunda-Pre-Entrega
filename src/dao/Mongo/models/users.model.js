import mongoose from "mongoose";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
  first_name: {type: String},
  last_name: {type: String},
  email: { type: String, unique: true, require: true, index:true },
});

export const userModel = mongoose.model(usersCollection, usersSchema);
