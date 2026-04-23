"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "VoteSmart",
  "/guide": "Voter Guide",
  "/booth": "Booth Finder",
  "/documents": "Documents",
  "/timeline": "Key Dates",
  "/chat": "Ask Anything",
  "/candidates": "Candidates",
};

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const title = pageTitles[pathname] ?? "VoteSmart";
  return (
    <header style={{
      display: "flex", alignItems: "center", padding: "16px 16px 12px", gap: "8px",
      position: "sticky", top: 0,
      background: "rgba(248,249,252,0.95)", backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)", zIndex: 50,
    }}>
      {!isHome && (
        <Link href="/" id="header-back-btn" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "36px", height: "36px", borderRadius: "10px",
          background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", flexShrink: 0,
        }}>
          <ChevronLeft size={18} strokeWidth={2.5} />
        </Link>
      )}
      <div style={{ flex: 1 }}>
        {isHome ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "10px",
              background: "var(--accent)", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "16px",
            }}>🗳️</div>
            <div>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.2 }}>VoteSmart</p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>India Election Assistant</p>
            </div>
          </div>
        ) : (
          <h1 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)", margin: 0 }}>{title}</h1>
        )}
      </div>
    </header>
  );
}
