# VoteSmart — India Election Assistant

A polished, mobile-first hackathon MVP that helps Indian voters understand the election process, find their polling booth, and get quick answers — all in one clean app.

## 🗳️ What It Does

| Feature | Description |
|---|---|
| 🏠 Home Dashboard | Live countdown to polling day, quick action grid |
| 📖 Voter Guide | 6-step interactive guide with expandable cards |
| 📍 Booth Finder | Search your area to find assigned polling booth |
| ✅ Document Checklist | Tap-to-pack checklist with Required/Accepted/Optional tags |
| 📅 Key Dates | Election timeline with reminder toggles |
| 💬 Ask Anything | FAQ-powered chatbot with instant answers |
| 👤 Candidates | Neutral candidate info cards, ECI verified |

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/votesmart-election-assistant.git
cd votesmart-election-assistant

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — animations
- **Lucide React** — icons
- **React Hook Form + Zod** — form validation
- **Local JSON** — mock data (easy to swap with Firebase/Supabase)

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Home Dashboard
│   ├── guide/            # Step-by-Step Guide
│   ├── booth/            # Polling Booth Finder
│   ├── documents/        # Document Checklist
│   ├── timeline/         # Reminder Timeline
│   ├── chat/             # Chatbot
│   └── candidates/       # Candidate Info
├── components/
│   └── layout/           # Header, BottomNav, PageWrapper
├── data/                 # Mock JSON data files
└── lib/
    └── utils.ts          # Utility functions
```

## 📊 Data Files

All mock data is in `src/data/` and can be replaced with API calls:

| File | Contents |
|---|---|
| `election-steps.json` | 6 voting steps |
| `booth-data.json` | 5 constituencies, 7 booths |
| `documents.json` | 8 documents with status |
| `timeline.json` | 8 key election dates |
| `faq.json` | 10 Q&A pairs |
| `candidates.json` | 4 mock candidates |

## 🎨 Design System

- **Accent**: `#2563EB` (blue-600) — trustworthy, civic
- **Background**: `#F8F9FC` — calm near-white
- **Font**: Inter (Google Fonts)
- **Mobile-first**: max-width 480px, bottom navigation bar

## 📞 Voter Helpline

Call **1950** — National Voter Helpline (all Indian languages supported)

---

Built with ❤️ for the hackathon | India Election Assistant
