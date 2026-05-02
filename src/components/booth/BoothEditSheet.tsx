"use client";
import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Booth, BoothEdit } from "@/lib/booth-store";
import { saveBooth, resetBooth } from "@/lib/booth-store";
import { X, MapPin, Clock, Accessibility, RefreshCw, Check } from "lucide-react";

// ─── Validation Schema ────────────────────────────────────────────────────────
const boothEditSchema = z.object({
  boothName: z.string().min(3, "Booth name must be at least 3 characters").max(120),
  address:   z.string().min(5, "Address must be at least 5 characters").max(200),
  landmark:  z.string().min(3, "Landmark must be at least 3 characters").max(150),
  timings:   z.string().min(3, "Timings are required").max(60),
  accessible: z.boolean(),
});

type FormData = z.infer<typeof boothEditSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface BoothEditSheetProps {
  booth: Booth | null;
  onClose: () => void;
  onSaved: (boothNumber: string) => void;
}

// ─── Input Component ──────────────────────────────────────────────────────────
function Field({
  label, id, error, children,
}: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label htmlFor={id} style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" style={{ fontSize: "11px", color: "#DC2626", margin: 0 }}>{error}</p>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: "10px",
  border: "1.5px solid var(--border)", background: "var(--background)",
  fontSize: "14px", color: "var(--text)", outline: "none",
  fontFamily: "var(--font-sans)", boxSizing: "border-box",
};

const inputErrorStyle: React.CSSProperties = { ...inputStyle, borderColor: "#DC2626" };

