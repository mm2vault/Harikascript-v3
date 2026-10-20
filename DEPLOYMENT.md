# HarikaScript deployment notes

## What GitHub Pages can run

GitHub Pages serves the built Vite frontend from `/Harikascript-v3/`. It does **not** run `server.ts` or Express API routes. The normal site UI can load from Pages, but AI assistant, AI frame generation, item research, and task verification require a separate backend host.

## Configure the frontend API URL

1. Host the Node/Express server from this repository on a backend service.
2. In GitHub repository **Settings → Secrets and variables → Actions → Variables**, create a repository variable named `VITE_API_BASE_URL`.
3. Set its value to the backend's HTTPS origin, without a trailing slash (for example, `https://your-service.example.com`).
4. Run the **Deploy HarikaScript to GitHub Pages** workflow again. The value is compiled into the frontend bundle; changing it requires a new build.

If this variable is empty, backend-only controls should show a setup message rather than silently calling a nonexistent `/api` route on GitHub Pages.

## Configure the backend

Use Node.js 22 and the repository's scripts:

- Build: `npm install && npm run build`
- Start: `npm start`

Configure backend environment variables in the backend host's secret settings:

- `PORT`: supplied by most hosting services automatically.
- `GEMINI_API_KEY`: optional; needed for Gemini-powered endpoints.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: required for protected admin API routes. Set it to the full service-account JSON as a **backend-only secret**.

Never use a `VITE_*` variable for service-account credentials. Anything prefixed with `VITE_` can be exposed to every site visitor.

## Firebase security rules

`firestore.rules` in this branch is a proposed rules update only. It is not deployed by GitHub Pages or by the frontend workflow. Test it against the app and deploy it to the Firebase project separately after reviewing the economy behavior: client-side coin, XP, task, inventory and unlock changes are intentionally blocked, so those rewards need trusted server-side logic to persist securely.

## Safe release process

The audit changes are kept on `audit/fix-ai-studio-issues`. Review the pull request and wait for the validation workflow before merging. The main branch and live Pages site remain unchanged until the branch is merged and Pages deploys.
