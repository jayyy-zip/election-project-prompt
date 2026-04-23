"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { useState } from "react";
import documentsData from "@/data/documents.json";
import { CreditCard, BookOpen, Car, Briefcase, Heart, FileText, IdCard, CheckSquare, Square, ArrowRight, Info } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = { CreditCard, BookOpen, Car, Briefcase, Heart, FileText, IdCard };

const statusStyle = {
  required: { bg: "#FEF2F2", text: "#DC2626", label: "Required" },
  accepted: { bg: "#ECFDF5", text: "#059669", label: "Accepted" },
  optional:  { bg: "#FFFBEB", text: "#D97706", label: "Optional"  },
};

export default function DocumentsPage() {
  const [packed, setPacked] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setPacked((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  const total = documentsData.length;
  const packedCount = packed.size;
  const percent = Math.round((packedCount / total) * 100);

  const groups = [
    { label: "Primary ID", emoji: "⭐", docs: documentsData.filter((d) => d.category === "primary") },
    { label: "Accepted Alternates (Any One)", emoji: "✅", docs: documentsData.filter((d) => d.category === "alternate") },
    { label: "Supplementary", emoji: "📋", docs: documentsData.filter((d) => d.category === "supplementary") },
  ];

  return (
    <PageWrapper>
      <div style={{ paddingTop: "8px" }}>
        <p className="section-subtitle" style={{ marginBottom: "4px" }}>What to carry on voting day</p>
        <p style={{ fontSize: "22px", fontWeight: 800, color: "var(--text)", margin: "0 0 16px" }}>Document Checklist</p>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: "16px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", margin: 0 }}>Documents packed</p>
            <span style={{ fontSize: "20px", fontWeight: 800, color: packedCount === total ? "var(--success)" : "var(--accent)" }}>{packedCount}/{total}</span>
          </div>
          <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${percent}%` }} /></div>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "8px 0 0" }}>
            {packedCount === total ? "🎉 All packed! You're ready to vote." : packedCount === 0 ? "Tap each document to mark it as packed" : `${total - packedCount} document${total - packedCount > 1 ? "s" : ""} left to pack`}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          style={{ padding: "12px 14px", background: "var(--accent-light)", borderRadius: "12px", border: "1px solid #BFDBFE", display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "20px" }}>
          <Info size={15} color="var(--accent)" strokeWidth={2} style={{ flexShrink: 0, marginTop: "1px" }} />
          <p style={{ fontSize: "13px", color: "var(--accent)", margin: 0, lineHeight: 1.5 }}>
            You need <strong>any ONE</strong> valid photo ID. Your EPIC (Voter ID) is preferred — if you don&apos;t have it, any alternate is fine.
          </p>
        </motion.div>

        {groups.map((group) => group.docs.length === 0 ? null : (
          <motion.div key={group.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", margin: "0 0 10px", textTransform: "uppercase" as const, letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>{group.emoji}</span>{group.label}
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
              {group.docs.map((doc, idx) => {
                const Icon = iconMap[doc.icon] ?? FileText;
                const isPacked = packed.has(doc.id);
                const status = statusStyle[doc.status as keyof typeof statusStyle];
                return (
                  <motion.button key={doc.id} id={`doc-${doc.id}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }} onClick={() => toggle(doc.id)}
                    style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px", background: isPacked ? "#F0FDF4" : "var(--surface)", borderRadius: "12px", border: isPacked ? "1.5px solid #86EFAC" : "1px solid var(--border)", cursor: "pointer", textAlign: "left" as const, transition: "all 0.15s ease", fontFamily: "var(--font-sans)" }}>
                    <div style={{ flexShrink: 0, marginTop: "1px" }}>
                      {isPacked ? <CheckSquare size={20} color="#16A34A" strokeWidth={2} /> : <Square size={20} color="#CBD5E1" strokeWidth={1.5} />}
                    </div>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: isPacked ? "#DCFCE7" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={17} color={isPacked ? "#16A34A" : "#64748B"} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" as const }}>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", margin: 0, textDecoration: isPacked ? "line-through" : "none", opacity: isPacked ? 0.6 : 1 }}>{doc.name}</p>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: status.bg, color: status.text, textTransform: "uppercase" as const, letterSpacing: "0.3px" }}>{status.label}</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>{doc.note}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}

        <Link href="/booth" className="btn-primary" id="documents-find-booth-cta">
          Next: Find My Polling Booth <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
        <div style={{ height: "8px" }} />
      </div>
    </PageWrapper>
  );
}
