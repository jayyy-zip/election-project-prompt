"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import candidatesData from "@/data/candidates.json";
import { ExternalLink, CheckCircle, Scale, Users } from "lucide-react";

export default function CandidatesPage() {
  return (
    <PageWrapper>
      <div style={{ paddingTop: "8px" }}>
        <p className="section-subtitle" style={{ marginBottom: "4px" }}>Andheri West Constituency</p>
        <p style={{ fontSize: "22px", fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Candidates</p>
        <p className="section-subtitle" style={{ marginBottom: "16px" }}>Neutral overview · No endorsements</p>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: "12px 14px", background: "#F0FDF4", borderRadius: "12px", border: "1px solid #A7F3D0", display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "20px" }}>
          <Scale size={15} color="#059669" strokeWidth={2} style={{ flexShrink: 0, marginTop: "1px" }} />
          <p style={{ fontSize: "13px", color: "#065F46", margin: 0, lineHeight: 1.5 }}>
            This app presents all candidates equally and does not endorse any party or individual. Make your own informed decision.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: "14px" }}>
          {candidatesData.map((candidate, idx) => (
            <motion.div key={candidate.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="card" style={{ padding: "18px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "14px" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "14px", background: `${candidate.partyColor}15`, border: `2px solid ${candidate.partyColor}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "18px", fontWeight: 800, color: candidate.partyColor, fontFamily: "var(--font-sans)" }}>
                  {candidate.partyInitials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                    <div>
                      <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", margin: "0 0 2px" }}>{candidate.name}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Age {candidate.age} · {candidate.education.split(",")[0]}</p>
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px", background: candidate.partyColor + "15", color: candidate.partyColor, textTransform: "uppercase" as const, letterSpacing: "0.3px", flexShrink: 0 }}>
                      {candidate.partyInitials}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "6px 0 0", lineHeight: 1.45 }}>{candidate.party}</p>
                </div>
              </div>

              <div style={{ padding: "10px 12px", background: "var(--background)", borderRadius: "10px", marginBottom: "12px" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", margin: "0 0 4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Background</p>
                <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: 1.5 }}>{candidate.background}</p>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", margin: "0 0 8px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Key Focus Areas</p>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: "5px" }}>
                  {candidate.keyPoints.map((point, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <CheckCircle size={13} color={candidate.partyColor} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: 1.4 }}>{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <CheckCircle size={12} color="#059669" strokeWidth={2.5} />
                  <span style={{ fontSize: "11px", color: "#059669", fontWeight: 600 }}>{candidate.verificationStatus}</span>
                </div>
                <a href={candidate.officialLink} id={`candidate-link-${candidate.id}`}
                  style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                  Official Site<ExternalLink size={12} strokeWidth={2} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.4 } }}
          style={{ marginTop: "20px", padding: "14px 16px", background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", textAlign: "center" }}>
          <Users size={22} color="var(--text-muted)" strokeWidth={1.5} style={{ marginBottom: "8px" }} />
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
            All candidate data is sourced from public ECI declarations. Visit <strong>affidavit.eci.gov.in</strong> for full candidate affidavits.
          </p>
        </motion.div>
        <div style={{ height: "8px" }} />
      </div>
    </PageWrapper>
  );
}
