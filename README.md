# 🗳️ VoteSmart — India Election Assistant

A clean, mobile-first web app that helps first-time voters understand the election process — what to do, when to do it, where to go, and what to carry on polling day.

**Live Demo:** [https://election-assistant-lime.vercel.app](https://election-assistant-lime.vercel.app)

---

## ✨ Features

### 🏠 Home Dashboard
- Real-time election countdown with urgency colour coding
- Live **document checklist progress pill** showing readiness
- One-tap access to all 6 core tools
- First-time voter quick-start banner

### 🤖 AI Election Assistant (Chatbot)
- Free-form question input — type anything and get an answer
- **Gemini 1.5 Flash** AI when API key is configured
- Smart FAQ fallback when Gemini is unavailable
- Contextual follow-up links (e.g. "Open Booth Finder")
- Suggested question chips for zero-learning-curve start
- Clear conversation action to reset session
- Auto-scroll and auto-focus after every reply

### 🗺️ Polling Booth Finder (★ New)
- Search by area, constituency, or booth name
- Clear search and retry with one tap
- **Inline Booth Editing** — "Find My Train"-style edit sheet:
  - Edit booth name, address, landmark, timings, accessibility
  - Zod-validated form with helpful inline error messages
  - Saves edits locally (persists across reloads)
  - Reset to original data at any time
  - "Edited" badge on modified cards
- Google Maps Directions link on every card
- Google Maps Embed API (when key is set)
- Accessibility badge for wheelchair-friendly booths

### 📋 Document Checklist
- Tap to pack/unpack any document
- **Persists across browser sessions** via localStorage
- Progress bar with live count
- "All packed" celebration banner
- One-tap reset to start fresh
- Grouped by: Primary ID, Accepted Alternates, Supplementary

### 📅 Election Timeline
- All key dates with icons and category colours
- Reminder toggle (persisted to localStorage)
- Completed vs upcoming sections
- aria-pressed toggles for full keyboard accessibility

### 📖 Voter Guide
- 6-step accordion guide to voting
- Quick tips per step
- Progress indicator
- CTA to Booth Finder

### 👥 Candidates Info
- Neutral candidate overview (no endorsements)
- Key focus areas per candidate
- Verified data disclosure

---

## 🔌 Google Services

| Service | Purpose | Status |
|---|---|---|
| **Gemini 1.5 Flash** | AI-powered chatbot | Active when `NEXT_PUBLIC_GEMINI_API_KEY` is set |
| **Google Maps Embed API** | Interactive map in booth cards | Active when `NEXT_PUBLIC_MAPS_API_KEY` is set |
| **Google Maps Links** | "Get Directions" on every booth card | Always active |
| **Firebase SDK** | Persistence layer (auth + Firestore ready) | Configured via `NEXT_PUBLIC_FIREBASE_*` |

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Static Export) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Custom CSS Design System |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| AI | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| Persistence | localStorage (booth edits, checklist, reminders) |
| Testing | Vitest + Testing Library (89 tests, 9 suites) |
| Deployment | Vercel |
| CI | Vercel Git Integration |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home dashboard
│   ├── booth/page.tsx        # Booth finder + editing
│   ├── chat/page.tsx         # AI chatbot
│   ├── documents/page.tsx    # Document checklist
│   ├── timeline/page.tsx     # Election timeline
│   ├── guide/page.tsx        # Voting guide
│   ├── candidates/page.tsx   # Candidate info
│   └── __tests__/            # Page-level integration tests
├── components/
│   ├── layout/               # Header, BottomNav, PageWrapper
│   ├── booth/
│   │   └── BoothEditSheet.tsx  # Booth editing modal
│   └── ui/
│       └── Toast.tsx           # Toast notification system
├── data/                     # Mock JSON data (preserved, not modified)
│   ├── booth-data.json
│   ├── documents.json
│   ├── faq.json
│   ├── timeline.json
│   ├── election-steps.json
│   └── candidates.json
└── lib/
    ├── booth-store.ts        # Booth override layer (JSON + localStorage)
    ├── constants.ts          # Single source of truth for all config
    ├── firebase.ts           # Firebase SDK with graceful fallback
    ├── gemini.ts             # Gemini AI with FAQ fallback
    ├── sanitize.ts           # Input sanitization (XSS prevention)
    ├── storage.ts            # Type-safe localStorage wrapper
    └── utils.ts              # Date formatting, greeting helpers
