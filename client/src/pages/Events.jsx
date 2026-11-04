import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Calendar, Clock, MapPin, Users, Loader2, AlertCircle } from "lucide-react";
import { getCampusEvents } from "../services/api";

const EVENT_COLORS = {
  Technical: { bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE" },
  Cultural: { bg: "#F5F3FF", color: "#6B21A8", border: "#DDD6FE" },
  Career: { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" },
  Sports: { bg: "#DCFCE7", color: "#166534", border: "#BBF7D0" },
  Networking: { bg: "#FCE7F3", color: "#9F1239", border: "#FBCFE8" },
  Workshop: { bg: "#FFF7ED", color: "#9A3412", border: "#FED7AA" },
  Social: { bg: "#ECFEFF", color: "#155E75", border: "#A5F3FC" },
  Wellness: { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" },
  Literary: { bg: "#FEF2F2", color: "#991B1B", border: "#FECACA" },
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getCampusEvents();
        setEvents(data.events || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredEvents = filter === "All" 
    ? events 
    : events.filter(e => e.type === filter);

  const eventTypes = ["All", ...new Set(events.map(e => e.type))];

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (loading) {
    return (
      <div className="fade-up mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-cc-muted">
          <Loader2 size={24} className="animate-spin" style={{ color: "#247C78" }} />
          <p className="text-sm">Loading events…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-up mx-auto max-w-5xl">
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up mx-auto max-w-5xl space-y-6">
      
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-heading mb-1">Campus Activities</p>
          <h1 className="text-2xl font-bold tracking-tight text-cc-text sm:text-3xl">
            Upcoming Events
          </h1>
          <p className="mt-1 text-sm text-cc-muted">
            Discover and participate in campus happenings
          </p>
        </div>
        <Link to="/" className="btn-secondary py-2 text-xs">
          <Sparkles size={13} /> Voice Assistant
        </Link>
      </div>

      
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "#EEF6F5", color: "#247C78" }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-xs text-cc-muted">Total Events</p>
            <p className="stat-value">{events.length}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "#EFF6FF", color: "#1E40AF" }}
          >
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-xs text-cc-muted">This Month</p>
            <p className="stat-value">{events.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "#F5F3FF", color: "#6B21A8" }}
          >
            <Users size={18} />
          </div>
          <div>
            <p className="text-xs text-cc-muted">Categories</p>
            <p className="stat-value">{new Set(events.map(e => e.type)).size}</p>
          </div>
        </div>
      </div>

      
      <div className="card">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold text-cc-muted">Filter by:</p>
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={
                filter === type
                  ? { background: "#247C78", color: "#fff" }
                  : { background: "#F0F7F6", color: "#687780" }
              }
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      
      <div className="space-y-4">
        {paginatedEvents.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-sm text-cc-muted">No events found for this filter.</p>
          </div>
        ) : (
          paginatedEvents.map((event) => {
            const style = EVENT_COLORS[event.type] || EVENT_COLORS.Technical;
            return (
              <div key={event.id} className="card-section">
                <div className="flex items-start justify-between gap-4 px-6 py-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start gap-3">
                      <h3 className="text-lg font-bold text-cc-text">{event.title}</h3>
                      <span
                        className="badge"
                        style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
                      >
                        {event.type}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-cc-muted leading-relaxed">{event.description}</p>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-cc-muted">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar size={13} />
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} />
                        {event.venue}
                      </span>
                      {event.organizer && (
                        <span className="flex items-center gap-1.5">
                          <Users size={13} />
                          {event.organizer}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      
      {totalPages > 1 && (
        <div className="card">
          <div className="flex items-center justify-between">
            <p className="text-xs text-cc-muted">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} events
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-cc-border bg-white px-3 py-1.5 text-xs font-medium text-cc-text transition-colors hover:bg-cc-bg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors"
                        style={
                          currentPage === page
                            ? { background: "#247C78", color: "#fff" }
                            : { background: "#F0F7F6", color: "#687780" }
                        }
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-1 text-xs text-cc-muted">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-cc-border bg-white px-3 py-1.5 text-xs font-medium text-cc-text transition-colors hover:bg-cc-bg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
