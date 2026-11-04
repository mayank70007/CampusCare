import { Router } from "express";
import { 
  createComplaint, getComplaint, listComplaints,
  classifyIntent, createReminder, listReminders, deleteReminder,
  getTimetable, getCampusEvents
} from "../controllers/complaints.js";

const router = Router();

router.post("/classify-intent", classifyIntent);
router.post("/reminders", createReminder);
router.get("/reminders", listReminders);
router.delete("/reminders/:id", deleteReminder);
router.get("/timetable", getTimetable);
router.get("/events", getCampusEvents);
router.post("/", createComplaint);
router.get("/", listComplaints);
router.get("/:id", getComplaint);

export default router;
