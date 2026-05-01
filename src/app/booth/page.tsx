"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import boothData from "@/data/booth-data.json";
import { sanitizeText } from "@/lib/sanitize";
import { Search, MapPin, Clock, Users, Navigation, CheckCircle, XCircle, Accessibility, ArrowRight } from "lucide-react";

const searchSchema = z.object({
  query: z
    .string()
    .min(2, "Enter at least 2 characters")
    .max(100, "Query too long")
    .transform((v) => sanitizeText(v)),
});
type SearchForm = z.infer<typeof searchSchema>;

interface BoothResult {
  boothNumber: string; boothName: string; address: string; landmark: string;
  timings: string; accessible: boolean; distanceKm: number;
  mapLat: number; mapLng: number; totalVoters: number; presiding_officer: string; constituency: string;
}

const MAPS_API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY;

function getMapsEmbedUrl(lat: number, lng: number): string | null {
  if (!MAPS_API_KEY) return null;
  const q = encodeURIComponent(`${lat},${lng}`);
  return `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${q}&zoom=16`;
}

function getMapsLinkUrl(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${encodeURIComponent(String(lat))},${encodeURIComponent(String(lng))}`;
}

const suggestedAreas = ["Andheri West", "Bandra East", "Juhu", "Powai", "Versova"];

export default function BoothPage() {
  const [results, setResults] = useState<BoothResult[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
  });

  const doSearch = useCallback((query: string) => {
    const safe = sanitizeText(query);
    if (!safe) return;
    setIsLoading(true);
    setSearched(true);
    setTimeout(() => {
      const q = safe.toLowerCase();
      const matched: BoothResult[] = [];
      boothData.constituencies.forEach((c) => {
        if (
          c.name.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
        ) {
          c.booths.forEach((b) => matched.push({ ...b, constituency: c.name }));
        }
      });
      setResults(matched);
      setIsLoading(false);
    }, 600);
  }, []);

  const onSearch = (data: SearchForm) => doSearch(data.query);

  return (
    <PageWrapper ariaLabel="Polling Booth Finder — search for your assigned booth">
      <div style={{ paddingTop: "8px" }}>
        <p className="section-subtitle" style={{ marginBottom: "4px" }}>Find where to vote</p>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text)", margin: "0 0 16px" }}>
          Polling Booth Finder
        </h1>

        <form onSubmit={handleSubmit(onSearch)} noValidate role="search" aria-label="Search for polling booth">
          <label htmlFor="booth-search-input" className="sr-only">
            Search by area or constituency name
          </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} aria-hidden="true">
                <MapPin size={17} strokeWidth={2} />
              </div>
              <input
                {...register("query")}
                id="booth-search-input"
                type="search"
                autoComplete="off"
                placeholder="Type your area or constituency..."
                aria-required="true"
                aria-invalid={!!errors.query}
                aria-describedby={errors.query ? "booth-search-error" : undefined}
                style={{
                  width: "100%", padding: "13px 14px 13px 40px", borderRadius: "12px",
                  border: errors.query ? "1.5px solid #DC2626" : "1.5px solid var(--border)",
                  background: "var(--surface)", fontSize: "14px", color: "var(--text)",
                  outline: "none", fontFamily: "var(--font-sans)",
                }}
              />
            </div>
            <button
              type="submit"
              id="booth-search-btn"
              disabled={isLoading}
              aria-label="Search for polling booth"
              aria-busy={isLoading}
              style={{
                padding: "13px 18px", background: "var(--accent)", color: "white", border: "none",
                borderRadius: "12px", cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", opacity: isLoading ? 0.7 : 1,
                minHeight: "48px",
              }}
            >
              <Search size={18} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
          {errors.query && (
            <p id="booth-search-error" role="alert" style={{ fontSize: "12px", color: "#DC2626", margin: "6px 0 0 4px" }}>
              {errors.query.message}
            </p>
          )}
        </form>

        {/* Suggestions */}
        {!searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "16px" }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 8px", fontWeight: 500 }}>
              Try searching for:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px" }} role="list" aria-label="Suggested areas">
              {suggestedAreas.map((area) => (
                <button
                  key={area}
                  id={`suggest-${area.toLowerCase().replace(/\s/g, "-")}`}
                  onClick={() => doSearch(area)}
                  role="listitem"
                  aria-label={`Search for booths in ${area}`}
                  style={{
                    padding: "6px 14px", border: "1.5px solid var(--border)", borderRadius: "20px",
                    background: "var(--surface)", fontSize: "13px", color: "var(--text)", cursor: "pointer",
                    fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: "4px",
                    minHeight: "36px",
                  }}
                >
                  <MapPin size={12} color="var(--accent)" strokeWidth={2.5} aria-hidden="true" />{area}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "32px 0" }}
              role="status"
              aria-live="polite"
              aria-label="Searching for booths"
            >
              <div style={{ width: "40px", height: "40px", border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} aria-hidden="true" />
              <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Searching booths...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {!isLoading && searched && results !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: "20px" }}
              aria-live="polite"
              aria-label={results.length === 0 ? "No booths found" : `${results.length} booth${results.length > 1 ? "s" : ""} found`}
            >
              {results.length === 0 ? (
                <div className="card" style={{ padding: "32px 20px", textAlign: "center" }} role="status">
                  <XCircle size={40} color="#CBD5E1" strokeWidth={1.5} style={{ marginBottom: "12px" }} aria-hidden="true" />
                  <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", margin: "0 0 6px" }}>No booths found</p>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
                    Try: Andheri West, Bandra East, Juhu, Powai, or Versova
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 10px" }} aria-live="polite">
                    {results.length} booth{results.length > 1 ? "s" : ""} found
                  </p>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
                    {results.map((booth, idx) => {
                      const embedUrl = getMapsEmbedUrl(booth.mapLat, booth.mapLng);
                      const linkUrl = getMapsLinkUrl(booth.mapLat, booth.mapLng);
                      return (
                        <motion.article
                          key={`${booth.boothNumber}-${idx}`}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="card"
                          style={{ padding: "18px" }}
                          aria-label={`Booth ${booth.boothNumber}: ${booth.boothName}`}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                                <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent)", background: "var(--accent-light)", padding: "2px 8px", borderRadius: "6px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>
                                  Booth #{booth.boothNumber}
                                </span>
                                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{booth.constituency}</span>
                              </div>
                              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>
                                {booth.boothName}
                              </h2>
                            </div>
                            <div style={{ background: "#ECFDF5", borderRadius: "8px", padding: "4px 8px", fontSize: "12px", fontWeight: 600, color: "#059669", flexShrink: 0, marginLeft: "8px" }}>
                              {booth.distanceKm} km
                            </div>
                          </div>

                          <dl style={{ display: "flex", flexDirection: "column" as const, gap: "7px", margin: 0 }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                              <MapPin size={14} color="var(--text-muted)" strokeWidth={2} style={{ flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
                              <div>
                                <dt className="sr-only">Address</dt>
                                <dd style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: 1.4 }}>{booth.address}</dd>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <Clock size={14} color="var(--text-muted)" strokeWidth={2} aria-hidden="true" />
                              <div>
                                <dt className="sr-only">Timings</dt>
                                <dd style={{ fontSize: "13px", color: "var(--text)", margin: 0 }}>{booth.timings}</dd>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <Users size={14} color="var(--text-muted)" strokeWidth={2} aria-hidden="true" />
                              <div>
                                <dt className="sr-only">Registered voters</dt>
                                <dd style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>{booth.totalVoters.toLocaleString()} registered voters</dd>
                              </div>
                            </div>
                            {booth.accessible && (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Accessibility size={14} color="#059669" strokeWidth={2} aria-hidden="true" />
                                <div>
                                  <dt className="sr-only">Accessibility</dt>
                                  <dd style={{ fontSize: "13px", color: "#059669", margin: 0, fontWeight: 500 }}>Wheelchair accessible</dd>
                                </div>
                              </div>
                            )}
                          </dl>

                          <div style={{ marginTop: "10px", padding: "8px 12px", background: "var(--background)", borderRadius: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                            <span aria-hidden="true">📍 </span>{booth.landmark}
                          </div>

                          {/* Google Maps Embed when key available, else plain link */}
                          {embedUrl ? (
                            <div style={{ marginTop: "12px", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)" }}>
                              <iframe
                                src={embedUrl}
                                title={`Map showing location of ${booth.boothName}`}
                                width="100%"
                                height="180"
                                style={{ border: 0, display: "block" }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                sandbox="allow-scripts allow-same-origin allow-popups"
                              />
                            </div>
                          ) : null}

                          <a
                            href={linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            id={`booth-directions-${booth.boothNumber}`}
                            aria-label={`Open ${booth.boothName} in Google Maps`}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                              marginTop: "10px", padding: "10px",
                              background: "var(--accent-light)", color: "var(--accent)",
                              borderRadius: "10px", textDecoration: "none", fontSize: "13px", fontWeight: 600,
                              minHeight: "44px",
                            }}
                          >
                            <Navigation size={15} strokeWidth={2} aria-hidden="true" />
                            Open in Google Maps
                            <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                          </a>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!searched && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}
            className="card"
            style={{ padding: "14px 16px", marginTop: "16px", background: "var(--accent-light)", borderColor: "#BFDBFE" }}
            role="note"
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <CheckCircle size={16} color="var(--accent)" strokeWidth={2} style={{ flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
              <p style={{ fontSize: "13px", color: "var(--accent)", margin: 0, lineHeight: 1.5 }}>
                Your booth is assigned based on your registered address. You can also call{" "}
                <strong><a href="tel:1950" style={{ color: "inherit" }}>1950</a></strong>{" "}
                (Voter Helpline) for help.
              </p>
            </div>
          </motion.div>
        )}
        <div style={{ height: "8px" }} />
      </div>
    </PageWrapper>
  );
}
