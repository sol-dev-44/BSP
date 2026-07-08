# Deferred Items — 260708-hcu

## ESLint config missing (pre-existing, out of scope)

`npm run lint` fails on `main` before this task's changes with:

```
ESLint couldn't find an eslint.config.(js|mjs|cjs) file.
```

Verified via `git stash` that this failure exists on `main` at commit `9c703a4`, unrelated to `BookingsTable.tsx` changes made in this task. ESLint 9 requires a flat config (`eslint.config.js`) and the repo has none. Not fixed here per scope boundary — logging for a future quick task or phase to add `eslint.config.js` (flat config migration from `eslint-config-next`).
