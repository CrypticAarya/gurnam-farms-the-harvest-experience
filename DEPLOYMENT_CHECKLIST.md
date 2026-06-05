# Deployment Checklist

This checklist helps deploy the project to Vercel or a container platform.

Vercel (recommended):
- Link the repo in Vercel and set the root to the repository root.
- In Vercel Project Settings → Environment Variables, add:
  - `VITE_SUPABASE_URL` (value from your Supabase project)
  - `VITE_SUPABASE_ANON_KEY` (anon/public key)
  - `RESEND_API_KEY` (server-side secret)
  - `VITE_SENTRY_DSN` (optional, for Sentry)
- Vercel will use `vercel.json` which sets `installCommand` and `buildCommand`.

GitHub Actions (auto-deploy to Vercel):
- A deploy workflow is included at `.github/workflows/deploy-vercel.yml` which uses a Vercel GitHub Action to deploy on push to `main`.
- Configure these repository Secrets (Settings → Secrets and variables → Actions):
  - `VERCEL_TOKEN` — your Vercel personal token
  - `VERCEL_ORG_ID` — your Vercel organization id
  - `VERCEL_PROJECT_ID` — your Vercel project id
  - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — used at build time
  - `RESEND_API_KEY` — server-side email key
  - `VITE_SENTRY_DSN` — optional (Sentry)

Once secrets are set, pushing to `main` will trigger an automatic Vercel deployment.

Docker (static hosting):
- Build image: `docker build -t gurnam-app .`
- Run container: `docker run -p 4173:4173 -e NODE_ENV=production -e VITE_SUPABASE_URL=... -e VITE_SUPABASE_ANON_KEY=... gurnam-app`

CI:
- GitHub Actions workflow `.github/workflows/ci.yml` runs install and `npm run build` on push/pull_request.
- Lint step is non-blocking in CI to prioritize build verification; run `npm run lint` locally and fix issues as needed.

Database:
- Apply SQL migrations in `scripts/migrations/*.sql` to your Supabase project (via SQL Editor or `supabase` CLI).

Local development:
- Copy `.env.example` to `.env` and fill values.
- Run `npm run dev` to start the dev server.
