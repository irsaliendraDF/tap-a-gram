# Tap-A-Gram

Tap candies for 60 seconds, build a love note in bricks, share it via URL hash.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## URL hash format

Share links look like:

```
https://<host>/#t=crush&to=Jamie&from=Alex&tier=3&m=2
```

| Param | Values | Meaning |
|---|---|---|
| `t` | `crush` `bestie` `selflove` `roast` `family` `justbecause` | Tone (controls palette and message pool) |
| `to` | string (max 18 chars) | Recipient name on the gram |
| `from` | string (max 18 chars) | Sender name |
| `tier` | `1` `2` `3` | Message intensity (1 = awkward, 3 = full feelings) |
| `m` | `0` `1` `2` | Which message in that tone × tier pool |

A valid hash drops the visitor straight into a "you got a gram" reveal.

## Editing messages

All 54 grams live in `src/TapAGram.jsx` in the `MESSAGES` constant. Format: `MESSAGES[tone][tier]` is an array of strings, `\n` for brick-line breaks. Stick to uppercase A–Z, 0–9, space, `.`, `!`, `?`, `/`, `'`. The pixel font only defines those glyphs.

## Tuning difficulty

Constants near the top of `src/TapAGram.jsx`:

```js
const GAME_DURATION = 60;
const SPAWN_INTERVAL_GOOD = [600, 1100];
const SPAWN_INTERVAL_BAD  = [1500, 2500];
const CANDY_LIFETIME      = [2200, 3000];
const SCORE_GOOD = 10;
const SCORE_VIBE = 25;
const SCORE_BAD  = -15;
const ON_VIBE_PROB = 0.4;
const TIER_THRESHOLDS = [100, 250];
```
