# Manual / User-Only Tasks — ZTools Docs
> The ONE place for everything only you (the human) can do. Fixed path: docs/MANUAL-TASKS.md.
> Global spec: ~/.claude/rules/manual-tasks.md.   Last updated: 2026-07-22

## ⏳ Pending manual tasks
| # | Task | Why only you | Detailed runbook | Status |
|---|------|--------------|------------------|--------|
| 1 | Point DNS + configure GitHub Pages for `ztools-docs.zaions.com` | Only you control the `zaions.com` DNS zone and the repo's Settings. Add a DNS **CNAME** record `ztools-docs` → `aoneahsan.github.io`, then in the repo **Settings → Pages** set source to **GitHub Actions**, set the custom domain to `ztools-docs.zaions.com`, and **Enforce HTTPS** once the cert provisions. `static/CNAME` already ships the domain in `build/`; the `deploy.yml` workflow handles the build + publish. | GitHub Pages custom-domain docs | ☐ Not started |

## ✅ Completed manual tasks
| # | Task | Resolution | Date |
|---|------|-----------|------|
| — | Confirm tracked `.env.x` is OK in this PUBLIC repo | **ACCEPTED.** `.env.x` holds only `DOTENVX_PROJECT_ID` (a non-secret dotenvx project id designed to be committed) — no credential is exposed. Kept tracked via `!.env.x` in `.gitignore`; safe for the public repo. | 2026-07-22 |
