# Antigravity Build Prompt — Bengali Shadi

Copy everything below the line into Antigravity as your project prompt.

---

## Project

Build a full-stack matrimony web application called **"Bengali Shadi"** — a matchmaking platform for the Bengali community (Hindu, Muslim, Christian, and other Bengali sub-communities), inspired in architecture by an existing project called "Apni Shadi" but with its own branding, cultural fields, and AI provider (Gemini only, no multi-provider routing needed unless you want a fallback).

## Tech stack

- **Backend:** Java 21, Spring Boot 3.x, Spring Web, Spring Data JPA/Hibernate, Spring Validation, Spring WebSocket
- **Database:** MySQL for runtime, H2 for tests
- **Frontend:** React 19 + Vite, plain CSS (or Tailwind if you prefer — specify one)
- **AI:** Google Gemini API only, via a dedicated `GeminiClient`
- **Realtime:** native WebSocket for live chat

## Core product flow

1. Profiles and demo accounts are seeded on startup (`ProfileSeeder`, `AccountSeeder`).
2. A user signs up or logs in.
3. Backend ranks opposite-gender profiles using rule-based compatibility scoring (not AI-decided).
4. Frontend shows ranked matches and a detailed profile view.
5. User can generate a full compatibility report and ask an AI advisor about a specific match.
6. A user sends an "interest request" to another profile; only after the receiver accepts does a private conversation unlock.
7. Messages are stored in MySQL and pushed live over WebSocket.

## Backend package structure

```
com.bengalishadi
├── auth        -> signup/login, password hashing (PBKDF2+SHA256), MVP token
├── profile     -> Profile entity, listing, search, seeding
├── match       -> rule-based compatibility scoring + report generation
├── connection  -> interest requests, conversations, chat messages, WebSocket broadcast
├── ai          -> Gemini-backed advisor: chat + narrative generation
└── config      -> CORS + WebSocket config
```

## Profile fields (Bengali-specific)

Use these instead of generic fields, to reflect the actual community:

- Basic: name, gender, age, height, location (district/city, state)
- Religion: Hindu / Muslim / Christian / Other
- Sub-community / caste where relevant (e.g., Bengali Hindu caste groups, or leave optional/omittable — make this field optional and non-mandatory to avoid excluding users who don't want to disclose it)
- Mother tongue (default Bengali), fluency in English/Hindi
- Region of origin: e.g., Kolkata, North Bengal, South Bengal, Bangladeshi-origin, NRI Bengali
- Education, profession, income
- Diet (veg/non-veg/eggetarian — common in Bengali households), smoking, drinking
- Family type (joint/nuclear), family values, children plans, relocation willingness
- About, interests, life goals, partner expectations
- Optional: horoscope/Kundli matching flag (Hindu users) — **keep this as an optional toggle, not a core dependency**, since not all users want it

## Matching logic (rule-based, in `MatchReportService`)

Score across:
- Location (same district > same state/region > different region, adjusted by relocation willingness)
- Religion/community alignment (if the user has opted to filter by it)
- Lifestyle (diet, smoking, drinking)
- Family expectations and children plans
- Career alignment
- Communication readiness (language fluency overlap)

Output includes: `overallScore`, `strengths`, `concerns`, `questionsToAsk`, `recommendation`, `summary`, `disclaimer`.

**Important:** AI never determines the score. The backend computes it first; AI only explains/narrates it.

## AI advisor (Gemini)

- `POST /api/ai/chat` takes `profileOneId`, `profileTwoId`, `message`.
- Backend first computes the calculated compatibility report, then sends both profiles + report to `AiAdvisorService`.
- `AiAdvisorService` builds a structured prompt instructing Gemini to:
  - Be warm, respectful, direct, and culturally aware of Bengali family/marriage norms
  - Never promise marriage success or make guarantees
  - Answer general questions naturally, not just compatibility questions
  - Ground compatibility answers in the backend-calculated report, not invent new scores
  - Suggest concrete discussion topics and next steps
- If the Gemini call fails, return a safe, pre-written fallback message instead of crashing.
- Store the Gemini API key in an environment variable (`YOUR_GEMINI_API_KEY_HERE`), never hard-coded or committed to `application.properties`.

## Private chat (gated, not open)

- `POST /api/interest-requests` → send interest
- `POST /api/interest-requests/{id}/accept` / `/decline`
- On accept, backend creates a `Conversation`
- `GET /api/conversations/{id}/messages` + `POST /api/conversations/{id}/messages`
- WebSocket endpoint: `ws://localhost:8080/ws/conversations/{conversationId}` pushes new messages live
- Protect against: self-requests, duplicate requests, non-participants reading/sending messages

## REST API surface

```
POST   /api/auth/signup
POST   /api/auth/login

GET    /api/profiles
GET    /api/profiles/{id}
POST   /api/profiles

GET    /api/matches?profileId=...
POST   /api/match-reports

POST   /api/ai/chat

GET    /api/interest-requests?profileId=...&box=all
POST   /api/interest-requests
POST   /api/interest-requests/{id}/accept
POST   /api/interest-requests/{id}/decline

GET    /api/conversations?profileId=...
GET    /api/conversations/{id}/messages?profileId=...
POST   /api/conversations/{id}/messages
```

## Frontend requirements

- Keep app state, API calls, and screen routing organized in separate hooks/components (avoid dumping everything into one giant file)
- Screens: login/signup, match list, profile detail + compatibility report, AI advisor chat, request center (sent/received), conversation/chat view
- Demo/offline fallback: if backend is unreachable, fall back to local sample Bengali profiles so the UI still demoes
- Poll interest requests and conversations periodically (e.g. every 15s) and open a WebSocket when a conversation is selected
- Use warm, respectful, culturally appropriate copy/tone throughout (Bengali matrimony context) — avoid generic dating-app language

## Seed data

Seed ~8–10 demo profiles with realistic Bengali names (mix of Hindu/Muslim Bengali names), varied districts (Kolkata, Howrah, Siliguri, Dhaka-origin NRI, etc.), varied professions, and a shared demo password like `Password@123`. Log the seeded emails on startup for easy testing.

## Local run setup

- MySQL database `bengali_shadi`, configurable via `root` /`lokojit456789` env vars, default `root/root`
- Provide a `docker-compose.yml` for MySQL as an alternative
- `GEMINI_API_KEY` env var required for real AI responses; document how to set it
- Backend on `localhost:8080`, frontend (Vite) on `localhost:5173` 
- Include a README with exact run steps for both backend and frontend, plus a manual smoke-test checklist (signup → view matches → generate report → ask AI → send interest → accept → chat live via WebSocket)

## Non-goals for v1 (explicitly out of scope)

- No production-grade auth (JWT/OAuth) yet — MVP token is fine for now, but note it clearly as not production-ready
- No image upload pipeline yet (use placeholder avatars)
- No horoscope-matching engine — just an optional flag/field if included
- No payments/subscriptions

## Deliverable

A working local full-stack app matching the above, with clean package structure, a README with run instructions, and inline comments explaining the compatibility scoring rules so they're easy to tune later.