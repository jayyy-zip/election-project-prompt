"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import documentsData from "@/data/documents.json";
import { CHECKLIST_STORAGE_KEY } from "@/lib/constants";
import { storageGet, storageSet } from "@/lib/storage";
import { CreditCard, BookOpen, Car, Briefcase, Heart, FileText, IdCard, CheckSquare, Square, ArrowRight, Info, RotateCcw, PartyPopper } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = { CreditCard, BookOpen, Car, Briefcase, Heart, FileText, IdCard };

const statusStyle = {
  required: { bg: "#FEF2F2", text: "#DC2626", label: "Required" },
  accepted: { bg: "#ECFDF5", text: "#059669", label: "Accepted" },
  optional:  { bg: "#FFFBEB", text: "#D97706", label: "Optional"  },
};

const groups = [
  { label: "Primary ID", emoji: "⭐", docs: documentsData.filter((d) => d.category === "primary") },
  { label: "Accepted Alternates (Any One)", emoji: "✅", docs: documentsData.filter((d) => d.category === "alternate") },
  { label: "Supplementary", emoji: "📋", docs: documentsData.filter((d) => d.category === "supplementary") },
];

export default function DocumentsPage() {
  const [packed, setPacked] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    const saved = storageGet<string[]>(CHECKLIST_STORAGE_KEY, []);
    setPacked(new Set(saved));
    setHydrated(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setPacked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      // Persist immediately
      storageSet(CHECKLIST_STORAGE_KEY, Array.from(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setPacked(new Set());
    storageSet(CHECKLIST_STORAGE_KEY, []);
  }, []);

  const total = documentsData.length;
  const packedCount = packed.size;
  const percent = Math.round((packedCount / total) * 100);
  const allPacked = packedCount === total;

  const progressLabel =
    allPacked          ? "🎉 All packed! You're ready to vote."
    : packedCount === 0 ? "Tap each document to mark it as packed"
    : `${total - packedCount} document${total - packedCount > 1 ? "s" : ""} left to pack`;

  return (
    <PageWrapper ariaLabel="Document checklist — what to carry on voting day">
      <div style={{ paddingTop: "8px" }}>
        <p className="section-subtitle" style={{ marginBottom: "4px" }}>What to carry on voting day</p>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text)", margin: "0 0 16px" }}>
          Document Checklist
        </h1>

        {/* Progress Card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: "16px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", margin: 0 }} id="progress-label">
              Documents packed
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{ fontSize: "20px", fontWeight: 800, color: allPacked ? "var(--success)" : "var(--accent)" }}
                aria-live="polite" aria-atomic="true"
              >
                {hydrated ? packedCount : "—"}/{total}
              </span>
              {packedCount > 0 && (
                <button
                  onClick={reset}
                  id="checklist-reset-btn"
                  aria-label="Reset checklist"
                  title="Reset checklist"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                >
                  <RotateCcw size={14} color="var(--text-muted)" strokeWidth={2.5} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          <div
            className="progress-bar-track"
            role="progressbar"
            aria-valuenow={hydrated ? percent : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${percent}% of documents packed`}
            aria-describedby="progress-label"
          >
            <div className="progress-bar-fill" style={{ width: `${hydrated ? percent : 0}%` }} />
          </div>
          <p style={{ fontSize: "12px", color: allPacked ? "var(--success)" : "var(--text-muted)", margin: "8px 0 0", fontWeight: allPacked ? 600 : 400 }} aria-live="polite" aria-atomic="true">
            {hydrated ? progressLabel : "Loading…"}
          </p>
        </motion.div>

        {/* All-packed celebration banner */}
        {allPacked && hydrated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ marginBottom: "20px", padding: "14px 16px", background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "14px", display: "flex", gap: "10px", alignItems: "center" }}
            role="status"
          >
            <PartyPopper size={20} color="#16A34A" strokeWidth={2} aria-hidden="true" />
            <div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#166534", margin: 0 }}>You&apos;re all set!</p>
              <p style={{ fontSize: "12px", color: "#15803D", margin: "2px 0 0" }}>Everything is packed. Head to your polling booth on Election Day.</p>
            </div>
          </motion.div>
        )}

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          style={{ padding: "12px 14px", background: "var(--accent-light)", borderRadius: "12px", border: "1px solid #BFDBFE", display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "20px" }}
          role="note"
        >
          <Info size={15} color="var(--accent)" strokeWidth={2} style={{ flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
          <p style={{ fontSize: "13px", color: "var(--accent)", margin: 0, lineHeight: 1.5 }}>
            You need <strong>any ONE</strong> valid photo ID. Your EPIC (Voter ID) is preferred — if you don&apos;t have it, any alternate is fine.
          </p>
        </motion.div>

        {/* Document Groups */}
        {groups.map((group) =>
          group.docs.length === 0 ? null : (
            <motion.section
              key={group.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: "20px" }}
              aria-label={group.label}
            >
              <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span aria-hidden="true">{group.emoji}</span>{group.label}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} role="group" aria-label={`${group.label} documents`}>
                {group.docs.map((doc, idx) => {
                  const Icon = iconMap[doc.icon] ?? FileText;
                  const isPacked = packed.has(doc.id);
                  const status = statusStyle[doc.status as keyof typeof statusStyle];
                  return (
                    <motion.button
                      key={doc.id}
                      id={`doc-${doc.id}`}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      onClick={() => toggle(doc.id)}
                      role="checkbox"
                      aria-checked={isPacked}
                      aria-label={`${doc.name} — ${status.label}${isPacked ? " — packed" : " — not packed"}`}
                      style={{
                        width: "100%", display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px",
                        background: isPacked ? "#F0FDF4" : "var(--surface)", borderRadius: "12px",
                        border: isPacked ? "1.5px solid #86EFAC" : "1px solid var(--border)",
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s ease",
                        fontFamily: "var(--font-sans)", minHeight: "56px",
                      }}
                    >
                      <div style={{ flexShrink: 0, marginTop: "1px" }} aria-hidden="true">
                        {isPacked
                          ? <CheckSquare size={20} color="#16A34A" strokeWidth={2} />
                          : <Square size={20} color="#CBD5E1" strokeWidth={1.5} />}
                      </div>
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: isPacked ? "#DCFCE7" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden="true">
                        <Icon size={17} color={isPacked ? "#16A34A" : "#64748B"} strokeWidth={2} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", margin: 0, textDecoration: isPacked ? "line-through" : "none", opacity: isPacked ? 0.6 : 1 }}>
                            {doc.name}
                          </p>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: status.bg, color: status.text, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                            {status.label}
                          </span>
                        </div>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>{doc.note}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          )
        )}

        <Link href="/booth" className="btn-primary" id="documents-find-booth-cta" aria-label="Find my polling booth — next step">
          Next: Find My Polling Booth <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
        </Link>
        <div style={{ height: "8px" }} />
      </div>
    </PageWrapper>
  );
}
