# ZTools Docs — Project Guide (CLAUDE.md)

**Last Updated**: 2026-10-02

Docusaurus 3 documentation site for **ZTools** (parent app `https://ztools.zaions.com`, Play Store
`com.zaions.ztools`). This repo is only the docs; the app lives in the private sibling repo at `../ztools/`.
Fleet rules load from `~/.claude/rules/` and are not repeated here.

| Fact | Value |
|---|---|
| Live docs | https://ztools-docs.zaions.com (GitHub Pages, `static/CNAME`) |
| Repo | `git@github.com:aoneahsan/ztools-docs.git` — **PUBLIC**, branch `main`, remote **`origin`** |
| Stack | Docusaurus 3.10 + `@docusaurus/faster`, React 19, TypeScript ~6, Yarn 4 (`.yarnrc.yml`, `nodeLinker: node-modules`) |
| Deploy | Push to `main` → `.github/workflows/deploy-pages.yml` builds and publishes. CI does not run the generator; `docs/tools/` is committed |
| Secrets | None in this repo, ever. Only `.env.example`; analytics keys are Actions secrets |
| Owner-only steps | `docs/MANUAL-TASKS.md` (excluded from the published site) |

## Tool pages — one source, real URLs

- `yarn generate:tools` (`scripts/generate-tool-pages.ts`) writes one MDX page per tool into `docs/tools/`.
  Never hand-edit a generated page; change the app's data and regenerate.
- **Identity comes from `../ztools/dist/tools-registry.json`**, emitted by the app's build (`yarn build` in
  `../ztools`). Content comes from `../ztools/src/data/toolContent/batch*.ts`.
- 🔴 **A tool's app link is `https://ztools.zaions.com` + its `route`, never `/<id>`.** Ids and routes differ
  for many tools; linking by id published 404 links until 2026-10-02.
- **Link gate:** the generator stops, writing nothing, when content has no registry row or a tool's route has
  no built page in `../ztools/dist`. Do not weaken it. Registry tools without content are listed as a warning.
- Paid (Growth Suite) and server-backed tools get their own wording through `ToolCTA`'s `kind` prop — they
  never carry the "no signup, no upload" line.
- Counts on the hub pages are computed by the generator. Hand-written pages say "580+".

## Commands

```bash
yarn install
yarn generate:tools   # needs a fresh ../ztools build
yarn typecheck
yarn build            # onBrokenLinks: 'throw' — the build is the internal link checker
yarn build:full       # generate:tools + build
```

Never run `yarn start` / `yarn serve` unprompted.

## Known local-build quirk

`@docusaurus/faster` can fail `yarn build` locally with a `git submodule status` exit 128 when the parent
workspace has gitlinks without `.gitmodules`. CI and standalone clones are unaffected. If typecheck is clean
and that exact error appears, it is this quirk; do not change the workspace.

## Content rules for hand-written pages

- State limits next to claims: most tools run in the browser; a few can use the server; the Growth Suite has
  paid plans; there is no iOS app.
- Check every `ztools.zaions.com/...` deep link against the registry or the app's built pages before adding it.
- Portfolio info for this site lives in the notebook, not here.
