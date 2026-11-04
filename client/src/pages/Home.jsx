import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mic, Square, Loader2, CheckCircle2, ArrowRight, AlertCircle,
  Sparkles, Zap,
  Zap as BoltIcon, Droplets, Building2, Wifi, BookOpen, Wrench,
  MessageSquare, Calendar, Bell, TrendingUp, Clock,
} from "lucide-react";
import { createComplaint, classifyIntent, createReminder, getTimetable, getCampusEvents, getReminders, getChatHistory, saveChatHistory } from "../services/api";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

/* ── Intent Options ─────────────────────────────────────── */
const INTENT_OPTIONS = [
  {
    intent: "complaint",
    icon: <MessageSquare size={18} />,
    label: "Report Issue",
    color: "#EF4444",
    bg: "#FEF2F2",
    examples: [
      "The Wi-Fi is not working in my hostel",
      "No electricity in Block C since morning",
      "Water supply issue in the cafeteria",
      "Broken AC in Room 305",
    ],
    placeholder: "Describe your campus issue...",
    categories: [
      { label: "Electricity", icon: <BoltIcon size={13} /> },
      { label: "Water", icon: <Droplets size={13} /> },
      { label: "Hostel", icon: <Building2 size={13} /> },
      { label: "Wi-Fi", icon: <Wifi size={13} /> },
      { label: "Classroom", icon: <BookOpen size={13} /> },
      { label: "Maintenance", icon: <Wrench size={13} /> },
    ],
  },
  {
    intent: "reminder",
    icon: <Bell size={18} />,
    label: "Set Reminder",
    color: "#F59E0B",
    bg: "#FFFBEB",
    examples: [
      "Remind me to submit assignment tomorrow",
      "Meeting with professor at 3 PM",
      "Library book return by Friday",
      "Project deadline next Monday",
    ],
    placeholder: "What do you want to be reminded about?",
    quickTimes: ["Tomorrow 9 AM", "This Evening", "Next Monday", "Custom"],
  },
  {
    intent: "timetable",
    icon: <Calendar size={18} />,
    label: "Check Timetable",
    color: "#3B82F6",
    bg: "#EFF6FF",
    examples: [
      "What is my next class?",
      "Show me today's schedule",
      "Do I have any classes tomorrow?",
      "When is my AI/ML Workshop?",
    ],
    placeholder: "Ask about your classes...",
    quickQueries: ["Next Class", "Today's Classes", "Tomorrow", "Full Week"],
  },
  {
    intent: "events",
    icon: <TrendingUp size={18} />,
    label: "Campus Events",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    examples: [
      "Show me upcoming college events",
      "What's happening this week?",
      "Any tech events coming up?",
      "Cultural activities this month",
    ],
    placeholder: "Ask about campus events...",
    quickFilters: ["All Events", "This Week", "Technical", "Cultural"],
  },
];

const PRIORITY_BADGE = { High: "badge-high", Medium: "badge-medium", Low: "badge-low" };

