# Project F8 — Architecture Blueprint

## 1. Executive Summary

Project F8 is a personal health/fitness tracking web app with a motorsport/F1 theme ("Race Control", pit stops, race countdown). Two users log daily "laps" — weight, steps, workout type, calories, protein, and sleep. Weekly weight averages are tracked as "pit stops" to measure progress over time.

**Stack:**
- **Frontend:** React 18 + React Router 6 + Vite 5 — plain JavaScript (.jsx), vanilla CSS
- **Backend:** Node.js (ESM) + Express 5 + Mongoose 9
- **Database:** MongoDB Atlas (cloud-hosted)
- **Deployment:** Express serves both API and the Vite-built SPA from a single origin

**Key architectural decisions:**
- Single-origin deployment — Express static-serves the Vite build output
- No authentication — users identified by hardcoded MongoDB ObjectIds
- No shared type layer — frontend and backend are independently structured
- All styles in one global CSS file with custom CSS variables as the design system

---

## 2. Canonical Directory Tree

```
project-f8/
├── .gitignore                        # Root gitignore (lists .env, .env.*)
│
├── backend-rest/                     # Express 5 + Mongoose REST API
│   ├── .env                          # ⚠ Live secrets — should not be committed
│   ├── .gitignore
│   ├── f8-test-requests.http         # Manual API tests (VS Code REST Client)
│   ├── lap-controllers.mjs           # Express app entry: all routes + handlers
│   ├── lap-models.mjs                # Mongoose models + all DB logic
│   ├── package.json
│   ├── package-lock.json
│   └── utils/
│       └── dates.mjs                 # Timezone/date helpers (PST/week boundary)
│
└── frontend-react/                   # React 18 SPA (Vite)
    ├── index.html
    ├── vite.config.js                # Dev proxy config (API → :3000)
    ├── package.json
    ├── package-lock.json
    ├── public/
    │   └── vite.svg
    └── src/
        ├── main.jsx                  # React DOM entry — createRoot
        ├── App.jsx                   # Router setup + shared lapToUpdate state
        ├── App.css                   # Entirely commented out — unused
        ├── index.css                 # All global styles + CSS design tokens
        ├── assets/
        │   ├── project-f8-logo.png   # App logo
        │   └── react.svg
        ├── components/
        │   ├── Header.jsx            # Nav, logo, live countdown widget
        │   ├── LapTable.jsx          # Desktop table + mobile card layout
        │   └── LapRow.jsx            # Single table row with edit/delete actions
        └── pages/
            ├── RetrievePage.jsx      # Lap list, user filter, delete/edit triggers
            ├── CreatePage.jsx        # Lap creation form + animated success overlay
            └── UpdatePage.jsx        # Lap edit form (requires lapToUpdate prop)
```

---

## 3. Architecture Decisions Record (ADR)

- **Express 5 (not 4):** Chosen for native async error propagation — no need for manual try/catch everywhere when combined with `express-async-handler`.
- **ESM throughout backend (`.mjs`):** Native ES module syntax (`import`/`export`) rather than CommonJS `require()`. Consistent with modern Node.js conventions.
- **Mongoose over raw MongoDB driver:** Schema validation, `.populate()` for joins, model-layer abstractions all simplify the data layer for a small app.
- **MongoDB Atlas:** Cloud-hosted; no local DB setup required. Free tier sufficient for two-user app.
- **Vite over CRA:** Fast HMR, minimal config, modern bundler. CRA is deprecated.
- **Vanilla CSS over Tailwind/CSS Modules:** Single global file with CSS custom properties. Simple enough for a small app; avoids build-time dependencies.
- **React `useState` + prop-drilling over Redux/Zustand/Context:** App is small enough that `lapToUpdate` lifted to `App.jsx` is sufficient. No complex shared state.
- **Single-origin deployment:** Express serves `frontend-react/dist/` as static files, eliminating CORS concerns and simplifying hosting.
- **No authentication:** Private personal-use app — not exposed to the public internet. Two users are hardcoded.

