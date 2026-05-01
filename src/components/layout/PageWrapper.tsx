"use client";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { motion } from "framer-motion";

interface PageWrapperProps {
  children: React.ReactNode;
  /** Optional accessible label for the main content region */
  ariaLabel?: string;
}

export function PageWrapper({ children, ariaLabel }: PageWrapperProps) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Header />
      <motion.main
        className="page-container"
        aria-label={ariaLabel}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" as const }}
      >
        {children}
      </motion.main>
      <BottomNav />
    </div>
  );
}
