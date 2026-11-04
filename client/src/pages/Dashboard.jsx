import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Inbox, Clock3, CheckCircle2, Loader2, Plus, RefreshCw, 
  AlertCircle, Mic, ChevronRight, Search, Bell, Trash2,
} from "lucide-react";
import { getComplaints, getReminders, deleteReminder } from "../services/api";

const CAT_STYLE = {
  Electricity: { bg: "#FEFCE8", color: "#854D0E" },
  Water: { bg: "#EFF6FF", color: "#1E40AF" },
  Hostel: { bg: "#F5F3FF", color: "#5B21B6" },
  Internet: { bg: "#ECFEFF", color: "#155E75" },
  Cleanliness: { bg: "#F0FDF4", color: "#166534" },
  Maintenance: { bg: "#FFF7ED", color: "#9A3412" },
  Other: { bg: "#F7F8F6", color: "#687780" },
};

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [complaintsData, remindersData] = await Promise.all([
        getComplaints(),
        getReminders()
      ]);
      setComplaints(complaintsData);
      setReminders(remindersData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await deleteReminder(id);
      setReminders(reminders.filter(r => r._id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const openCount = complaints.filter(c => c.status === "Open").length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;

  const filtered = useMemo(() =>
    complaints.filter(c => {
      const matchStatus = filter === "All" || c.status === filter;
      const q = search.toLowerCase();
      return matchStatus && (!q ||
        c.title.toLowerCase().includes(q) ||
        c.ticketId.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }),
    [complaints, filter, search]
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filtered.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  return (
    <div className="fade-up mx-auto max-w-6xl space-y-6">

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-heading mb-1">Student Portal</p>
          <h1 className="text-2xl font-bold tracking-tight text-cc-text sm:text-3xl">
            My Complaints
          </h1>
          <p className="mt-1 text-sm text-cc-muted">
            Track your campus issue reports
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-secondary py-2">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
          <Link to="/" className="btn-primary py-2">
            <Plus size={14} /> New Complaint
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Inbox size={18} />}
          label="Total Complaints"
          value={complaints.length}
        />
        <StatCard
          icon={<Clock3 size={18} />}
          label="Pending"
          value={openCount}
        />
        <StatCard
          icon={<CheckCircle2 size={18} />}
          label="Resolved"
          value={resolvedCount}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      {reminders.length > 0 && (
        <div className="card-section">
          <div className="flex items-center gap-2.5 border-b border-cc-border px-5 py-3.5">
            <Bell size={16} style={{ color: "#247C78" }} />
            <h2 className="text-sm font-semibold text-cc-text">My Reminders</h2>
            <span className="rounded-full border px-2 py-0.5 text-[11px] font-semibold"
              style={{ background: "#F0F7F6", color: "#247C78", borderColor: "#DCECE8" }}>
              {reminders.length}
            </span>
          </div>
          <div className="divide-y divide-cc-border">
            {reminders.slice(0, 5).map(reminder => (
              <div key={reminder._id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-cc-text">{reminder.text}</p>
                  <p className="mt-0.5 text-xs text-cc-muted">
                    {new Date(reminder.datetime).toLocaleString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteReminder(reminder._id)}
                  className="btn-ghost shrink-0 p-2 text-red-600 hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card-section">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cc-border px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-semibold text-cc-text">My Complaints</h2>
            <span className="rounded-full border px-2 py-0.5 text-[11px] font-semibold"
              style={{ background: "#F0F7F6", color: "#247C78", borderColor: "#DCECE8" }}>
              {filtered.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-cc-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                className="input-field h-8 rounded-lg py-0 pl-8 pr-3 text-xs w-32 sm:w-44"
              />
            </div>

            <div className="flex rounded-lg border border-cc-border bg-cc-bg p-0.5">
              {["All", "Open", "Resolved"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="rounded-md px-2.5 py-1 text-xs font-medium"
                  style={filter === f
                    ? { background: "#fff", color: "#247C78", boxShadow: "0 1px 2px rgba(20,45,58,0.08)" }
                    : { color: "#687780" }
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <Loader2 size={24} className="animate-spin" style={{ color: "#247C78" }} />
            <p className="text-sm text-cc-muted">Loading complaints…</p>
          </div>
        ) : filtered.length === 0 ? (
          complaints.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "#EEF6F5", color: "#247C78" }}>
                <Mic size={22} />
              </div>
              <div>
                <p className="font-semibold text-cc-text">No complaints yet</p>
                <p className="mt-1 text-sm text-cc-muted">Report your first campus issue</p>
              </div>
              <Link to="/" className="btn-primary mt-1 py-2 text-xs">
                <Plus size={13} /> Report Issue
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16">
              <Search size={20} className="text-cc-muted opacity-40" />
              <p className="text-sm font-semibold text-cc-text">No matching complaints</p>
              <button onClick={() => { setSearch(""); setFilter("All"); }} className="btn-secondary py-1.5 text-xs">
                Clear filters
              </button>
            </div>
          )
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-cc-border" style={{ background: "#FAFBFA" }}>
                    {["Ticket", "Title", "Category", "Priority", "Status", "Date", ""].map(h => (
                      <th key={h} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-cc-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedComplaints.map(c => <DesktopRow key={c._id} item={c} />)}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-cc-border md:hidden">
              {paginatedComplaints.map(c => <MobileCard key={c._id} item={c} />)}
            </div>

            {totalPages > 1 && (
              <div className="border-t border-cc-border bg-cc-bg px-5 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-cc-muted">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-lg border border-cc-border bg-white px-3 py-1.5 text-xs font-medium disabled:opacity-50">
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-lg border border-cc-border bg-white px-3 py-1.5 text-xs font-medium disabled:opacity-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: "#EEF6F5", color: "#247C78" }}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-cc-muted">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

function DesktopRow({ item }) {
  const cat = CAT_STYLE[item.category] ?? CAT_STYLE.Other;
  const isOpen = item.status === "Open";
  return (
    <tr className="group border-b border-cc-border hover:bg-[#F7FAF9]">
      <td className="px-5 py-3.5">
        <span className="font-mono text-xs font-semibold" style={{ color: "#247C78" }}>
          {item.ticketId}
        </span>
      </td>
      <td className="max-w-[220px] px-5 py-3.5">
        <p className="truncate text-sm font-medium text-cc-text">{item.title}</p>
      </td>
      <td className="px-5 py-3.5">
        <span className="badge" style={{ background: cat.bg, color: cat.color }}>
          {item.category}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span className={item.priority === "High" ? "badge-high" : item.priority === "Medium" ? "badge-medium" : "badge-low"}>
          {item.priority}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span className={isOpen ? "badge-pending" : "badge-resolved"}>
          {isOpen ? "Pending" : "Resolved"}
        </span>
      </td>
      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-cc-muted">
        {new Date(item.createdAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric"
        })}
      </td>
      <td className="px-5 py-3.5">
        <Link to={`/complaints/${item._id}`}
          className="inline-flex items-center gap-1 rounded-lg border border-cc-border px-2.5 py-1.5 text-xs font-medium text-cc-muted opacity-0 group-hover:opacity-100">
          View <ChevronRight size={11} />
        </Link>
      </td>
    </tr>
  );
}

function MobileCard({ item }) {
  const cat = CAT_STYLE[item.category] ?? CAT_STYLE.Other;
  const isOpen = item.status === "Open";
  return (
    <div className="flex items-start justify-between gap-3 px-5 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-semibold" style={{ color: "#247C78" }}>
            {item.ticketId}
          </span>
          <span className={isOpen ? "badge-pending" : "badge-resolved"}>
            {isOpen ? "Pending" : "Resolved"}
          </span>
        </div>
        <p className="mt-1 truncate text-sm font-medium text-cc-text">{item.title}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="badge" style={{ background: cat.bg, color: cat.color }}>
            {item.category}
          </span>
          <span className="ml-auto text-[10px] text-cc-muted">
            {new Date(item.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short"
            })}
          </span>
        </div>
      </div>
      <Link to={`/complaints/${item._id}`} className="btn-ghost shrink-0 p-2">
        <ChevronRight size={15} className="text-cc-muted" />
      </Link>
    </div>
  );
}
