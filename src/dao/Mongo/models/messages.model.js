import mongoose from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
  user: { type: String, index: true },
  message: String,
});

export const messagesModel = mongoose.model(messagesCollection, messagesSchema);
