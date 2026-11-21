---
id: api
title: The ZTools API
description: The ZTools REST API — base URL, the Authorization header, the response envelope, errors, cursor pages, rate limits, and every resource with a curl example.
sidebar_label: The API
sidebar_position: 2
tags: [developers, api, rest, openapi]
last_update:
  date: 2026-11-21
  author: The ZTools team
---

# The ZTools API

**The ZTools API is a JSON REST API over your own ZTools data.** Every request carries an [access key](./access-keys.md) and goes to one base URL:

```text
https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/api/v1
```

The machine-readable description is the [OpenAPI document](https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/api/v1/openapi.json) (also as [Markdown](https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/api/v1/openapi.md)). It needs no key, and it's built from the same field list the API serves. The examples below set two shell variables first:

```bash
export ZTOOLS_API="https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/api/v1"
export ZTOOLS_KEY="zt_pat_…"   # from Account → Other apps
```

## Signing requests {#signing-requests}

Send the key as a bearer token:

```bash
curl "$ZTOOLS_API/presets" -H "Authorization: Bearer $ZTOOLS_KEY"
```

A request acts as you. It sees exactly the rows you see in ZTools, and only in the parts the key is ticked for. The API also accepts the sign-in token of an app you connected; assistants usually reach ZTools through [MCP](./assistants.md) instead.

Bodies are JSON with `Content-Type: application/json`, up to 64 KB. A field the resource doesn't list is refused, never ignored.

## What comes back {#what-comes-back}

One item comes back inside `data`:

```json
{ "data": { "id": "3d0c7f52-9b1e-4f0a-8c6d-51a2e7b04f19", "name": "Brand colors", "tool_ids": ["color-picker", "contrast-checker"] } }
```

A list comes back as a page, with `meta`:

```json
{ "data": [ { "id": "…" }, { "id": "…" } ], "meta": { "next_cursor": "eyJyIjoi…", "limit": 20 } }
```

