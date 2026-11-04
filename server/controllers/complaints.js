import Complaint from "../models/Complaint.js";
import Reminder from "../models/Reminder.js";

const categories = ["Electricity", "Water", "Hostel", "Internet", "Cleanliness", "Maintenance", "Other"];
const priorities = ["Low", "Medium", "High"];

const DEMO_TIMETABLE = [
  { day: "Monday", subject: "Data Structures", time: "09:00 AM", room: "Room 101", type: "Lecture", professor: "Dr. Sharma" },
  { day: "Monday", subject: "Database Systems", time: "11:00 AM", room: "Room 205", type: "Lecture", professor: "Prof. Gupta" },
  { day: "Monday", subject: "Database Lab", time: "02:00 PM", room: "Lab 3", type: "Lab", professor: "Mr. Patel" },
  
  { day: "Tuesday", subject: "Operating Systems", time: "09:00 AM", room: "Room 303", type: "Lecture", professor: "Dr. Verma" },
  { day: "Tuesday", subject: "Computer Networks", time: "11:00 AM", room: "Room 102", type: "Lecture", professor: "Prof. Singh" },
  { day: "Tuesday", subject: "Web Development Lab", time: "02:00 PM", room: "Lab 1", type: "Lab", professor: "Ms. Reddy" },
  
  { day: "Wednesday", subject: "Software Engineering", time: "09:00 AM", room: "Room 201", type: "Lecture", professor: "Dr. Kumar" },
  { day: "Wednesday", subject: "Computer Networks Lab", time: "11:00 AM", room: "Lab 2", type: "Lab", professor: "Mr. Joshi" },
  { day: "Wednesday", subject: "AI/ML Workshop", time: "02:00 PM", room: "Seminar Hall", type: "Workshop", professor: "Dr. Mehta" },
  
  { day: "Thursday", subject: "Data Structures Lab", time: "09:00 AM", room: "Lab 4", type: "Lab", professor: "Mr. Desai" },
  { day: "Thursday", subject: "Theory of Computation", time: "11:00 AM", room: "Room 105", type: "Lecture", professor: "Prof. Rao" },
  { day: "Thursday", subject: "Cloud Computing", time: "02:00 PM", room: "Room 301", type: "Lecture", professor: "Dr. Iyer" },
  
  { day: "Friday", subject: "Cybersecurity", time: "09:00 AM", room: "Room 203", type: "Lecture", professor: "Prof. Nair" },
  { day: "Friday", subject: "Mobile App Development", time: "11:00 AM", room: "Lab 5", type: "Lab", professor: "Ms. Shah" },
  { day: "Friday", subject: "Project Work", time: "02:00 PM", room: "Lab 1", type: "Project", professor: "Team Mentors" },
  
  { day: "Saturday", subject: "Seminar Series", time: "10:00 AM", room: "Auditorium", type: "Seminar", professor: "Guest Speakers" },
];

