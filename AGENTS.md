<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Mashbot (SE3002 Assignment 01)

This repo is a graded coursework MVP evaluating AI-generated software quality, not a
production product. Read [`README.md`](./README.md) and
[`docs/requirements-scope.md`](./docs/requirements-scope.md) before making changes — they
define the exact 7 FR + 3 NFR scope this codebase is allowed to claim as implemented.

## Ground rules for changes

- **Do not silently expand scope.** Every requirement implemented must trace back to a row in
  `docs/requirements-scope.md`. If you add behaviour outside that table, add a row (or a note
  in `docs/assumptions.md`) explaining why, per the assignment's "unsupported assumptions must
  not be hidden" rule.
- **The frozen baseline matters.** Once a `baseline-vN` tag exists, treat it as read-only
  evidence. New work happens in new commits on top of it; never rewrite history that a
  SonarQube scan or test run was already taken against.
- **RLS is part of the security model**, not just the server actions. `supabase/migrations/0001_init.sql`
  encodes the same role checks (`is_admin`, `has_role`, `is_active_user`) that the server
  actions in `src/lib/actions/*` also check explicitly — keep both in sync when changing
  authorization rules.
- **Simulated integrations stay simulated.** External service accounts (`src/lib/actions/externalAccounts.ts`)
  intentionally do not call real provider APIs (see `docs/assumptions.md` item 4). Don't wire up
  real OAuth without updating that assumption and getting explicit sign-off — it changes the
  security/NFR evaluation.
- **Service-role key never enters this codebase.** User deletion only removes the `profiles`
  row (see comment in `src/lib/actions/users.ts`) precisely to avoid needing that key
  client/server-action-side. If you add a use case that seems to need it, flag it instead of
  adding the key to `.env.local`.

## Tech stack quick reference

Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4, Supabase (Postgres + Auth).
Server mutations are Server Actions in `src/lib/actions/`, not API routes. Auth/session
handling and route protection live in `src/proxy.ts` (Next 16's renamed `middleware.ts`).
