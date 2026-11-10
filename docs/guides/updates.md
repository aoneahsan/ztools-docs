---
title: How ZTools stays up to date
description: How the ZTools web and Android apps load a new release, what the update screen means, and why your drafts and offline work are safe.
tags: [guide, updates, android, pwa]
sidebar_label: How ZTools stays up to date
sidebar_position: 8
last_update:
  date: 2026-11-10
---

# How ZTools stays up to date

You don't need to do anything. ZTools loads a new release by itself, at a moment that won't interrupt a task.

## On the web

A small worker notices when a new release is out. It caches nothing; its only job is to tell the page. The page then loads the new release at a safe moment, so an open tab doesn't stay on an old version.

## On Android

- A new Android build arrives through Google Play's immediate in-app update.
- Everything else, such as a tool fix, comes as a signed over-the-air web update, without a trip to the store.

## What the update screen means

Most releases need nothing from you. When a release is required, ZTools shows an update screen that says why, with one Update button. Tap it and carry on where you were.

## Is my work safe?

Yes. Nothing you typed is lost: drafts are kept across an update.

If your connection drops after ZTools has loaded, you can keep working. The update check waits until you're back online and never locks you out while you're offline.

## Next

- [Install ZTools as an app (PWA)](/docs/guides/install-as-app)
- [Install the Android app](/docs/guides/android-app)
- [Changelog](/docs/changelog)
