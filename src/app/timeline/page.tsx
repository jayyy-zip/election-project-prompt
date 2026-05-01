"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import timelineData from "@/data/timeline.json";
import { formatDate } from "@/lib/utils";
import { Megaphone, AlertCircle, FilePen, Search, UserMinus, VolumeX, Vote, BarChart2, Bell, BellOff, Calendar, CheckCircle } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Megaphone, AlertCircle, FilePen, Search, UserMinus, VolumeX, Vote, BarChart2, Calendar, CheckCircle,
};

const categoryColors: Record<string, { bg: string; accent: string; border: string }> = {
  announcement: { bg: "#F5F3FF", accent: "#7C3AED", border: "#DDD6FE" },
  deadline:     { bg: "#FEF2F2", accent: "#DC2626", border: "#FECACA" },
  candidate:    { bg: "#FFFBEB", accent: "#D97706", border: "#FDE68A" },
  voting:       { bg: "#EFF6FF", accent: "#2563EB", border: "#BFDBFE" },
  result:       { bg: "#ECFDF5", accent: "#059669", border: "#A7F3D0" },
};

const STORAGE_KEY = "votesmart_reminders";

interface TimelineEvent {
  id: number; date: string; event: string; shortDesc: string;
  details: string; category: string; icon: string; isPast: boolean; isHighlight?: boolean;
}

function loadReminders(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function saveReminders(reminders: Set<number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(reminders)));
  } catch {
    // localStorage unavailable — fail silently
  }
}

export default function TimelinePage() {
  const [reminders, setReminders] = useState<Set<number>>(new Set());

  // Hydrate from localStorage after mount
  useEffect(() => {
    setReminders(loadReminders());
  }, []);

  const toggleReminder = useCallback((id: number, eventName: string) => {
    setReminders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveReminders(next);
      // Announce to screen readers
      const msg = next.has(id)
        ? `Reminder set for ${eventName}`
        : `Reminder removed for ${eventName}`;
      // Use a live region via aria-live on the parent — covered by aria-pressed change
      void msg;
      return next;
    });
  }, []);

  const upcoming = (timelineData as TimelineEvent[]).filter((e) => !e.isPast);
  const past = (timelineData as TimelineEvent[]).filter((e) => e.isPast);

  return (
    <PageWrapper ariaLabel="Election timeline with key dates and deadline reminders">
      <div style={{ paddingTop: "8px" }}>
        <p className="section-subtitle" style={{ marginBottom: "4px" }}>Don&apos;t miss a deadline</p>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>
          Election Timeline
        </h1>
        <p className="section-subtitle" style={{ marginBottom: "20px" }}>
          Toggle reminders for important dates
        </p>

        {/* Summary Pills */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" as const }} aria-label="Timeline summary" role="group">
          <div style={{ padding: "6px 14px", background: "var(--surface)", borderRadius: "20px", border: "1px solid var(--border)", fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle size={13} color="var(--success)" strokeWidth={2.5} aria-hidden="true" />
            {past.length} completed
          </div>
          <div style={{ padding: "6px 14px", background: "var(--accent-light)", borderRadius: "20px", border: "1px solid #BFDBFE", fontSize: "13px", color: "var(--accent)", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={13} strokeWidth={2.5} aria-hidden="true" />
            {upcoming.length} upcoming
          </div>
          {reminders.size > 0 && (
            <div
              style={{ padding: "6px 14px", background: "#FFFBEB", borderRadius: "20px", border: "1px solid #FDE68A", fontSize: "13px", color: "#D97706", display: "flex", alignItems: "center", gap: "6px" }}
              aria-live="polite"
            >
              <Bell size={13} strokeWidth={2.5} aria-hidden="true" />
              {reminders.size} reminder{reminders.size > 1 ? "s" : ""} set
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <section aria-label="Upcoming election dates">
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", margin: "0 0 12px", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
            <span aria-hidden="true">📅 </span>Upcoming
          </h2>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px", marginBottom: "24px" }}>
            {upcoming.map((event, idx) => {
              const Icon = iconMap[event.icon] ?? Calendar;
              const colors = categoryColors[event.category] ?? categoryColors.announcement;
              const hasReminder = reminders.has(event.id);
              return (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                  className="card"
                  style={{ padding: "16px", border: event.isHighlight ? "2px solid var(--accent)" : "1px solid var(--border)", background: event.isHighlight ? "var(--accent-light)" : "var(--surface)" }}
                  aria-label={`${event.event} on ${formatDate(event.date)}`}
                >
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: colors.bg, border: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden="true">
                      <Icon size={19} color={colors.accent} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: 600, color: colors.accent, margin: "0 0 2px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>
                            {formatDate(event.date)}
                          </p>
                          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>
                            {event.event}
                          </h3>
                        </div>
                        <button
                          id={`reminder-${event.id}`}
                          onClick={() => toggleReminder(event.id, event.event)}
                          aria-pressed={hasReminder}
                          aria-label={hasReminder ? `Remove reminder for ${event.event}` : `Set reminder for ${event.event}`}
                          style={{
                            background: hasReminder ? "#FFFBEB" : "var(--background)",
                            border: hasReminder ? "1.5px solid #FDE68A" : "1px solid var(--border)",
                            borderRadius: "8px", padding: "5px", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, transition: "all 0.15s ease",
                            minWidth: "32px", minHeight: "32px",
                          }}
                        >
                          {hasReminder
                            ? <Bell size={15} color="#D97706" strokeWidth={2} aria-hidden="true" />
                            : <BellOff size={15} color="var(--text-muted)" strokeWidth={1.8} aria-hidden="true" />}
                        </button>
                      </div>
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "5px 0 0", lineHeight: 1.45 }}>
                        {event.shortDesc}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* Past Events */}
        <section aria-label="Completed election dates">
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", margin: "0 0 12px", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
            <span aria-hidden="true">✅ </span>Completed
          </h2>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
            {past.map((event) => (
              <div
                key={event.id}
                className="card"
                style={{ padding: "12px 14px", opacity: 0.55 }}
                aria-label={`${event.event} — completed on ${formatDate(event.date)}`}
              >
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <CheckCircle size={16} color="var(--success)" strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden="true" />
                  <div>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{formatDate(event.date)}</p>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", margin: 0, textDecoration: "line-through" }}>{event.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: "8px" }} />
      </div>
    </PageWrapper>
  );
}
