# ZTools Documentation

Public documentation for [ZTools](https://ztools.zaions.com), covering 579 tools in 20 categories. The site
uses Docusaurus 3 and publishes at [ztools-docs.zaions.com](https://ztools-docs.zaions.com).

The 2026-10-21 maintenance pass regenerated all 579 tool pages, passed typecheck/build and controlled desktop/mobile Chrome, and updated the GitHub Pages workflow to current action majors. The workspace fleet tracker records the deployment run.

- [Open ZTools](https://ztools.zaions.com)
- [Browse the docs](https://ztools-docs.zaions.com)
- [Get the Android app](https://play.google.com/store/apps/details?id=com.zaions.ztools)

## What this repository contains

This repository holds the public docs site. Each tool page includes use cases, examples and FAQs. Generated
tool pages come from the private sibling app's rich content and its build-time registry, so links use the real
application route.

The application, backend, Android source and browser extension live in the private sibling repository. No app
secrets or private source belong here.

## Run locally

```bash
yarn install --immutable
yarn generate:tools
yarn typecheck
yarn build
yarn serve
```

The generator needs `../ztools/` and a fresh `../ztools/dist/tools-registry.json`. Without those inputs, the
committed tool pages can still build, but they cannot be regenerated.

All docs-site integrations are optional: Google Analytics 4, Microsoft Clarity, Amplitude and Sentry. Their
variable names are in `.env.example`; values belong in local environment storage or GitHub Actions secrets.
Unset variables leave the corresponding integration out of the build. See the
[docs privacy page](https://ztools-docs.zaions.com/docs/privacy).

## Repository map

| Path | Purpose |
|---|---|
| `docs/tools/` | Generated tool pages; never edit by hand |
| `docs/guides/` | Handwritten task guides |
| `blog/` | Release notes and project updates |
| `src/pages/index.tsx` | Documentation home |
| `src/components/ToolCTA/` | Links from docs pages to the app |
| `scripts/generate-tool-pages.ts` | Registry and content generator |
| `static/` | CNAME, images, robots.txt and llms.txt |
| `.github/workflows/deploy-pages.yml` | GitHub Pages build and deploy |

## Add or update a tool page

1. Update the tool metadata and rich content in `../ztools/`.
2. Build the app so its registry and static routes are current.
3. Run `yarn generate:tools && yarn typecheck && yarn build` here.
4. Review the generated diff and the exact build in a controlled browser.
5. Push `main`; GitHub Pages publishes the verified source.

A tool needs both metadata and rich content. The generator fails when an app route, registry row or content
record is missing.

## Processing boundaries

Many tools work in the browser. Some send input to a server or provider, and Growth tools require an account
and have plan limits. Each generated page names the tool's current setup. The app's
[privacy policy](https://ztools.zaions.com/privacy-policy) explains application data processing.

## License and contact

The docs site source is MIT licensed. Documentation content follows the ZTools app's
[terms](https://ztools.zaions.com/terms).

Ahsan Mahmood · [aoneahsan.com](https://aoneahsan.com) ·
[aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)
