import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft, CheckCircle2, Loader2, AlertCircle,
  Tag, Zap, Calendar, FileText, Hash, Clock,
} from "lucide-react";
import { getComplaint } from "../services/api";

const CAT_STYLE = {
  Electricity: { bg: "#FEFCE8", color: "#854D0E" },
  Water: { bg: "#EFF6FF", color: "#1E40AF" },
  Hostel: { bg: "#F5F3FF", color: "#5B21B6" },
  Internet: { bg: "#ECFEFF", color: "#155E75" },
  Cleanliness: { bg: "#F0FDF4", color: "#166534" },
  Maintenance: { bg: "#FFF7ED", color: "#9A3412" },
  Other: { bg: "#F7F8F6", color: "#687780" },
};

export default function Details() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getComplaint(id).then(setComplaint).catch(e => setError(e.message));
  }, [id]);

  if (!complaint && !error) {
    return (
      <div className="flex flex-col items-center gap-3 py-32">
        <Loader2 size={24} className="animate-spin" style={{ color: "#247C78" }} />
        <p className="text-sm text-cc-muted">Loading ticket…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl py-16">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Could not load ticket</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
        <Link to="/dashboard" className="btn-ghost mt-4 inline-flex">
          <ArrowLeft size={13} /> Back
        </Link>
      </div>
    );
  }

  const isOpen = complaint.status === "Open";
  const cat = CAT_STYLE[complaint.category] ?? CAT_STYLE.Other;
  const priColor = complaint.priority === "High" ? "#EF4444" : complaint.priority === "Medium" ? "#F97316" : "#94A3B8";

  return (
    <div className="fade-up mx-auto max-w-2xl space-y-4">
      <Link to="/dashboard" className="btn-ghost -ml-2 inline-flex">
        <ArrowLeft size={13} /> Back
      </Link>

      <div className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium"
        style={isOpen
          ? { background: "#FFFBEB", borderColor: "#FDE68A", color: "#92400E" }
          : { background: "#F0FDF4", borderColor: "#BBF7D0", color: "#166534" }
        }>
        {isOpen ? <Clock size={14} /> : <CheckCircle2 size={14} />}
        {isOpen
          ? "Your complaint is under review"
          : "This complaint has been resolved"
        }
      </div>

      <div className="card-section">
        <div className="border-b border-cc-border px-6 py-5" style={{ background: "#FAFBFA" }}>
          <div className="flex flex-wrap items-start gap-2">
            <span className="font-mono text-xs font-semibold" style={{ color: "#247C78" }}>
              {complaint.ticketId}
            </span>
            <span className={isOpen ? "badge-pending" : "badge-resolved"}>
              {isOpen ? "Pending" : "Resolved"}
            </span>
          </div>
          <h1 className="mt-2 text-lg font-bold leading-snug text-cc-text">
            {complaint.title}
          </h1>
        </div>

        <div className="grid grid-cols-2 divide-x divide-y divide-cc-border">
          <MetaCell icon={<Tag size={13} />} label="Category">
            <span className="badge" style={{ background: cat.bg, color: cat.color }}>
              {complaint.category}
            </span>
          </MetaCell>

          <MetaCell icon={<Zap size={13} />} label="Priority">
            <span className={complaint.priority === "High" ? "badge-high" : complaint.priority === "Medium" ? "badge-medium" : "badge-low"}>
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: priColor }} />
              {complaint.priority}
            </span>
          </MetaCell>

          <MetaCell icon={<Hash size={13} />} label="Ticket ID">
            <span className="font-mono text-sm font-semibold text-cc-text">{complaint.ticketId}</span>
          </MetaCell>

          <MetaCell icon={<Calendar size={13} />} label="Submitted">
            <span className="text-sm text-cc-text">
              {new Date(complaint.createdAt).toLocaleString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit"
              })}
            </span>
          </MetaCell>
        </div>

        {complaint.summary && (
          <div className="border-t border-cc-border px-6 py-4" style={{ background: "#F7FAF9" }}>
            <div className="flex items-start gap-3">
              <FileText size={14} className="mt-1 text-cc-muted" />
              <div>
                <p className="field-label" style={{ color: "#247C78" }}>Summary</p>
                <p className="text-sm text-cc-muted">{complaint.summary}</p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-cc-border px-6 py-5">
          <p className="field-label">Your complaint</p>
          <p className="text-sm leading-relaxed text-cc-text">{complaint.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cc-border bg-cc-card px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-cc-text">Need further assistance?</p>
          <p className="text-xs text-cc-muted">Submit a new complaint with additional details</p>
        </div>
        <Link to="/" className="btn-primary py-2 text-xs">
          Report New Issue
        </Link>
      </div>
    </div>
  );
}

function MetaCell({ icon, label, children }) {
  return (
    <div className="flex items-start gap-2.5 px-5 py-4">
      <span className="mt-0.5 shrink-0 text-cc-muted">{icon}</span>
      <div>
        <p className="field-label">{label}</p>
        {children}
      </div>
    </div>
  );
}
