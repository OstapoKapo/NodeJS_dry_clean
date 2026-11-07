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

## Audit and follow-up

**Prompt (user):** “Now let’s audit the implementation. Review the code, project structure, module dependencies, and architecture against spec.md, standards/, and our ADRs. Find the top 3 real issues, unnecessary dependencies, or places where the implementation is more complicated than needed. For each issue, explain what’s wrong and where, why it’s a problem, and how we could improve it. Also check if we have any unnecessary modules or abstractions, especially the separate VersionModule. Don’t fix anything yet.”

**Response (assistant):** Reported three findings: the dependency audit missed path aliases and actual module wiring; the smoke test called the controller instead of making an HTTP request; and the one-endpoint `VersionModule` was an unnecessary wrapper. No files were changed in the audit.

**Prompt (user):** “I reviewed the audit results, and I agree with these three issues. The dependency audit should catch forbidden imports even when path aliases are used and check actual NestJS module imports. The smoke test should make a real HTTP request to /version. Move the controller and GitShaService to AppModule and remove VersionModule. Before fixing code, update the relevant spec or standards. Then fix each issue, add tests where needed, and run all checks.”

**Response (assistant):** Updated `spec.md` and `standards/` first, added regression tests for alias imports and Nest module wiring, changed the smoke test to send an HTTP request through Nest using an in-memory transport, and registered the version controller and service directly in AppModule. `make check` passes with seven tests.
