"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { useState } from "react";
import timelineData from "@/data/timeline.json";
import { formatDate } from "@/lib/utils";
import { Megaphone, AlertCircle, FilePen, Search, UserMinus, VolumeX, Vote, BarChart2, Bell, BellOff, Calendar, CheckCircle } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { Megaphone, AlertCircle, FilePen, Search, UserMinus, VolumeX, Vote, BarChart2, Calendar, CheckCircle };

const categoryColors: Record<string, { bg: string; accent: string; border: string }> = {
  announcement: { bg: "#F5F3FF", accent: "#7C3AED", border: "#DDD6FE" },
  deadline:     { bg: "#FEF2F2", accent: "#DC2626", border: "#FECACA" },
  candidate:    { bg: "#FFFBEB", accent: "#D97706", border: "#FDE68A" },
  voting:       { bg: "#EFF6FF", accent: "#2563EB", border: "#BFDBFE" },
  result:       { bg: "#ECFDF5", accent: "#059669", border: "#A7F3D0" },
};

interface TimelineEvent {
  id: number; date: string; event: string; shortDesc: string;
  details: string; category: string; icon: string; isPast: boolean; isHighlight?: boolean;
}

export default function TimelinePage() {
  const [reminders, setReminders] = useState<Set<number>>(new Set());
  const toggleReminder = (id: number) =>
    setReminders((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  const upcoming = (timelineData as TimelineEvent[]).filter((e) => !e.isPast);
  const past = (timelineData as TimelineEvent[]).filter((e) => e.isPast);

  return (
    <PageWrapper>
      <div style={{ paddingTop: "8px" }}>
        <p className="section-subtitle" style={{ marginBottom: "4px" }}>Don&apos;t miss a deadline</p>
        <p style={{ fontSize: "22px", fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Election Timeline</p>
        <p className="section-subtitle" style={{ marginBottom: "20px" }}>Toggle reminders for important dates</p>

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" as const }}>
          <div style={{ padding: "6px 14px", background: "var(--surface)", borderRadius: "20px", border: "1px solid var(--border)", fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle size={13} color="var(--success)" strokeWidth={2.5} />{past.length} completed
          </div>
          <div style={{ padding: "6px 14px", background: "var(--accent-light)", borderRadius: "20px", border: "1px solid #BFDBFE", fontSize: "13px", color: "var(--accent)", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={13} strokeWidth={2.5} />{upcoming.length} upcoming
          </div>
          {reminders.size > 0 && (
            <div style={{ padding: "6px 14px", background: "#FFFBEB", borderRadius: "20px", border: "1px solid #FDE68A", fontSize: "13px", color: "#D97706", display: "flex", alignItems: "center", gap: "6px" }}>
              <Bell size={13} strokeWidth={2.5} />{reminders.size} reminder{reminders.size > 1 ? "s" : ""} set
            </div>
          )}
        </div>

        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", margin: "0 0 12px", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>📅 Upcoming</p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px", marginBottom: "24px" }}>
          {upcoming.map((event, idx) => {
            const Icon = iconMap[event.icon] ?? Calendar;
            const colors = categoryColors[event.category] ?? categoryColors.announcement;
            const hasReminder = reminders.has(event.id);
            return (
              <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="card"
                style={{ padding: "16px", border: event.isHighlight ? "2px solid var(--accent)" : "1px solid var(--border)", background: event.isHighlight ? "var(--accent-light)" : "var(--surface)" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: colors.bg, border: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={19} color={colors.accent} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div>
                        <p style={{ fontSize: "11px", fontWeight: 600, color: colors.accent, margin: "0 0 2px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>{formatDate(event.date)}</p>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>{event.event}</p>
                      </div>
                      <button id={`reminder-${event.id}`} onClick={() => toggleReminder(event.id)}
                        style={{ background: hasReminder ? "#FFFBEB" : "var(--background)", border: hasReminder ? "1.5px solid #FDE68A" : "1px solid var(--border)", borderRadius: "8px", padding: "5px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s ease" }}
                        title={hasReminder ? "Remove reminder" : "Set reminder"}>
                        {hasReminder ? <Bell size={15} color="#D97706" strokeWidth={2} /> : <BellOff size={15} color="var(--text-muted)" strokeWidth={1.8} />}
                      </button>
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "5px 0 0", lineHeight: 1.45 }}>{event.shortDesc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", margin: "0 0 12px", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>✅ Completed</p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
          {past.map((event) => (
            <div key={event.id} className="card" style={{ padding: "12px 14px", opacity: 0.55 }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <CheckCircle size={16} color="var(--success)" strokeWidth={2} style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{formatDate(event.date)}</p>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", margin: 0, textDecoration: "line-through" }}>{event.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: "8px" }} />
      </div>
    </PageWrapper>
  );
}
