---
id: assistants
title: Connect Claude, ChatGPT, Claude Code or Cursor to ZTools
description: Connect an assistant to ZTools over MCP, choose what it can read and change, confirm the removals it asks for, and disconnect it.
sidebar_label: Assistants
sidebar_position: 3
tags: [developers, mcp, assistants, claude, chatgpt]
last_update:
  date: 2026-11-21
  author: The ZTools team
---

# Assistants

**Connect Claude, ChatGPT, Claude Code or Cursor and ask it to find a preset, tidy a collection or point a QR code somewhere new.** It works with only what you allow, and it never removes anything without your yes on ZTools. Every assistant uses the same address:

```text
https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/mcp
```

That's ZTools' MCP server. You don't need a key: the assistant sends you to ZTools to sign in with Google and choose what it can do. **Other apps**, under **Assistants**, shows the address with a copy button.

## Connecting {#connecting}

### Claude {#claude}

1. In Claude, open **Settings**, then **Connectors**, and choose **Add custom connector**.
2. Name it ZTools and paste the address above.
3. Choose **Connect**. ZTools opens; sign in with Google and pick what Claude can do.

### ChatGPT {#chatgpt}

1. In ChatGPT, open **Settings**, then **Apps and connectors**, then **Advanced**, and turn on developer mode. Your ChatGPT plan needs to allow custom connectors.
2. Choose **Create**, name it ZTools, paste the address above and choose **OAuth**.
3. ChatGPT opens ZTools; sign in with Google and pick what it can do.

### Claude Code {#claude-code}

1. In a terminal, run:

   ```bash
   claude mcp add --transport http ztools https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/mcp
   ```

2. Start Claude Code, type `/mcp`, choose **ztools**, then **Authenticate**.
3. Your browser opens ZTools; sign in with Google and pick what Claude Code can do.

### Cursor {#cursor}

1. Open **Cursor Settings**, then **MCP**, and add a server, or put this in `~/.cursor/mcp.json`:

   ```json
   {
     "mcpServers": {
       "ztools": { "url": "https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/mcp" }
     }
   }
   ```

2. Cursor lists **ztools** as needing a login. Choose it.
3. ZTools opens in your browser; sign in with Google and pick what Cursor can do.

## What you agree to {#what-you-agree-to}

The page that opens is called **Connect Claude to ZTools**, with your assistant's name in it. It says who made the app and where it sends you back to, then shows the same grid as an access key: **Read**, **Change** and **Remove** for each part of your ZTools data, and **Read team and shared items**. Your plan, its limits and today's use are always included, read only. [What each tick reaches](./access-keys.md#what-each-tick-reaches) lists the parts.

You can name the connection, up to 60 characters, such as "Claude on my laptop". Then choose **Approve**, or **Deny** to share nothing. A request lasts 10 minutes; after that, start connecting again from the assistant.

When [two-step sign-in](./two-step-sign-in.md) is on, connecting asks for the code from your authenticator app, even on a remembered browser. We email you each time an assistant is connected.

The assistant sees only the tools its ticks allow. It can list, read, create and change, and for each part ticked **Remove** it can *ask* to remove. It can never reach what's in [the never list](./index.md#what-an-outside-app-can-never-reach), and it can't manage keys, other connections or two-step sign-in.

## Removing waits for your yes {#removing-waits-for-your-yes}

An assistant never removes anything in one step. When you ask it to delete a preset, it gets a link to ZTools and passes it to you:

```text
https://ztools.zaions.com/developers/confirm/<request id>
```

The page, **Confirm a removal**, names what was asked for, what it holds and what goes with it. For a QR code that's its scans, and a printed code stops sending people on; for a collection it's the grouping only, and the tools stay. Choose **Remove** or **Keep it**. A model can't say yes for you.

The request runs out after 10 minutes, and nothing is removed. Keeping it sends no answer back to the assistant; the request just runs out. A waiting request also shows on **Other apps** as **Waiting for you**, with **Look and decide**.

## Renaming and disconnecting {#renaming-and-disconnecting}

Each connected assistant has a row on **Other apps**: its name, when it was connected and when it was last used.

- **Rename** changes what the row is called. Leave it empty to go back to the assistant's own name.
- **Remove**, then press again, and the assistant loses access at once. Its next request is refused, and it has to be connected again from scratch.

## How many you can connect {#how-many-you-can-connect}

Free allows 3 assistants. ZTools Pro, Growth Pro and Growth Pro Team allow 10; Growth Ultimate and Growth Ultimate Team allow 25. Their requests count toward your [requests a day](./api.md#rate-limits) with your keys'.

## What the assistant reads is your own writing {#your-own-writing}

Preset names, notes on saved runs and collection descriptions come back to the assistant as data, exactly as you wrote them. ZTools tells the assistant so. Still, if you paste text from somewhere else into a note, an assistant reading it later reads that text too.

## For developers of MCP clients {#for-mcp-client-developers}

The server speaks MCP over Streamable HTTP at the address above. Without a token it answers `401` with a `WWW-Authenticate` header pointing to its protected-resource metadata:

```text
https://luzmtjynzrxwqwzlswjq.supabase.co/functions/v1/mcp/.well-known/oauth-protected-resource
```

The authorization server is `https://luzmtjynzrxwqwzlswjq.supabase.co/auth/v1`, with dynamic client registration and PKCE. Tools are named `list_<resource>`, `get_<resource>`, `create_<resource>`, `update_<resource>` and `prepare_delete_<resource>`, with the resources from [the API](./api.md). An access key also works as the bearer, for a client you run yourself.
