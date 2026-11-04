import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Mic, LayoutDashboard, Calendar, Sparkles, Menu, X } from "lucide-react";

const NAV = [
  { to: "/",          icon: <Mic size={14} />,              label: "Voice Assistant" },
  { to: "/timetable", icon: <Calendar size={14} />,         label: "My Timetable" },
  { to: "/events",    icon: <Sparkles size={14} />,         label: "Campus Events" },
  { to: "/dashboard", icon: <LayoutDashboard size={14} />,  label: "My Complaints" },
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  const linkCls = ({ isActive }) => (isActive ? "nav-item-active" : "nav-item");

  return (
    <div className="page-root">

      
      <header className="sticky top-0 z-30 border-b border-cc-border bg-cc-card/95 backdrop-blur-sm">
        <div className="mx-auto flex h-15 max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">

          
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex select-none items-center gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy">
              <Mic size={15} className="text-white" />
            </div>
            <div className="leading-none">
              <span className="block text-sm font-bold text-cc-text">CampusCare</span>
              <span className="hidden text-[10px] text-cc-muted sm:block">
                Your Campus. Your Voice. Our Care.
              </span>
            </div>
          </Link>

          
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map(({ to, icon, label }) => (
              <NavLink key={to} to={to} end={to === "/"} className={linkCls}>
                {icon} {label}
              </NavLink>
            ))}
          </nav>

          
          <button
            className="btn-ghost p-2 sm:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        
        {open && (
          <div className="border-t border-cc-border bg-cc-card px-4 pb-3 pt-2 sm:hidden">
            {NAV.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-teal text-white"
                      : "text-cc-muted hover:bg-sage/60 hover:text-cc-text"
                  }`
                }
              >
                {icon} {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {children}
      </main>

      
      <footer className="mt-16 border-t border-cc-border bg-cc-card py-7 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-navy">
            <Mic size={11} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-cc-text">CampusCare</span>
        </div>
        <p className="mt-1.5 text-xs text-cc-muted">
          Helping students resolve campus issues, one complaint at a time.
        </p>
      </footer>
    </div>
  );
}
