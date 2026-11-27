# Search-console fix log — ztools-docs

Fixed path in every repo (`aoneahsan-cccs-search-issue-remediation`). Newest first. Not published: excluded in
`docusaurus.config.ts`. The audit session retests with the commands under **Retest**.

## ztools-docs#2 — indexing issues (audit 2026-11-26) · 2026-11-27 · commit: see `git log -- docs/search-consoles/fix-log.md`

Status: box 1 and the ztools-docs part of box 2 are live-verified, google-pending (commit `2817996`, gh-pages
`a586644`, IndexNow 200 for all 661 sitemap URLs). Live 2026-11-27: `/docs/tools/pdf/rotate-pdf` → 301 to the slashed
form; `/docs/tools/pdf/rotate-pdf/`, `/docs/guides/speak/`, `/docs/privacy/` and `/blog/archive/` → 200; one
self-canonical in the slashed form; 0 unslashed URLs in `sitemap.xml`; `/docs/tags/guide/` → refresh `/sitemap/`. The other hosts in box 2 are Pending (below). Built with zero new warnings; the one webpack warning
(`vscode-languageserver-types`, pulled in by Mermaid) was there before this change. `yarn seo:contract` passes, and it
failed on a planted noindex on `/docs/tools/pdf/rotate-pdf/`. Rendered at 1440 before publishing.

| Box | SA | What was wrong (evidence) | Root fix (file) | Contract | Live proof |
|---|---|---|---|---|---|
| 1 · 114 tool URLs 404 with a trailing slash | P26 | `trailingSlash: false` wrote `page.html`; on 2026-11-27 `/docs/tools/pdf/rotate-pdf/` → 404, slashless → 200 | `docusaurus.config.ts` `trailingSlash: true`: every page is `<route>/index.html`, and GitHub Pages 301s `/x` to `/x/`. Links from the ZTools app to either form now land | fails on any `x.html` page, unslashed same-origin canonical or unslashed sitemap URL | see Retest |
| 2 · `/docs/guides/*` (5), `/docs/privacy`, `/blog/archive` | P26 | all trailing-slash forms (probed: `/docs/guides/speak/`, `/docs/privacy/`, `/blog/archive/` → 404) | same switch | same | see Retest |
| 2 · `/docs/tags/*` (3) | P26/P32 | slashed tag pages 404, and the tag pages were boilerplate | `tags:` front matter → `topics:` (46 docs; the `/sitemap` chips read it in `plugins/site-pages.ts`); every old tag URL redirects to its matching page or `/sitemap` (`plugins/seo-redirects.ts`) | each redirect and its target are checked | `/docs/tags/guide/` → refresh `/sitemap/` |
| found · `/blog/tags`, `/blog/authors` had no meta description | P29/P32 | thin lists of the same 4 posts; one author entry also printed a personal phone number on a public page | blog tags and `authors.yml` removed; the team written inline as the author of every post; old URLs → `/blog` | contract: one description per page | see Retest |
| found · ecosystem and about-developer pages | — | they canonicalise to `ztools.zaions.com` on purpose (they carry the website's words) | contract checks the slash form only on same-origin canonicals | — | — |

Overruled by owner law: none in this issue (it asked for redirects, not noindex).

### Box 2's other hosts — fixed in their own repos, 2026-11-27

- `ztools.zaions.com/privacy/` → 301 `/privacy-policy` (ztools app commit `6014ba9`)
- `docs.zaions.com/PACKAGES/` → `/packages/` (zaions-docs commit `7e72502`)
- `zaions.com/blogspot/`, `zaions.com/tag/react-final-form` → 301 `/blog` (zaions-portfolio commit `115ba06`)

### Pending

| Box | Why not done here | Who | Next action |
|---|---|---|---|
| Google re-crawl and Validate fix | console | daily audit | Validate fix |

### Retest

```bash
H=https://ztools-docs.zaions.com
for p in /docs/tools/pdf/rotate-pdf /docs/tools/pdf/rotate-pdf/ /docs/guides/speak/ /docs/privacy/ /blog/archive/; do
  printf '%s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$H$p")"
done   # slashless → 301 to slashed; slashed → 200
curl -s "$H/docs/tags/guide/" | grep -o 'http-equiv="refresh"[^>]*'   # → /sitemap/
curl -s "$H/sitemap.xml" | grep -oE '<loc>[^<]*</loc>' | grep -vc '/</loc>'   # 0
```
