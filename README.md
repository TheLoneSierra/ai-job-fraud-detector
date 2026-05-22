# HireSafe AI — Scam Risk Analysis for Job Hunting

HireSafe AI is a web application that helps job seekers quickly assess scam risk in recruiter messages and offer documents. It extracts key details from user inputs, scores risk level using AI, and shows red flags + recommended next steps.

---

## Features

### 1) Upload or paste input

- Upload supported files (images and text-like files).
- Or paste text directly into the analyzer.

### 2) Text extraction

- For image uploads, the backend performs OCR using `tesseract.js`.
- For plain text / JSON text-like files, the app reads them directly.

### 3) Company intel extraction + caching

- The backend extracts signals such as:
  - company name candidates
  - emails
  - domains
- These signals are used to look up stored “company intel” records in MongoDB.

### 4) Risk scoring + AI summary

- If no valid cached intel match exists, the app calls Gemini to produce:
  - risk score and risk level
  - a structured JSON response containing red flags, extracted information, and recommended actions

### 5) Fast cached responses (cache-first)

- When matching cached company intel exists, the system returns:
  - `cache.status = "cache-first"`
  - a “Loaded from cache …” label in the UI

This is designed to avoid slow AI calls during/after periods of high traffic.

### 6) Result report download

- Users can download a generated report from the result page.

---

## Tech Stack

### Frontend

- React + Vite
- UI components from `lucide-react`

### Backend

- Node.js + Express
- MongoDB via Mongoose
- OCR via `tesseract.js`

---

## Project Structure (high level)

### Client

- `client/src/pages/Analyze.jsx` — main analyzer page
- `client/src/services/analysisService.js` — client API calls and upload/extract helpers
- `client/src/components/ResultHeader.jsx` — displays cache source + report metadata
- Other components: cards and grids for the analysis result

### Server

- `server/src/server.js` and `server/src/app.js` — app entry and routing
- `server/src/controllers/analysisController.js` — request handlers
- `server/src/services/` — extraction, cache, AI generation, and scoring logic
  - `extractionService.js`
  - `companyIntelCacheService.js`
  - `geminiService.js`

---

## How it works (data flow)

1. **User provides input**
   - Upload a file or paste text.

2. **Extraction**
   - OCR (images) or direct reading (text-like inputs).

3. **Cache lookup**
   - Backend checks MongoDB for matching cached company intel using extracted signals.

4. **Cache hit**
   - If there is a strong match and cached data is fresh enough, the backend returns the cached response immediately.

5. **Cache miss**
   - If no cache match is found, the backend generates a fresh scam analysis via Gemini.
   - The newly generated signals and analysis are stored/updated in MongoDB for future requests.

6. **Result rendering**
   - Frontend displays risk level/score, AI summary, red flags, extracted info, verification checks, and recommended actions.

---

## Configuration

Create a `.env` file in the `server/` directory with (at minimum):

- `MONGODB_URI` or `MONGO_URI`
- `GEMINI_API_KEY`
- Optional:
  - `GEMINI_MODEL`
  - `GEMINI_FALLBACK_MODELS`
  - `COMPANY_CACHE_MAX_AGE_DAYS`

---

## Running locally

### 1) Start backend

```bash
cd hiresafe-ai/server
npm install
npm run dev
```

### 2) Start frontend

```bash
cd hiresafe-ai/client
npm install
npm run dev
```

---

## Notes & Failure Modes

- **OCR/extraction may be imperfect** for low-quality scans.
  - The system still produces output and shows “Not identified” where fields cannot be extracted.

- **Cache requires MongoDB**
  - If MongoDB is unreachable, the backend returns fresh AI results instead of cached intel.

- **AI latency**
  - When traffic increases, the caching mechanism reduces repeated AI calls for the same company signals.

---

## Caching behavior (what to mention in your presentation)

- The app stores “company intel” after generating an AI response.
- On subsequent scans, it checks whether the input matches an existing cached company record.
- When it matches, the UI shows **Loaded from cache** so users get results immediately, rather than waiting for Gemini.