const DEMO_CAMPUS_EVENTS = [
  { 
    id: "1", 
    title: "Tech Fest 2026 - Code Summit", 
    date: "2026-11-15", 
    time: "10:00 AM", 
    venue: "Main Auditorium", 
    type: "Technical", 
    description: "3-day technology festival with coding competitions, tech talks, and workshops on AI, blockchain, and web3",
    organizer: "Tech Club"
  },
  { 
    id: "2", 
    title: "Freshers' Welcome Party", 
    date: "2026-11-08", 
    time: "06:00 PM", 
    venue: "Open Air Theater", 
    type: "Cultural", 
    description: "Grand welcome event for first-year students with live music, dance performances, and DJ night",
    organizer: "Student Council"
  },
  { 
    id: "3", 
    title: "Cultural Night - Rangmanch 2026", 
    date: "2026-11-18", 
    time: "06:00 PM", 
    venue: "Open Air Theater", 
    type: "Cultural", 
    description: "Evening of music, dance, drama, and stand-up comedy featuring talented students",
    organizer: "Cultural Committee"
  },
  { 
    id: "4", 
    title: "Career Fair & Placement Drive", 
    date: "2026-11-22", 
    time: "09:00 AM", 
    venue: "Convention Center", 
    type: "Career", 
    description: "Meet recruiters from 50+ top companies including Google, Microsoft, Amazon, and startups",
    organizer: "Training & Placement Cell"
  },
  { 
    id: "5", 
    title: "Annual Sports Day", 
    date: "2026-11-25", 
    time: "07:00 AM", 
    venue: "Sports Ground", 
    type: "Sports", 
    description: "Inter-department sports competitions: cricket, football, basketball, athletics, and more",
    organizer: "Sports Committee"
  },
  { 
    id: "6", 
    title: "Alumni Meet 2026", 
    date: "2026-11-28", 
    time: "05:00 PM", 
    venue: "Conference Hall", 
    type: "Networking", 
    description: "Connect with successful alumni, hear their stories, and build your professional network",
    organizer: "Alumni Association"
  },
  { 
    id: "7", 
    title: "Startup Bootcamp", 
    date: "2026-11-12", 
    time: "10:00 AM", 
    venue: "Innovation Center", 
    type: "Workshop", 
    description: "3-day intensive bootcamp on entrepreneurship, pitching, and building your startup from scratch",
    organizer: "E-Cell"
  },
  { 
    id: "8", 
    title: "Blood Donation Camp", 
    date: "2026-11-20", 
    time: "09:00 AM", 
    venue: "Medical Center", 
    type: "Social", 
    description: "Annual blood donation drive in partnership with City Blood Bank. Save lives, donate blood!",
    organizer: "NSS Unit"
  },
  { 
    id: "9", 
    title: "Photography Exhibition", 
    date: "2026-11-14", 
    time: "11:00 AM", 
    venue: "Art Gallery", 
    type: "Cultural", 
    description: "Showcase of stunning photographs by student photographers. Theme: 'Campus Through My Lens'",
    organizer: "Photography Club"
  },
  { 
    id: "10", 
    title: "Robotics Competition - RoboWars", 
    date: "2026-11-27", 
    time: "02:00 PM", 
    venue: "Engineering Block", 
    type: "Technical", 
    description: "Build and battle! Teams compete with their custom-built robots in an epic showdown",
    organizer: "Robotics Society"
  },
  { 
    id: "11", 
    title: "Mental Health Awareness Week", 
    date: "2026-11-10", 
    time: "03:00 PM", 
    venue: "Student Center", 
    type: "Wellness", 
    description: "Week-long awareness sessions, yoga classes, meditation workshops, and counseling sessions",
    organizer: "Wellness Committee"
  },
  { 
    id: "12", 
    title: "CodeStorm - 24 Hour Coding Marathon", 
    date: "2026-11-16", 
    time: "09:00 AM", 
    venue: "Computer Labs", 
    type: "Technical", 
    description: "24-hour coding marathon to build innovative solutions. Cash prizes worth ₹2 lakhs!",
    organizer: "ACM Student Chapter"
  },
  { 
    id: "13", 
    title: "Fashion Show - Runway Ramp", 
    date: "2026-11-21", 
    time: "07:00 PM", 
    venue: "Main Auditorium", 
    type: "Cultural", 
    description: "Glamorous evening showcasing student designers' collections and modeling talent",
    organizer: "Fashion Society"
  },
  { 
    id: "14", 
    title: "Literary Fest - WordPlay", 
    date: "2026-11-13", 
    time: "10:00 AM", 
    venue: "Library Lawn", 
    type: "Literary", 
    description: "Poetry slams, creative writing workshops, book discussions, and author meet & greet",
    organizer: "Literary Club"
  },
  { 
    id: "15", 
    title: "Environmental Drive - Green Campus", 
    date: "2026-11-09", 
    time: "08:00 AM", 
    venue: "Campus Wide", 
    type: "Social", 
    description: "Tree plantation drive, campus cleanup, and sustainability workshop. Let's go green!",
    organizer: "Eco Club"
  },
];