// ─── Component ────────────────────────────────────────────────────────────────
export function BoothEditSheet({ booth, onClose, onSaved }: BoothEditSheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(boothEditSchema),
    defaultValues: booth ? {
      boothName:  booth.boothName,
      address:    booth.address,
      landmark:   booth.landmark,
      timings:    booth.timings,
      accessible: booth.accessible,
    } : undefined,
  });

  // Reset form when booth changes
  useEffect(() => {
    if (booth) {
      reset({
        boothName:  booth.boothName,
        address:    booth.address,
        landmark:   booth.landmark,
        timings:    booth.timings,
        accessible: booth.accessible,
      });
      // Focus first field after sheet animates in
      setTimeout(() => firstInputRef.current?.focus(), 300);
    }
  }, [booth, reset]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  const onSubmit = useCallback((data: FormData) => {
    if (!booth) return;
    const edit: BoothEdit = {
      boothName:  data.boothName,
      address:    data.address,
      landmark:   data.landmark,
      timings:    data.timings,
      accessible: data.accessible,
    };
    saveBooth(booth.boothNumber, edit);
    onSaved(booth.boothNumber);
    onClose();
  }, [booth, onSaved, onClose]);

  const handleReset = useCallback(() => {
    if (!booth) return;
    resetBooth(booth.boothNumber);
    onSaved(booth.boothNumber);
    onClose();
  }, [booth, onSaved, onClose]);

  const { ref: nameRef, ...nameRest } = register("boothName");

  return (
    <AnimatePresence>
      {booth && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(2px)", zIndex: 200,
            }}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Edit booth ${booth.boothNumber} information`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            style={{
              position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
              width: "100%", maxWidth: "480px", zIndex: 201,
              background: "var(--surface)", borderRadius: "20px 20px 0 0",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
              maxHeight: "88vh", overflowY: "auto",
            }}
          >
            {/* Handle bar */}
            <div style={{ width: "40px", height: "4px", background: "var(--border)", borderRadius: "2px", margin: "12px auto 0" }} aria-hidden="true" />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 0" }}>
              <div>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", margin: 0 }}>
                  Edit Booth Info
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>
                  Booth #{booth.boothNumber} · {booth.constituency}
                </p>
              </div>
              <button
                onClick={onClose}
                id="booth-edit-close"
                aria-label="Close edit panel"
                style={{
                  background: "var(--background)", border: "1px solid var(--border)",
                  borderRadius: "10px", padding: "6px", cursor: "pointer",
                  display: "flex", alignItems: "center",
                }}
              >
                <X size={16} color="var(--text)" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Booth Name */}
              <Field label="Booth Name" id="edit-booth-name" error={errors.boothName?.message}>
                <div style={{ position: "relative" }}>
                  <input
                    id="edit-booth-name"
                    type="text"
                    aria-invalid={!!errors.boothName}
                    aria-describedby={errors.boothName ? "edit-booth-name-error" : undefined}
                    style={errors.boothName ? inputErrorStyle : inputStyle}
                    ref={(el) => {
                      nameRef(el);
                      firstInputRef.current = el;
                    }}
                    {...nameRest}
                  />
                </div>
              </Field>

              {/* Address */}
              <Field label="Address" id="edit-address" error={errors.address?.message}>
                <div style={{ position: "relative" }}>
                  <MapPin size={14} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "12px", pointerEvents: "none" }} aria-hidden="true" />
                  <input
                    id="edit-address"
                    type="text"
                    aria-invalid={!!errors.address}
                    style={{ ...(errors.address ? inputErrorStyle : inputStyle), paddingLeft: "32px" }}
                    {...register("address")}
                  />
                </div>
              </Field>

              {/* Landmark */}
              <Field label="Nearby Landmark" id="edit-landmark" error={errors.landmark?.message}>
                <input
                  id="edit-landmark"
                  type="text"
                  aria-invalid={!!errors.landmark}
                  style={errors.landmark ? inputErrorStyle : inputStyle}
                  {...register("landmark")}
                />
              </Field>

              {/* Timings */}
              <Field label="Polling Timings" id="edit-timings" error={errors.timings?.message}>
                <div style={{ position: "relative" }}>
                  <Clock size={14} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "12px", pointerEvents: "none" }} aria-hidden="true" />
                  <input
                    id="edit-timings"
                    type="text"
                    aria-invalid={!!errors.timings}
                    style={{ ...(errors.timings ? inputErrorStyle : inputStyle), paddingLeft: "32px" }}
                    {...register("timings")}
                  />
                </div>
              </Field>

              {/* Accessibility toggle */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--background)", borderRadius: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Accessibility size={16} color="var(--accent)" strokeWidth={2} aria-hidden="true" />
                  <label htmlFor="edit-accessible" style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", cursor: "pointer" }}>
                    Wheelchair Accessible
                  </label>
                </div>
                <input
                  id="edit-accessible"
                  type="checkbox"
                  {...register("accessible")}
                  style={{ width: "18px", height: "18px", accentColor: "var(--accent)", cursor: "pointer" }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                <button
                  type="button"
                  onClick={handleReset}
                  id="booth-edit-reset"
                  aria-label="Reset to original booth data"
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    padding: "12px", borderRadius: "12px",
                    border: "1.5px solid var(--border)", background: "var(--background)",
                    fontSize: "13px", fontWeight: 600, color: "var(--text-muted)",
                    cursor: "pointer", fontFamily: "var(--font-sans)",
                  }}
                >
                  <RefreshCw size={14} strokeWidth={2.5} aria-hidden="true" />
                  Reset
                </button>
                <button
                  type="submit"
                  id="booth-edit-save"
                  disabled={isSubmitting || !isDirty}
                  aria-label="Save booth edits"
                  style={{
                    flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    padding: "12px", borderRadius: "12px",
                    background: isSubmitting || !isDirty ? "var(--border)" : "var(--accent)",
                    border: "none",
                    fontSize: "14px", fontWeight: 700, color: isSubmitting || !isDirty ? "var(--text-muted)" : "white",
                    cursor: isSubmitting || !isDirty ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-sans)", transition: "all 0.15s ease",
                  }}
                >
                  <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                  Save Changes
                </button>
              </div>

              <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
