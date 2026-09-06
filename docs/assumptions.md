# AI-Assisted Development Record

## Tooling

The baseline implementation of this MVP was produced with Claude Code (Anthropic), an
AI-assisted coding tool, working from the Mashbot SRS (`2010 - mashboot.pdf`) and the selected
10-requirement scope in [`requirements-scope.md`](./requirements-scope.md). The pair is
responsible for the resulting code, reviewed the generated implementation, and recorded the
assumptions below as required by the assignment brief.

## How to read this file

Each entry names the requirement it affects, the assumption introduced, and its basis:

- **(a) SRS** — directly supported by the SRS text.
- **(b) Design decision** — not explicit in the SRS, but a defensible scoping choice we made and documented.
- **(c) Unsupported** — a gap between the SRS and the implementation that we are not hiding.

See [`requirements-scope.md`](./requirements-scope.md) for the full per-requirement table; this
file lists the assumptions that affect the codebase/architecture as a whole.

## Architecture-wide assumptions

1. **Auth provider fixed to Supabase Auth.** The SRS (0670) calls for a *configurable*
   authentication module with an internal fallback. The MVP hardcodes Supabase email/password
   auth and does not implement a pluggable module system. **(c) Unsupported** — documented
   limitation, not a hidden gap.

2. **Session timeout is a fixed constant**, not an admin-configurable setting (SRS 0680).
   **(c) Unsupported**.

3. **Roles are global, not per-product/per-campaign.** The SRS (0200) describes roles assignable
   "for individual products"; campaign-level permissions (0520) suggest per-campaign ACLs. The
   MVP stores one role set per user account, applied uniformly across all campaigns they can
   access. **(b) Design decision** — reduces scope to fit an MVP timeline; a per-campaign
   permissions table is the natural next iteration.

4. **External service accounts are simulated, not live OAuth integrations.** Connecting
   Facebook/Twitter/etc. would require registering developer apps with each platform, which is
   outside the scope of a graded coursework MVP. The UI clearly labels connections as
   "simulated" and stores only a provider name + external username. **(b) Design decision**,
   explicitly surfaced in the UI so it is never mistaken for a real integration.

5. **No real publishing side-effects.** "Publishing" a piece of content changes its status in our
   own database only; it does not call any external network's API. This keeps the MVP safe to
   demo without real credentials while still exercising the full approval → schedule → publish
   state machine. **(b) Design decision**.

6. **Backups, TLS termination, and server memory ceilings are delegated to the hosting platform**
   (Supabase managed Postgres + Vercel/Node hosting) and are not independently implemented or
   measured by application code. See the NFR rows in `requirements-scope.md` for the specific
   limitations this creates for evidence-gathering. **(a) SRS-supported requirement, (c)
   unsupported evidence** — we report this gap rather than fabricating a measurement.

7. **Email verification on registration (SRS use case 6) is not implemented.** Supabase Auth
   supports it, but it was left disabled for the MVP so the pair can create test accounts quickly
   during test execution. **(b) Design decision** — a real release would enable it.

8. **Content types are limited to Text and Image** (SRS 0550/0560, Priority 1) — Audio and Video
   (0570/0580, Priority 3) are out of scope for the initial release per the SRS's own priority
   scheme. **(a) SRS-supported** (Priority 3 items are not expected in the initial release).

9. **Deleting a user account removes only the `profiles` row, not the underlying Supabase Auth
   user.** A full delete requires the service-role key, which the client-side/server-action code
   in this MVP intentionally never holds (keeping it out of the codebase avoids a severe
   SonarQube security hotspot for a secret key with database-wide privileges). **(b) Design
   decision**, documented so it is not mistaken for a complete deletion.

## Baseline freeze

The first complete, runnable commit implementing all 10 selected requirements is the baseline
that will be submitted to SonarQube and used for all test execution in Part 3 of the assignment.
Any defect fixes made after that point will be committed separately so the evaluated baseline
remains reconstructible from git history (see `README.md` → "Baseline & branching").