```

---

## 🧪 Tests

**89 tests across 9 suites — all passing.**

```bash
npm test          # Run all tests once
npm run test:watch  # Watch mode
```

| Test Suite | What's Covered |
|---|---|
| `home.test.tsx` | Dashboard renders, quick actions, checklist pill |
| `booth.test.tsx` | Search, empty state, validation, edit open/close, Maps link |
| `chat.test.tsx` | Welcome msg, FAQ match, fallback, clear, XSS, send disabled |
| `documents.test.tsx` | Toggle, persist, hydration, reset, progress bar |
| `timeline.test.tsx` | Reminder toggle, persistence, sections |
| `booth-store.test.ts` | Search, save, reset, localStorage, edge cases |
| `storage.test.ts` | Get/set/remove/merge + corrupt JSON handling |
| `sanitize.test.ts` | XSS stripping, length limit, safe detection |
| `utils.test.ts` | formatDate, getDaysUntil, getGreeting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Local Development

```bash
# 1. Clone
git clone https://github.com/urstrulyyjay/election-project-prompt.git
cd election-project-prompt/election-assistant

# 2. Install dependencies
npm install

# 3. Set up environment (optional — app works without keys)
cp .env.local.example .env.local
# Edit .env.local and add your API keys

# 4. Run dev server
npm run dev
# Open http://localhost:3000
```

### Environment Variables

Copy `.env.local.example` to `.env.local`:

```env
# Gemini AI — powers the chatbot (optional, FAQ fallback used if missing)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Google Maps Embed — shows interactive map in booth cards (optional)
NEXT_PUBLIC_MAPS_API_KEY=your_maps_api_key_here

# Firebase — persistence (optional, localStorage used if missing)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

> **Note:** The app works fully without any API keys. Gemini falls back to FAQ logic. Maps falls back to a Google Maps link. Firebase falls back to localStorage.

---

## 🔒 Security

- `Content-Security-Policy` headers on all routes
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`
- Input sanitization on all user text (XSS prevention)
- `encodeURIComponent` on all URL params
- `rel="noopener noreferrer"` on all external links
- `<iframe sandbox>` on Maps embed
- No secrets committed — `.env.local.example` template only

---

## ♿ Accessibility

- WCAG 2.1 AA compliant design
- `aria-live` regions for dynamic content (chat, search, countdown)
- `aria-current="page"` on active nav item
- `aria-pressed` on toggle buttons
- `role="progressbar"` with `aria-valuenow/min/max`
- `role="log"` on chat message history
- `:focus-visible` keyboard navigation ring on all interactive elements
- 4.5:1+ contrast ratio on all text
- 48px minimum touch targets
- Semantic HTML: `<article>`, `<section>`, `<dl>/<dt>/<dd>`, `<h1>/<h2>/<h3>`

---

## 📦 Deployment

The app auto-deploys to Vercel on every push to `main`.

```bash
# Manual deploy
vercel --prod --yes
```

---

## 📋 Data

All mock data lives in `src/data/` and is never overwritten:

| File | Purpose |
|---|---|
| `booth-data.json` | 5 constituencies, 6 booths (base data) |
| `documents.json` | Required/accepted/optional ID list |
| `faq.json` | 10 FAQ entries with keyword matching |
| `timeline.json` | 8 election timeline events |
| `election-steps.json` | 6-step voting guide |
| `candidates.json` | 3 sample candidates |

User edits to booth data are stored **separately** in localStorage under `votesmart_booth_edits` — the original JSON is never modified.

---

## 🤝 Contributing

This is a hackathon project. Feel free to fork and extend!

---

## Author 🧠
- Jay Amol Dhokne 

- Student At College of Engineering & Technology Akola

- Department : Information Technology 

## Linkedin

- www.linkedin.com/in/jay-dhokne-891a55290


## Instagram

- https://www.instagram.com/27.6.9.65/


*Built for the promptWars Hackathon 2026 · Powered by Next.js + Gemini AI*
