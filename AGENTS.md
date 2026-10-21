# ZTools docs — project guide (AGENTS.md)

**Last updated:** 2026-10-21. Claude Code reads `CLAUDE.md`; other agents read `AGENTS.md`. The two are
identical except this heading. Change both together. Fleet law auto-loads from `~/.claude/rules/`.

## Repository and publication

This public Docusaurus repository documents ZTools at https://ztools-docs.zaions.com. Repository
`aoneahsan/ztools-docs`, branch `main`, remote `origin`. A push to `main` runs
`.github/workflows/deploy-pages.yml`; build and controlled-browser verification must pass before the push.
No secrets or private repository links belong here.

The private app is the sibling `../ztools/`. Its fresh build emits `../ztools/dist/tools-registry.json`.
The docs generator combines that registry with the app's rich tool content and commits the generated MDX.
Current verified registry: 579 tools in 20 categories.

## Commands

```bash
yarn install --immutable
yarn generate:tools   # requires a fresh ../ztools build
yarn typecheck
yarn build
yarn serve            # only when browser verification is requested
```

`yarn build:full` runs the generator and build. Docusaurus treats broken internal links as errors.

## Content and generator contracts

- Never hand-edit `docs/tools/`; change app metadata/content or `scripts/generate-tool-pages.ts`, then regenerate.
- A tool link uses the registry's `route`, never `/<id>`. The generator stops before writing if content,
  registry and built routes disagree.
- Counts on generated hubs come from the registry. Handwritten pages use evergreen wording.
- Many tools run in the browser; others send input to a server or provider. Growth tools require sign-in and
  have plan limits. State the boundary for the named tool rather than making a catalog-wide privacy claim.
- Public content follows the approved ZTools Story Bible and final packets in `../ztools/docs/story/`.
- `docs/MANUAL-TASKS.md` is private operational material excluded from the published build.
- Optional analytics/error services are controlled by CI secrets. Keep only `.env.example` in Git.

## Context record

| Field | Value |
|---|---|
| Last optimized | 2026-10-21 |
| Next routine optimization eligible | 2026-11-20 |
| Guide bytes | 02442 |
| Covered subtree | public docs repository, generator, Docusaurus config and Pages workflow |
| Gitignore last verified | 2026-10-20 — dependencies, build output, caches and environment values ignored |
