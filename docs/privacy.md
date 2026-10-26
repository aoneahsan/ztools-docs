---
id: privacy
title: Privacy & Analytics — ZTools Documentation
description: How optional analytics and error monitoring work on the ZTools documentation site, and what you can do to limit them.
sidebar_label: Privacy
sidebar_position: 98
---

# Privacy & Analytics

This page covers the ZTools documentation site at `ztools-docs.zaions.com`. Depending on its build configuration, the site may use analytics and error-monitoring services. For data you enter into the ZTools app, read the separate [app privacy policy](https://ztools.zaions.com/privacy-policy).

## 🔎 Which services can run on the docs site? {#which-services-can-run-on-the-docs-site}

Each service is optional. The site's source code enables it only when its corresponding build setting has a value.

| Service | What the site's code enables |
|---|---|
| Google Analytics 4 | Page traffic measurement when `GA_MEASUREMENT_ID` is set. The Docusaurus configuration requests IP anonymization. |
| Microsoft Clarity | Session recordings and heatmaps when `CLARITY_PROJECT_ID` is set. What appears in a recording also depends on the Clarity project's masking settings. |
| Amplitude | Page views, sessions, attribution, and file downloads when `AMPLITUDE_API_KEY` is set. Form and element interaction autocapture are disabled in the site's configuration. |
| Sentry | Browser error reports and sampled performance traces when `SENTRY_DSN` is set. Trace sampling is configured at 10%; session replay is disabled. |

An unset Google Analytics or Clarity setting omits its script from the build. An unset Amplitude or Sentry setting leaves its SDK uninitialized. The docs still work without these services.

## 📋 What information can reach these services? {#what-information-can-reach-these-services}

When enabled, these services can receive details about a visit, such as viewed URLs, referrers, browser and device information, events, and error context. A request to a provider can also expose your network address to that provider. Clarity can record page interactions and content, subject to its masking settings. The repository doesn't show each provider's account settings.

The code asks Google Analytics to anonymize IP addresses and tells Amplitude's SDK not to include an IP address in its tracking options. Neither setting proves that every provider excludes city data or never receives a full network address. Sentry replay is disabled, and one navigation-breadcrumb field is reduced to a pathname; other error context may still be sent. Avoid putting private information in a docs URL.

This page describes visits to the docs site. It does not describe processing of files, prompts, voice recordings, dictation, or other inputs in the [ZTools app](https://ztools.zaions.com/privacy-policy). The app policy names the providers that handle them, including Anthropic for shared AI (OpenAI when Anthropic's shared credit is unavailable), Groq for transcription, and Polar for plan payments.

## ⚙️ How can I limit analytics? {#how-can-i-limit-analytics}

The docs site has no built-in analytics switch, and its code does not act on a browser's Do Not Track signal. You can use browser tracking protection or a content blocker to limit requests to these services. Google also offers a [browser add-on for Analytics opt-out](https://tools.google.com/dlpage/gaoptout). Whether a browser setting or blocker stops a request depends on your setup.

## 🗓️ How long is data kept? {#how-long-is-data-kept}

Retention depends on the enabled provider and its account settings. Those settings have not been verified for this site, so this page does not promise a fixed deletion date. To ask about docs analytics data, email [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com).

## 🔗 Where can I check the configuration? {#where-can-i-check-the-configuration}

The public repository shows the [build settings](https://github.com/aoneahsan/ztools-docs/blob/main/docusaurus.config.ts) and [client-side initialization](https://github.com/aoneahsan/ztools-docs/blob/main/src/clientModules/third-party-analytics.ts). Provider account settings and build secrets are not public there.

For app data handling, read the [ZTools privacy policy](https://ztools.zaions.com/privacy-policy); for a question about this docs site, email [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com).

*Last updated: 2026-10-20*
