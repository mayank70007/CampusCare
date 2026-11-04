# CampusCare — Voice-First Student Campus Assistant

A smart campus assistant where students can use voice or text to report complaints, check their timetable, set reminders, and discover campus events. Built with AI-powered intent recognition.

---

## Features

- 🎤 **Voice & Text Input** - Natural language processing for commands
- 📝 **Smart Complaints** - AI categorizes and prioritizes issues automatically
- 📅 **Timetable Assistant** - Check your class schedule by day or time
- 🔔 **Reminders** - Set and manage personal reminders
- ✨ **Campus Events** - Browse upcoming events by category
- 📊 **Dashboard** - Track all your complaints and reminders

---

## Architecture

```
Browser (React + Vite)
  ├─ Web Speech API          → speech-to-text (free, built-in)
  ├─ SpeechSynthesis API     → text-to-speech (free, built-in)
  └─ fetch /api/*            → proxied to Express

Server (Node.js + Express)
  ├─ POST /api/complaints              → calls Gemini, saves ticket
  ├─ POST /api/complaints/classify-intent → classifies voice commands
  ├─ POST /api/complaints/reminders    → create reminder
  ├─ GET  /api/complaints/reminders    → list reminders
  ├─ DELETE /api/complaints/reminders/:id → delete reminder
  ├─ GET  /api/complaints/timetable    → timetable data
  ├─ GET  /api/complaints/events       → campus events
  ├─ GET  /api/complaints              → list all complaints
  ├─ GET  /api/complaints/:id          → get single complaint
  └─ PATCH /api/complaints/:id/status  → update status

Persistence
  └─ MongoDB Atlas (set MONGODB_URI in server/.env)

AI
  └─ Gemini 1.5 Flash free tier — server-side only, key never sent to browser
     • Complaint classification
     • Intent detection for voice commands
```

---

## Prerequisites

- Node.js 18 or later
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Google Chrome (best Web Speech API support)

---

## Setup

```bash
# 1. Clone / open the project
# 2. Install all dependencies
npm install
npm run install:all

# 3. Configure environment
copy server\.env.example server\.env
# Open server/.env and set your GEMINI_API_KEY and MONGODB_URI
```

Your `server/.env` should look like:

```
PORT=5000
GEMINI_API_KEY=your_free_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
MONGODB_URI=your_mongodb_connection_string_here
```

---

## Run the project

```bash
# From the project root (starts both React client + Express server)
npm run dev
```

- Frontend → http://localhost:5173
- Backend  → http://localhost:5000

> Always open the app in **Google Chrome**. The Web Speech API has the best support there.

---

## API Reference

### Complaints
| Method | Endpoint | Body / Notes |
|--------|----------|--------------|
| `POST` | `/api/complaints` | `{ "description": "..." }` — AI classifies and creates ticket |
| `GET` | `/api/complaints` | Returns all complaints |
| `GET` | `/api/complaints/:id` | Single complaint by ID |

### Voice Assistant
| Method | Endpoint | Body / Notes |
|--------|----------|--------------|
| `POST` | `/api/complaints/classify-intent` | `{ "text": "voice command" }` — Returns intent classification |

### Reminders
| Method | Endpoint | Body / Notes |
|--------|----------|--------------|
| `POST` | `/api/complaints/reminders` | `{ "text": "...", "datetime": "ISO string" }` — Create reminder |
| `GET` | `/api/complaints/reminders` | Returns array of all reminders |
| `DELETE` | `/api/complaints/reminders/:id` | Delete a reminder |

### Timetable & Events
| Method | Endpoint | Body / Notes |
|--------|----------|--------------|
| `GET` | `/api/complaints/timetable` | Returns timetable with today's classes and next class |
| `GET` | `/api/complaints/events` | Returns campus events |

---

## Project Structure

```
client/
  src/
    components/
      Layout.jsx          Navigation header
    pages/
      Home.jsx            Voice assistant with AI intent detection
      Dashboard.jsx       Complaints list with reminders
      Details.jsx         Single complaint view
      Details.jsx         Single ticket view, resolve button
    services/
      api.js              fetch wrappers for all API calls (complaints, reminders, timetable, events)
    App.jsx               Router setup
    main.jsx
    index.css             Tailwind base + .card / .button-primary utilities

server/
  config/
    database.js           MongoDB connect (graceful fallback to JSON)
  controllers/
    complaints.js         All business logic including:
                          - Complaint creation and Gemini classification
                          - Intent classification for voice commands
                          - Reminder CRUD operations
                          - Timetable and events data
  models/
    Complaint.js          Mongoose schema (ticketId, title, category, priority…)
    Reminder.js           Mongoose schema for reminders
  routes/
    complaints.js         Router wiring for all endpoints
  server.js               Express app entry point
  .env                    Your secrets (gitignored)
  .env.example            Template to copy
```

---

## How it works (detailed)

### Voice Complaint Registration
1. **Voice in**: `Home.jsx` creates a `SpeechRecognition` instance with `lang: "en-IN"`, streams interim results into the textarea as the student speaks.

2. **AI understands**: On submit, the client POSTs only the plain-text description to `/api/complaints`. The server sends a structured prompt to Gemini asking for `title`, `description`, `category`, `priority`, and `summary` as JSON. The response is validated against the allowed category and priority lists.

3. **Real action**: The server generates a `VG` ticket ID (6-digit timestamp suffix), attaches a status of `Open`, and saves to MongoDB or the local JSON file.

4. **Voice out**: The browser calls `window.speechSynthesis.speak(...)` with a confirmation message: *"Your complaint has been successfully registered. Your ticket ID is VGxxxxxx."*

### Voice Assistant Flow
1. **Voice command**: Student speaks or types a natural language command in the Voice Assistant page.

2. **Intent classification**: The command is sent to `/api/complaints/classify-intent` where Gemini analyzes it and returns:
   - Intent type (CREATE_COMPLAINT, GET_TIMETABLE, CREATE_REMINDER, GET_CAMPUS_EVENTS, or UNKNOWN)
   - Confidence score (0-1)
   - Extracted data relevant to the intent

3. **Action execution**: Based on the detected intent:
   - **CREATE_COMPLAINT**: Creates a complaint ticket using the existing complaint flow
   - **GET_TIMETABLE**: Fetches timetable data, identifies next class based on current time
   - **CREATE_REMINDER**: Saves reminder to the database with text and datetime
   - **GET_CAMPUS_EVENTS**: Returns upcoming campus events

4. **Voice response**: The result is spoken back to the user using SpeechSynthesis and displayed on screen.

---

## Fallbacks

| Situation | Behaviour |
|-----------|-----------|
| No `GEMINI_API_KEY` | Ticket still created; category defaults to `Other`, priority to `Medium` |
| No `MONGODB_URI` | Server will not start - MongoDB is required |
| Browser lacks Web Speech API | Error shown; user can type the complaint manually |
| Gemini call fails | HTTP 502 returned with error message; no partial ticket saved |

---



## What is real vs mocked

| Component | Real | Notes |
|-----------|------|-------|
| Voice recognition | ✅ Browser Web Speech API | |
| Voice responses | ✅ Browser SpeechSynthesis | |
| AI classification | ✅ Gemini API (live call) | For both complaints and intents |
| Ticket persistence | ✅ MongoDB Atlas | |
| Complaint dashboard | ✅ Derived from real saved data | |
| Reminders | ✅ MongoDB storage | |
| Timetable | 📌 Sample data | Populated with sample classes |
| Campus events | 📌 Sample data | Populated with sample events |