A create answers `201` with the new item. A remove answers `204` with no body, or `202` when an assistant asked for it (see [Removing](#removing)).

## Errors {#errors}

Every error has the same shape. `message` is a sentence you can show a person; quote `correlation_id` when you write to us.

```json
{
  "error": {
    "code": "scope_required",
    "message": "This credential needs the presets:write permission.",
    "details": { "scope": "presets:write" },
    "correlation_id": "req_228becbff290bcfa"
  }
}
```

| Status | `code` | When |
|---|---|---|
| 400 | `invalid_request` | A field is missing, not allowed or the wrong shape (`details.issues` lists each one), the body isn't JSON, or a cursor ran out |
| 401 | `invalid_token` | No key, or a key that is wrong, expired or removed |
| 403 | `scope_required` | The key isn't ticked for this. `details.scope` names the tick it needs |
| 404 | `not_found` | Nothing with that id on your account, including another person's id and a malformed one |
| 405 | `method_not_allowed` | The address exists, but not for this method, such as a `POST` to `/teams` |
| 409 | `conflict` | It already exists, such as a tool that is already a favorite |
| 413 | `payload_too_large` | The body is over 64 KB |
| 429 | `rate_limited` | Too many requests. Wait for `Retry-After` seconds |
| 500 | `internal` | Something went wrong on our side |

## Pages of results {#pages-of-results}

Lists return 20 items unless you ask for between 1 and 50 with `limit`. When there are more, `meta.next_cursor` holds a cursor; pass it back as `cursor` with the same query. When it's `null`, you have them all.

```bash
curl "$ZTOOLS_API/history?limit=50" -H "Authorization: Bearer $ZTOOLS_KEY"
curl "$ZTOOLS_API/history?limit=50&cursor=eyJyIjoi…" -H "Authorization: Bearer $ZTOOLS_KEY"
```

A cursor lasts 15 minutes and works only for the query that made it. After that, start again without it.

Each list has one fixed order, named under its resource below. A few lists take a filter, written as `field.eq=value`.

## Rate limits {#rate-limits}

- **120 requests a minute** for each key or assistant, so a runaway loop stops early.
- **Requests a day** for you, across every key and assistant together: 5,000 on Free, 50,000 on ZTools Pro, Growth Pro and Growth Pro Team, 100,000 on Growth Ultimate and Growth Ultimate Team. The day starts again at midnight UTC.

Answers carry `RateLimit-Limit`, `RateLimit-Remaining` and `RateLimit-Reset` (seconds until the tighter of the two limits starts again). A `429` adds `Retry-After`. Refused requests still count, so retrying in a tight loop keeps you refused.

## Removing {#removing}

With a key ticked **Remove**, a `DELETE` removes the item at once and answers `204`.

When an assistant asks to remove something, nothing goes straight away. The API answers `202`:

```json
{
  "data": {
    "status": "pending_confirmation",
    "confirm_url": "https://ztools.zaions.com/developers/confirm/8a41c0d2-7e5b-4f3a-9c18-0b6d2e9f7a35",
    "expires_at": "2026-11-21T09:40:00.000Z"
  }
}
```

You open the link, see what it holds and what goes with it, and choose **Remove** or **Keep it**. The request runs out after 10 minutes and nothing is removed. More in [Assistants](./assistants.md#removing-waits-for-your-yes).

## Your ZTools data {#your-ztools-data}

Each part reads with its `:read` tick, creates and changes with `:write`, and removes with `:delete`.

### Favorites {#favorites}

Tools you saved with the heart, in your own order (`sort_order`). A favorite's id is the tool's id, the one in its ZTools address.

| | |
|---|---|
| Addresses | `GET /favorites` · `POST /favorites` · `GET`, `PATCH`, `DELETE /favorites/{tool_id}` |
| Fields | `id`, `tool_id`, `sort_order`, `added_at`, `updated_at` |
| You send | `tool_id` (required), `sort_order` |

```bash
curl -X POST "$ZTOOLS_API/favorites" \
  -H "Authorization: Bearer $ZTOOLS_KEY" -H "Content-Type: application/json" \
  -d '{"tool_id": "json-formatter"}'

curl -X DELETE "$ZTOOLS_API/favorites/json-formatter" -H "Authorization: Bearer $ZTOOLS_KEY"
```

### Presets {#presets}

Tool settings you saved and named, newest change first. `data` holds the settings as the tool stores them; `usage_count` is counted by ZTools. A preset's tool is set when it's made and can't be changed.

| | |
|---|---|
| Addresses | `GET /presets` · `POST /presets` · `GET`, `PATCH`, `DELETE /presets/{id}` |
| Filter | `tool_id.eq` |
| Fields | `id`, `tool_id`, `name`, `description`, `tags`, `data`, `usage_count`, `created_at`, `updated_at` |
| You send | `tool_id`, `name`, `data` (all required on create), `description`, `tags` |

```bash
curl "$ZTOOLS_API/presets?tool_id.eq=json-formatter" -H "Authorization: Bearer $ZTOOLS_KEY"
```

```json
{
  "data": [
    {
      "id": "b7e2d1c4-5a3f-4e8b-9d60-1f2c3a4b5c6d",
      "tool_id": "json-formatter",
      "name": "API responses, 2 spaces",
      "description": null,
      "tags": ["work"],
      "data": { "indent": 2, "sortKeys": true },
      "usage_count": 14,
      "created_at": "2026-10-02T08:14:31.000Z",
      "updated_at": "2026-11-18T16:40:05.000Z"
    }
  ],
  "meta": { "next_cursor": null, "limit": 20 }
}
```

The keys inside `data` belong to each tool and differ from tool to tool. Read a preset you made in ZTools to see the shape before you write one.

### History and tags {#history-and-tags}

Tool runs you saved, newest first (`ran_at`). A run's `input`, `output` and `options` are set when it's saved. After that, only `note`, `tags`, `is_pinned` and `is_archived` change, as in the app. Your history tags are their own list, in name order.

| | |
|---|---|
| Addresses | `GET /history` · `POST /history` · `GET`, `PATCH`, `DELETE /history/{id}` · `GET /history_tags` · `POST /history_tags` · `GET`, `PATCH`, `DELETE /history_tags/{id}` |
| History fields | `id`, `tool_id`, `input`, `output`, `options`, `operation`, `processing_ms`, `note`, `tags`, `is_pinned`, `is_archived`, `ran_at`, `updated_at` |
| Tag fields | `id`, `name`, `color`, `created_at`, `updated_at` |
| You send | history: `tool_id` (required), then any of `input`, `output`, `options`, `operation`, `processing_ms`, `note`, `tags`, `is_pinned`, `is_archived` · tags: `name` (required), `color` |

```bash
curl -X PATCH "$ZTOOLS_API/history/5c9e0a1b-2d3f-4a5b-8c7d-6e9f0a1b2c3d" \
  -H "Authorization: Bearer $ZTOOLS_KEY" -H "Content-Type: application/json" \
  -d '{"note": "Invoice export for October", "is_pinned": true}'
```

### Collections {#collections}

Tools you grouped for one kind of job, in your own order. `tool_ids` lists the tools by id.

| | |
|---|---|
| Addresses | `GET /collections` · `POST /collections` · `GET`, `PATCH`, `DELETE /collections/{id}` |
| Fields | `id`, `name`, `description`, `icon`, `color`, `tool_ids`, `sort_order`, `created_at`, `updated_at` |
| You send | `name` (required), `description`, `icon`, `color`, `tool_ids`, `sort_order` |

```bash
curl -X POST "$ZTOOLS_API/collections" \
  -H "Authorization: Bearer $ZTOOLS_KEY" -H "Content-Type: application/json" \
  -d '{"name": "Brand colors", "tool_ids": ["color-picker", "contrast-checker"]}'
```

Removing a collection removes the grouping only. The tools in it stay.

### Workflows {#workflows}

Tool chains you built, newest change first. `nodes` holds the steps and their settings, `edges` how one step's output feeds the next. `run_count` is counted by ZTools. Setting `is_public` lets anyone with the link open and copy it, as sharing does in the app. Only your own workflows are here.

| | |
|---|---|
| Addresses | `GET /workflows` · `POST /workflows` · `GET`, `PATCH`, `DELETE /workflows/{id}` |
| Fields | `id`, `name`, `description`, `nodes`, `edges`, `is_public`, `author_name`, `run_count`, `created_at`, `updated_at` |
| You send | `name`, `nodes`, `edges` (all required on create), `description`, `is_public`, `author_name` |

```bash
curl -X PATCH "$ZTOOLS_API/workflows/0e4a8b2c-6d1f-4c3e-a5b7-9f8e7d6c5b4a" \
  -H "Authorization: Bearer $ZTOOLS_KEY" -H "Content-Type: application/json" \
  -d '{"name": "Resize, compress, rename"}'
```

### Dynamic QR codes and their scans {#dynamic-qr-codes}

Your dynamic QR codes, newest first. A code's id is the code in the short link its image opens. `destination` is where a scan sends people, an `http` or `https` address; turning `is_active` off pauses the code, so a scan shows a notice instead. `scan_count` and `last_scan_at` are kept by ZTools.

Scans are read only, newest first, filtered by code with `code.eq`. Each has when, and roughly where and on what device. ZTools stores no IP address.

| | |
|---|---|
| Addresses | `GET /qr_codes` · `POST /qr_codes` · `GET`, `PATCH`, `DELETE /qr_codes/{code}` · `GET /qr_scans` |
| Code fields | `id`, `label`, `destination`, `is_active`, `scan_count`, `last_scan_at`, `created_at`, `updated_at` |
| Scan fields | `id`, `code`, `scanned_at`, `country`, `region`, `city`, `device`, `os`, `browser`, `referer_host` |
| You send | `destination` (required), `label`, `is_active` |

Point a printed code somewhere new:

```bash
curl -X PATCH "$ZTOOLS_API/qr_codes/k7Qp2x" \
  -H "Authorization: Bearer $ZTOOLS_KEY" -H "Content-Type: application/json" \
  -d '{"destination": "https://example.com/menu-winter"}'
```

Read its latest scans:

```bash
curl "$ZTOOLS_API/qr_scans?code.eq=k7Qp2x&limit=50" -H "Authorization: Bearer $ZTOOLS_KEY"
```

Removing a code removes its scans too, and a printed copy stops sending people on.

### Tracked sites {#tracked-sites}

Sites where you count visits from AI bots, newest first. `site_key` is the key in your visibility pixel, made by ZTools. The daily bot counts stay in the app.

| | |
|---|---|
| Addresses | `GET /tracked_sites` · `POST /tracked_sites` · `GET`, `PATCH`, `DELETE /tracked_sites/{id}` |
| Fields | `id`, `name`, `url`, `site_key`, `created_at` |
| You send | `name`, `url` (both required) |

```bash
curl -X POST "$ZTOOLS_API/tracked_sites" \
  -H "Authorization: Bearer $ZTOOLS_KEY" -H "Content-Type: application/json" \
  -d '{"name": "Shop", "url": "https://shop.example.com"}'
```

### Preferences {#preferences}

One settings object for each area: `accessibility`, `i18n`, `appTheme`, `pushNotifications` and `notifications`. The id is the area's name. Preferences are read and changed, never removed.

| | |
|---|---|
| Addresses | `GET /preferences` · `POST /preferences` · `GET`, `PATCH /preferences/{area}` |
| Fields | `id`, `key`, `value`, `updated_at` |
| You send | `key` and `value` on create; `value` on change |

```bash
curl "$ZTOOLS_API/preferences/appTheme" -H "Authorization: Bearer $ZTOOLS_KEY"
```

`value` is the area's settings as the app keeps them. To change one setting, read the area, change that one key, and send the whole object back as `value`.

### Notifications {#notifications}

Your ZTools inbox, newest first. You can read it, mark an item read or unread, and clear it. ZTools writes notifications; the API can't create one.

| | |
|---|---|
| Addresses | `GET /notifications` · `GET`, `PATCH`, `DELETE /notifications/{id}` |
| Fields | `id`, `type`, `title`, `body`, `priority`, `severity`, `action_url`, `action_text`, `source`, `expires_at`, `read_at`, `created_at` |
| You send | `read_at`: a time marks it read, `null` marks it unread |

```bash
curl -X PATCH "$ZTOOLS_API/notifications/9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d" \
  -H "Authorization: Bearer $ZTOOLS_KEY" -H "Content-Type: application/json" \
  -d '{"read_at": "2026-11-21T09:30:00Z"}'
```

## Shared, read only {#shared-read-only}

These involve other people, so they're read only from outside ZTools, whatever the key says: a `POST`, `PATCH` or `DELETE` answers `405`. All of them need the **Read team and shared items** tick (`shared:read`), and each is `GET /<name>` for a page and `GET /<name>/{id}` for one item.

| Address | What it holds | Order |
|---|---|---|
| `/teams` | Teams you own or belong to: `name`, `seats`, `is_owner` | name |
| `/team_members` | Who is in each team, by `display_name` and `role`, with `is_you`. No emails or photos. Filter with `team_id.eq` | joined |
| `/workspaces` | Your dashboard workspaces by `name`, and which is the default. Not their layout | newest change |
| `/shared_links` | Tool results you shared: the link id, tool, title, visibility, how often it was opened, and when it runs out. Not what it opens | newest |
| `/shared_documents` | Legal documents you shared by link, with open and export counts. Not the document text | newest |
| `/comments` | Comments you wrote on shared tool content | newest |
| `/reviews` | Reviews you wrote of ZTools tools, with their rating and helpful counts | newest |
| `/review_votes` | Reviews you marked `helpful` or `not-helpful` | newest |
| `/product_votes` | Products you voted `up` or `down` | newest |
| `/blog_posts` | Published posts on the ZTools blog: title, excerpt, tags and `url`. The article itself is at `url` | newest |

```bash
curl "$ZTOOLS_API/team_members?team_id.eq=2b6f9d3e-1a4c-4e7b-8f0a-3c5d7e9f1b2a" \
  -H "Authorization: Bearer $ZTOOLS_KEY"
```

## Your plan and use {#your-plan-and-use}

Every key and assistant reads these, without a tick (`account:read`).

| Address | What it holds |
|---|---|
| `GET /account` | One item: your `plan` as ZTools resolves it, `ztools_pro`, any trial plan and its end, your plan's `limits` (`null` means no limit), and `other_apps`: the four limits for keys, requests a day, webhook addresses and assistants, with today's requests |
| `GET /usage` | Growth Suite use per month and per limit, yours or your team's, newest month first |
| `GET /token` | What the key in this request is and which scopes it holds ([example](./access-keys.md#checking-what-a-key-can-do)) |

```bash
curl "$ZTOOLS_API/account" -H "Authorization: Bearer $ZTOOLS_KEY"
```

Payments, checkout and billing ids are never here.

## What the API never serves {#what-the-api-never-serves}

Speak recordings and voice notes, AI assistant conversations, Growth Suite provider keys, payments, your email and Google sign-in, two-step sign-in, the keys, secrets and connections themselves, the admin, and other people's private rows. No address reaches them, whatever a key is ticked for.
