
## 2026-05-30 — `npm run lint` infrastructure failure (Plan 02.1-03)

ESLint 9.x requires `eslint.config.(js|mjs|cjs)` — repo has no such file (only `.eslintrc.*` style or none). Running `npm run lint` exits with an ESLint setup error, not a code-quality finding. Pre-existing across the codebase; not introduced by Plan 02.1-03. `npm run build` (which runs Next.js built-in lint) passes cleanly. Defer to a future infrastructure quick task to add `eslint.config.js`.
