# Contributing to ZTools Docs

Thanks for your interest in improving the [ZTools documentation site](https://ztools-docs.zaions.com). This repo is **only the documentation** — the ZTools app itself lives in a separate repository. Contributions to the docs are welcome: typo fixes, clearer explanations, new guides, accessibility improvements, and site/config fixes.

## How the tool pages work (read this first)

The per-tool pages under `docs/tools/**` are **auto-generated** — do **not** edit them by hand. They are produced by `scripts/generate-tool-pages.ts`, which reads the ZTools app's content data files as the single source of truth:

- **Free core tools** → metadata from the app's `src/data/toolsData.ts`, enriched content from `src/data/toolContent/batch*.ts`.
- **Paid Growth Suite tools** → metadata from the app's `src/data/growthSuiteTools.ts`, content from the same batch files.

Coverage is automatic: any tool that has enriched content **and** metadata gets a page on the next run — there is no allowlist to maintain. Paid Growth Suite tools are rendered with a clear paid/BYOK notice and never carry the "no data leaves your device" claim.

**So:** to fix the wording of a *tool* page, change the content in the app repo's `batch*.ts`, not the generated `.mdx`. Anything you edit under `docs/tools/**` will be overwritten the next time `yarn generate:tools` runs.

## What you can edit directly here

- Non-tool docs under `docs/` (guides, privacy, getting-started, etc.).
- The generator itself (`scripts/generate-tool-pages.ts`) — page template, SEO frontmatter, category handling.
- Site config (`docusaurus.config.ts`), theme, React components under `src/`, styles, and assets.
- This `CONTRIBUTING.md`, the `README.md`, and other top-level docs.

## Local setup

```bash
yarn install
yarn generate:tools   # regenerate the tool MDX from the sibling ../ztools app
yarn typecheck        # tsc — must be clean
yarn build            # production build into build/
# yarn start          # local preview server (for your own machine)
```

The generator expects the ZTools app checked out as a sibling directory (`../ztools`). If it isn't present, the tool pages can't be regenerated, but the rest of the site still builds.

## Content guidelines

- **Be honest.** State what a tool does *and* what it doesn't. Never invent statistics, user counts, ratings, or testimonials.
- **Keep the free/paid line clear.** The free core tools run in the browser with no signup; the Growth Suite is paid + BYOK and calls external services. Don't blur the two.
- **Privacy claims must be true for that specific tool.** "No data leaves your device" only applies to genuinely client-side tools.
- **No keyword stuffing.** It actively *reduces* AI-search visibility (per the Princeton GEO study, KDD 2024) and reads as spam.
- Write for humans first; clear, structured prose is also what AI search engines extract.

## Pull requests

1. Fork and branch from `main`.
2. Make your change; run `yarn typecheck` and `yarn build` — both must be clean.
3. Use a clear, conventional commit message (e.g. `docs: clarify the JWT decoder privacy note`).
4. Open a PR describing what changed and why. Screenshots help for visual changes.

## Code of conduct

Be respectful and constructive. Assume good faith, keep feedback specific, and focus on the work.

## Questions / contact

- Maintainer: **Ahsan Mahmood** — [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)
- Web: [aoneahsan.com](https://aoneahsan.com) · [LinkedIn](https://linkedin.com/in/aoneahsan) · [GitHub](https://github.com/aoneahsan)

The docs-site source is MIT licensed. By contributing, you agree your contributions are licensed under the same terms.
