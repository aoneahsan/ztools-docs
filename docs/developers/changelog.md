---
id: changelog
title: ZTools developers changelog
description: Changes to the ZTools API, MCP server, webhooks and two-step sign-in, newest first, each entry dated.
sidebar_label: Developers changelog
sidebar_position: 6
tags: [developers, changelog]
last_update:
  date: 2026-11-21
  author: The ZTools team
---

# Developers changelog

Newest first. The API's current version is `v1`.

## 2026-11-21: the open platform {#2026-11-21}

- **[The API](./api.md).** Your favorites, presets, tool history and tags, collections, workflows, dynamic QR codes, tracked sites, preferences and notifications, read and changed with an [access key](./access-keys.md) (`zt_pat_…`). QR code scans, teams, workspaces, shared links and documents, and public content are read only. The [OpenAPI document](https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/api/v1/openapi.json) needs no key.
- **[Assistants](./assistants.md).** Claude, ChatGPT, Claude Code and Cursor connect over MCP with a Google sign-in and the ticks you choose. A removal an assistant asks for waits for your yes on ZTools.
- **[Webhooks](./webhooks.md).** 20 events and a test event, signed with Standard Webhooks. A delivery carries the event, its time and the item's id and name, unless the address has **Include what was written** on.
- **[Two-step sign-in](./two-step-sign-in.md).** A code from an authenticator app after Google, ten recovery codes, and an opt-in 7-day remembered browser.
- Speak recordings and AI assistant conversations are in none of these, and never leave ZTools.
- Limits per plan are in the [overview](./index.md#limits-on-each-plan). There is no calendar feed.
