"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion, type Variants } from "framer-motion";
import { getGreeting, getDaysUntil } from "@/lib/utils";
import Link from "next/link";
import { BookOpen, MapPin, FileCheck, Calendar, Users, MessageCircle, ChevronRight, AlertCircle, Clock, TrendingUp } from "lucide-react";

const ELECTION_DATE = "2026-05-07";
const CAMPAIGN_END_DATE = "2026-05-05";

const quickActions = [
  { id: "how-to-vote", href: "/guide", icon: BookOpen, label: "How to Vote", desc: "Step-by-step guide", color: "#2563EB", bg: "#EFF6FF" },
  { id: "booth-finder", href: "/booth", icon: MapPin, label: "Find My Booth", desc: "Search by area", color: "#059669", bg: "#ECFDF5" },
  { id: "documents", href: "/documents", icon: FileCheck, label: "Documents", desc: "What to carry", color: "#D97706", bg: "#FFFBEB" },
  { id: "key-dates", href: "/timeline", icon: Calendar, label: "Key Dates", desc: "Election timeline", color: "#7C3AED", bg: "#F5F3FF" },
  { id: "candidates", href: "/candidates", icon: Users, label: "Candidates", desc: "Know who's running", color: "#DB2777", bg: "#FDF2F8" },
  { id: "ask-anything", href: "/chat", icon: MessageCircle, label: "Ask Anything", desc: "Get quick answers", color: "#0891B2", bg: "#ECFEFF" },
];

const container: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } } };

export default function HomePage() {
  const greeting = getGreeting();
  const daysUntilElection = getDaysUntil(ELECTION_DATE);
  const daysUntilCampaignEnd = getDaysUntil(CAMPAIGN_END_DATE);

  const statusLabel =
    daysUntilElection > 0 ? `${daysUntilElection} days until Polling Day`
    : daysUntilElection === 0 ? "Today is Polling Day! 🗳️"
    : "Polling has concluded";

  const urgencyColor = daysUntilElection <= 3 ? "#EF4444" : daysUntilElection <= 7 ? "#F59E0B" : "#2563EB";

  return (
    <PageWrapper>
      <motion.section variants={container} initial="hidden" animate="show" style={{ paddingTop: "8px" }}>
        <motion.div variants={item}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 2px" }}>{greeting} 👋</p>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text)", margin: "0 0 2px", lineHeight: 1.25 }}>Ready to vote?</h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>Everything you need in one place.</p>
        </motion.div>

        {/* Status Card */}
        <motion.div variants={item} style={{ marginTop: "20px" }}>
          <div className="card" style={{
            padding: "20px",
            background: `linear-gradient(135deg, ${urgencyColor}10 0%, ${urgencyColor}05 100%)`,
            borderColor: `${urgencyColor}30`, position: "relative", overflow: "hidden",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: urgencyColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Clock size={22} color="white" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 2px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Maharashtra State Elections</p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", margin: "0 0 4px", lineHeight: 1.3 }}>{statusLabel}</p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>Polling Day: May 7, 2026 · 7AM–6PM</p>
              </div>
            </div>
            {daysUntilCampaignEnd > 0 && (
              <div style={{ marginTop: "12px", padding: "8px 12px", background: "rgba(255,255,255,0.7)", borderRadius: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={14} color={urgencyColor} strokeWidth={2.5} />
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Campaign silence period starts May 5</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={item} style={{ marginTop: "16px" }}>
          <Link href="/chat" id="cta-ask-question" className="btn-primary">
            <MessageCircle size={18} strokeWidth={2} />
            Ask a Question — Get Instant Help
          </Link>
        </motion.div>

        {/* First-Time Voter Banner */}
        <motion.div variants={item} style={{ marginTop: "12px" }}>
          <Link href="/guide" id="first-time-voter-banner" style={{
            display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
            background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
            borderRadius: "12px", border: "1px solid #DDD6FE", textDecoration: "none",
          }}>
            <span style={{ fontSize: "20px" }}>🌟</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#5B21B6", margin: 0 }}>First-time voter?</p>
              <p style={{ fontSize: "12px", color: "#7C3AED", margin: 0, opacity: 0.8 }}>Follow our beginner guide — takes 3 minutes</p>
            </div>
            <ChevronRight size={16} color="#7C3AED" strokeWidth={2.5} />
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <p className="section-title" style={{ fontSize: "16px" }}>Quick Actions</p>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <TrendingUp size={12} color="var(--text-muted)" />
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>6 tools</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.id} href={action.href} id={`quick-action-${action.id}`} style={{
                  display: "flex", flexDirection: "column", gap: "8px", padding: "16px",
                  background: "var(--surface)", borderRadius: "14px", border: "1px solid var(--border)",
                  textDecoration: "none", transition: "all 0.15s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: action.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={action.color} strokeWidth={2} />
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>{action.label}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
        <div style={{ height: "16px" }} />
      </motion.section>
    </PageWrapper>
  );
}
