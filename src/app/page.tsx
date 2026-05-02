"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion, type Variants } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { getGreeting, getDaysUntil } from "@/lib/utils";
import { ELECTION_DATE, CAMPAIGN_SILENCE_DATE, ELECTION_NAME, CHECKLIST_STORAGE_KEY } from "@/lib/constants";
import { storageGet } from "@/lib/storage";
import documentsData from "@/data/documents.json";
import Link from "next/link";
import {
  BookOpen, MapPin, FileCheck, Calendar, Users, MessageCircle,
  ChevronRight, AlertCircle, Clock, TrendingUp,
} from "lucide-react";

const quickActions = [
  { id: "how-to-vote",    href: "/guide",      icon: BookOpen,       label: "How to Vote",    desc: "Step-by-step guide",  color: "#2563EB", bg: "#EFF6FF" },
  { id: "booth-finder",   href: "/booth",      icon: MapPin,         label: "Find My Booth",  desc: "Search & edit info",  color: "#059669", bg: "#ECFDF5" },
  { id: "documents",      href: "/documents",  icon: FileCheck,      label: "Documents",      desc: "What to carry",       color: "#D97706", bg: "#FFFBEB" },
  { id: "key-dates",      href: "/timeline",   icon: Calendar,       label: "Key Dates",      desc: "Election timeline",   color: "#7C3AED", bg: "#F5F3FF" },
  { id: "candidates",     href: "/candidates", icon: Users,          label: "Candidates",     desc: "Know who's running",  color: "#DB2777", bg: "#FDF2F8" },
  { id: "ask-anything",   href: "/chat",       icon: MessageCircle,  label: "Ask Anything",   desc: "AI answers instantly", color: "#0891B2", bg: "#ECFEFF" },
];

const container: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } } };

