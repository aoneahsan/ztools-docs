---
id: getting-started
title: Getting Started with ZTools
description: How to use ZTools — open any tool, run it locally in your browser, save results. No signup, no upload.
sidebar_label: Getting started
sidebar_position: 2
---

# Getting Started

ZTools is built around one principle: **zero friction**. Open the app, pick a tool, paste your input, get the output. No account, no payment, no email opt-in.

## 1. Open the app

Visit **[ztools.zaions.com](https://ztools.zaions.com)** — works in any modern browser (Chrome, Firefox, Safari, Edge, Brave). No install required.

Mobile? Both **[Android](https://play.google.com/store/apps/details?id=com.zaions.ztools)** and a coming-soon iOS build are wrapped via Capacitor and ship the same tools.

## 2. Find a tool

Three discovery paths:

- **Search** — top-of-page search box, fuzzy match on tool name + description + category.
- **Browse** — the home page groups tools by category (Text, Image, PDF, Data, etc.).
- **Direct URL** — every tool has a stable URL: `ztools.zaions.com/<tool-id>`. Bookmark your favorites.

## 3. Use the tool

Each tool follows a similar pattern:

1. **Input area** — paste, upload, or type your data.
2. **Configure** — pick options (formatting style, output format, etc.).
3. **Output area** — result appears live as you type, or after clicking the action button.
4. **Copy / download** — one-click copy or download for the result.

For tools that handle files (image compression, PDF merge, etc.), files stay on your device. The browser does the work.

## 4. Save your work

ZTools doesn't require an account, but signing in unlocks:

- **Favorites** — save frequently-used tools for quick access.
- **History** — last 50 inputs across all tools.
- **Cloud sync** — favorites and preferences sync across devices.

Sign-in uses Google OAuth via the [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/identity) or Firebase Auth on web. Your tool inputs are never sent to any server.

## 5. Customize the experience

The Palette icon in the top header opens a theme customizer with:

- **Appearance** — light, dark, system.
- **Accent color** — 26 built-in palettes.
- **Font size, scaling, border radius** — accessibility-first sliders.
- **Panel background** — solid or translucent.

Preferences persist locally; signed-in users get cross-device sync.

## 6. Share results

Most tools have a **Share** button that:

- Copies a deep-link URL with your input pre-filled (where the input fits in a URL).
- Generates a shareable image of the output (for visual tools like color picker, QR generator).
- Falls back to plain text copy.

## What's next

- Browse the **[full tool catalog](/docs/tools)**.
- Read a **[guide](/docs/guides)** for a common workflow.
- Open the app: **[ztools.zaions.com](https://ztools.zaions.com)**.

---

*Last updated: 2026-05-06*
