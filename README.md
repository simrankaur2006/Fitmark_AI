# Fitmark — AI Resume Analyzer

A full-stack, production-shaped resume-vs-job-description analyzer.

- **Frontend:** React 18 + Vite + React Router + Tailwind CSS + Recharts-ready
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose) — stores analysis history
- **AI:** Anthropic Claude API, called only from the backend (key never touches the browser)

---

## 1. Project structure

```
ai-resume-analyzer/
├── backend/
│   ├── config/db.js               # MongoDB connection
│   ├── models/Analysis.js         # Mongoose schema for saved analyses
│   ├── middleware/upload.js       # Multer: file type/size validation
│   ├── middleware/errorHandler.js # Central error + 404 handling
│   ├── services/resumeParser.js   # PDF/DOCX -> plain text extraction
│   ├── services/aiService.js      # Anthropic API call + JSON validation
│   ├── controllers/analysisController.js
│   ├── routes/analysisRoutes.js
│   ├── server.js                  # App entry point
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/            # Navbar, ToastStack, EmptyState
    │   │   ├── ResumeUpload/      # Drag & drop upload
    │   │   ├── JobDescription/    # JD textarea
    │   │   ├── LoadingScreen/     # Staged analysis loader
    │   │   ├── Dashboard/         # Score ring, category bars, badges
    │   │   ├── Improvement/       # STAR-method bullet rewrites
    │   │   ├── Interview/         # Interview question prep
    │   │   └── History/           # Past analyses list
    │   ├── pages/                 # HomePage, AnalyzePage, ResultsPage, HistoryPage
    │   ├── context/AppContext.jsx # Global state (intake, toasts, current analysis)
    │   ├── services/api.js        # Axios calls to the backend
    │   └── utils/storage.js       # LocalStorage (client id + history cache)
    └── index.html
```

## 2. How the pieces fit together

1. The **frontend** collects a resume file (PDF/DOCX) and a job description, then
   `POST`s them as `multipart/form-data` to `/api/analysis`.
2. The **backend** validates the file, extracts plain text with `pdf-parse` or
   `mammoth`, and sends the resume text + job description to **Claude** with a
   system prompt that forces a strict JSON schema.
3. The AI's response is parsed defensively (`aiService.parseAndValidateAnalysis`)
   so a malformed or partial response never crashes the UI — every field falls
   back to a safe default.
4. If MongoDB is connected, the result is saved to the `analyses` collection and
   returned to the client; if not, the app still works end-to-end without
   history persistence (the frontend also mirrors history in `localStorage`).
5. The **frontend** renders the result across three tabs: Overview (scores,
   keywords, strengths/weaknesses, ATS warnings), Improve My Resume (STAR
   bullet rewrites), and Interview Prep (categorized questions).

## 3. Setup

### Prerequisites
- Node.js 18+
- A MongoDB instance (local `mongod`, or a free MongoDB Atlas cluster)
- An Anthropic API key from https://console.anthropic.com/

### Backend

```bash
cd backend
cp .env.example .env
# edit .env: set MONGODB_URI and ANTHROPIC_API_KEY
npm install
npm run dev        # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev         # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000` (see
`vite.config.js`), so no CORS configuration is needed in development beyond
what's already in `server.js`.

### Production build

```bash
cd frontend
npm run build        # outputs static files to frontend/dist
```

Serve `frontend/dist` from any static host (Vercel, Netlify, Nginx, or Express's
own `express.static`), and deploy `backend/` to any Node host (Render, Railway,
Fly.io, a VPS, etc.) with the same environment variables from `.env.example`.

## 4. Security notes

- The Anthropic API key lives only in the backend's `.env` and is never sent
  to the browser.
- Uploaded files are validated by both extension and MIME type, and capped at
  `MAX_UPLOAD_MB` (default 5MB).
- Uploaded resume **bytes** are never written to disk or the database — only
  the extracted text is used in-memory for the AI call, and only the AI's
  structured output (plus a short JD snippet and filename) is persisted.
- The `/api/analysis` POST route is rate-limited (30 requests / 15 min / IP)
  since it's the endpoint that calls the paid AI API.

## 5. Extending this

- **Auth:** add a `User` model and JWT/session middleware, then scope
  `Analysis.clientId` to the authenticated user id instead of an anonymous
  browser-generated id.
- **Swap AI providers:** all AI logic is isolated in `backend/services/aiService.js`
  — replace the `fetch` call and system prompt to point at a different provider
  without touching routes or the frontend.
- **Swap storage:** `Analysis` is a normal Mongoose model; moving to
  PostgreSQL means swapping this file and `config/db.js` for a Prisma/Sequelize
  equivalent — the controller/route layer is storage-agnostic.
