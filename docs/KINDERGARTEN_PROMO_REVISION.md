# Leia Kindergarten promo — revision script & shot list (v2)

Source: `public/leia-kindergarten-workbook/promo.mp4` (43.9 s, 1920×1080).
Basis: vidIQ review (Review score 82). Three fixes: hook, character re-hook, interactive B-roll.
Everything else in the current cut stays — it's clean and well paced.

## Current cut (reference)

| Time | On screen |
|---|---|
| 0:00–0:04 | Cover + "Learning that feels like play." |
| 0:04–0:12 | "Trace it." (Aa / Ant, numbered start dots) |
| 0:12–0:16 | "Count it." (Number Meadow, ten-frames) |
| 0:16–0:20 | "Solve it." (Shape Town maze) |
| 0:20–0:24 | Red wipe transition |
| 0:24–0:30 | "Seven lands. Three friends. One very good dog." (Ollie, Ruby, Bella, Leia) |
| 0:30–0:34 | "Grown-ups love it too." (tip, answer key, certificate) |
| 0:34–0:44 | End card: 110 pages, Letter + A4, answer key, instant download |

## Fix 1 — Hook (0:00–0:04)

Replace the title reveal with a parent pain point; title moves to 0:04.

- **0:00–0:02.5** — Cream background, text types/pops in, one line at a time:
  "Tired of the daily battle…" → "…to get them writing and counting?"
  Optional: quiet record-scratch / "bonk" SFX on the second line.
- **0:02.5–0:04** — Cover slides in from the left with a soft whoosh; text swaps to
  **"Learning that feels like play."** (the current tagline becomes the *answer* to the hook).
- Title card "Leia's Learning Adventures: Kindergarten" holds under the tagline as now.
- Keep total length: trim 1 s from the end-card hold to absorb the extra second.
- Voiceover (if used): "Tired of the daily battle to get your kids practicing writing and math?
  Meet Leia." Otherwise text + SFX only.

## Fix 2 — Character re-hook (0:22–0:26)

The red wipe leads straight into the character reveal with no cue. Make the reveal four beats:

- **0:22** — Wipe ends on a pop SFX; headline "Seven lands. Three friends. One very good dog." lands.
- **0:23.5 / 0:24.5 / 0:25.5 / 0:26.5** — Each avatar circle scales in (bounce, ~8 frames)
  with its name label and a distinct SFX (hoot, boing, flutter, bark).
  Order unchanged: Ollie → Ruby → Bella → Leia (Leia last, biggest bounce, bark).
- Land labels as dynamic text pop-ups (name + one trait): "Ollie the Owl", "Ruby the Rabbit",
  "Bella the Butterfly", "Leia the Dog".
- Land chips (Alphabet Forest…Puzzle Market) fade in *after* the fourth bark, not during.
- Pushes the section about 2 s later; recover by shortening the red wipe to 0.5 s.

## Fix 3 — Interactive B-roll (0:05–0:20)

Show a child's hand doing the page instead of a static page appearing.

- **Trace it** — Animated crayon follows the numbered dots of the "A": start dot → arrow →
  stroke 2 → crossbar. Orange line draws on in sync with a soft crayon-scratch SFX. The current
  cut already has the pencil icon and a partial orange stroke; extend it into the full letter.
- **Count it** — Tap highlight on each picture in turn (finger-tap ripple), count badge
  increments 1…6, ten-frame cells fill as each is counted. Caption: "Touch, say, fill."
- **Solve it** — Green path draws start → finish through the shape maze (already begins at
  START); end with a small checkmark and "Puzzles check themselves."
- Style: soft finger-tap ripples or a chunky crayon cursor; no realistic hands needed.
- Pacing: ~5 s each (trace 0:05–0:10, count 0:10–0:15, solve 0:15–0:20). Fits the existing
  window — only the motion inside each page changes.

## Revised timeline

| Time | Beat |
|---|---|
| 0:00–0:02.5 | Pain-point hook text + SFX |
| 0:02.5–0:05 | Cover + "Learning that feels like play." |
| 0:05–0:10 | Trace it — animated crayon stroke |
| 0:10–0:15 | Count it — tap + fill animation |
| 0:15–0:20 | Solve it — path draws, checkmark |
| 0:20–0:22 | Short wipe (0.5 s) into characters |
| 0:22–0:28 | Character pop-ups with name SFX |
| 0:28–0:32 | Grown-ups love it too |
| 0:32–0:44 | End card (unchanged) |

## Optional extras

- Burned-in captions throughout (silent autoplay is the default on most feeds).
- Add "Ages 4–6" to the hook line for search/relevance.
- Thumbnail/poster: swap `promo-poster.jpg` to a frame with the pain-point line.

## Delivery notes

- Re-export at 1920×1080, H.264, same filename `promo.mp4` so
  `src/data/books.ts` (`src: '/leia-kindergarten-workbook/promo.mp4'`) needs no change.
- Keep file size near the current ~4 MB; `PromoVideo.astro` defers loading, but heavy files
  still hurt mobile.
- Regenerate `promo-poster.jpg` if the first frame changes.
