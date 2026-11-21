---
id: access-keys
title: ZTools access keys
description: Make an access key for the ZTools API, pick what it can read, change or remove, and show, replace or remove it later.
sidebar_label: Access keys
sidebar_position: 1
tags: [developers, api, access-keys]
last_update:
  date: 2026-11-21
  author: The ZTools team
---

# Access keys

**An access key lets a script, a spreadsheet or your own app use the [ZTools API](./api.md) as you, with only what you tick.** Keys look like `zt_pat_…`. You make them in **Account**, then [**Other apps**](https://ztools.zaions.com/account/other-apps), under **Access keys**.

## Making a key {#making-a-key}

1. Open **Other apps** and choose **Make a key**.
2. Name it after where it's used, like "QR scans to my sheet", so you know which one to remove later.
3. Tick what it can do. For each part of your ZTools data (Favorites, Presets, History and tags, Collections, Workflows, Dynamic QR codes, Tracked sites, Preferences, Notifications) there's a **Read**, a **Change** and a **Remove** tick. Preferences can't be removed, so that part has no Remove tick.
4. Tick **Read team and shared items** if the key needs your teams, workspaces, shared links and documents, or your public content. These are read only, whatever you tick.
5. Pick when it runs out: 30, 90 or 365 days, or **Never**.
6. Choose **Make the key**, then copy it.

Every key can also read your plan, its limits and today's use, without a tick.

**Never is only for a key that reads.** A key that changes or removes things runs out after 30, 90 or 365 days. The API refuses a key with changes and no end date.

## What each tick reaches {#what-each-tick-reaches}

| Part | What it covers | The API addresses |
|---|---|---|
| Favorites | Tools you saved with the heart | `/favorites` |
| Presets | Tool settings you saved and named | `/presets` |
| History and tags | What you ran, with your notes, pins and tags | `/history`, `/history_tags` |
| Collections | Tools you grouped for one kind of job | `/collections` |
| Workflows | Tool chains you built and their run counts | `/workflows` |
| Dynamic QR codes | Your codes, where they point, and their scans | `/qr_codes`, `/qr_scans` (scans read only) |
| Tracked sites | Sites where you count AI-bot visits | `/tracked_sites` |
| Preferences | Theme, language, accessibility and notification settings | `/preferences` |
| Notifications | Your inbox: read it, mark it read, clear it | `/notifications` |
| Read team and shared items | Teams, members, workspaces, shared links and documents, comments, reviews, votes, the blog | [Shared, read only](./api.md#shared-read-only) |

In the API these ticks are scopes such as `presets:read`, `presets:write` and `presets:delete`, and `shared:read` for the shared items. A request outside them answers `403` with the scope it needed.

## Showing a key again {#showing-a-key-again}

ZTools shows the key once when you make it. You can show it again within 10 minutes of signing in: choose **Show the key** on its row. If you signed in longer ago, the row says **Sign in again to show it**. Sign in with Google again (and type the code from your authenticator app when [two-step sign-in](./two-step-sign-in.md) is on), and you come straight back to the same row.

Nobody on the ZTools team can see a key. The admin shows a key's name and its first characters only.

## Replacing a key {#replacing-a-key}

Choose **Replace**, then press again. ZTools makes a new key with the same name and the same ticks, and the old one keeps working for 24 hours, so your script has a day to switch. If the old key had an end date, the new one runs out 90 days from the replacement; a **Never** key is replaced by another that never runs out. The old row says **Replaced · works until** that time. We email you when a key is replaced.

## Removing a key {#removing-a-key}

Choose **Remove**, then press again. It stops working at once. The next request with it answers `401`.

## Checking what a key can do {#checking-what-a-key-can-do}

Ask the API. `GET /token` answers with the kind of credential, your account id and the scopes it holds:

```bash
curl https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/api/v1/token \
  -H "Authorization: Bearer $ZTOOLS_KEY"
```

```json
{
  "data": {
    "kind": "pat",
    "user_id": "6f1c2a7e-0b3d-4c55-9a1e-2f8d7c4b9e10",
    "client_id": null,
    "scopes": ["account:read", "qr_codes:read", "qr_codes:write"]
  }
}
```

Each row on Other apps also shows when the key was made, when it was last used, and when it runs out.

## How many you can have {#how-many-you-can-have}

Free allows 5 keys. ZTools Pro, Growth Pro and Growth Pro Team allow 25; Growth Ultimate and Growth Ultimate Team allow 50. When you're at the limit, remove a key or [see plans with more room](https://ztools.zaions.com/growth/pricing). Every limit is in the [overview](./index.md#limits-on-each-plan).

Keep a key out of code you share and out of a public repository. Anyone holding it can do what it's ticked for until you remove it.
