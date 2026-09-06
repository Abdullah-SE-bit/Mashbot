# Mashbot — SE3002 Assignment 01 MVP

Social-media campaign manager, implementing a 7 FR + 3 NFR scope drawn from the Mashbot SRS
(`2010 - mashboot.pdf`) for the SE3002 "Quality Evaluation of AI-Generated Software" assignment
(`SE3002_SQE_Assignment_01.pdf`).

- **Selected scope, rationale, and AI assumptions:** [`docs/requirements-scope.md`](./docs/requirements-scope.md)
- **AI-assisted development record:** [`docs/assumptions.md`](./docs/assumptions.md)

## Tech stack

| Layer | Technology |
|---|---|
| App | Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4 |
| Database / Auth / Storage | Supabase — Postgres (with `pgvector` available), Auth, Storage |
| Data access | `@supabase/ssr` (server components, server actions) + `@supabase/supabase-js` (browser) |

> Next.js 16 renamed `middleware.ts` → `proxy.ts` and made `params`/`cookies()` async-only.
> This codebase is written against those 16.x conventions — see `node_modules/next/dist/docs/`
> for the authoritative reference if extending it.

## Project structure

```
src/
  app/
    login/, register/, forgot-password/, reset-password/   # public auth routes
    (app)/                                                  # authenticated route group
      layout.tsx        # shared nav + auth/deactivation guard
      dashboard/
      campaigns/         # list, new, [id] detail, [id]/edit
      accounts/          # external service accounts
      profile/
      admin/users/       # admin-only account & role management
  components/            # UI split by feature (auth, campaigns, accounts, profile, admin, ui)
  lib/
    supabase/            # browser + server Supabase client factories
    actions/             # server actions (mutations), grouped by entity
    types.ts             # shared TypeScript types mirroring the DB schema
  proxy.ts                # session refresh + route protection (formerly "middleware")
supabase/
  migrations/0001_init.sql # schema, triggers, RLS policies
docs/
  requirements-scope.md   # Part 1 deliverable: 7 FR + 3 NFR table
  assumptions.md          # AI-assisted development record
```

## Requirement scope (summary)

7 Functional Requirements: Manage User Account, Manage Campaign, Manage External Service
Account, Contributor/Approver Content Workflow, Content Scheduling, Login & Account-Validity
Enforcement, Self-Service Password Reset.

3 Non-Functional Requirements: encrypted client/server connection (SRS 0620), backup
availability constraints (SRS 0630), server/client memory constraints (SRS 2.1.6).

Full table with wording, risk, and AI-assumption defence: [`docs/requirements-scope.md`](./docs/requirements-scope.md).

## Setup

### 1. Create a Supabase project

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql).
3. In **Project Settings → API**, copy the Project URL and the `anon public` key.

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from step 1.

### 3. Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/login`.

### 4. Create your first accounts

- Register a normal account at `/register` — it is created with the `contributor` role
  (see `handle_new_user()` in the migration) so you can immediately create draft content.
- To exercise the Approver/Publisher workflow, either register a second account and, as an
  admin, grant it the `approver`/`publisher` role from **Admin → roles**, or toggle roles
  directly for your own test account once you are an admin.
- To make an account an administrator (there is no self-service admin signup, by design), run
  in the Supabase SQL editor:

  ```sql
  update public.profiles set account_type = 'admin' where email = 'you@example.com';
  ```

## Baseline & branching

The assignment requires freezing "the first complete runnable version" before running
SonarQube and executing tests, and preserving it separately from any later defect fixes.
Workflow used in this repo:

1. The commit tagged `baseline-v1` (see `git tag`) is the frozen baseline submitted for
   SonarQube analysis and used for all Part 3 test execution.
2. Defect fixes found during testing are committed after that tag, on top of `main`, so the
   frozen baseline remains reconstructible via `git checkout baseline-v1`.

## AI-assisted development

This MVP's baseline implementation was produced with Claude Code from the SRS and the scope
table in `docs/requirements-scope.md`. See [`docs/assumptions.md`](./docs/assumptions.md) for
the full list of assumptions introduced during development and their basis (SRS-supported,
design decision, or unsupported/limitation).

## Scripts

```bash
npm run dev     # start the dev server (Turbopack)
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint
```
