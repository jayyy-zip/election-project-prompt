"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastItemProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

const toastConfig = {
  success: { icon: CheckCircle, bg: "#F0FDF4", border: "#86EFAC", text: "#166534", iconColor: "#16A34A" },
  error:   { icon: XCircle,    bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B", iconColor: "#DC2626" },
  warning: { icon: AlertCircle,bg: "#FFFBEB", border: "#FDE68A", text: "#92400E", iconColor: "#D97706" },
  info:    { icon: Info,        bg: "#EFF6FF", border: "#BFDBFE", text: "#1E40AF", iconColor: "#2563EB" },
};

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const cfg = toastConfig[toast.type];
  const Icon = cfg.icon;

  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), toast.duration ?? 3000);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      role="alert"
      aria-live="assertive"
      style={{
        display: "flex", alignItems: "flex-start", gap: "10px",
        padding: "12px 14px",
        background: cfg.bg, border: `1px solid ${cfg.border}`,
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        minWidth: "260px", maxWidth: "340px",
        pointerEvents: "auto",
      }}
    >
      <Icon size={16} color={cfg.iconColor} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
      <p style={{ fontSize: "13px", color: cfg.text, margin: 0, lineHeight: 1.5, flex: 1, fontWeight: 500 }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        style={{
          background: "none", border: "none", cursor: "pointer", padding: "0",
          color: cfg.text, opacity: 0.6, display: "flex", alignItems: "center",
          flexShrink: 0,
        }}
      >
        <X size={14} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </motion.div>
  );
}

/** Render a stack of toasts fixed at the top of the screen */
export function ToastContainer({ toasts, onRemove }: { toasts: ToastData[]; onRemove: (id: string) => void }) {
  return (
    <div
      aria-label="Notifications"
      style={{
        position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)",
        zIndex: 9999, display: "flex", flexDirection: "column", gap: "8px",
        alignItems: "center", pointerEvents: "none",
        width: "calc(100% - 32px)", maxWidth: "440px",
      }}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Hook to manage a list of toasts */
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info", duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
