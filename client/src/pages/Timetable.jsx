import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Loader2, AlertCircle, MapPin, User } from "lucide-react";
import { getTimetable } from "../services/api";

export default function Timetable() {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getTimetable();
        setTimetable(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="fade-up mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-cc-muted">
          <Loader2 size={24} className="animate-spin" style={{ color: "#247C78" }} />
          <p className="text-sm">Loading timetable…</p>
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
          <p className="section-heading mb-1">Academic Schedule</p>
          <h1 className="text-2xl font-bold tracking-tight text-cc-text sm:text-3xl">
            My Timetable
          </h1>
          <p className="mt-1 text-sm text-cc-muted">
            Your weekly class schedule at a glance
          </p>
        </div>
        <Link to="/" className="btn-secondary py-2 text-xs">
          <Calendar size={13} /> Voice Assistant
        </Link>
      </div>

      
      {timetable && timetable.todayClasses && timetable.todayClasses.length > 0 && (
        <div className="card-section">
          <div
            className="flex items-center justify-between border-b border-cc-border px-6 py-4"
            style={{ background: "#F0F7F6" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "#DCECE8" }}>
                <Calendar size={18} style={{ color: "#1B625F" }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-cc-text">Today's Classes - {timetable.today}</p>
                <p className="text-xs text-cc-muted">{timetable.todayClasses.length} classes scheduled</p>
              </div>
            </div>
          </div>

          {timetable.nextClass && (
            <div className="border-b border-cc-border bg-blue-50 px-6 py-4">
              <p className="text-xs font-semibold text-blue-900">🎯 Next Class</p>
              <p className="mt-1 text-base font-bold text-blue-900">{timetable.nextClass.subject}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-blue-800">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {timetable.nextClass.time}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {timetable.nextClass.room}
                </span>
                {timetable.nextClass.professor && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <User size={14} />
                      {timetable.nextClass.professor}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="divide-y divide-cc-border">
            {timetable.todayClasses.map((cls, i) => (
              <div key={i} className="flex items-start justify-between gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-cc-text">{cls.subject}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-cc-muted">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {cls.room}
                    </span>
                    <span>•</span>
                    <span>{cls.type}</span>
                    {cls.professor && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User size={11} />
                          {cls.professor}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-sm font-semibold" style={{ color: "#247C78" }}>
                  <Clock size={14} />
                  {cls.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      <div className="card-section">
        <div
          className="border-b border-cc-border px-6 py-4"
          style={{ background: "#F0F7F6" }}
        >
          <p className="text-sm font-semibold text-cc-text">Full Week Schedule</p>
          <p className="text-xs text-cc-muted">All your classes for the week</p>
        </div>

        {timetable && timetable.timetable && (
          <>
            
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "#F0F7F6" }}>
                    <th className="border border-cc-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-cc-muted">
                      Time
                    </th>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                      <th
                        key={day}
                        className="border border-cc-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-cc-muted"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {["09:00 AM", "11:00 AM", "02:00 PM"].map((timeSlot) => (
                    <tr key={timeSlot}>
                      <td className="border border-cc-border bg-cc-bg px-4 py-3 text-xs font-semibold text-cc-muted">
                        {timeSlot}
                      </td>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
                        const classItem = timetable.timetable.find(
                          (c) => c.day === day && c.time === timeSlot
                        );
                        return (
                          <td
                            key={`${day}-${timeSlot}`}
                            className="border border-cc-border px-4 py-3"
                            style={classItem ? { background: "#fff" } : { background: "#FAFBFA" }}
                          >
                            {classItem ? (
                              <div>
                                <p className="text-sm font-semibold text-cc-text">{classItem.subject}</p>
                                <p className="mt-1 text-xs text-cc-muted">{classItem.room}</p>
                                <p className="mt-0.5 text-xs text-cc-muted">{classItem.type}</p>
                                {classItem.professor && (
                                  <p className="mt-0.5 text-[10px] text-cc-muted">{classItem.professor}</p>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-cc-muted">—</p>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            
            <div className="divide-y divide-cc-border lg:hidden">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
                const dayClasses = timetable.timetable.filter((c) => c.day === day);
                if (dayClasses.length === 0) return null;

                return (
                  <div key={day} className="px-6 py-4">
                    <p className="mb-3 text-sm font-bold text-cc-text">{day}</p>
                    <div className="space-y-2">
                      {dayClasses.map((cls, i) => (
                        <div
                          key={i}
                          className="flex items-start justify-between gap-4 rounded-lg border border-cc-border bg-cc-bg px-4 py-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-cc-text">{cls.subject}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-cc-muted">
                              <span className="flex items-center gap-1">
                                <MapPin size={10} />
                                {cls.room}
                              </span>
                              <span>•</span>
                              <span>{cls.type}</span>
                              {cls.professor && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <User size={10} />
                                    {cls.professor}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-cc-muted">
                            <Clock size={12} />
                            {cls.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
