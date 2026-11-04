const request = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(path, { headers: { "Content-Type": "application/json" }, ...options });
  } catch {
    throw new Error("Cannot connect to the API. Start the project with `npm run dev` from the project root, then try again.");
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
