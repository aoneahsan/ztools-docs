# ZTools Docs — Portfolio Info

Reference Date: 2026-05-07
Project Type: Docusaurus 3 documentation site for the ZTools utility suite (520+ tools)
Project Slug: ztools-docs
Primary Email Reference: aoneahsan@gmail.com
Last Portfolio Update: 2026-05-07
Next Eligible Update After: 2026-05-14

---

## Identity & Distribution (Authoritative)

| Field | Value |
| --- | --- |
| Project Slug | `ztools-docs` |
| Public Brand Name | ZTools Docs |
| Public URL (Live) | https://ztools-docs.zaions.com |
| Sibling App | https://ztools.zaions.com (and `com.zaions.ztools` on Play Store) |
| Repository | private (single source of truth: ZTools app content) |
| App ID (Capacitor) | N/A — pure Docusaurus website |
| Android URL | N/A |
| iOS URL | N/A |
| Chrome Extension | N/A |
| NPM Package | N/A |
| License | MIT |
| Author | Ahsan Mahmood — aoneahsan@gmail.com |
| Payment / Support URL | https://aoneahsan.com/payment?project-id=ztools-docs&project-identifier=ztools-docs |
| Tool Count | 520+ tool pages (MDX, auto-generated from sibling ZTools app) |
| Generator | `yarn generate:tools` reads `../ztools/` content data and emits MDX into `docs/tools/` |

---

## Brand Assets

