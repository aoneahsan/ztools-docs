# Manual / User-Only Tasks — ZTools Docs
> The ONE place for everything only you (the human) can do. Fixed path: docs/MANUAL-TASKS.md.
> Global spec: ~/.claude/rules/manual-tasks.md.   Last updated: 2026-06-24

## ⏳ Pending manual tasks
| # | Task | Why only you | Detailed runbook | Status |
|---|------|--------------|------------------|--------|
| 1 | Confirm tracked `.env.x` is OK in this PUBLIC repo | It holds only `DOTENVX_PROJECT_ID` (a non-secret dotenvx project id, designed to be committed). The gitignore-hygiene grep flags any `.env*` file, so kept tracked via `!.env.x` rather than removed. No credential is exposed; confirm you're comfortable with the project id being public (standard dotenvx behaviour). | n/a (dotenvx docs) | ☐ Confirm |

## ✅ Completed manual tasks
(none yet)
