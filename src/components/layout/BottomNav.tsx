"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MapPin, Calendar, MessageCircle } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/guide", icon: BookOpen, label: "Guide" },
  { href: "/booth", icon: MapPin, label: "Booth" },
  { href: "/chat", icon: MessageCircle, label: "Ask" },
  { href: "/timeline", icon: Calendar, label: "Dates" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 8px" }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              id={`nav-${label.toLowerCase()}`}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
                padding: "6px 12px", borderRadius: "12px", textDecoration: "none",
                transition: "all 0.15s ease",
                color: active ? "var(--accent)" : "var(--text-muted)",
                background: active ? "var(--accent-light)" : "transparent",
                minWidth: "56px",
                minHeight: "48px",       // WCAG touch target
                justifyContent: "center",
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} aria-hidden="true" />
              <span style={{ fontSize: "10px", fontWeight: active ? 700 : 500 }}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
