# Spec format

Every feature or lab spec is a Markdown file (root `spec.md` for the system, or `docs/specs/<name>.md`) with these sections, in order:

1. **Title** — system or feature name. Do not put a lab number in the title if the spec outlives the lab.
2. **Purpose** — one paragraph: what problem, for whom, and what is explicitly out of scope.
3. **Modules and dependencies** — each module's responsibility and the allowed dependency direction.
4. **Data model** — a table of models, fields, constraints, and relationships. Money is integer cents.
5. **Main scenarios** — numbered, observable behaviors, including failure behavior (what is *not* saved).
6. **Acceptance criteria** — a checklist of verifiable statements: endpoint + input → status code + observable result. Each criterion must be testable by a reviewer without reading code.
7. **Scope for the current increment** (optional) — when the spec describes a target larger than the current lab, a separate section lists the subset delivered now with its own acceptance criteria.

Rules:

- Mark target-only sections as such so a reviewer never mistakes future behavior for current scope.
- Use exact names (endpoints, modules, fields) that match the code.
- Changes to behavior update the spec in the same commit as the code.
