/**
 * gemini.ts — Gemini API wrapper with graceful FAQ fallback.
 *
 * If NEXT_PUBLIC_GEMINI_API_KEY is absent or the API call fails,
 * it automatically falls back to the local FAQ matching (findAnswer).
 *
 * To enable Gemini, add to .env.local:
 *   NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sanitizeText } from "./sanitize";

const SYSTEM_PROMPT = `You are VoteSmart, a friendly and trustworthy Indian election assistant.
Answer questions about voting in India clearly and briefly (2–4 sentences max).
Focus on: voter registration, EPIC card, polling booths, documents needed, election timelines, and ECI processes.
Do not discuss politics, candidates, or party preferences.
If you don't know, say: "For accurate information, please call the National Voter Helpline at 1950."
Always reply in simple, clear English.`;

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI | null {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) return null;
  if (!genAI) genAI = new GoogleGenerativeAI(key);
  return genAI;
}

export function isGeminiConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}

/**
 * Ask Gemini a question. Returns the answer string.
 * Throws on network/API error so callers can fall back.
 */
export async function askGemini(userMessage: string): Promise<string> {
  const client = getClient();
  if (!client) throw new Error("Gemini not configured");

  const safeMessage = sanitizeText(userMessage);
  if (!safeMessage) throw new Error("Empty input");

  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(
    `${SYSTEM_PROMPT}\n\nUser question: ${safeMessage}`
  );

  const text = result.response.text().trim();
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}
