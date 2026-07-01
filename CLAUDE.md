# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing/landing site for Shout4Help (a safety app). React + Vite frontend, with a small Express backend used only for one feature: tester signup, which adds a submitted Gmail address to a Google Workspace group via the Admin SDK.

## Commands

```bash
npm run dev          # runs frontend (Vite) and backend (Express) concurrently
npm run dev:client   # Vite dev server only
npm run dev:server   # Express API only (node ./server/index.js)
npm run build         # tsc typecheck + vite build
npm run preview       # preview the production build
```

There is no test suite and no linter configured. There is no `npm run start` for local backend-only smoke testing outside of `dev:server`; use `curl -X POST localhost:8787/api/testers -H 'Content-Type: application/json' -d '{"email":"x@gmail.com"}'` to exercise the API directly, and `GET /api/health` for a liveness check.

## Architecture

**Frontend is effectively one file.** `src/App.tsx` just re-exports `src/ReferenceLanding.tsx`, which is the entire landing page (~1150 lines, all sections as functions in one file: `Navbar`, `Hero`, `Features`, `HowItWorks`, `UseCases`, `TesterCta`, `Footer`). There is no router and no component directory — new sections get added as functions in this file, not split out speculatively.

**Backend logic is shared between two entry points**, both wrapping the same `processTesterSignup` function in `server/testerSignup.js`:
- `server/index.js` — Express server for local dev (`npm run dev:server`), proxied from Vite at `/api` (see `vite.config.ts`).
- `api/testers.js` — a serverless-function-style handler (Vercel-style default export) for the same endpoint, used in production deployment. **Any change to signup behavior must be made in `server/testerSignup.js` / `server/googleWorkspace.js`, not duplicated per-entrypoint** — `api/testers.js` is a thin adapter, not a second implementation.

**Google Workspace integration** (`server/googleWorkspace.js`) authenticates as a service account (`GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL` / `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`) impersonating `GOOGLE_IMPERSONATED_ADMIN_EMAIL` via JWT, then calls the Admin SDK `directory.members.insert` to add the email to `GOOGLE_GROUP_EMAIL`. Key behaviors to preserve when touching this file:
- Only `@gmail.com` addresses are accepted (validated in `testerSignup.js` before any Google call).
- A 409 from Google (duplicate member) is treated as success (`already_member`), not an error.
- After insert, membership is re-verified with `directory.members.get` before reporting success, since Workspace API writes aren't always immediately consistent — a failed verification returns `verification_failed` (502) rather than a false positive.
- Missing env config throws `ConfigError`, which is handled distinctly (500 `configuration_error`) from actual Google API failures (502 `google_api_error`), so config problems are distinguishable from transient/runtime failures in logs and responses.

Required env vars are documented in `.env.example`. `VITE_ANDROID_APP_URL` / `VITE_PLAY_TEST_URL` (frontend-side) control what link is shown to a tester after a successful signup.

## Notes

- `.cursor/` in this repo contains a stray runtime debug log (`debug-76fb6e.log`), not actual Cursor rules — ignore it, it's not configuration.
- `README.md` is empty; there's no additional project documentation beyond this file and `.env.example`.