function normalizeAI(value, input) {
  const category = categories.includes(value.category) ? value.category : "Other";
  const priority = priorities.includes(value.priority) ? value.priority : "Medium";
  return {
    title: String(value.title || "Campus complaint").slice(0, 120),
    description: String(value.description || input).slice(0, 2000),
    category, priority,
    summary: String(value.summary || input).slice(0, 240)
  };
}
async function callGemini(prompt, model, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
        }),
      }
    );
    if (response.status === 429) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, attempt * 2000));
        continue;
      }
      throw new Error("The AI service is busy right now. Please wait a moment and try again.");
    }
    if (!response.ok) throw new Error(`AI service error (${response.status}). Please try again.`);
    const payload = await response.json();
    const raw = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("AI service returned an empty response.");
    return raw;
  }
}

function parseReminderDate(value) {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value !== "string") return null;

  const input = value.trim();
  const timeOnly = input.match(/^(\d{1,2}):(\d{2})$/);
  if (timeOnly) {
    const hours = Number(timeOnly[1]);
    const minutes = Number(timeOnly[2]);
    if (hours > 23 || minutes > 59) return null;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    if (date <= new Date()) date.setDate(date.getDate() + 1);
    return date;
  }

  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function understandComplaint(input) {
  if (!process.env.GEMINI_API_KEY) {
    return normalizeAI({ title: "Campus complaint", description: input, category: "Other", priority: "Medium", summary: input }, input);
  }
  const prompt = `Classify this campus complaint. Return JSON only with exactly these string keys: title, description, category, priority, summary. category must be one of ${categories.join(", ")}. priority must be one of Low, Medium, High. Complaint: ${input}`;
  const models = [process.env.GEMINI_MODEL || "gemini-3.5-flash-lite", "gemini-3.5-flash"];
  let lastError;
  for (const model of models) {
    try {
      const raw = await callGemini(prompt, model);
      return normalizeAI(JSON.parse(raw), input);
    } catch (err) {
      lastError = err;
      if (!err.message.includes("busy") && !err.message.includes("503") && !err.message.includes("500")) break;
    }
  }
  throw lastError;
}
function ticketId() { return `VG${Date.now().toString().slice(-6)}`; }

export async function createComplaint(req, res) {
  const input = typeof req.body.description === "string" ? req.body.description.trim() : "";
  if (!input) return res.status(400).json({ message: "Complaint description is required." });
  if (input.length > 2000) return res.status(400).json({ message: "Complaint must be 2000 characters or fewer." });
  try {
    const understood = await understandComplaint(input);
    const complaintData = { ...understood, ticketId: ticketId(), status: "Open" };
    const saved = await Complaint.create(complaintData);
    return res.status(201).json({ complaint: saved });
  } catch (error) { 
    return res.status(502).json({ message: error.message || "Could not register complaint." }); 
  }
}
export async function listComplaints(req, res) { 
  try { 
    const items = await Complaint.find().sort({ createdAt: -1 }); 
    res.json(items); 
  } catch (error) { 
    res.status(500).json({ message: "Could not load complaints." }); 
  } 
}

export async function getComplaint(req, res) { 
  try { 
    const item = await Complaint.findById(req.params.id); 
    if (!item) return res.status(404).json({ message: "Complaint not found." }); 
    res.json(item); 
  } catch (error) { 
    res.status(404).json({ message: "Complaint not found." }); 
  } 
}

