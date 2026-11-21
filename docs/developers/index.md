---
id: index
title: ZTools for developers
description: Reach your own ZTools favorites, presets, history, collections, workflows and QR codes from a script, an assistant such as Claude or ChatGPT, or your own server, and what an outside app can never touch.
sidebar_label: Overview
sidebar_position: 0
slug: /developers
tags: [developers, api, mcp, webhooks]
last_update:
  date: 2026-11-21
  author: The ZTools team
---

# ZTools for developers

**Your ZTools data can be read and changed from outside ZTools, by things you connect yourself.** A script with an access key, an assistant such as Claude or ChatGPT, or your own server hearing about each change. You set them all up in **Account**, then [**Other apps**](https://ztools.zaions.com/account/other-apps), on every plan, Free included.

A key, an assistant or a webhook only ever gets what you tick for it. Each one acts as you, and sees nothing you can't see in ZTools yourself.

## Three ways in {#three-ways-in}

| Way | What it's for | Read |
|---|---|---|
| Access key and the API | A script, a spreadsheet or your own app lists your presets, saves a run to history or points a QR code somewhere new | [Access keys](./access-keys.md), [The API](./api.md) |
| An assistant | Ask Claude, ChatGPT, Claude Code or Cursor to "find my JSON presets" or "tidy my Design collection" | [Assistants](./assistants.md) |
| Webhooks | ZTools sends a signed message to your server the moment something changes, such as a scan on one of your QR codes | [Webhooks](./webhooks.md) |

There is no calendar feed. Nothing in ZTools is a dated event that would belong in a calendar.

## What an outside app can reach {#what-an-outside-app-can-reach}

| | What |
|---|---|
| **Read and change** | Your favorites, presets, tool history and its tags, collections, workflows, dynamic QR codes, tracked sites, preferences and notifications. The scans of your QR codes are read only. Preferences can be changed but never removed. |
| **Read only** | Your teams and their members, dashboard workspaces, the links and documents you shared, and public content: your comments, reviews and votes, and the published ZTools blog. Other people are part of these, so only ZTools itself changes them. |
| **Always, read only** | Your plan, its limits and today's use. Every key and assistant can read these, whatever you tick. |
| **Never** | Anything in the list below. |

Removing is a tick of its own for each part, off unless you tick it. An assistant never removes anything in one step: it asks, and nothing goes until you say yes on ZTools.

### What an outside app can never reach {#what-an-outside-app-can-never-reach}

- Your plan, payments and checkout. It can read which plan you're on; it can't change it.
- Your email address and Google sign-in.
- Two-step sign-in, recovery codes and remembered browsers.
- Access keys, webhook secrets and connected assistants themselves.
- Growth Suite provider keys you saved. They stay sealed with your passphrase.
- Speak recordings and AI assistant conversations. They never leave ZTools.
- Anything in the admin, and other people's private rows.

## The addresses {#the-addresses}

| | Address |
|---|---|
| API base | `https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/api/v1` |
| OpenAPI document | [`/openapi.json`](https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/api/v1/openapi.json) and [`/openapi.md`](https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/api/v1/openapi.md) under the API base, no key needed |
| MCP server, for assistants | `https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/mcp` |

The OpenAPI document is generated from the same list of fields the API serves, so it never describes a field the API doesn't return.

## Limits on each plan {#limits-on-each-plan}

| Plan | Access keys | Requests a day | Webhook addresses | Connected assistants |
|---|---:|---:|---:|---:|
| Free | 5 | 5,000 | 3 | 3 |
| ZTools Pro, Growth Pro and Growth Pro Team | 25 | 50,000 | 20 | 10 |
| Growth Ultimate and Growth Ultimate Team | 50 | 100,000 | 40 | 25 |

A person on two plans gets the higher number. Requests count every key and assistant of yours together, and start again at midnight UTC. **Use against your plan**, on Other apps, shows today's count. Plans are on the [Plans page](https://ztools.zaions.com/growth/pricing).

## Keys and secrets stay hidden until you sign in again {#keys-and-secrets-stay-hidden}

A key or a webhook secret is shown when you make it, and again only within 10 minutes of a fresh sign-in. When [two-step sign-in](./two-step-sign-in.md) is on, that sign-in includes the code from your authenticator app. Signed in longer ago, everything else on Other apps still works, and ZTools asks you to sign in again before it shows anything secret.

Every key you make, every assistant you connect and every webhook you add sends you an email, so a change you didn't make doesn't go unnoticed.

## In this section {#in-this-section}

- [Access keys](./access-keys.md): making, showing, replacing and removing one.
- [The API](./api.md): signing requests, errors, pages of results, and every resource with an example.
- [Assistants](./assistants.md): Claude, ChatGPT, Claude Code and Cursor, step by step.
- [Webhooks](./webhooks.md): every event, what a delivery carries, and checking its signature.
- [Two-step sign-in](./two-step-sign-in.md): the code from your phone, recovery codes and remembered browsers.
- [Developers changelog](./changelog.md): what changed here, newest first.

Questions about the API go to [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com).
