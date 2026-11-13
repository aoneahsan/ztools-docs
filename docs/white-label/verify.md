---
title: Check a licence
description: How to check a ZTools white-label licence by its key or by the domain it runs on, and what the public licence file contains.
sidebar_label: Check a licence
sidebar_position: 4
tags: [white-label, verification]
last_update:
  date: 2026-11-13
  author: The ZTools team
---

# Check a licence

Anyone can check a ZTools licence on the [verify page](https://ztools.zaions.com/verify-license). Verification is run by our licensing service and reads its records at the moment you ask.

## By key

Paste the key from the certificate. It starts with `ZTOOLS-WL-`. The answer shows only public details: who it was issued to, its domains and platforms, and its dates. It never shows an email, a price or a private key.

## By domain

Enter the domain a deployment runs on. The service reads the file the deployment serves at:

```text
https://<domain>/.well-known/ztools-white-label-license.json
```

and checks the key named inside it. The file looks like this:

```json
{
  "$schema": "ztools-white-label-license",
  "product": "ZTools",
  "publicKey": "ZTOOLS-WL-…",
  "client": "Client name",
  "domain": "tools.example.com",
  "verifyUrl": "https://ztools.zaions.com/verify-license?key=ZTOOLS-WL-…",
  "issuedAt": "2026-11-13"
}
```

The certificate PDF sits beside it at `/.well-known/ztools-white-label-license.pdf`. We add both files when we deploy; the buyer doesn't need to.

## What the answers mean

| Answer | Meaning |
|---|---|
| Active | The key is ours and the licence is in force. |
| Being set up | Paid for; the deployment isn't live yet. |
| Revoked | The licence was used outside its terms or on a domain it doesn't cover. |
| Different domain | The file on this domain names a licence for another domain. |
| No file | The domain serves no ZTools licence file. |
| Didn't answer | The domain couldn't be reached. Check by key instead. |

A certificate PDF on its own is only a record. The live check is the proof.