const QuickActionCard = memo(function QuickActionCard({
  id, href, icon: Icon, label, desc, color, bg,
}: typeof quickActions[0]) {
  return (
    <Link
      href={href}
      id={`quick-action-${id}`}
      aria-label={`${label} — ${desc}`}
      style={{
        display: "flex", flexDirection: "column", gap: "8px", padding: "16px",
        background: "var(--surface)", borderRadius: "14px", border: "1px solid var(--border)",
        textDecoration: "none", transition: "all 0.15s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} color={color} strokeWidth={2} aria-hidden="true" />
      </div>
      <div>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>{label}</p>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{desc}</p>
      </div>
    </Link>
  );
});

export default function HomePage() {
  const greeting = getGreeting();
  const daysUntilElection = getDaysUntil(ELECTION_DATE);
  const daysUntilCampaignSilence = getDaysUntil(CAMPAIGN_SILENCE_DATE);

  // Checklist progress pill — hydrated client-side
  const [checklistCount, setChecklistCount] = useState<number | null>(null);
  useEffect(() => {
    const saved = storageGet<string[]>(CHECKLIST_STORAGE_KEY, []);
    setChecklistCount(saved.length);
  }, []);

  const totalDocs = documentsData.length;
  const checklistPercent = checklistCount !== null ? Math.round((checklistCount / totalDocs) * 100) : 0;

  const statusLabel =
    daysUntilElection > 0   ? `${daysUntilElection} day${daysUntilElection !== 1 ? "s" : ""} until Polling Day`
    : daysUntilElection === 0 ? "Today is Polling Day! 🗳️"
    : "Polling has concluded";

  const urgencyColor = daysUntilElection <= 3 ? "#EF4444" : daysUntilElection <= 7 ? "#F59E0B" : "#2563EB";

  return (
    <PageWrapper ariaLabel="VoteSmart home — election overview and quick actions">
      <motion.section
        variants={container} initial="hidden" animate="show"
        style={{ paddingTop: "8px" }}
        aria-label="Election dashboard"
      >
        {/* Greeting */}
        <motion.div variants={item}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 2px" }} aria-hidden="true">{greeting} 👋</p>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text)", margin: "0 0 2px", lineHeight: 1.25 }}>
            Ready to vote?
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>
            Everything you need in one place.
          </p>
        </motion.div>

        {/* Election Countdown */}
        <motion.div variants={item} style={{ marginTop: "20px" }}>
          <div
            className="card"
            role="status" aria-live="polite"
            aria-label={`Election status: ${statusLabel}`}
            style={{
              padding: "20px",
              background: `linear-gradient(135deg, ${urgencyColor}10 0%, ${urgencyColor}05 100%)`,
              borderColor: `${urgencyColor}30`,
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: urgencyColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Clock size={22} color="white" strokeWidth={2} aria-hidden="true" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 2px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {ELECTION_NAME}
                </p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", margin: "0 0 4px", lineHeight: 1.3 }}>
                  {statusLabel}
                </p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
                  Polling Day: May 7, 2026 · 7AM–6PM
                </p>
              </div>
            </div>
            {daysUntilCampaignSilence > 0 && (
              <div style={{ marginTop: "12px", padding: "8px 12px", background: "rgba(255,255,255,0.7)", borderRadius: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={14} color={urgencyColor} strokeWidth={2.5} aria-hidden="true" />
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                  Campaign silence period starts May 5
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Checklist progress pill */}
        {checklistCount !== null && (
          <motion.div variants={item} style={{ marginTop: "12px" }}>
            <Link
              href="/documents"
              id="home-checklist-pill"
              aria-label={`Document checklist: ${checklistCount} of ${totalDocs} ready — tap to continue`}
              style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
                background: checklistCount === totalDocs ? "#F0FDF4" : "var(--surface)",
                borderRadius: "12px",
                border: checklistCount === totalDocs ? "1px solid #86EFAC" : "1px solid var(--border)",
                textDecoration: "none",
              }}
            >
              <FileCheck size={18} color={checklistCount === totalDocs ? "#059669" : "var(--accent)"} strokeWidth={2} aria-hidden="true" />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", margin: 0 }}>
                  Your Checklist
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                  <div style={{ flex: 1, height: "4px", background: "#E2E8F0", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${checklistPercent}%`, background: checklistCount === totalDocs ? "#059669" : "var(--accent)", borderRadius: "2px", transition: "width 0.4s ease" }} />
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0 }}>{checklistCount}/{totalDocs} ready</span>
                </div>
              </div>
              <ChevronRight size={14} color="var(--text-muted)" strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </motion.div>
        )}

        {/* Primary CTA */}
        <motion.div variants={item} style={{ marginTop: "14px" }}>
          <Link href="/chat" id="cta-ask-question" className="btn-primary" aria-label="Ask a voting question">
            <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            Ask a Question — Get Instant Help
          </Link>
        </motion.div>

        {/* First-Time Voter Banner */}
        <motion.div variants={item} style={{ marginTop: "10px" }}>
          <Link
            href="/guide"
            id="first-time-voter-banner"
            aria-label="First-time voter? Follow our beginner guide"
            style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
              background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
              borderRadius: "12px", border: "1px solid #DDD6FE", textDecoration: "none",
            }}
          >
            <span style={{ fontSize: "20px" }} aria-hidden="true">🌟</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#5B21B6", margin: 0 }}>First-time voter?</p>
              <p style={{ fontSize: "12px", color: "#7C3AED", margin: 0, opacity: 0.85 }}>Follow our beginner guide — takes 3 minutes</p>
            </div>
            <ChevronRight size={16} color="#7C3AED" strokeWidth={2.5} aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div variants={item} style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <p className="section-title" style={{ fontSize: "16px" }}>Quick Actions</p>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }} aria-hidden="true">
              <TrendingUp size={12} color="var(--text-muted)" />
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>6 tools</span>
            </div>
          </div>
          <div
            role="list"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
            aria-label="Quick action links"
          >
            {quickActions.map((action) => (
              <div role="listitem" key={action.id}>
                <QuickActionCard {...action} />
              </div>
            ))}
          </div>
        </motion.div>
        <div style={{ height: "16px" }} />
      </motion.section>
    </PageWrapper>
  );
}
