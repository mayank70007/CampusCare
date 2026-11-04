# CampusCare

## About the project

I built CampusCare as a campus support assistant for students. My aim was to put common campus-related tasks in one place instead of making students use different systems for complaints, reminders, timetables, and events.

Students can type a request or speak into the microphone. For example, they can report a Wi-Fi problem, ask about their next class, create a reminder, or check upcoming events.

Live frontend: [https://campus-care-ekd1.onrender.com](https://campus-care-ekd1.onrender.com)

Live backend: [https://campuscare-c54l.onrender.com](https://campuscare-c54l.onrender.com)

GitHub: [https://github.com/mayank70007/CampusCare](https://github.com/mayank70007/CampusCare)

## What problem it solves

Students often need to contact different departments or check different sources for simple campus-related tasks. This can take extra time when they only want to report an issue or get a quick answer.

CampusCare provides one straightforward interface for:

- Reporting campus complaints
- Checking complaint ticket details
- Creating and deleting reminders
- Asking about the timetable
- Viewing upcoming campus events
- Reviewing recent and previous assistant conversations

## How it works

The user starts by typing a message or using voice input. The browser converts the voice into text using the Web Speech API. The React frontend then sends the request to the Node.js and Express backend.

The backend sends the request to the Gemini API to identify what the student wants. It then performs the relevant action, such as creating a complaint, setting a reminder, or returning timetable and event information.

Complaints, reminders, and chat history are stored in MongoDB. The result is sent back to the frontend and displayed to the user. For voice interactions, the response can also be read aloud using the browser's speech synthesis feature.

## Application structure

The project has two main parts:

- `client` contains the React, Vite, and Tailwind CSS frontend.
- `server` contains the Express API, Gemini integration, MongoDB connection, routes, controllers, and models.

The frontend has separate pages for the assistant, complaints dashboard, complaint details, timetable, events, and chat history. Shared navigation is handled by a reusable layout component.

The backend keeps routes, controllers, models, and database configuration separate. This made it easier to add features such as chat history without putting all the logic in one file.

## Request flow

1. The student types a request or records a voice command.
2. The frontend sends the text to the intent-classification API.
3. The backend validates the request and asks Gemini to return a structured intent and extracted data.
4. The frontend uses that intent to run the correct feature.
5. The result is displayed in a feature-specific result card.
6. The completed question and response are saved to MongoDB as chat history.

The supported intents are creating a complaint, creating a reminder, checking the timetable, and checking campus events. If a request cannot be classified, the user receives an error instead of a fake successful result.

## Main features

### Voice and text assistant

Students can type naturally or use the microphone. The assistant recognises the request and sends it to the correct feature. The response can also be spoken using the browser's Speech Synthesis API.

### Complaint management

When a student reports an issue, the application creates a complaint ticket. It assigns a category, priority, title, summary, and ticket ID. The complaint can then be viewed from the complaints dashboard along with its current status.

### Reminders

Students can create reminders with a message and date/time. Active reminders are shown in the dashboard and can be deleted when they are no longer needed.

### Timetable and campus events

The assistant can answer questions about today's classes, the next class, a particular day, or a subject. Students can also view the complete timetable and upcoming campus events through the dedicated pages.

### Chat history

The assistant page shows recent conversations so students can quickly review what they just asked. A separate History page shows all conversations saved in MongoDB. Clearing the recent view does not delete the saved history.

## Backend API

The main API endpoints are under `/api/complaints`:

- `POST /classify-intent` classifies a text command using Gemini.
- `POST /` creates a complaint.
- `GET /` lists saved complaints.
- `GET /:id` returns one complaint.
- `POST /reminders` creates a reminder.
- `GET /reminders` lists reminders.
- `DELETE /reminders/:id` deletes a reminder.
- `GET /timetable` returns timetable data and next-class information.
- `GET /events` returns upcoming campus events.
- `POST /history` saves a completed assistant conversation.
- `GET /history` returns saved conversations, with an optional limit for recent chats.

The API checks required input and returns error responses when a request is invalid or an AI or database operation fails.

## Data stored in MongoDB

The application currently uses three MongoDB collections:

- **Complaints:** ticket ID, title, description, category, priority, summary, status, and timestamps.
- **Reminders:** reminder text, date/time, completion state, and timestamps.
- **Chat history:** the user's query, detected classification, assistant result, and timestamps.

The recent-chat list is limited on the assistant page for a cleaner interface. The full history remains available on the History page.

## Technologies used

- React and Vite for the frontend
- Tailwind CSS for styling
- Node.js and Express for the backend
- MongoDB and Mongoose for data storage
- Gemini API for intent and complaint classification
- Web Speech API for voice input
- Speech Synthesis API for spoken responses
- Render for deployment

## My work on the project

I worked on both the frontend and backend. The main work I completed was:

- Built the React pages, navigation, and responsive layout
- Created the voice and text assistant workflow
- Added intent handling for complaints, reminders, timetable questions, and events
- Added complaint categorisation, priority assignment, ticket creation, and status display
- Built the reminder APIs and dashboard functionality
- Created the timetable and campus event pages
- Added MongoDB models and Express routes
- Added MongoDB-backed chat history
- Added the recent-chat view and full History page
- Made clearing recent chats persist after a page refresh
- Configured the application for separate frontend and backend deployment on Render

## Technical decisions

I used React and Vite because they made it easier to build reusable components and develop the frontend quickly.

I separated the backend into routes, controllers, models, and database configuration so each feature is easier to understand and update.

I used MongoDB because the application stores different types of information, such as complaints, reminders, and chat entries. Mongoose provides schemas and validation for this data.

I kept Gemini API calls on the server so the API key is not exposed in the browser. I used the browser's built-in Web Speech API for voice input instead of adding a separate speech service.

## Deployment and configuration

I deployed the frontend and backend as separate Render services. The frontend is a static site from the `client` folder. Its production build is created with `npm run build`, and Render serves the generated `dist` folder.

The backend is a Node.js web service from the `server` folder. It starts with `npm start` and listens on the port provided by Render.

The backend uses these environment variables:

- `GEMINI_API_KEY` for Gemini requests
- `GEMINI_MODEL` for selecting the Gemini model
- `MONGODB_URI` for the MongoDB connection
- `PORT` for local development; Render provides the production port

The frontend uses `VITE_API_URL` to point to the deployed backend. During local development, Vite proxies `/api` requests to `http://localhost:5000`.

## Challenges and how I handled them

### Understanding different ways of asking the same thing

Students can describe the same request in different ways. I used Gemini intent classification to understand the request and map it to one of the supported actions.

### Handling timetable questions

Timetable questions may mention a day, time, subject, or just ask for the next class. I added filtering logic to handle these cases and return a suitable response.

### Separating recent chats from saved history

The recent-chat section should stay short, while the History page should keep all conversations. I saved chats in MongoDB and used a local cleared timestamp so that chats removed from the recent view do not return after a refresh.

### Deploying the frontend and backend separately

Locally, Vite forwards `/api` requests to the local backend. On Render, the frontend and backend are separate services, so I added a `VITE_API_URL` setting for the production frontend.

### Keeping credentials private

I stored the MongoDB connection string and Gemini key in environment variables instead of putting them in the frontend code or repository.

## Testing and verification

During development, I checked the frontend with a production Vite build and verified that the backend API responded successfully. I also tested the history endpoint and the frontend/backend connection after deploying the services separately on Render.

I verified that:

- The frontend production build completes successfully.
- The backend starts and connects to MongoDB.
- Complaints, reminders, events, timetable, and history endpoints respond through the API.
- Recent chats remain hidden after using Clear All and refreshing the assistant page.
- Clearing recent chats does not remove entries from the full History page.

## Current limitations

This is a student project with demo timetable and campus-event data. It does not yet include student login or user-specific accounts, so stored data is not separated by student. Complaint status is displayed from the stored record, but there is no separate student-facing status-update workflow.
