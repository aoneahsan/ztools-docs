---
title: Install ZTools as an app (PWA)
description: How to install ZTools as a standalone app on desktop and mobile — and an honest note on offline use.
tags: [guide, pwa, install, offline]
sidebar_label: Install as an app (PWA)
sidebar_position: 6
---

# Install ZTools as an app (PWA)

ZTools is an installable Progressive Web App. Installing it gives you a home-screen or dock icon and a standalone window without browser chrome — it feels like a native app.

## Desktop (Chrome, Edge, Brave)

Open [ztools.zaions.com](https://ztools.zaions.com) and click the **install icon** in the address bar (or the browser menu → *Install ZTools…*). It opens in its own window and gets a launcher/dock entry.

## Android

Open the site in Chrome, then use the menu → **Add to Home screen / Install app**. (For a fuller native experience, the [Play Store app](/docs/guides/android-app) is also available.)

## iPhone / iPad

Open the site in Safari, tap **Share → Add to Home Screen**. This is the recommended path until the [native iOS app](/docs/guides/android-app) ships.

## Honest note on offline use

**ZTools currently requires an internet connection to load.** The app deliberately disables offline caching so it always serves the latest version — there is no service-worker cache, so you can't open it with no connection. This is a conscious trade-off (always-fresh over offline).

What *is* local: once a tool has loaded, the free browser-only tools do their work on your device — your input isn't uploaded. So "installed as an app" means an app-like window and icon, not offline availability. If offline support lands later, it'll be noted in the [changelog](/docs/changelog).

## Next

- [Get the most out of ZTools](/docs/guides/get-the-most-from-ztools)
- [Install the browser extension](/docs/guides/browser-extension)
