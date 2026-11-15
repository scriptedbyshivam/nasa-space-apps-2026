# Flame in Freefall

A NASA Space Apps 2026 web app for exploring microgravity combustion science from NASA's
Physical Sciences Informatics (PSI) archive. The app turns 14 PSI investigations into an
interactive experiment explorer, side-by-side comparison tool, evidence library, fire-safety
charts, and a grounded science copilot.

![Flame in Freefall](public/assets/assests/image_8c38fee5.png)

## What It Does

- **Experiment Explorer** — search, filter, sort, and inspect 14 NASA PSI investigations across
  BASS, FLEX, SAFFIRE I–III, SAME, ACME, SLICE, SPICE, and CFI.
- **Comparison** — compare up to three investigations across recorded test conditions and key
  published results.
- **Evidence Library** — browse research documents, publication links, DOIs, and investigation
  identifiers.
- **Fire Safety Charts** — visualize oxygen, pressure, airflow, spread, suppression, and smoke
  trends with explicit provenance badges.
- **Ask the Science Copilot** — answers questions from a server-side grounded knowledge base
  built from the local dataset. If `GEMINI_API_KEY` is configured, Gemini generates a
  constrained answer from retrieved context; otherwise the server stays in grounded local mode.
- **Image provenance** — every visual is labeled as NASA imagery, an AI illustration, or a
  schematic. AI illustrations are never presented as NASA photographs.

## Data Notes

- Values are recorded PSI test conditions and published findings, not raw telemetry or a
  controlled reanalysis.
- Charts marked **Illustrative Demonstration Data** are qualitative trend illustrations, not
  measured NASA time series.
- Some PSI identifiers are marked **unverified** in the local dataset pending confirmation
  against the NASA PSI archive.
- AI-generated illustrations are labeled in the UI and in image credits.

## Tech Stack

- React 19 + Vite 8
- TypeScript
- Tailwind CSS 4
- Recharts, GSAP, Motion, Lucide
- Express 4 + `@google/genai`
- Node.js 20+

## Run Locally

**Prerequisites:** Node.js 20 or newer and npm.

```bash
npm install
copy .env.example .env   # Windows; use cp on macOS/Linux
npm run dev
```

Open `http://localhost:3000`.

Add a Gemini key to `.env` only if you want live model answers:

```env
GEMINI_API_KEY="your-key"
GEMINI_MODEL="gemini-2.5-flash"
PORT="3000"
```

Without a key, the `/api/health` endpoint reports `mode: "grounded-local"` and the copilot uses
the deterministic retrieval/generation fallback.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Express with Vite middleware on port 3000 |
| `npm run build` | Build the production client into `dist/` |
| `npm start` | Serve the built client with Express |
| `npm run preview` | Preview the Vite production build |
| `npm run clean` | Remove build output |
| `npm run lint` | Type-check with `tsc --noEmit` |

`npm start` requires a prior `npm run build`.

## Deploy on Vercel

The repo includes `vercel.json` and a serverless API entry at `api/[...path].ts`.

1. Import `scriptedbyshivam/nasa-space-apps-2026` into Vercel.
2. Keep the detected **Vite** framework preset. Build command: `npm run build`; output: `dist`.
3. Add environment variables in **Project Settings → Environment Variables**:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL` (optional; defaults to `gemini-2.5-flash`)
4. Deploy. `/api/*` routes are handled by the Express app in `api/[...path].ts`; do not set a custom start command.

Never upload the local `.env` file. Use Vercel environment variables for deployment secrets.

## API

- `GET /api/health` — Gemini configuration, model, mode, and knowledge-base counts.
- `POST /api/copilot` — `{ question, history?, context? }`; returns a grounded answer, citations,
  source (`gemini-live` or `grounded-knowledge-base`), model, and optional fallback reason.

Rate limit: 30 requests per minute per IP. Request body limit: 32 KB.

## Project Structure

```text
server.ts                         Express API + Vite/static server
src/App.tsx                       Hash-routed app shell
src/data/nasaFireData.ts           PSI experiments, charts, topics, research docs
src/components/science/           Explorer, comparison, charts, copilot UI
public/assets/                    NASA imagery and labeled AI illustrations
```

## Limitations

- This is an educational visualization, not a flight-safety or design tool.
- Local dataset values should be cross-checked against the linked NASA PSI records before
  operational use.
- Live Gemini output depends on the configured key, quota, and model availability; the app
  falls back to local grounded mode on failure.
