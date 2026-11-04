import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database.js";
import complaintRoutes from "./routes/complaints.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/complaints", complaintRoutes);

const port = process.env.PORT || 5000;
await connectDatabase();
app.listen(port);