export default function Home() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [hasActiveReminder, setHasActiveReminder] = useState(false);
  const recognition = useRef(null);

  useEffect(() => {
    checkActiveReminders();
    loadRecentHistory();
  }, []);

  const loadRecentHistory = async () => {
    try {
      const clearedAt = Number(localStorage.getItem("campuscare-recent-chat-cleared-at") || 0);
      const entries = await getChatHistory(10);
      setHistory(entries.filter((entry) => new Date(entry.timestamp).getTime() > clearedAt));
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  const checkActiveReminders = async () => {
    try {
      const reminders = await getReminders();
      setHasActiveReminder(reminders.length > 0);
    } catch (err) {
      console.error("Failed to check reminders:", err);
    }
  };

  /* ── Voice ── */
  const toggleListening = () => {
    setError("");
    if (!SpeechRecognition) {
      setError("Speech recognition is not available. Please type your command below.");
      return;
    }
    if (listening) { recognition.current?.stop(); return; }
    const r = new SpeechRecognition();
    r.continuous     = false;
    r.interimResults = true;
    r.lang           = "en-IN";
    r.onresult = (e) => setText(Array.from(e.results).map((x) => x[0].transcript).join(""));
    r.onerror  = () => { setListening(false); setError("Could not capture audio. Please check your microphone permissions."); };
    r.onend    = () => setListening(false);
    recognition.current = r;
    r.start();
    setListening(true);
  };

  const speak = (message) => {
    if (window.speechSynthesis) {
      const utt = new SpeechSynthesisUtterance(message);
      utt.rate = 0.92;
      window.speechSynthesis.speak(utt);
    }
  };

  /* ── Execute based on detected intent ── */
  const executeIntent = async (intent, extractedData) => {
    switch (intent) {
      case "CREATE_COMPLAINT": {
        const res = await createComplaint(extractedData.description || text.trim());
        const message = `Complaint registered successfully. Your ticket ID is ${res.complaint.ticketId}.`;
        speak(message);
        return {
          type: "complaint",
          data: res.complaint,
          message,
        };
      }

      case "CREATE_REMINDER": {
        if (hasActiveReminder) {
          throw new Error("You already have an active reminder. Please delete it from your dashboard before creating a new one.");
        }
        const res = await createReminder(
          extractedData.text || text.trim(),
          extractedData.datetime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        );
        const message = "Reminder created successfully.";
        speak(message);
        setHasActiveReminder(true);
        return {
          type: "reminder",
          data: res.reminder,
          message,
        };
      }

      case "GET_TIMETABLE": {
        const res = await getTimetable();
        const input = text.trim();
        let message;
        
        const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const lowerInput = input.toLowerCase();
        let targetDay = null;
        
        for (const day of daysOfWeek) {
          if (lowerInput.includes(day)) {
            targetDay = day.charAt(0).toUpperCase() + day.slice(1);
            break;
          }
        }
        
        const subjectKeywords = [
          "data structure", "database", "operating system", "computer network",
          "software engineering", "ai", "ml", "artificial intelligence", "machine learning",
          "web development", "cloud computing", "cybersecurity", "mobile app",
          "theory of computation", "seminar"
        ];
        
        let targetSubject = null;
        for (const keyword of subjectKeywords) {
          if (lowerInput.includes(keyword)) {
            const matchingClasses = res.timetable.filter(c => 
              c.subject.toLowerCase().includes(keyword) || 
              c.type.toLowerCase().includes(keyword)
            );
            if (matchingClasses.length > 0) {
              targetSubject = matchingClasses[0].subject;
              break;
            }
          }
        }
        
        if (targetSubject) {
          const subjectClasses = res.timetable.filter(c => c.subject === targetSubject);
          const days = [...new Set(subjectClasses.map(c => c.day))];
          
          if (subjectClasses.length === 0) {
            message = `You don't have ${targetSubject} classes this week.`;
          } else if (subjectClasses.length === 1) {
            message = `You have ${targetSubject} on ${days[0]} at ${subjectClasses[0].time} in ${subjectClasses[0].room}.`;
          } else {
            message = `You have ${targetSubject} classes on ${days.join(", ")}. Total ${subjectClasses.length} classes this week.`;
          }
          speak(message);
          return {
            type: "timetable",
            data: { ...res, targetSubject, subjectClasses },
            message,
          };
        }
        
        if (targetDay === "Sunday") {
          message = "Sunday is a holiday. You have no classes on Sunday.";
          speak(message);
          return {
            type: "timetable",
            data: { ...res, targetDay: "Sunday", isHoliday: true },
            message,
          };
        }
        
        const timeMatch = lowerInput.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
        let targetTime = null;
        
        if (timeMatch) {
          let hour = parseInt(timeMatch[1]);
          const minute = timeMatch[2] || "00";
          const period = timeMatch[3].toUpperCase();
          
          if (period === "PM" && hour !== 12) hour += 12;
          if (period === "AM" && hour === 12) hour = 0;
          
          targetTime = `${hour.toString().padStart(2, '0')}:${minute}`;
        }
        
        if (targetDay) {
          const dayClasses = res.timetable.filter(c => c.day === targetDay);
          if (dayClasses.length === 0) {
            message = `You have no classes on ${targetDay}.`;
          } else if (timeMatch && targetTime) {
            const classAtTime = dayClasses.find(c => {
              const classHour = c.time.includes("PM") && !c.time.startsWith("12") 
                ? parseInt(c.time.split(":")[0]) + 12 
                : parseInt(c.time.split(":")[0]);
              const classTimeStr = `${classHour.toString().padStart(2, '0')}:00`;
              return classTimeStr === targetTime;
            });
            
            if (classAtTime) {
              message = `On ${targetDay} at ${classAtTime.time}, you have ${classAtTime.subject} in ${classAtTime.room}.`;
            } else {
              message = `You don't have any class on ${targetDay} at that time.`;
            }
          } else {
            message = `On ${targetDay}, you have ${dayClasses.length} classes: ${dayClasses.map(c => c.subject).join(", ")}.`;
          }
          speak(message);
          return {
            type: "timetable",
            data: { ...res, targetDay, dayClasses },
            message,
          };
        }
        
        if (res.nextClass) {
          message = `Your next class is ${res.nextClass.subject} at ${res.nextClass.time} in ${res.nextClass.room}.`;
        } else if (res.todayClasses.length > 0) {
          message = `You have ${res.todayClasses.length} classes today.`;
        } else {
          message = "You have no classes scheduled for today.";
        }
        speak(message);
        return {
          type: "timetable",
          data: res,
          message,
        };
      }

      case "GET_CAMPUS_EVENTS": {
        const res = await getCampusEvents();
        const lowerInput = text.trim().toLowerCase();
        
        const eventTypes = ["technical", "cultural", "career", "sports", "networking", "workshop", "social", "wellness", "literary"];
        let targetType = null;
        
        for (const type of eventTypes) {
          if (lowerInput.includes(type)) {
            targetType = type.charAt(0).toUpperCase() + type.slice(1);
            break;
          }
        }
        
        let filteredEvents = res.events;
        let message;
        
        if (targetType) {
          filteredEvents = res.events.filter(e => e.type === targetType);
          if (filteredEvents.length === 0) {
            message = `There are no ${targetType} events scheduled at the moment.`;
          } else if (filteredEvents.length === 1) {
            message = `There is 1 ${targetType} event: ${filteredEvents[0].title} on ${new Date(filteredEvents[0].date).toLocaleDateString("en-IN")}.`;
          } else {
            message = `There are ${filteredEvents.length} ${targetType} events. The next one is ${filteredEvents[0].title} on ${new Date(filteredEvents[0].date).toLocaleDateString("en-IN")}.`;
          }
        } else {
          const count = res.events.length;
          message = count > 0
            ? `There are ${count} upcoming campus events. The next one is ${res.events[0].title}.`
            : "There are no upcoming campus events.";
        }
        
        speak(message);
        return {
          type: "events",
          data: { ...res, events: filteredEvents, targetType },
          message,
        };
      }

      default:
        throw new Error("I couldn't understand that. Please try rephrasing your request.");
    }
  };

  /* ── Submit ── */
  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) { setError("Please speak or type your request."); return; }
    
    const userQuery = text.trim();
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const classification = await classifyIntent(userQuery);
      const executionResult = await executeIntent(classification.intent, classification.extractedData);
      
      const newEntry = {
        id: Date.now(),
        query: userQuery,
        classification,
        execution: executionResult,
        timestamp: new Date().toISOString(),
      };
      
      const savedEntry = await saveChatHistory({
        query: newEntry.query,
        classification: newEntry.classification,
        execution: newEntry.execution,
      });
      setHistory((prev) => [savedEntry.entry, ...prev].slice(0, 10));
      setResult({
        classification,
        execution: executionResult,
      });
      
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const pickCategory = (label) => {
    const base = label === "Wi-Fi" ? "Internet" : label;
    setText((prev) => prev || `Issue with ${base.toLowerCase()} on campus.`);
  };

  const useExample = (example) => {
    setText(example);
  };

  return (
    <div className="fade-up mx-auto max-w-[720px] space-y-6">

      
      <div className="pt-2 text-center">
        <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-cc-text sm:text-[2.5rem]">
          Your Campus,{" "}
          <span style={{ color: "#247C78" }}>Your Voice.</span>
        </h1>
        <p className="mx-auto mt-2.5 max-w-lg text-sm leading-relaxed text-cc-muted">
          Just speak or type naturally — report issues, set reminders, check your timetable, and discover events.
        </p>
      </div>

      
      <form onSubmit={submit} className="card-section">
        
        <div
          className="relative flex flex-col items-center overflow-hidden px-6 py-11 text-center"
          style={{ background: "#142D3A" }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 110%, rgba(36,124,120,0.25) 0%, transparent 65%)",
            }}
          />

          {listening && (
            <>
              <span
                className="mic-ring absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{ borderColor: "rgba(220,236,232,0.25)" }}
              />
              <span
                className="mic-ring-2 absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{ borderColor: "rgba(220,236,232,0.12)" }}
              />
            </>
          )}

          <button
            type="button"
            onClick={toggleListening}
            aria-label={listening ? "Stop recording" : "Start voice input"}
            className="relative z-10 flex h-[84px] w-[84px] items-center justify-center rounded-full text-white transition-all duration-200 focus:outline-none"
            style={
              listening
                ? { background: "#c0392b", border: "3px solid rgba(255,100,100,0.5)", boxShadow: "0 0 24px rgba(192,57,43,0.45)", transform: "scale(1.08)" }
                : { background: "rgba(36,124,120,0.25)", border: "3px solid rgba(220,236,232,0.3)", boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }
            }
          >
            {listening ? <Square size={26} fill="currentColor" /> : <Mic size={30} strokeWidth={1.75} />}
          </button>

          <p className="relative z-10 mt-4 text-sm font-semibold" style={{ color: "#DCECE8" }}>
            {listening ? "Listening… speak now" : "Tap the microphone to speak"}
          </p>
          {listening && (
            <p className="relative z-10 mt-1 text-xs" style={{ color: "rgba(220,236,232,0.6)" }}>
              Tap again to stop
            </p>
          )}
        </div>

        
        <div className="space-y-4 p-6">

          
          <div>
            <p className="field-label">Try these examples</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {INTENT_OPTIONS.map((opt) => (
                <div key={opt.intent}>
                  {opt.examples.slice(0, 1).map((example, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => useExample(example)}
                      className="flex w-full items-start gap-2.5 rounded-lg border border-cc-border bg-cc-bg px-3 py-2.5 text-left text-xs transition-all hover:border-teal/30 hover:bg-cc-card"
                    >
                      <div
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded"
                        style={{ background: opt.bg, color: opt.color }}
                      >
                        {opt.icon}
                      </div>
                      <p className="flex-1 text-cc-muted">"{example}"</p>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          
          <div>
            <label className="field-label" htmlFor="input">
              Your command
            </label>
            <textarea
              id="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="Type or speak: Report an issue, set a reminder, check classes, or ask about events..."
              className="input-field resize-none"
            />
          </div>

          
          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          
          <button
            type="submit"
            disabled={submitting}
            className="btn-navy w-full py-2.5"
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Processing…</>
            ) : (
              <><Sparkles size={15} /> Process Command</>
            )}
          </button>
        </div>
      </form>

      
      {result && (
        <div className="fade-up space-y-4">
          
          <div className="card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-cc-text">Intent Detected</p>
              <span className="badge" style={{ background: "#EEF6F5", color: "#247C78", border: "1px solid #DCECE8" }}>
                {result.classification.intent.replace(/_/g, " ")}
              </span>
            </div>
            <p className="mt-1 text-xs text-cc-muted">
              Confidence: {Math.round(result.classification.confidence * 100)}%
            </p>
          </div>
          
          
          <ResultCard result={result.execution} />
        </div>
      )}

      
      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-cc-text">Chat History</h2>
            <button
              onClick={() => {
                localStorage.setItem("campuscare-recent-chat-cleared-at", String(Date.now()));
                setHistory([]);
              }}
              className="text-xs text-cc-muted hover:text-red-600"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-3">
            {history.map((entry) => (
              <div key={entry.id} className="card-section">
                <div className="border-b border-cc-border bg-cc-bg px-5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-cc-text">You asked:</p>
                      <p className="mt-1 text-sm text-cc-muted">"{entry.query}"</p>
                    </div>
                    <span className="text-[10px] text-cc-muted">
                      {new Date(entry.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles size={14} className="text-teal" />
                    <p className="text-xs font-semibold text-cc-text">AI Response:</p>
                    <span className="badge" style={{ background: "#EEF6F5", color: "#247C78" }}>
                      {entry.classification.intent.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-sm text-cc-text">{entry.execution.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}


/* ── Result Card Component ──────────────────────────────────────── */

function ResultCard({ result }) {
  if (result.type === "complaint") {
    return (
      <div className="fade-up card-section">
        <div
          className="flex items-center gap-3 border-b border-cc-border px-6 py-4"
          style={{ background: "#F0F7F6" }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "#DCECE8" }}>
            <CheckCircle2 size={16} style={{ color: "#1B625F" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-cc-text">Complaint Registered</p>
            <p className="text-xs text-cc-muted">{result.message}</p>
          </div>
          <Link to="/dashboard" className="btn-secondary py-1.5 text-xs">
            View <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-cc-border sm:grid-cols-4">
          <InfoCell label="Ticket ID" value={result.data.ticketId} mono />
          <InfoCell label="Category" value={result.data.category} />
          <InfoCell label="Priority" value={result.data.priority} />
          <InfoCell label="Status" value={result.data.status} />
        </div>
        <div className="border-t border-cc-border bg-cc-bg px-6 py-3">
          <p className="text-xs text-cc-muted">
            <span className="font-semibold text-cc-text">{result.data.title}</span>
          </p>
        </div>
      </div>
    );
  }

  if (result.type === "timetable") {
    return (
      <div className="fade-up card-section">
        <div className="border-b border-cc-border px-6 py-4" style={{ background: "#F0F7F6" }}>
          <p className="text-sm font-semibold text-cc-text">Your Timetable</p>
          <p className="text-xs text-cc-muted">{result.message}</p>
        </div>
        
        {result.data.isHoliday && (
          <div className="px-6 py-8 text-center">
            <p className="text-4xl mb-3">🌴</p>
            <p className="text-base font-semibold text-cc-text">Sunday is a Holiday!</p>
            <p className="mt-1 text-sm text-cc-muted">Enjoy your day off</p>
          </div>
        )}
        
        {result.data.targetSubject && result.data.subjectClasses && result.data.subjectClasses.length > 0 && (
          <div className="space-y-2 p-6">
            <p className="text-sm font-semibold text-cc-text mb-3">{result.data.targetSubject} Classes</p>
            {result.data.subjectClasses.map((cls, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-cc-border bg-cc-bg px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-cc-text">{cls.day}</p>
                  <p className="text-xs text-cc-muted">
                    {cls.room} • {cls.type} {cls.professor && `• ${cls.professor}`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-cc-muted">
                  <Clock size={12} />
                  {cls.time}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {result.data.targetDay && result.data.dayClasses && result.data.dayClasses.length > 0 && (
          <div className="space-y-2 p-6">
            <p className="text-sm font-semibold text-cc-text mb-3">{result.data.targetDay}'s Classes</p>
            {result.data.dayClasses.map((cls, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-cc-border bg-cc-bg px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-cc-text">{cls.subject}</p>
                  <p className="text-xs text-cc-muted">
                    {cls.room} • {cls.type} {cls.professor && `• ${cls.professor}`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-cc-muted">
                  <Clock size={12} />
                  {cls.time}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!result.data.targetDay && !result.data.isHoliday && !result.data.targetSubject && (
          <>
            {result.data.nextClass && (
              <div className="border-b border-cc-border bg-blue-50 px-6 py-3">
                <p className="text-xs font-semibold text-blue-900">🎯 Next Class</p>
                <p className="mt-1 text-sm text-blue-800">
                  {result.data.nextClass.subject} • {result.data.nextClass.time} • {result.data.nextClass.room}
                </p>
                {result.data.nextClass.professor && (
                  <p className="mt-0.5 text-xs text-blue-700">{result.data.nextClass.professor}</p>
                )}
              </div>
            )}
            <div className="space-y-2 p-6">
              {result.data.todayClasses && result.data.todayClasses.length > 0 ? (
                result.data.todayClasses.slice(0, 4).map((cls, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-cc-border bg-cc-bg px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-cc-text">{cls.subject}</p>
                      <p className="text-xs text-cc-muted">
                        {cls.room} • {cls.type} {cls.professor && `• ${cls.professor}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-cc-muted">
                      <Clock size={12} />
                      {cls.time}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-cc-muted">No classes today</p>
              )}
            </div>
          </>
        )}
        
        <div className="border-t border-cc-border px-6 py-3 text-center">
          <Link to="/timetable" className="text-xs text-teal hover:underline">
            View Full Week Schedule →
          </Link>
        </div>
      </div>
    );
  }

  if (result.type === "reminder") {
    return (
      <div className="fade-up card-section">
        <div
          className="flex items-center gap-3 border-b border-cc-border px-6 py-4"
          style={{ background: "#F0F7F6" }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "#DCECE8" }}>
            <Bell size={16} style={{ color: "#1B625F" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-cc-text">Reminder Created</p>
            <p className="text-xs text-cc-muted">{result.message}</p>
          </div>
          <Link to="/dashboard" className="btn-secondary py-1.5 text-xs">
            View <ArrowRight size={12} />
          </Link>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-cc-text">{result.data.text}</p>
          <p className="mt-1 text-xs text-cc-muted">
            {new Date(result.data.datetime).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    );
  }

  if (result.type === "events") {
    return (
      <div className="fade-up card-section">
        <div className="border-b border-cc-border px-6 py-4" style={{ background: "#F0F7F6" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-cc-text">Campus Events</p>
              <p className="text-xs text-cc-muted">{result.message}</p>
            </div>
            {result.data.targetType && (
              <span
                className="badge"
                style={{ background: "#F0F7F6", color: "#247C78", border: "1px solid #DCECE8" }}
              >
                {result.data.targetType}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-2 p-6">
          {result.data.events && result.data.events.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="rounded-lg border border-cc-border bg-cc-bg px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-cc-text">{event.title}</p>
                  <p className="mt-0.5 text-xs text-cc-muted line-clamp-1">{event.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-cc-muted">
                    <span>📅 {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    <span>•</span>
                    <span>🕐 {event.time}</span>
                    <span>•</span>
                    <span>📍 {event.venue}</span>
                  </div>
                </div>
                <span
                  className="badge shrink-0"
                  style={{ background: "#F0F7F6", color: "#247C78", border: "1px solid #DCECE8" }}
                >
                  {event.type}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-cc-border px-6 py-3 text-center">
          <Link to="/events" className="text-xs text-teal hover:underline">
            View All Events →
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

function InfoCell({ label, value, mono }) {
  return (
    <div className="bg-cc-card px-5 py-3.5">
      <p className="field-label">{label}</p>
      <p className={`text-sm font-semibold text-cc-text ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
