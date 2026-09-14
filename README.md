# Shot05 + Shot06 — Representation Shift Animatic

A standalone, dependency-free 25-second SVG animatic based on the approved
`references/shot05-shot06-storyboard.png` storyboard.

## Preview

Double-click `index.html` (or use **Open with** and choose a browser). The
project is designed to run directly from a local `file://` URL on Windows,
macOS, and Linux; no server, installation, or build step is required.

The animatic autoplays once. Use Play/Pause, Replay, the progress bar, or
keyboard controls (`Space`, `Home`, arrow keys) to review timing. The animation
honors `prefers-reduced-motion` by starting paused.

## Files

- `index.html` — responsive 16:9 SVG stage and accessible controls
- `styles.css` — paper/sketch art direction and responsive presentation
- `timeline.js` — the globally accessible, single source of truth for cues and subtitle timing
- `main.js` — deterministic render loop driven entirely by local timeline time

## Timing

- Shot05: local `0–13.5s`
- Shot06: local `13.5–25s`

All cue times are centralized in `timeline.js`. Rendering is state-based, so
scrubbing and replaying produce the same frame at the same time.

For the complete implementation and iteration workflow, see
[`WORKFLOW.md`](WORKFLOW.md).
