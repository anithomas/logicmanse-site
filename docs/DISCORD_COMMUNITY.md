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

## Still to do

- Create a permanent invite link (never expires, no use limit) and add it to the site (`SOCIAL_LINKS` in `site.ts`, footer and QR pages).
- Finish and check the `#welcome-and-rules` text (it is partly filled in).
- Turn on AutoMod and review the Safety Setup screen.
- Set up the `#social-feed` webhook (via MonitoRSS, Zapier or IFTTT). The webhook URL stays outside the repo.
- Optional: custom role colours in the brand navy/forest, a server banner, and the Server Guide.
