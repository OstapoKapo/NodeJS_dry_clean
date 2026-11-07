# Lab 1 AI work record

Prompts and responses are kept here for review. This record contains no credentials.

## Specification

**Prompt (user, excerpt):** “Create a spec.md that includes what we're building and why; modules and responsibilities; dependencies; data models; data changes; and clear, testable acceptance criteria. Keep it within one page. Don't implement the application or create other files yet.”

**Response (assistant):** Created a one-page `spec.md` describing Customers, Services, Orders, price snapshots, order status transitions, and acceptance criteria. No application code or commit was made.

## Planning

**Prompt (user, excerpt):** “For this lab, I don't want to implement the full backend yet. I want to focus on the project foundation, architecture, and development standards. Create a step-by-step plan ... Don't implement anything or modify files yet.”

**Response (assistant):** Proposed the scaffold, Prisma migration, module boundaries, `/version`, standards and ADRs, Makefile checks, Git hooks, AI record, commit sequence, and verification. Flagged that the original spec's CRUD criteria exceeded Lab 1 scope.

**Prompt (user):** “Looks good. Let's keep all plans in docs/plans/ and ADRs in docs/adr/. Create docs/plans/lab1.md with this plan.”

**Response (assistant):** Created `docs/plans/lab1.md` with the approved plan and updated ADR path. No implementation or commit was made in that step.

## Implementation

**Prompt (user):** “Okay implement the plan”

**Follow-up prompt (user):** “Also, create an AGENTS.md file with project-wide rules for AI agents. Keep it simple, similar to what real projects use. Include rules for code style, architecture, module dependencies, testing, and verification before finishing changes. Make sure agents follow spec.md, standards/, and ADRs when making changes. Don't duplicate all the documentation in AGENTS.md, just reference it. Also, add a rule that agents should read AGENTS.md and the relevant project docs before starting work.”

**Response (assistant):** Implemented the Lab 1 foundation, `AGENTS.md`, standards and ADRs, documentation, `/version`, automated checks and hooks. `make check` passes, including three tests; the module audit rejects a forbidden import; both hook scripts pass and propagate a failing check. Applying the migration is blocked because PostgreSQL is unavailable, and installing hooks or making the remaining commits is blocked because this session cannot write `.git/config`.
