"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import faqData from "@/data/faq.json";
import { Send, Bot, User, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";

interface Message {
  id: string; role: "user" | "bot"; text: string;
  relatedPage?: string | null; relatedPageLabel?: string | null;
}

interface FaqItem {
  id: number; question: string; keywords: string[]; answer: string;
  category: string; relatedPage: string | null; relatedPageLabel: string | null;
}

const suggestedQuestions = ["How do I vote?", "What documents should I carry?", "Where is my polling booth?", "When is the election?", "I lost my voter ID", "What time do booths open?"];

function findAnswer(query: string): FaqItem | null {
  const q = query.toLowerCase();
  let best: FaqItem | null = null;
  let maxScore = 0;
  for (const faq of faqData as FaqItem[]) {
    let score = 0;
    for (const kw of faq.keywords) { if (q.includes(kw.toLowerCase())) score++; }
    if (score > maxScore) { maxScore = score; best = faq; }
  }
  return best;
}

function formatAnswer(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} style={{ margin: i === 0 ? 0 : "4px 0 0", lineHeight: 1.55, fontSize: "14px" }}>
        {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
      </p>
    );
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "bot", text: "👋 Hi! I'm your Election Assistant. Ask me anything about voting — documents, booth location, process, deadlines, or candidates!", relatedPage: null, relatedPageLabel: null },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: text.trim() }]);
    setInput(""); setIsTyping(true);
    setTimeout(() => {
      const faq = findAnswer(text);
      setMessages((prev) => [...prev, {
        id: `b-${Date.now()}`, role: "bot",
        text: faq ? faq.answer : "I'm not sure about that yet, but you can call the **National Voter Helpline at 1950** for immediate help!",
        relatedPage: faq?.relatedPage ?? null,
        relatedPageLabel: faq?.relatedPageLabel ?? null,
      }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--background)", maxWidth: "480px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "16px", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bot size={20} color="white" strokeWidth={2} />
        </div>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", margin: 0 }}>Election Assistant</p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10B981" }} />
            <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>Online · Replies instantly</p>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
          <Sparkles size={14} color="var(--accent)" strokeWidth={2} />
          <span style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 600 }}>AI</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", margin: "0 0 10px" }}>Tap a question to get started</p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px", justifyContent: "center" }}>
              {suggestedQuestions.map((q) => (
                <button key={q} id={`suggest-q-${q.replace(/\s+/g, "-").toLowerCase()}`} onClick={() => sendMessage(q)}
                  style={{ padding: "7px 14px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "20px", fontSize: "13px", color: "var(--text)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.22 }}
              style={{ display: "flex", flexDirection: "column" as const, alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", maxWidth: "85%", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: msg.role === "user" ? "var(--accent)" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {msg.role === "user" ? <User size={14} color="white" strokeWidth={2} /> : <Bot size={14} color="var(--accent)" strokeWidth={2} />}
                </div>
                <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"} style={{ padding: "10px 14px" }}>
                  {msg.role === "bot" ? formatAnswer(msg.text) : <p style={{ fontSize: "14px", margin: 0 }}>{msg.text}</p>}
                </div>
              </div>
              {msg.role === "bot" && msg.relatedPage && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} style={{ marginLeft: "36px" }}>
                  <Link href={msg.relatedPage} id={`chat-link-${msg.id}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", background: "var(--accent-light)", color: "var(--accent)", borderRadius: "20px", textDecoration: "none", fontSize: "12px", fontWeight: 600 }}>
                    {msg.relatedPageLabel}<ArrowRight size={12} strokeWidth={2.5} />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={14} color="var(--accent)" strokeWidth={2} />
              </div>
              <div className="chat-bubble-bot" style={{ padding: "12px 16px", display: "flex", gap: "4px", alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#CBD5E1", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
                <style>{`@keyframes bounce { 0%,80%,100% { transform: translateY(0) } 40% { transform: translateY(-6px) } }`}</style>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px calc(12px + env(safe-area-inset-bottom))", background: "var(--surface)", borderTop: "1px solid var(--border)", display: "flex", gap: "10px", alignItems: "center", flexShrink: 0 }}>
        <input id="chat-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage(input)} placeholder="Ask anything about voting..."
          style={{ flex: 1, padding: "11px 14px", borderRadius: "12px", border: "1.5px solid var(--border)", background: "var(--background)", fontSize: "14px", color: "var(--text)", outline: "none", fontFamily: "var(--font-sans)" }} />
        <button id="chat-send-btn" onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
          style={{ width: "42px", height: "42px", borderRadius: "12px", background: input.trim() ? "var(--accent)" : "var(--border)", border: "none", cursor: input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s ease", flexShrink: 0 }}>
          <Send size={17} color={input.trim() ? "white" : "var(--text-muted)"} strokeWidth={2} />
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
