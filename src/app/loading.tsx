/**
 * Global loading skeleton shown during Next.js route transitions.
 * Keeps the loading state clean, minimal, and on-brand.
 */
export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        display: "flex",
        flexDirection: "column",
        maxWidth: "480px",
        margin: "0 auto",
      }}
      role="status"
      aria-label="Loading page"
    >
      {/* Header skeleton */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "10px",
            background: "var(--border)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: "80px",
            height: "14px",
            borderRadius: "6px",
            background: "var(--border)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Content skeleton lines */}
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {[100, 70, 90, 60, 80].map((w, i) => (
          <div
            key={i}
            style={{
              width: `${w}%`,
              height: "14px",
              borderRadius: "6px",
              background: "var(--border)",
              animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
