---
id: privacy
title: Privacy & Analytics — ZTools Documentation
description: How ZTools docs uses Google Analytics 4. What's tracked, what isn't, how to opt out.
sidebar_label: Privacy
sidebar_position: 98
---

# Privacy & Analytics

This documentation site (`ztools-docs.zaions.com`) uses up to four third-party tools — **Google Analytics 4** (page traffic), **Microsoft Clarity** (anonymized session recordings + heatmaps), **Amplitude** (product analytics), and **Sentry** (error monitoring). Any combination may be active depending on which env-driven secrets are set in CI. This page tells you exactly what each one collects, what they don't, and how to opt out.

## Tools at a glance

| Tool | What it does | When active |
|---|---|---|
| Google Analytics 4 | Aggregate page traffic, referrers, country (no city), device class | When `GA_MEASUREMENT_ID` build secret is set |
| Microsoft Clarity | Anonymized session recordings + click/scroll heatmaps | When `CLARITY_PROJECT_ID` is set |
| Amplitude | Page views, file downloads, attribution. NO form/element interactions. | When `AMPLITUDE_API_KEY` is set |
| Sentry | Frontend JS error reports + 10% transaction perf samples | When `SENTRY_DSN` is set |

If a tool's secret isn't configured, **its script doesn't ship at all** — nothing to opt out from.

## What's tracked

| Field | Why |
|---|---|
| Page URL viewed | Identify the most-read pages so I prioritize doc improvements |
| Referrer (where you came from) | See whether traffic is from Google, ChatGPT, Reddit, direct, etc. |
| Browser, OS, device class | Spot rendering issues by device |
| Country (city-level **disabled**) | Know roughly where readers are |
| Session duration + pages-per-session | Measure how useful the docs are |

GA4 is configured with **IP anonymization on** — your IP address is truncated before storage. Google never sees your full IP for this site.

## What's NOT tracked (across all four tools)

- ❌ **Your inputs to ZTools tools.** This is the main app at `ztools.zaions.com`, not the docs. Tool inputs are processed in your browser and never leave your device.
- ❌ **Personally identifying information.** No email, no name, no account ID — the docs site has no signup.
- ❌ **Form submissions.** Site has no forms; Amplitude form interactions explicitly disabled.
- ❌ **Element-level interactions.** Amplitude `elementInteractions` disabled.
- ❌ **Cross-site cookies.** GA4 + Amplitude use first-party cookies only.
- ❌ **Sentry session replay.** `replaysSessionSampleRate: 0` — no DOM replay capture.
- ❌ **Sentry default PII.** `sendDefaultPii: false` — request headers / cookies not sent on errors.
- ❌ **Search-input URLs in Sentry breadcrumbs.** Strip query string + hash from navigation breadcrumbs to avoid leaking what you typed into the search bar.

## How to opt out

Three options, listed easiest to hardest:

### 1. Browser-level Do Not Track

Most modern browsers respect a "Do Not Track" or equivalent tracking-prevention setting. ZTools docs respects whatever your browser tells it.

- **Firefox** → Preferences → Privacy & Security → Enhanced Tracking Protection: Strict
- **Brave** → Shields up (default)
- **Safari** → Preferences → Privacy → Prevent cross-site tracking
- **Chrome** → Settings → Privacy and security → Send a "Do Not Track" request

### 2. Google Analytics opt-out add-on

Install the official [GA Opt-out browser add-on](https://tools.google.com/dlpage/gaoptout) — works for any GA-using site, not just this one.

### 3. Block tracking domains at the DNS / network level

Block these hosts via DNS resolver, browser extension, or `/etc/hosts`:

- GA4: `googletagmanager.com`, `google-analytics.com`
- Clarity: `clarity.ms`, `c.clarity.ms`
- Amplitude: `api2.amplitude.com`, `cdn.amplitude.com`
- Sentry: `o*.ingest.sentry.io` (the `o*` is a per-org subdomain)

uBlock Origin's default lists already block most of these. NextDNS,
AdGuard DNS, or Pi-hole at the network level catch them all.

## Why use analytics at all?

Honest answer: I want to know which docs pages help most so I can spend time on the right improvements. Without aggregate traffic data, I'm guessing.

If a privacy-respecting alternative (Plausible, Simple Analytics, server-side first-party analytics) becomes practical to self-host, I'll switch. GA4 is the pragmatic starting point.

## Data retention

- **GA4 default**: 14 months. After that, data is automatically deleted from Google's servers.
- **No off-Google sharing**: I don't sell or share this data with third parties. It exists only in the GA4 console and is used solely for site improvement.

## Source code

The GA integration is open-source and reviewable: see [docusaurus.config.ts](https://github.com/aoneahsan/ztools-docs/blob/main/docusaurus.config.ts) for the exact configuration. The Measurement ID is injected from a GitHub Actions secret at build time, never committed to the repo.

## Questions?

Email: [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)
WhatsApp: [+92 304 6619706](https://wa.me/923046619706)
GitHub issue: [github.com/aoneahsan/ztools-docs/issues](https://github.com/aoneahsan/ztools-docs/issues)

---

*Last updated: 2026-05-06*
