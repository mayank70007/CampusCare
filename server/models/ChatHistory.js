import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema({
  query: { type: String, required: true, trim: true, maxlength: 2000 },
  classification: { type: mongoose.Schema.Types.Mixed, required: true },
  execution: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

export default mongoose.model("ChatHistory", chatHistorySchema);
