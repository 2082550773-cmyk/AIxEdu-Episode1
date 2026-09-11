# Shot05 + Shot06 — Representation Shift Animatic

A standalone, dependency-free 25-second SVG animatic based on the approved
`references/shot05-shot06-storyboard.png` storyboard.

## Run

Serve the repository with any static HTTP server, for example:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>. The animatic autoplays once. Use the
Play/Pause, Replay, progress bar, or keyboard controls (`Space`, `Home`, arrow
keys) to review timing. The animation honors `prefers-reduced-motion` by
starting paused.

## Files

- `index.html` — responsive 16:9 SVG stage and accessible controls
- `styles.css` — paper/sketch art direction and responsive presentation
- `timeline.js` — the single source of truth for cues and subtitle timing
- `main.js` — deterministic render loop driven entirely by local timeline time

## Timing

- Shot05: local `0–15s` (video `00:43–00:58`)
- Shot06: local `15–25s` (video `00:58–01:08`)

All cue times are centralized in `timeline.js`. Rendering is state-based, so
scrubbing and replaying produce the same frame at the same time.
