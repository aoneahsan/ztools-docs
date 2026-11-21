---
id: two-step-sign-in
title: Two-step sign-in for ZTools
description: Turn on two-step sign-in for ZTools with an authenticator app, keep your ten recovery codes, remember a browser for 7 days, and what to do when you lose your phone.
sidebar_label: Two-step sign-in
sidebar_position: 5
tags: [developers, security, two-step-sign-in, 2fa]
last_update:
  date: 2026-11-21
  author: The ZTools team
---

# Two-step sign-in

**Signing in with Google is the first step. Two-step sign-in adds a six-digit code from an authenticator app on your phone**, so a Google session on its own can't open your ZTools account, show your access keys or connect an assistant. It's optional for everyone on every plan, and it's always on for the ZTools team. You'll find it in **Account**, then [**Security**](https://ztools.zaions.com/account/security).

## Setting it up {#setting-it-up}

1. On **Security**, choose **Set up two-step sign-in**.
2. **Scan the code.** Open an authenticator app on your phone (Google Authenticator, Microsoft Authenticator, 1Password or any app that takes a QR code) and scan it. Can't scan? Type the key shown under it. The app lists it as ZTools with your email.
3. **Type the six digits** your app shows for ZTools, and choose **Check the code**. If it doesn't match, check that the phone's time is set automatically, then type the newest code.
4. **Keep your recovery codes.** ZTools shows ten, once. Copy them or download them as a file, tick **I've saved these codes somewhere safe**, and choose **Turn on two-step sign-in**.

From the next sign-in, ZTools asks for a code after Google.

## Recovery codes {#recovery-codes}

Each of the ten codes works once, if your phone is lost or wiped. ZTools keeps only a fingerprint of each code, so nobody, the ZTools team included, can show them to you again.

**Security** shows how many are left. At three or fewer it warns you: make new ones while you still have your phone. **Make new recovery codes** needs a sign-in in the last 10 minutes with a code from your app, and replaces the whole set; the old ones stop working.

## Signing in {#signing-in}

After Google, type the code from your authenticator app. Codes change every 30 seconds, so use the newest. After several codes that don't match, ZTools asks you to wait a few minutes.

### Remembering a browser {#remembering-a-browser}

Under the code there's **Remember this browser for 7 days**, off unless you tick it. Tick it only on a computer you don't share. That browser then signs in with Google alone until the date on **Security**. A visit doesn't extend it.

A remembered browser still asks for a code to show a key or a webhook secret, connect an assistant, change two-step sign-in, or open the admin.

**Security** lists every remembered browser, with **Forget** on each and **Forget every browser** for all of them. Signing out forgets the browser you sign out of. The Android app doesn't remember a browser, so it asks for the code at each sign-in.

## Losing your phone {#losing-your-phone}

**You still have a recovery code.** Sign in with Google, choose **Use a recovery code instead**, and type one. It works once and signs in that browser only. Then, within 10 minutes, choose **Set up a new phone** on **Security** and scan the new code. The lost phone stops working once the new one is checked. Your recovery codes don't change.

**You have neither your phone nor a recovery code.** Write to [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) and say which ZTools account it is. Once you've shown the account is yours, the ZTools team can do a support reset.

## What support can and can't do {#what-support-can-and-cant-do}

A support reset turns two-step sign-in off on your account, forgets every remembered browser and removes your recovery codes. We email you when it happens, and the reason, with your help request's ticket, goes into our audit log. You can turn two-step sign-in on again in **Security** whenever you like.

Support can't:

- see your recovery codes, your authenticator key, your access keys or your webhook secrets;
- turn two-step sign-in on for you, or sign in as you;
- reset an account without a reason that names its ticket.

Everyone on the ZTools team signs in with a code on every admin visit, and no one on the team can reset their own two-step sign-in or another admin's.

## A new phone, or turning it off {#a-new-phone-or-turning-it-off}

- **Set up a new phone** while you still have the old one: scan the new code, check it, and the old phone's codes stop working.
- **Turn off two-step sign-in** asks for a code. Remembered browsers are forgotten and the recovery codes stop working. Signing in with Google is enough again.

Accounts on the ZTools team keep two-step sign-in on.

## Recent sign-ins {#recent-sign-ins}

**Security** lists the last ten sign-ins to your account: when, how (Google, Google and a code, Google on a remembered browser, or Google and a recovery code), and in which browser, such as "Chrome on Windows". It never shows a place. **Sign out everywhere else** ends every other session and keeps this browser signed in.
