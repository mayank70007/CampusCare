const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "" : "https://campuscare-c54l.onrender.com")
).replace(/\/$/, "");

const request = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch (error) {
    throw new Error(
      error instanceof TypeError
        ? "Cannot connect to the CampusCare backend."
        : error.message
    );
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Something went wrong.");
  return payload;
};

export const createComplaint = (description) =>
  request("/api/complaints", { method: "POST", body: JSON.stringify({ description }) });
export const getComplaints = () => request("/api/complaints");
export const getComplaint = (id) => request(`/api/complaints/${id}`);

export const classifyIntent = (text) =>
  request("/api/complaints/classify-intent", { method: "POST", body: JSON.stringify({ text }) });

export const createReminder = (text, datetime) =>
  request("/api/complaints/reminders", { method: "POST", body: JSON.stringify({ text, datetime }) });
export const getReminders = () => request("/api/complaints/reminders");
export const deleteReminder = (id) =>
  request(`/api/complaints/reminders/${id}`, { method: "DELETE" });

export const getTimetable = () => request("/api/complaints/timetable");

export const getCampusEvents = () => request("/api/complaints/events");

export const saveChatHistory = (entry) =>
  request("/api/complaints/history", { method: "POST", body: JSON.stringify(entry) });
export const getChatHistory = (limit) =>
  request(`/api/complaints/history${limit ? `?limit=${limit}` : ""}`);
