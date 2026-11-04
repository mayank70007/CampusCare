import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  text: { type: String, required: true },
  datetime: { type: Date, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Reminder", reminderSchema);
