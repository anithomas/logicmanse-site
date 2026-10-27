# Logicmanse Discord Community

Record of how the **Logicmanse Publications** Discord server is set up, so it can be rebuilt or extended. Built 2026-10-21/22. **No tokens, webhook URLs or passwords belong in this file.**

## Channels

| Category | Channels | Notes |
|---|---|---|
| Information | `welcome-and-rules`, `announcements`, `get-your-roles`, `introductions` | `announcements` and `get-your-roles` are read-only for everyone |
| Text Channels | `general`, `events`, `ideas-and-feedback` | Existed before the build |
| Voice Channels | Lounge, Community Hangout, Stream Room | Existed before the build |
| BOOKS | `new-releases`, `kids-books-and-leia`, `cookbook-corner`, `renovation-help`, `reviews-and-feedback` | `new-releases` is read-only |
| COMMUNITY | `share-your-photos`, `giveaways` | |
| SOCIAL MEDIA | `social-feed`, `share-our-posts` | `social-feed` is read-only (for a webhook or bot to post into) |
| SUPPORT | `help-and-orders`, `suggestions` | |
| TEAM (private) | `ideas`, `launch-checklist` | Only the owner can see these |

"Read-only" means @everyone has **Send Messages** denied on that channel. The owner and webhooks can still post.

## Roles

Moderator (green); Kids Books, Renovation Book, Cookbook (gold); Parent, Home Cook, Renovator, Educator, Launch Alerts, Giveaway Alerts, Member (grey). No Admin role: the owner already has full control.

## Community and Onboarding

- Community mode is on. Verified email required; media scanned for all members. Rules channel is `welcome-and-rules`. Updates and safety notices go to the auto-created, moderator-only `moderator-only` channel.
- Onboarding is on. Default channels: everything in Information, plus `general`.
- Questions (all allow multiple answers, none required), each answer assigns the matching role:
  1. **What brings you here?** Parent, Home Cook, Renovator, Educator
  2. **Which books do you own?** Kids Books, Renovation Book, Cookbook
  3. **Want updates?** Launch Alerts, Giveaway Alerts
- The optional Server Guide was skipped.

## AutoMod (Server Settings > Safety Setup > AutoMod)

On since 2026-10-22, all with "Block message" and no alert channel: Block Mention Spam, Block Suspected Spam Content, and Block Commonly Flagged Words (Severe Profanity, Insults & Slurs and Sexual Content all ticked). The sensitive-media filter scans all members. Raid protection/CAPTCHA and DM and spam protection are fully enabled.

## Invite link

A permanent invite (never expires) is created and linked from the site footer and every QR page through `SOCIAL_LINKS` in `site.ts`. Invites land in `#welcome-and-rules`. To replace it: Invite to Server, tick "Set this link to never expire", then update the one `href` in `site.ts`.

## Still to do

- Review the `#welcome-and-rules` text. The channel was made public and read-only on 2026-10-22 (it had been private, which hid the rules from invited members); the text there now is the five short rules plus the site link.
- Optional AutoMod extras: a custom blocked-word list, profile-name filtering, and an alert channel (rules currently only block the message).
- Set up the `#social-feed` webhook (via MonitoRSS, Zapier or IFTTT). The webhook URL stays outside the repo.
- Optional: custom role colours in the brand navy/forest, a server banner, and the Server Guide.