### Logo (SVG — inline)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="ZTools Docs">
  <defs>
    <linearGradient id="ztd-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="92" height="92" rx="22" fill="url(#ztd-grad)"/>
  <rect x="22" y="22" width="40" height="56" rx="4" fill="#FFFFFF"/>
  <path d="M30 36 L54 36 M30 46 L54 46 M30 56 L48 56 M30 66 L52 66" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M62 30 L70 30 L70 78 L62 78 Z" fill="#FFFFFF" opacity="0.85"/>
  <circle cx="76" cy="40" r="4" fill="#FFFFFF" opacity="0.75"/>
  <circle cx="76" cy="54" r="4" fill="#FFFFFF" opacity="0.75"/>
  <circle cx="76" cy="68" r="4" fill="#FFFFFF" opacity="0.75"/>
</svg>
```

### Color Palette

| Role | Token | Hex | Usage |
| --- | --- | --- | --- |
| Primary | Slate 900 | `#0F172A` | Brand mark, code blocks |
| Secondary | Cyan 400 | `#22D3EE` | Gradient end, link hover |
| Surface — Light | Slate 50 | `#F8FAFC` | Page background |
| Surface — Dark | Slate 900 | `#0F172A` | Dark mode background |
| Foreground | Slate 900 / 50 | `#0F172A` / `#F8FAFC` | Body copy |

> Color cue tracks the parent `ztools` project for cross-property brand consistency.

---

## Update History (max 10)

| Date | Type | Notes |
| --- | --- | --- |
| 2026-05-07 | Created | First portfolio info file. Captures live URL `https://ztools-docs.zaions.com`, Docusaurus 3 stack, single-source-of-truth data binding to sibling `../ztools/` app, generator script (`yarn generate:tools`), 520+ tool pages emitted as MDX, 13 content batches (last: design + productivity + developer + extractor + legal — 55 tools), production audit (broken links + missing assets + strict CI), live-site fixes (button contrast, local search, mermaid, announcement bar), and the env-driven analytics + observability stack (Microsoft Clarity, Amplitude, Sentry, Google Analytics 4 with IP anonymization), full icon / favicon / OG / manifest set (PWA-ready), and dotenv wiring for local analytics overrides. |

---

## One-Line Summary

ZTools Docs is the Docusaurus 3 documentation site for the ZTools utility suite — auto-generating 520+ per-tool MDX pages from the sibling `ztools` app's content data, with env-driven Clarity/Amplitude/Sentry/GA4, full PWA-ready icon set, and a strict-CI broken-link audit.

## Elevator Pitch

ZTools Docs is the public documentation surface for ZTools. A single `yarn generate:tools` command reads the sibling app's content data files and emits MDX for every one of the 520+ tools — single source of truth, no drift between app and docs. The Docusaurus 3 site ships with env-driven Microsoft Clarity, Amplitude, Sentry, and Google Analytics 4 (IP-anonymized, privacy-disclosed), a complete favicon / OG / manifest set for proper social previews and PWA install, local search, Mermaid diagrams, an announcement bar, and a production audit that fails CI on broken links or missing assets.

## What This Project Is About

A documentation companion to the ZTools utility app. Users land on `ztools-docs.zaions.com`, browse 520+ tool pages, read use cases / examples / FAQs / tips per tool, and click through to the live tool on `ztools.zaions.com`. The MDX pages are derived from the same content data that powers the AEO content in the parent ZTools project — the docs site is essentially the public-facing "documentation cut" of that content.

## Vision

Be the canonical documentation surface for the ZTools utility suite — discoverable on Google, citable by AI search, and always in sync with the app because both read the same source of truth.

## Mission

- Auto-generate 520+ per-tool MDX pages from `../ztools/` content data.
- Run on Docusaurus 3 with strict CI (broken links + missing assets fail the build).
- Wire env-driven analytics + error tracking — Clarity, Amplitude, Sentry, GA4 (with IP anonymization).
- Ship complete favicon / OG / PWA manifest set for social-card previews and offline install.
- Stay free-tier — Docusaurus is static, hosting is cheap.

## Core Value Proposition

- **Single source of truth** — docs derived from the same content data that powers the app's AEO content.
- 520+ per-tool pages, always in sync with the app.
- Static-first delivery — fast loads, AI-crawler-friendly, no SPA SEO problems.
- Quad-provider observability — Clarity (UX), Amplitude (product), Sentry (errors), GA4 (lifecycle), all env-gated.
- Strict CI — broken links and missing assets fail the build.
- Full PWA-ready icon + manifest set.

## Tech Stack (Verified)

| Layer | Technology |
| --- | --- |
| Framework | Docusaurus 3 |
| Language | TypeScript |
| Content | Auto-generated MDX from `../ztools/` content data |
| Generator | `scripts/generate-tool-pages.ts` (run via `yarn generate:tools`) |
| Search | Local search (Docusaurus plugin) |
| Diagrams | Mermaid |
| Analytics | Google Analytics 4 (env-driven, IP-anonymized) |
| UX Analytics | Microsoft Clarity (env-driven) |
| Product Analytics | Amplitude (env-driven) |
| Error Tracking | Sentry (env-driven) |
| Env Loading | dotenv for local development |
| Package Manager | yarn |
| CI | Strict — broken links + missing assets fail |

## Best Features

- Auto-generated per-tool MDX from a single content source — no drift.
- 520+ tool pages with use cases, examples, FAQs, tips.
- Quad-provider observability (Clarity + Amplitude + Sentry + GA4) all env-gated.
- Full favicon / OG / PWA manifest set — proper social previews, PWA installable.
- Local search built in (no Algolia subscription).
- Mermaid diagram support for flowcharts and architecture diagrams.
- Announcement bar for site-wide updates.
- Strict-CI build that fails on broken links and missing assets.
- Dotenv wiring for local analytics testing.

## Technical Strengths

- Single-source-of-truth design — docs and app cannot drift because both read the same content data.
- Docusaurus 3 with TypeScript-driven config (`docusaurus.config.ts`).
- Privacy-respecting analytics — GA4 IP-anonymized, all keys env-gated, fully optional.
- Strict-CI link auditing prevents broken-doc regressions.
- 13 content batches shipped over the source generator's evolution — final batch covered design + productivity + developer + extractor + legal (55 tools).

## Business and Product Strengths

- Public documentation drives organic discovery for ZTools tools.
- AI-crawler-friendly static MDX — citable by ChatGPT, Claude, Perplexity, Google AI Overviews.
- Cross-link to live tools at `ztools.zaions.com` keeps users in the funnel.
- PWA-ready means users can install the docs as an app.
- Free-tier hosting suitable for static Docusaurus output.

## Benefits for Users and Teams

- Users: discover tools via Google or AI search, read concrete usage docs, click through to the tool.
- ZTools team: a single content data update flows into both the app's AEO content AND the public docs — no manual sync.
- AI assistants: structured per-tool MDX is easy to crawl and cite.

## Hidden Facts and High-Value Talking Points

- 520+ tool pages auto-generated — the largest single source of MDX pages in the workspace.
- The same content data powers both the app's per-tool AEO content AND this docs site — single source of truth.
- 13 content batches shipped to bring the generator coverage to 100 % (final batch: 55 tools across design / productivity / developer / extractor / legal).
- Quad-provider analytics + error tracking, all env-gated (silent if keys absent).
- IP-anonymized GA4 + privacy-disclosed setup — compliance-aware analytics.
- Strict-CI audit fails the build on broken links or missing assets — no broken-doc regressions.

## Resume / CV / Portfolio Use

Use this project to highlight:

- Docusaurus 3 production deployment.
- Single-source-of-truth docs architecture (auto-generation from sibling app content).
- Quad-provider observability stack with env-driven keys and privacy disclosures.
- Strict-CI link auditing.
- PWA-ready static-site delivery.
- 520+ MDX pages at scale.

## Strong Resume Bullet Ideas

- Built ZTools Docs, a Docusaurus 3 documentation site for the 520+ tool ZTools utility suite, with per-tool MDX pages auto-generated from the sibling app's content data via a `yarn generate:tools` script — single source of truth, no app/docs drift.
- Wired a quad-provider observability stack — Microsoft Clarity (UX), Amplitude (product), Sentry (errors), Google Analytics 4 (IP-anonymized, privacy-disclosed) — all env-gated and silent when keys are absent.
- Shipped a complete favicon / OG / PWA manifest set for proper social previews and offline-install support, plus local search, Mermaid diagrams, an announcement bar, and a strict-CI broken-link audit that fails the build on broken links or missing assets.
- Ran 13 content batches to bring the generator to 100 % coverage; final batch covered design + productivity + developer + extractor + legal (55 tools).

## Social Post Angles

- Single-source-of-truth docs — when the docs and app cannot drift because they both read the same data.
- Quad-provider observability that respects user privacy — env-gated, IP-anonymized.
- 520+ auto-generated MDX pages on Docusaurus 3.
- Strict-CI broken-link audits — never ship a broken doc again.
- PWA-ready Docusaurus — what changes in your manifest.

## Suggested SEO Keywords

- ZTools Docs
- Docusaurus 3 documentation site
- single source of truth docs
- auto-generated MDX docs
- developer tools documentation
- AI-citable docs site
- privacy-respecting GA4 docs
- strict-CI broken link audit

## Social Hashtags

### Generic Hashtags Provided

#Aoneahsan #AhsanMahmood #Zaions #BestOpenSourceCommunityProject #TopFree #SaaSApp

### Top 20 Project Hashtags

#ZToolsDocs #Docusaurus #DocusaurusV3 #DeveloperDocs #DocsAsCode #MDX #TypeScriptProject #StaticSite #PWA #GoogleAnalytics #MicrosoftClarity #Amplitude #Sentry #Mermaid #LocalSearch #BuildInPublic #DocumentationEngineering #SingleSourceOfTruth #FreeTierSaaS #AISEO

## SEO and Content Support Notes

- Position as the public docs companion to the ZTools utility suite — not a standalone product.
- Lead with "single source of truth" + "520+ auto-generated MDX pages" — those are the differentiators.
- Mention the privacy-respecting analytics stack when targeting compliance-aware audiences.
- Cross-link `ztools.zaions.com` (app) and `ztools-docs.zaions.com` (docs) in posts.

## Known Constraints To Mention Honestly

- Public version of ZTools is the docs site here; the ZTools app source is currently private.
- Generator depends on the sibling `../ztools/` content data files being present — not standalone.
- Mobile/Capacitor packaging not in scope (it's a Docusaurus static site).

## Why This Project Has Strong Portfolio Value

ZTools Docs is a working example of single-source-of-truth documentation at scale (520+ pages), with privacy-respecting observability, PWA delivery, and strict-CI quality gates — all on a static Docusaurus 3 stack. It is the public face of the ZTools content investment that produced the workspace's canonical AEO playbook example.

## Content Prompting Notes For Future ChatGPT Use

When generating content from this file, emphasize:

- Single-source-of-truth docs auto-generated from sibling app content.
- 520+ MDX pages — concrete scale signal.
- Quad-provider env-gated observability with privacy disclosures (GA4 IP anonymization).
- PWA-ready favicon / manifest set.
- Strict-CI broken-link audit.
- Use the slate-to-cyan gradient as the brand colour cue (matches parent `ztools`).

## File Usage Rule

Refresh weekly (MANDATORY); 3-day skip floor; max 10 history records. Filename always carries last-updated date. Final destination: `~/Documents/ahsan-notebook/static/assets/personal/projects-info-as-portfolio-item/apps/ZTOOLS-DOCS_portfolio-info_<YYYY-MM-DD>.md`.
