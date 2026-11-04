import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, required: true },
  summary: { type: String, required: true },
  status: { type: String, enum: ["Open", "Resolved"], default: "Open" }
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);