---

## 4. Standards & Conventions

### File Naming
| Context | Convention | Example |
|---|---|---|
| Backend source files | `kebab-case.mjs` | `lap-controllers.mjs` |
| React components | `PascalCase.jsx` | `LapTable.jsx` |
| React pages | `PascalCase + "Page".jsx` | `RetrievePage.jsx` |
| Utilities | `kebab-case.mjs` | `dates.mjs` |

### CSS Naming
- Global utility classes: `kebab-case` (`.form-group`, `.btn-primary`)
- Feature-specific classes: `f8-` prefix (`.f8-success`, `.countdown`)
- BEM-style modifiers for sub-elements: `.f8-success__logo`, `.f8-success__flag`
- State classes: `.race-week` applied to `.countdown` when < 7 days remain

### API Conventions
- Resource routes: plural nouns, kebab-case (`/laps`, `/pit-stops`, `/users`)
- Query parameters for filtering: `?userId=<id>`, `?active=true`
- Response on not found: `{ "Error": "Not found" }` (capital E)
- Response on bad request: `{ "Error": "Invalid request" }` (capital E)
- Response body for success: the created/updated document

### MongoDB / Mongoose
- Model names: `PascalCase` (`Lap`, `User`, `PitStop`)
- Collection names: `snake_case` (auto-pluralized by Mongoose: `laps`, `users`, `pit_stops`)
- `versionKey: false` on all schemas (no `__v` field)
- Compound unique indexes for business rules (user + date, user + weekStart)

### React Components
- Functional components only — no class components
- Props passed as named destructured parameters
- Page components own their fetch logic via `useEffect`
- Shared display state (e.g., `lapToUpdate`) lives in the nearest common ancestor (`App.jsx`)

---

## 5. Blueprint for Future Projects (Same Stack)

### Project Scaffold Checklist

```
new-project/
├── backend-rest/
│   ├── .env                   ← Never commit; add to .gitignore FIRST
│   ├── .env.example           ← Commit this instead
│   ├── app.mjs                ← Express app factory (no listen call)
│   ├── server.mjs             ← Entry: import app, call app.listen()
│   ├── routes/
│   │   └── resource.mjs       ← Route definitions only
│   ├── controllers/
│   │   └── resource.mjs       ← Handler functions, call services
│   ├── services/
│   │   └── resource.mjs       ← Business logic, call models
│   ├── models/
│   │   └── Resource.mjs       ← Mongoose schema + model
│   ├── middleware/
│   │   ├── errorHandler.mjs   ← Global Express error handler
│   │   └── validate.mjs       ← Request body validation middleware
│   └── utils/
│       └── db.mjs             ← MongoDB connection helper
│
└── frontend-react/
    ├── vite.config.js         ← Proxy /api/* → backend port
    └── src/
        ├── main.jsx
        ├── App.jsx            ← Router only
        ├── index.css          ← CSS custom properties + global base styles
        ├── api/
        │   └── resource.js    ← fetch wrappers (not inline in components)
        ├── components/        ← Reusable UI (no data fetching)
        └── pages/             ← Route-level components (own data fetching)
```

### Step-by-Step Setup

1. **Init both packages:**
   ```bash
   mkdir backend-rest frontend-react
   cd backend-rest && npm init -y && npm pkg set type=module
   npm install express express-async-handler mongoose dotenv
   npm install -D nodemon
   cd ../frontend-react && npm create vite@latest . -- --template react
   ```

2. **Gitignore `.env` before creating it:**
   ```bash
   echo ".env" >> backend-rest/.gitignore
   touch backend-rest/.env.example   # document required vars here
   ```

3. **Vite proxy config** (`vite.config.js`):
   ```js
   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         '/api': 'http://localhost:3000'
       }
     }
   })
   ```

