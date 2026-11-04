import { useEffect, useState } from "react";
import { History as HistoryIcon, Loader2, Sparkles } from "lucide-react";
import { getChatHistory } from "../services/api";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getChatHistory()
      .then(setHistory)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-up mx-auto max-w-[720px] space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <HistoryIcon size={20} className="text-teal" />
          <h1 className="text-2xl font-bold text-cc-text">Chat History</h1>
        </div>
        <p className="mt-1 text-sm text-cc-muted">All your previous assistant conversations.</p>
      </div>

      {loading && (
        <div className="card flex items-center justify-center gap-2 text-sm text-cc-muted">
          <Loader2 size={16} className="animate-spin" /> Loading history...
        </div>
      )}
      {error && <div className="card text-sm text-red-600">{error}</div>}
      {!loading && !error && history.length === 0 && (
        <div className="card text-center text-sm text-cc-muted">No chat history yet.</div>
      )}
      <div className="space-y-3">
        {history.map((entry) => (
          <div key={entry.id} className="card-section">
            <div className="border-b border-cc-border bg-cc-bg px-5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-cc-text">You asked:</p>
                  <p className="mt-1 text-sm text-cc-muted">"{entry.query}"</p>
                </div>
                <span className="text-[10px] text-cc-muted">
                  {new Date(entry.timestamp).toLocaleString("en-IN")}
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
  );
}
