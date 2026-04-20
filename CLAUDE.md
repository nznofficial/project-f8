# Project F8 — Claude Code Session Brief

## Project Summary

Project F8 is a two-user personal fitness tracker with an F1/motorsport theme. Users log daily "laps" (weight, steps, workout, calories, protein, sleep) and track weekly weight trends as "pit stops." Frontend is React 18 + React Router 6 + Vite 5 with vanilla CSS. Backend is Express 5 + Mongoose 9 (ESM, `.mjs`) backed by MongoDB Atlas. Express serves the Vite build output as static files — single-origin deployment, no CORS.

---

## Key Commands

```bash
# Backend (from backend-rest/)
npm run dev      # nodemon lap-controllers.mjs — watch mode
npm start        # node lap-controllers.mjs — production

# Frontend (from frontend-react/)
npm run dev      # vite dev server on :5173, proxies API calls to :3000
npm run build    # vite build → frontend-react/dist/
npm run lint     # eslint on .js/.jsx
npm run preview  # serve the built dist locally
```

**Dev workflow:** Start backend (`npm run dev` in `backend-rest/`) first, then frontend (`npm run dev` in `frontend-react/`).

---

## Architecture Quick-Ref

```
frontend-react/src/
  pages/           ← Route components; own their fetch logic via useEffect
  components/      ← Reusable display components; receive data via props
  App.jsx          ← BrowserRouter + routes; holds shared lapToUpdate state
  index.css        ← ALL styles + CSS custom properties (--f8-*)

backend-rest/
  lap-controllers.mjs   ← Express app + all route handlers (single file)
  lap-models.mjs        ← All Mongoose schemas + DB query functions
  utils/dates.mjs       ← PST/week-boundary date helpers
```

API routes: `GET/POST /laps`, `GET/PUT/DELETE /laps/:_id`, `GET /users`, `POST /pit-stops/preview`, `PUT /pit-stops/finalize`, `GET /pit-stops`

---

## Coding Conventions

- **Backend files:** `kebab-case.mjs` — native ESM (`import`/`export`), no CommonJS
- **React components:** `PascalCase.jsx` — functional only, no class components
- **Page components:** suffix `Page` — e.g. `CreatePage.jsx`, `RetrievePage.jsx`
- **CSS classes:** kebab-case; feature-specific classes use `f8-` prefix (`.f8-success`, `.countdown`)
- **MongoDB models:** PascalCase (`Lap`, `User`, `PitStop`); `versionKey: false` on all schemas
- **API responses on error:** `{ "Error": "Not found" }` / `{ "Error": "Invalid request" }` (capital E key)
- **State management:** `useState` + `useEffect` only — no Redux/Zustand/Context
- **Cross-page state:** lift to `App.jsx` (current pattern: `lapToUpdate` for edit flow)

---

## Patterns to Avoid

- **Do not hardcode user ObjectIds** in form components — fetch from `/users?active=true` instead (RetrievePage does this correctly; CreatePage and UpdatePage do not yet)
- **Do not duplicate mobile card markup** — mobile layout belongs in `LapTable.jsx` only, not also in `RetrievePage.jsx`
- **Do not use `alert()` for user feedback** — use inline state or the success overlay pattern from `CreatePage`
- **Do not inline `fetch` calls inside components** — extract to an `src/api/` module when adding new API calls
- **Do not commit `.env`** — the `.gitignore` covers it but verify with `git status` before any commit touching backend config
- **Do not use `export const Foo` + `export default Foo` on the same component** — pick one (`export default`)

---

## Relevant File Paths

| File | Purpose |
|---|---|
| `backend-rest/lap-controllers.mjs` | Express app entry — all routes and middleware |
| `backend-rest/lap-models.mjs` | All Mongoose models and DB query functions |
| `backend-rest/utils/dates.mjs` | Date helpers — `localMidnight()`, `mondayStartLocal()` |
| `backend-rest/.env` | Live secrets — `MONGODB_CONNECT_STRING`, `PORT` |
| `backend-rest/f8-test-requests.http` | Manual API tests (VS Code REST Client) |
| `frontend-react/vite.config.js` | Vite dev proxy config (forwards API calls to :3000) |
| `frontend-react/src/App.jsx` | Router + shared `lapToUpdate` state |
| `frontend-react/src/index.css` | All styles + CSS design tokens (`--f8-*` variables) |

## Known Issues to Be Aware Of

- `UpdatePage` will crash if navigated to directly (no `lapToUpdate` guard) — add `if (!lapToUpdate) return <Navigate to="/" />;`
- `localMidnight()` in `dates.mjs` uses hardcoded `-08:00` (PST) — incorrect during PDT
- No tests exist anywhere in the project
- No CI/CD pipeline configured
