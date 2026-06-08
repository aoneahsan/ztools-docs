# ZTools Docs — Project Guide (AGENTS.md)

**Last Updated**: 2026-05-29

Docusaurus 3 documentation site for the **ZTools** utility suite (parent app: `ztools.zaions.com`, Play Store `com.zaions.ztools`). This repo is **only the docs** — the ZTools app source lives in a separate (currently private) repo.

- Live docs: https://ztools-docs.zaions.com
- Parent app: https://ztools.zaions.com
- Repo: `git@github.com:aoneahsan/ztools-docs.git` (remote name is `o`), branch `main`
- License: MIT (docs site source)

---

## What this is

- Docusaurus 3.10.1 static site, React 19, TypeScript 6, yarn 4.14.1 (Corepack).
- **536 per-tool MDX pages** auto-generated across 19 categories from the sibling `../ztools/` app's content data files — single source of truth, no app/docs drift.
- Generator: `scripts/generate-tool-pages.ts`, run via `yarn generate:tools` (full pipeline: `yarn build:full`).
- `@docusaurus/faster` (Rspack) build, local search (`@easyops-cn/docusaurus-search-local`), Mermaid diagrams, strict CI (`onBrokenLinks: 'throw'`).
- Env-gated observability: GA4 (IP-anonymized), Microsoft Clarity, Amplitude, Sentry — each ships only when its env var is set. Disclosure at `/docs/privacy`.
- Full favicon / OG / PWA manifest set. Brand: warm amber `#ffa840` on charcoal/cream, dark-mode default.

## Commands

```bash
yarn install
yarn generate:tools   # regenerate MDX from ../ztools content data
yarn typecheck        # tsc — must be clean
yarn build            # Rspack production build into build/
yarn build:full       # generate:tools + build
```

> Never run dev/preview/watch servers (`yarn start`, `yarn serve`) — author runs those.

## Known local-build quirk

Docs siblings using `@docusaurus/faster` (Rspack) can fail `yarn build` LOCALLY when the 01-code parent has gitlinks without a `.gitmodules` (eager `git submodule status` exits 128). CI / standalone clones are unaffected. As of 2026-05-29 the local build PASSED; if it ever fails with that exact submodule error and typecheck is clean, treat it as the known local-only quirk — do NOT modify the workspace.

---

## Portfolio Info File — Weekly Update Rule
- Canonical portfolio info file: `/home/ahsan/Documents/ahsan-notebook/static/assets/personal/projects-info-as-portfolio-item/apps/ZTOOLS-DOCS_portfolio-info_<YYYY-MM-DD>.md`
- Update at least once per week (and on any material change). Keep the last-updated date in the filename.
- Keep a max-10-entry update history inside the file. On each refresh: prepend today's row, delete the previous dated file, write the new one.
- Tracker: `/home/ahsan/Documents/01-code/docs/tracking/portfolio-info-files-update-tracker.json`
- Last applied: 2026-05-29

## Package Manager Hierarchy: nvm → npm (global) → yarn (local) (IRON-SOLID)

Three tiers, each tool ONLY for its tier — for the best, most reproducible dev results:
- **`nvm`** → install/update Node.js (which bundles `npm`): `nvm install --lts`. Use nvm to get/update `npm` itself.
- **`npm`** → ALL global packages: `npm install -g yarn` (install yarn globally if missing) + `npm install -g <pkg>` (every other global CLI).
- **`yarn`** → ALL local project work: `yarn`, `yarn add <pkg>`, `yarn add -D <pkg>` inside the project.

❌ NEVER use `npm`/`pnpm` for LOCAL installs. NEVER use `pnpm` at all. ✅ Only `yarn.lock` in the project — delete `package-lock.json` and `pnpm-lock.yaml`.

## Package Upgrades: Use `npm-check-updates`
For dependency upgrades use `npx -y npm-check-updates -u && yarn install` (latest STABLE), NOT `yarn upgrade --latest`. Full rule in global `~/.claude/CLAUDE.md`. Last applied: 2026-05-29

## SEO + AEO + Ranking
Diagnostic + fix playbook: `~/.claude/rules/seo-aeo-ranking.md`. This site is the origin example for that playbook. robots.txt allows all major AI bots; `llms.txt` shipped; per-tool 1000+ word MDX with FAQ/HowTo. Last applied: 2026-05-06
