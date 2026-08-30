# Content integrity

Phase 1 contains identity supplied in the brief, neutral destinations, and explicit pending-content messages in `src/data/world-map.ts`. It contains no fabricated companies, roles, dates, projects, metrics, education, contact URLs, or proficiency claims. `portfolio.ts` is intentionally not populated before reading the CV.

When the CV becomes accessible:

1. Extract its text locally into the task's private `work/` directory, outside this repository.
2. Make a provenance table with: fact ID, exact source text, CV page/section, proposed public copy, and verification status.
3. Create `src/data/portfolio.ts` with verified identity, experience, education, skills, projects, and contact details. Keep dates in the specificity actually supplied by the CV.
4. Link each record to its provenance fact IDs. Do not commit sensitive raw extraction files.
5. Use optional case-study fields. Omit unsupported architecture, challenges, impact, metrics, and links rather than filling them with speculation.
6. Bind verified project artifacts to the workshop. Foundation screens, blocks, and lights currently depict the environment, not an employer system or performance claim.

AI exploration comes from the user's brief and remains separate from professional skills. The agent loop is a deterministic local simulation. It makes no network request, calls no model, and measures no real score.

Do not add a public CV download until its privacy-sensitive details have been checked. Do not fabricate a contact form backend, email address, or GitHub URL.