4. **Express static + SPA fallback** (`app.mjs`):
   ```js
   app.use(express.static('../frontend-react/dist'));
   app.get(/.*/, (req, res) => {
     if (!req.path.startsWith('/api')) {
       res.sendFile(path.resolve('../frontend-react/dist/index.html'));
     }
   });
   ```

5. **Global error handler middleware** (add last):
   ```js
   app.use((err, req, res, next) => {
     const status = err.status ?? 500;
     res.status(status).json({ error: err.message ?? 'Internal server error' });
   });
   ```

6. **CSS design tokens** (`index.css`):
   ```css
   :root {
     --color-bg: #0B0D10;
     --color-surface: #1E232B;
     --color-accent: #C8102E;
     --color-text: #F5F7FA;
     --color-muted: #9AA4B2;
     --radius: 10px;
     --shadow: 0 12px 30px rgba(0,0,0,0.35);
   }
   ```

7. **`npm run dev` scripts** (add to both `package.json` files):
   - Backend: `"dev": "nodemon app.mjs"`
   - Frontend: `"dev": "vite"` (already default from Vite template)

8. **`.env.example`** template:
   ```
   MONGODB_CONNECT_STRING=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/?appName=Cluster0
   PORT=3000
   ```

---

## 6. Gaps & Recommendations

### Critical

| # | Issue | Recommendation |
|---|---|---|
| 1 | **`.env` with live credentials may be tracked in git** | Run `git rm --cached backend-rest/.env`, add to `.gitignore`, rotate the Atlas password immediately |
| 2 | **`UpdatePage` crashes on direct navigation** to `/update-lap` | Add null guard: `if (!lapToUpdate) return <Navigate to="/" />;` |
| 3 | **`localMidnight()` uses hardcoded `-08:00`** (PST only) | Use a DST-aware library or replace with `new Date(`${dateLocal}T00:00:00`)` and rely on server's local TZ |

### High Priority

| # | Issue | Recommendation |
|---|---|---|
| 4 | **No `.env.example` file** | Create one documenting `MONGODB_CONNECT_STRING` and `PORT` |
| 5 | **Hardcoded user ObjectIds in CreatePage and UpdatePage** | User picker (dropdown) should be fetched from `/users?active=true` same as RetrievePage |
| 6 | **Duplicate mobile card markup** in both `LapTable.jsx` and `RetrievePage.jsx` | Consolidate into `LapTable.jsx` only; remove from `RetrievePage` |
| 7 | **No global Express error handler** | Add `app.use((err, req, res, next) => ...)` at the end of `lap-controllers.mjs` |

### Medium Priority

| # | Issue | Recommendation |
|---|---|---|
| 8 | **`UpdatePage` uses `alert()` for success/failure** | Replace with consistent inline feedback (same success overlay pattern as CreatePage) |
| 9 | **No API service module on frontend** | Extract all `fetch` calls into `src/api/laps.js`, `src/api/users.js` etc. for reuse and testability |
| 10 | **No CI/CD** | Add a minimal `.github/workflows/ci.yml` — at minimum run ESLint on PRs |
| 11 | **`App.css` is entirely commented out** | Delete the file; it adds noise |
| 12 | **Named + default export on `CreatePage`** | Pick one; prefer `export default` (consistent with `RetrievePage` and `UpdatePage`) |

### Low Priority

| # | Issue | Recommendation |
|---|---|---|
| 13 | **No TypeScript** | Consider migrating to `.ts`/`.tsx` for type safety; the data models are already well-defined in Mongoose schemas |
| 14 | **No tests** | Add Vitest for frontend unit tests; add supertest + in-memory MongoDB for backend integration tests |
| 15 | **`TZ` constant in `dates.mjs` is exported but never used** | Remove or use it in `localMidnight` |
| 16 | **`export const` + `export default` on `CreatePage.jsx`** | Standardize to `export default` only |