export async function classifyIntent(req, res) {
  const input = typeof req.body.text === "string" ? req.body.text.trim() : "";
  if (!input) return res.status(400).json({ message: "Voice command text is required." });
  
  const validIntents = ["CREATE_COMPLAINT", "GET_TIMETABLE", "CREATE_REMINDER", "GET_CAMPUS_EVENTS", "UNKNOWN"];
  
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ 
        intent: "UNKNOWN", 
        confidence: 0,
        extractedData: {},
        message: "AI service not configured. Please set GEMINI_API_KEY." 
      });
    }
    
    const prompt = `You are a voice assistant for a college campus. Classify the user's voice command into one of these intents:
- CREATE_COMPLAINT: User wants to report a campus issue (infrastructure, facilities, etc.)
- GET_TIMETABLE: User asks about their class schedule, next class, or timetable
- CREATE_REMINDER: User wants to set a reminder for something
- GET_CAMPUS_EVENTS: User asks about upcoming events, activities, or happenings on campus
- UNKNOWN: Cannot determine intent

Return JSON with these exact keys:
- intent: one of the intents above
- confidence: number 0-1
- extractedData: object with relevant extracted info based on intent

For CREATE_COMPLAINT, extract: { description: "the complaint text" }
For GET_TIMETABLE, extract: { query: "what they asked about timetable" }
For CREATE_REMINDER, extract: { text: "reminder text", datetime: "when to remind (parse to ISO format if possible)" }
For GET_CAMPUS_EVENTS, extract: { query: "what they asked about events" }

Voice command: "${input}"

Return ONLY valid JSON, no other text.`;

    const models = [process.env.GEMINI_MODEL || "gemini-3.5-flash-lite", "gemini-3.5-flash"];
    let lastError;
    
    for (const model of models) {
      try {
        const raw = await callGemini(prompt, model);
        const result = JSON.parse(raw);
        
        if (!validIntents.includes(result.intent)) {
          result.intent = "UNKNOWN";
        }
        
        return res.json(result);
      } catch (err) {
        lastError = err;
        if (!err.message.includes("busy") && !err.message.includes("503") && !err.message.includes("500")) break;
      }
    }
    
    throw lastError;
  } catch (error) {
    return res.status(502).json({ message: error.message || "Could not classify intent." });
  }
}

export async function createReminder(req, res) {
  const { text, datetime } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "Reminder text is required." });
  }

  const reminderDate = parseReminderDate(datetime);
  if (!reminderDate) {
    return res.status(400).json({
      message: "Reminder date and time must be a valid ISO date or HH:MM time.",
    });
  }

  try {
    const reminder = await Reminder.create({
      text: text.trim().slice(0, 200),
      datetime: reminderDate,
      completed: false
    });
    
    return res.status(201).json({ reminder });
  } catch (error) {
    console.error("Reminder creation error:", error);
    return res.status(500).json({ message: error.message || "Could not create reminder." });
  }
}

export async function listReminders(req, res) {
  try {
    const items = await Reminder.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Could not load reminders." });
  }
}

export async function deleteReminder(req, res) {
  try {
    const result = await Reminder.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Reminder not found." });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Could not delete reminder." });
  }
}

export async function getTimetable(req, res) {
  try {
    const today = new Date();
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
    
    const todayClasses = DEMO_TIMETABLE.filter(c => c.day === dayName);
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    let nextClass = null;
    for (const cls of todayClasses) {
      const timeStr = cls.time.replace(/[AP]M/, '').trim();
      const [hours, minutes] = timeStr.split(':').map(Number);
      const classHour = cls.time.includes('PM') && hours !== 12 ? hours + 12 : hours;
      const classTimeStr = `${classHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      if (classTimeStr > currentTimeStr) {
        nextClass = cls;
        break;
      }
    }
    
    res.json({
      timetable: DEMO_TIMETABLE,
      todayClasses,
      nextClass,
      today: dayName
    });
  } catch (error) {
    res.status(500).json({ message: "Could not load timetable." });
  }
}

export async function getCampusEvents(req, res) {
  try {
    const today = new Date("2026-11-04");
    
    const upcomingEvents = DEMO_CAMPUS_EVENTS.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    });
    
    res.json({
      events: upcomingEvents,
      allEvents: DEMO_CAMPUS_EVENTS
    });
  } catch (error) {
    res.status(500).json({ message: "Could not load campus events." });
  }
}
