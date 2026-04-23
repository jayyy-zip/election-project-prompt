"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import stepsData from "@/data/election-steps.json";
import { ClipboardCheck, MapPin, FolderOpen, Calendar, Vote, CheckCircle, ChevronDown, ChevronUp, Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = { ClipboardCheck, MapPin, FolderOpen, Calendar, Vote, CheckCircle };

const stepColors = [
  { accent: "#2563EB", light: "#EFF6FF" },
  { accent: "#059669", light: "#ECFDF5" },
  { accent: "#D97706", light: "#FFFBEB" },
  { accent: "#7C3AED", light: "#F5F3FF" },
  { accent: "#DB2777", light: "#FDF2F8" },
  { accent: "#0891B2", light: "#ECFEFF" },
];

export default function GuidePage() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <PageWrapper>
      <div style={{ paddingTop: "8px" }}>
        <p className="section-subtitle" style={{ marginBottom: "4px" }}>Your complete guide</p>
        <p style={{ fontSize: "22px", fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>How to Vote in India</p>
        <p className="section-subtitle" style={{ marginBottom: "20px" }}>6 simple steps — tap each to learn more</p>

        <div className="card" style={{ padding: "14px 16px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", margin: 0 }}>Election Progress</p>
            <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600 }}>Registration Closed</span>
          </div>
          <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: "35%" }} /></div>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "6px 0 0" }}>Polling Day: May 7, 2026 · Steps 1–2 complete</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {stepsData.map((step, index) => {
            const Icon = iconMap[step.icon] ?? CheckCircle;
            const color = stepColors[index % stepColors.length];
            const isExpanded = expandedId === step.id;
            return (
              <motion.div key={step.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07, duration: 0.28 }}>
                <div className="card" style={{ overflow: "hidden", border: isExpanded ? `1.5px solid ${color.accent}40` : "1px solid var(--border)" }}>
                  <button
                    id={`step-${step.id}-toggle`}
                    onClick={() => setExpandedId(isExpanded ? null : step.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: isExpanded ? color.accent : color.light, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s ease" }}>
                      <Icon size={20} color={isExpanded ? "white" : color.accent} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: color.accent, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Step {step.id}</span>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>{step.title}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>{step.shortDesc}</p>
                    </div>
                    <div style={{ flexShrink: 0, color: "var(--text-muted)" }}>
                      {isExpanded ? <ChevronUp size={18} strokeWidth={2} /> : <ChevronDown size={18} strokeWidth={2} />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
                        <div style={{ padding: "0 16px 16px" }}>
                          <div style={{ height: "1px", background: "var(--border)", margin: "0 0 14px" }} />
                          <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.65, margin: "0 0 14px" }}>{step.details}</p>
                          {step.tips.length > 0 && (
                            <div style={{ background: color.light, borderRadius: "10px", padding: "12px 14px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                                <Lightbulb size={13} color={color.accent} strokeWidth={2.5} />
                                <span style={{ fontSize: "11px", fontWeight: 700, color: color.accent, textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Quick Tips</span>
                              </div>
                              <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column" as const, gap: "4px" }}>
                                {step.tips.map((tip, i) => <li key={i} style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.5 }}>{tip}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div style={{ marginTop: "20px" }}>
          <Link href="/booth" className="btn-primary" id="guide-find-booth-cta">
            Find My Polling Booth <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
        <div style={{ height: "8px" }} />
      </div>
    </PageWrapper>
  );
}
