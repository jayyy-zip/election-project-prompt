"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import faqData from "@/data/faq.json";
import { sanitizeText, isSafeInput } from "@/lib/sanitize";
import { askGemini, isGeminiConfigured } from "@/lib/gemini";
import { Send, Bot, User, ArrowRight, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  relatedPage?: string | null;
  relatedPageLabel?: string | null;
}

interface FaqItem {
  id: number; question: string; keywords: string[]; answer: string;
  category: string; relatedPage: string | null; relatedPageLabel: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_CHARS = 500;

const SUGGESTED_QUESTIONS = [
  "How do I vote?",
  "What documents should I carry?",
  "Where is my polling booth?",
  "When is the election?",
  "I lost my voter ID",
  "What time do booths open?",
];

const FALLBACK_MESSAGE =
  "I'm not sure about that specific question. You can call the **National Voter Helpline at 1950** for immediate help, or visit **voters.eci.gov.in** for official information.";

const WELCOME_MESSAGE = isGeminiConfigured()
  ? "👋 Hi! I'm your AI-powered Election Assistant (Gemini). Ask me anything about voting in India!"
  : "👋 Hi! I'm your Election Assistant. Ask me anything about voting — documents, booth location, process, deadlines, or candidates!";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function findFaqAnswer(query: string): FaqItem | null {
  const q = query.toLowerCase();
  let best: FaqItem | null = null;
  let maxScore = 0;
  for (const faq of faqData as FaqItem[]) {
    let score = 0;
    for (const kw of faq.keywords) {
      if (q.includes(kw.toLowerCase())) score++;
    }
    if (score > maxScore) { maxScore = score; best = faq; }
  }
  return maxScore > 0 ? best : null;
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
}

function parseMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} style={{ margin: i === 0 ? 0 : "5px 0 0", lineHeight: 1.6, fontSize: "14px" }}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
      </p>
    );
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChatPage() {
  const makeWelcome = (): Message => ({
    id: makeId("welcome"),
    role: "bot",
    text: WELCOME_MESSAGE,
    relatedPage: null,
    relatedPageLabel: null,
  });

  const [messages, setMessages] = useState<Message[]>([makeWelcome()]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on every message or typing indicator change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(async (rawText: string) => {
    const text = sanitizeText(rawText.trim());
    if (!isSafeInput(text) || isTyping) return;

    const userMsg: Message = { id: makeId("u"), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      let botText: string;
      let relatedPage: string | null = null;
      let relatedPageLabel: string | null = null;

      if (isGeminiConfigured()) {
        try {
          botText = await askGemini(text);
        } catch {
          const faq = findFaqAnswer(text);
          botText = faq ? faq.answer : FALLBACK_MESSAGE;
          relatedPage = faq?.relatedPage ?? null;
          relatedPageLabel = faq?.relatedPageLabel ?? null;
        }
      } else {
        const faq = findFaqAnswer(text);
        botText = faq ? faq.answer : FALLBACK_MESSAGE;
        relatedPage = faq?.relatedPage ?? null;
        relatedPageLabel = faq?.relatedPageLabel ?? null;
      }

      setMessages((prev) => [
        ...prev,
        { id: makeId("b"), role: "bot", text: botText, relatedPage, relatedPageLabel },
      ]);
    } finally {
      setIsTyping(false);
      // Return focus to input after bot replies
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearConversation = useCallback(() => {
    setMessages([makeWelcome()]);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 50);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const charCount = input.length;
  const canSend = input.trim().length > 0 && !isTyping;

  return (
    <div
      style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "var(--background)", maxWidth: "480px", margin: "0 auto" }}
      role="main"
      aria-label="Election assistant chatbot"
    >
      {/* ── Header ── */}
      <header style={{ padding: "14px 16px", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden="true">
          <Bot size={20} color="white" strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", margin: 0 }}>Election Assistant</p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10B981" }} aria-hidden="true" />
            <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>Online · Replies instantly</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }} aria-hidden="true">
          {isGeminiConfigured() && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Sparkles size={13} color="var(--accent)" strokeWidth={2} />
              <span style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 600 }}>Gemini AI</span>
            </div>
          )}
          <button
            onClick={clearConversation}
            id="chat-clear-btn"
            aria-label="Clear conversation"
            title="Clear conversation"
            style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "8px", padding: "6px", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <Trash2 size={14} color="var(--text-muted)" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* ── Message List ── */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation history"
        aria-relevant="additions"
        style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}
      >
        {/* Suggested chips — only visible at start */}
        {messages.length === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.25 } }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", margin: "0 0 10px" }}>
              Tap a question to get started, or type your own below
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }} role="group" aria-label="Suggested questions">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  id={`suggest-q-${q.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => sendMessage(q)}
                  aria-label={`Ask: ${q}`}
                  disabled={isTyping}
                  style={{
                    padding: "7px 14px", background: "var(--surface)", border: "1.5px solid var(--border)",
                    borderRadius: "20px", fontSize: "13px", color: "var(--text)", cursor: "pointer",
                    fontFamily: "var(--font-sans)", minHeight: "36px", opacity: isTyping ? 0.5 : 1,
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: "6px" }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", maxWidth: "88%", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                <div
                  style={{ width: "28px", height: "28px", borderRadius: "50%", background: msg.role === "user" ? "var(--accent)" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  aria-hidden="true"
                >
                  {msg.role === "user"
                    ? <User size={14} color="white" strokeWidth={2} />
                    : <Bot size={14} color="var(--accent)" strokeWidth={2} />}
                </div>
                <div
                  className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"}
                  style={{ padding: "10px 14px" }}
                  aria-label={msg.role === "user" ? "Your message" : "Assistant reply"}
                >
                  {msg.role === "bot"
                    ? parseMarkdown(msg.text)
                    : <p style={{ fontSize: "14px", margin: 0 }}>{msg.text}</p>}
                </div>
              </div>
              {msg.role === "bot" && msg.relatedPage && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }} style={{ marginLeft: "36px" }}>
                  <Link
                    href={msg.relatedPage}
                    id={`chat-link-${msg.id}`}
                    aria-label={`${msg.relatedPageLabel} — opens in app`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", background: "var(--accent-light)", color: "var(--accent)", borderRadius: "20px", textDecoration: "none", fontSize: "12px", fontWeight: 600 }}
                  >
                    {msg.relatedPageLabel}<ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
              role="status" aria-live="polite" aria-label="Assistant is typing"
            >
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }} aria-hidden="true">
                <Bot size={14} color="var(--accent)" strokeWidth={2} />
              </div>
              <div className="chat-bubble-bot" style={{ padding: "12px 16px", display: "flex", gap: "4px", alignItems: "center" }} aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#CBD5E1", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
                <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar ── */}
      <div style={{ padding: "10px 16px calc(10px + env(safe-area-inset-bottom))", background: "var(--surface)", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label htmlFor="chat-input" className="sr-only">Type your question about voting</label>
          <input
            ref={inputRef}
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about voting…"
            autoComplete="off"
            aria-label="Type your question"
            aria-describedby={charCount > 400 ? "chat-char-count" : undefined}
            maxLength={MAX_CHARS}
            disabled={isTyping}
            style={{
              flex: 1, padding: "11px 14px", borderRadius: "12px",
              border: "1.5px solid var(--border)", background: "var(--background)",
              fontSize: "14px", color: "var(--text)", outline: "none",
              fontFamily: "var(--font-sans)", opacity: isTyping ? 0.6 : 1,
            }}
          />
          <button
            id="chat-send-btn"
            onClick={() => sendMessage(input)}
            disabled={!canSend}
            aria-label="Send message"
            aria-disabled={!canSend}
            style={{
              width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
              background: canSend ? "var(--accent)" : "#E2E8F0",
              border: "none", cursor: canSend ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s ease",
            }}
          >
            <Send size={17} color={canSend ? "white" : "#94A3B8"} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        {charCount > 400 && (
          <p id="chat-char-count" style={{ fontSize: "11px", color: charCount >= MAX_CHARS ? "#DC2626" : "var(--text-muted)", margin: "4px 0 0", textAlign: "right" }}>
            {charCount}/{MAX_CHARS}
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
