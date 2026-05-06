---
id: privacy
title: Privacy & Analytics — ZTools Documentation
description: How ZTools docs uses Google Analytics 4. What's tracked, what isn't, how to opt out.
sidebar_label: Privacy
sidebar_position: 98
---

# Privacy & Analytics

This documentation site (`ztools-docs.zaions.com`) uses **Google Analytics 4** to track aggregate page traffic. This page tells you exactly what is and isn't collected, and how to opt out.

## What's tracked

| Field | Why |
|---|---|
| Page URL viewed | Identify the most-read pages so I prioritize doc improvements |
| Referrer (where you came from) | See whether traffic is from Google, ChatGPT, Reddit, direct, etc. |
| Browser, OS, device class | Spot rendering issues by device |
| Country (city-level **disabled**) | Know roughly where readers are |
| Session duration + pages-per-session | Measure how useful the docs are |

GA4 is configured with **IP anonymization on** — your IP address is truncated before storage. Google never sees your full IP for this site.

## What's NOT tracked

- ❌ **Your inputs to ZTools tools.** This is the main app at `ztools.zaions.com`, not the docs. Tool inputs are processed in your browser and never leave your device. The docs site only tracks doc reading, not tool usage.
- ❌ **Personally identifying information.** No email, no name, no account ID. The docs site has no signup.
- ❌ **Form submissions.** This site has no forms.
- ❌ **Outbound link clicks.** Default GA4 enhanced measurement is ENABLED for outbound clicks; if you'd rather we disable that, [open an issue](https://github.com/aoneahsan/ztools-docs/issues).
- ❌ **Cross-site cookies.** GA4 uses first-party cookies only.

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

### 3. Block the GA domain at the DNS level

Block `googletagmanager.com` and `google-analytics.com` via:
- A privacy-focused DNS resolver (NextDNS, AdGuard DNS, Quad9)
- A browser extension (uBlock Origin, Privacy Badger)
- `/etc/hosts` if you're old-school

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
