# Fitmark — AI Resume Analyzer

FitMark AI is an AI-powered resume analysis platform that evaluates how well a candidate's resume matches a given Job Description (JD). It analyzes skills, experience, qualifications, and keywords to identify strengths, skill gaps, and areas for improvement.

Features
📄 Resume Analysis — Analyze resume content and extract relevant information.
🎯 Job Description Matching — Compare a resume against a specific job description.
📊 Match Score — Generate an overall resume–job compatibility score.
🧠 AI-Powered Analysis — Use LLMs to understand resume and JD context beyond simple keyword matching.
🔍 Skill Gap Detection — Identify missing or insufficient skills required for the target role.
💡 Personalized Suggestions — Get actionable recommendations to improve resume relevance.
📋 Keyword Analysis — Identify important keywords and technologies from the job description.
⚡ Fast & Interactive UI — Simple interface for uploading/providing resume and job details.

- **Frontend:** React 18 + Vite + React Router + Tailwind CSS + Recharts-ready
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose) — stores analysis history
- **AI:** Anthropic Claude API, called only from the backend (key never touches the browser)

How It Works-
Resume + Job Description
          ↓
    Resume Processing
          ↓
    JD Analysis
          ↓
    AI/LLM Analysis
          ↓
  Skill & Keyword Matching
          ↓
    Match Score + Gaps
          ↓
 Personalized Suggestions
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

Use Cases-

FitMark AI can be useful for:

Students preparing for placements
Freshers applying for internships
Job seekers targeting specific roles
Resume optimization
Identifying missing technical skills
Understanding job requirements


## 3. Setup

### Prerequisites
- Node.js 18+
- A MongoDB instance (local `mongod`, or a free MongoDB Atlas cluster)
- An Gemini API key 

### Backend

```bash
cd backend
cp .env

npm install
npm run dev        # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev         # starts on http://localhost:5173
```

### Production build

```bash
cd frontend
npm run build        # outputs static files to frontend/dist
```


## 4. Security notes

- Uploaded files are validated by both extension and MIME type, and capped at
  `MAX_UPLOAD_MB` (default 5MB).
- Uploaded resume **bytes** are never written to disk or the database — only
  the extracted text is used in-memory for the AI call, and only the AI's
  structured output (plus a short JD snippet and filename) is persisted.


⭐ If you find this project useful, consider giving the repository a star!
