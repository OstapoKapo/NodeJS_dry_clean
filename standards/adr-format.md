# ADR format (MADR)

Architecture decisions are recorded in `docs/adr/NNNN-kebab-title.md` using [MADR](https://adr.github.io/madr/). Numbers are sequential and never reused. A superseded ADR is kept and its status set to `Superseded by NNNN`.

Template:

```markdown
# NNNN. <Short title of solved problem and solution>

- Status: proposed | accepted | rejected | deprecated | superseded by NNNN
- Date: YYYY-MM-DD

## Context and problem statement

<Two or three sentences: the forces at play and the question being decided.>

## Decision drivers

- <driver 1>
- <driver 2>

## Considered options

- <option 1>
- <option 2>

## Decision outcome

Chosen option: "<option>", because <justification>.

### Consequences

- Good, because <positive consequence>.
- Bad, because <negative consequence>.

## Pros and cons of the options (optional)

### <option 1>

- Good, because …
- Bad, because …
```
