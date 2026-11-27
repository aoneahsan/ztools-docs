---
id: webhooks
title: ZTools webhooks
description: Every ZTools webhook event and its payload, how to check a delivery's Standard Webhooks signature in Node and Python, and how retries, pausing and turning off work.
sidebar_label: Webhooks
sidebar_position: 4
topics: [developers, webhooks, standard-webhooks]
last_update:
  date: 2026-11-21
  author: The ZTools team
---

# Webhooks

**ZTools sends a signed message to your server the moment something changes, such as a scan on one of your QR codes.** Each one is signed with [Standard Webhooks](https://www.standardwebhooks.com/), so your server can prove it came from ZTools and wasn't changed on the way. You add addresses in **Account**, then [**Other apps**](https://ztools.zaions.com/account/other-apps), under **Webhooks**.

An event fires for every change, whether you made it in the app, on Android, with an access key or through an assistant.

## Adding an address {#adding-an-address}

1. Choose **Add a webhook**.
2. Paste the address under **Send to this address**.
3. Tick the events to send under **Send these events**.
4. Leave **Include what was written** off unless your server needs the content (see [below](#what-a-delivery-carries)).
5. Choose **Add the webhook**, then copy the signing secret. It starts with `whsec_`.

The address has to be one the internet can reach:

- `https` only, on port 443 or 8443.
- No name or password in the address. Check the signature instead.
- No private network, local host or ZTools address. The address is checked when you add it and again on every delivery, and redirects aren't followed.

We email you when an address is added.

## Events {#events}

| Event | When |
|---|---|
| `favorite.added` | A tool was saved with the heart |
| `favorite.removed` | A tool left your favorites |
| `preset.created` | A preset was saved |
| `preset.updated` | A preset was renamed or changed |
| `preset.deleted` | A preset was removed |
| `history.saved` | A tool run was saved to history |
| `history.deleted` | A history entry was removed |
| `collection.created` | A collection was made |
| `collection.updated` | Tools were added, removed or renamed |
| `collection.deleted` | A collection was removed |
| `workflow.created` | A workflow was built |
| `workflow.updated` | A workflow's steps changed |
| `workflow.deleted` | A workflow was removed |
| `qr_code.created` | A code was made |
| `qr_code.updated` | Its destination changed, or it was paused |
| `qr_code.scanned` | Someone scanned one of your codes |
| `qr_code.deleted` | A code was removed |
| `tracked_site.added` | A site was added for AI-bot counts |
| `tracked_site.removed` | A site was removed |
| `notification.created` | A notification reached your inbox |
| `webhook.test` | You chose **Send a test event** |

An `.updated` event fires only when something you wrote changed. ZTools' own counters, such as a preset's use count, a workflow's run count or a code's scans, don't send one.

## What a delivery carries {#what-a-delivery-carries}

Each delivery is a `POST` with a JSON body: the event `type`, the `timestamp` it happened, and `data`. The signature in this example is a made-up value; a real one checks against your secret.

**With "Include what was written" off**, `data` holds only the item's `id`, its `name` and `occurred_at`. Nothing you wrote leaves ZTools:

```http
POST /hooks/ztools HTTP/1.1
Content-Type: application/json
User-Agent: ZTools-Webhooks/1.0
webhook-id: msg_4f1d2c3b5a6e4d7c8b9a0f1e2d3c4b5a
webhook-timestamp: 1795253405
webhook-signature: v1,K5oZfzN95Z9UVu1EsfQmfVNQhnkZ2pj9o9NDN/H/pI4=

{"type":"qr_code.scanned","timestamp":"2026-11-21T09:30:05.214Z","data":{"id":"scan_5521","name":"k7Qp2x","occurred_at":"2026-11-21T09:30:05.214Z"}}
```

What `id` and `name` are, for each kind of item:

| Events | `data.id` | `data.name` |
|---|---|---|
| `favorite.*` | the tool's id | the tool's id |
| `preset.*`, `collection.*`, `workflow.*`, `tracked_site.*` | the item's id | its name |
| `history.*` | the run's id | the tool's id |
| `qr_code.created`, `.updated`, `.deleted` | the code | its label |
| `qr_code.scanned` | the scan, as `scan_<n>` | the code that was scanned |
| `notification.created` | the notification's id | its title |
| `webhook.test` | none: `data` is `{"message": "Test event"}` | |

**With "Include what was written" on**, `data` also carries the item's fields, the same ones [the API](./api.md#your-ztools-data) returns: a run's input and output, notes, a preset's settings, where a QR code points, and the rest. A removal carries the item as it was just before it went.

Turning it on is a fresh sign-in, with the code from your authenticator app when [two-step sign-in](./two-step-sign-in.md) is on, because from then on what you write leaves for that address. Each address keeps its own choice; the row says **Includes what was written.** or **Ids and names only.**

The same event can reach an address more than once, for example after a timeout. `webhook-id` stays the same on every retry of one event, so store it and skip one you've already handled.

## Checking a delivery came from ZTools {#checking-a-delivery}

The signature is `v1,` and the base64 HMAC-SHA256 of `<webhook-id>.<webhook-timestamp>.<body>`, keyed with your secret: the part after `whsec_`, base64-decoded. `webhook-signature` can hold more than one, separated by spaces, while two secrets sign (see [Replacing the secret](#replacing-the-secret)); accept the delivery when any one matches.

Three rules for the check:

- Use the **raw body**, byte for byte. Parsed and re-serialized JSON won't match.
- Refuse a `webhook-timestamp` more than 5 minutes from your clock, so an old delivery can't be replayed.
- Compare in constant time.

Any [Standard Webhooks library](https://github.com/standard-webhooks/standard-webhooks) does all three. Without one:

### Node {#node}

```js
import express from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';

/** True when a delivery is signed with your ZTools secret and is less than 5 minutes old. */
function verifyZtoolsWebhook(secret, headers, rawBody) {
  const id = headers['webhook-id'];
  const timestamp = headers['webhook-timestamp'];
  const signatures = headers['webhook-signature'];
  if (!id || !timestamp || !signatures) return false;
  if (!/^\d+$/.test(timestamp) || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expected = createHmac('sha256', key).update(`${id}.${timestamp}.${rawBody}`).digest();

  return signatures.split(' ').some((part) => {
    const [version, value] = part.split(',');
    if (version !== 'v1' || !value) return false;
    const given = Buffer.from(value, 'base64');
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

const app = express();

// express.raw keeps the body as bytes, so the signature can be checked.
app.post('/hooks/ztools', express.raw({ type: 'application/json' }), (req, res) => {
  const rawBody = req.body.toString('utf8');
  if (!verifyZtoolsWebhook(process.env.ZTOOLS_WEBHOOK_SECRET, req.headers, rawBody)) {
    return res.status(400).end();
  }
  const event = JSON.parse(rawBody);
  // Answer first; do slow work after, keyed on req.headers['webhook-id'].
  res.status(204).end();
  console.log(event.type, event.data.id);
});

app.listen(3000);
```

### Python {#python}

```python
import base64
import hashlib
import hmac
import os
import time

from flask import Flask, request

def verify_ztools_webhook(secret, headers, raw_body):
    """True when a delivery is signed with your ZTools secret and is less than 5 minutes old."""
    msg_id = headers.get("webhook-id")
    timestamp = headers.get("webhook-timestamp")
    signatures = headers.get("webhook-signature")
    if not (msg_id and timestamp and signatures):
        return False
    if not timestamp.isdigit() or abs(time.time() - int(timestamp)) > 300:
        return False

    key = base64.b64decode(secret.removeprefix("whsec_"))
    signed = f"{msg_id}.{timestamp}.".encode() + raw_body
    expected = base64.b64encode(hmac.new(key, signed, hashlib.sha256).digest()).decode()

    for part in signatures.split(" "):
        version, _, value = part.partition(",")
        if version == "v1" and hmac.compare_digest(value, expected):
            return True
    return False

app = Flask(__name__)

@app.post("/hooks/ztools")
def ztools_hook():
    raw_body = request.get_data()  # the bytes as sent
    if not verify_ztools_webhook(os.environ["ZTOOLS_WEBHOOK_SECRET"], request.headers, raw_body):
        return "", 400
    event = request.get_json()
    print(event["type"], event["data"].get("id"))
    return "", 204
```

Both samples were checked against the signer ZTools uses, with one secret and with two.

## Answering, retries and turning off {#answering-retries-and-turning-off}

Answer with any `2xx` within 10 seconds, then do the slow work. Anything else, or no answer in time, is a failed try.

ZTools tries again after 5 seconds, 5 minutes, 30 minutes, 2 hours, 5 hours, 10 hours and 10 hours again: eight tries over about 27 hours, always with the same `webhook-id`. After the last one the delivery stops, and you can send it again from the log.

- A `410 Gone` answer turns the address off at once.
- An address that keeps failing for 5 days is turned off.

Either way we email you the last error, and the row says **Turned off after failing**. Events from that time are not sent. Fix your server, then choose **Turn back on**.

## Managing an address {#managing-an-address}

- **Send a test event** sends `webhook.test` to the address right away.
- **What we sent** is the delivery log: when, which event, how your server answered, how long it took and which try it was. A failed one says when it tries again; **Send again** sends one more time.
- **Pause** stops sending until you choose **Resume**.
- **Remove**, then press again, and nothing more is sent.

### Showing and replacing the secret {#replacing-the-secret}

**Show the secret** works within 10 minutes of signing in, like an [access key](./access-keys.md#showing-a-key-again).

**Replace the secret**, then press again, makes a new one. For the next 24 hours both secrets sign every delivery, so `webhook-signature` carries two signatures and your server has a day to switch. Then only the new one signs.

## How many you can have {#how-many-you-can-have}

Free allows 3 webhook addresses. ZTools Pro, Growth Pro and Growth Pro Team allow 20; Growth Ultimate and Growth Ultimate Team allow 40. Deliveries don't count toward your requests a day.
