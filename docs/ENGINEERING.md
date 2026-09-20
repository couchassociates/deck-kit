# Engineering notes

For anyone developing deck-kit itself. `PLAYER.md` is the contract, `docs/DIRECTION.md` the principles; this file is how the code works, how to test it, what has bitten us, and why things are the way they are.

## 1. Architecture

A deck is one HTML file in three zones, separated by banner comments:

1. **Deck styles**: typography, palette, slide layouts. Owned by the deck. May override any `--pk-*` token to restyle the player chrome.
2. **Deck content**: `<div id="viewport"><div id="stage">` holding one `<section class="slide">` per slide. The stage carries optional `data-brand`, `data-version`, `data-duration`, `data-width`, `data-height`, `data-channel`.
3. **Player**: `player.css` inlined in `<style id="player-css">` and `player.js` in `<script id="player-js">`, or linked. `build.py` produces the inlined form and can rebuild a deck from itself because it cuts at the zone 3 banner.

The player is one IIFE. On load it:

- injects its own chrome markup (progress bar, HUD, ribbon with arrows and centre control, toolbar, notes panel) with `insertAdjacentHTML`, so the content file never contains chrome;
- reads `W`/`H` from the stage (default 1920 × 1080) and sets `--pk-w`/`--pk-h`; owns `section.slide` sizing and `#stage > section.slide` placement (absolute, hidden unless `.is-active`);
- generates the index slide (slide 0, a grid of scaled clones), the hold screen, the ink canvas, the fx canvas and the magnifier lens inside `#stage`;
- builds `slides = [grid].concat(content)`; everything else is driven by `cur`.

Thumbnails everywhere (index, ribbon, next preview, magnifier lens) are DOM clones of the slide, scaled with `transform: scale(k)`, `inert`, notes removed. Because clones are not stage children, the player sizes all `section.slide`, not only staged ones; that was a real bug once.

Presenter mode is `body.notes-open`, toggled by N or by `?presenter` in the URL. In that mode `fit()` reserves the notes panel width, the toolbar height, the ribbon height and a margin around the stage, then scales the stage to what is left.

## 2. Two-window sync

Two windows of the same deck on one machine talk over `BroadcastChannel('deck-player:' + (data-channel || title))`, with `localStorage` events as the fallback for slide and clock only. Message types:

- `{i, hold, t}` slide and hold-screen state; also written to `localStorage` under `<channel>:state`.
- `{clock}` the clock object `{running, startAt, base}`; also stored under `<channel>:clock`, which is what lets the clock survive a reload.
- `{ink: {i, st}}` the full ink slot for one slide (strokes, ellipses, placed magnifier). Sent throttled while drawing.
- `{hover: {...}}` a live cursor, laser dot, oval preview or magnifier hover; `null` to clear.
- `{sel: {i, rects}}` text-selection rectangles in stage coordinates, from the pointer tool; `null` to clear.
- `{hello: 1}` sent by a non-presenter window on load; a presenter window answers with `{inkAll}`, its state and its clock.

Rules that keep it from looping: a receiving window applies state with `fromPeer = true` so it does not rebroadcast; `go()` returns early when the index is unchanged; `BroadcastChannel` never echoes to the sender. Ink and hover are sent with `setTimeout` throttles, not `requestAnimationFrame`, because Chrome pauses animation frames in a hidden window and the shared window is often hidden behind the meeting app.

Ink is per slide, in memory only; a reload clears it by design. Sync is one machine only; there is no server.

## 3. Ink and tools

Tools are toggles: `pointer`, `pen`, `hi`, `laser`, `circle` (drag-to-draw oval, Shift for a circle), `mag` (magnifier). Default is `none`: nothing is mirrored and a click advances. The ink canvas gets `pointer-events` only when a tool other than pointer/none is active, so plain clicks still reach the stage.

- Pointer mirrors the cursor position as an arrow on the shared window and mirrors native text selection as yellow rectangles. A click that moved more than six pixels or that produced a selection does not advance.
- Pen and highlighter store point arrays; the highlighter is drawn at reduced alpha and larger width. Widths are `PEN_W=[3,6,10,16]`, `HI_W=[22,32,44,60]`.
- The oval stores `{x, y, rx, ry}` as a stroke of tool `ellipse`.
- The laser is drawn on the fx canvas and fades over 900 ms.
- The magnifier is a `div#lens` containing a scaled clone of the current slide, translated so the cursor point sits at the lens centre; diameters `320, 440, 560, 720`; one per slide; it follows the cursor only until placed.
- Colour and width are popover pickers; the toolbar drops labels to icons when narrow and never scrolls.

## 4. Clock and pace

`data-duration` on the stage (minutes, default 60). Each slide may carry `data-start`/`data-end` in minutes, decimals allowed. The clock reports "ahead by", "on time", "behind by" against the current slide's window, or "no window" when the slide has none. Start/pause on T, reset on Shift+R, set to any mm:ss, or snap to the current slide's start for rehearsing from the middle.

## 5. Notes

`aside.notes` inside a slide. Three optional blocks are styled: `div.open` (the bridging line to say as the slide lands; never the title read aloud), `div.cue` (a planned exchange with a co-presenter), `div.next` (the hand-off into the next slide). The panel is a column: notes card at the top (scrolls internally), then clock, next preview (clickable), and the key reference anchored to the bottom.

## 6. Testing

There is no test suite; test in a browser.

- Open `template.html`, then open it again with `?presenter`. Check the index, ribbon, notes, clock, hold screen (B), each tool, and that ink drawn in the presenter window appears in the other.
- `window.__deck()` returns `{cur, tool, strokes, ellipses, mag, presenter, remoteHover, remoteSel}` for the window it is called in. Drive the page with synthetic `PointerEvent`s on `#ink` (coordinates from `#stage.getBoundingClientRect()`) and read `__deck()` in both windows to confirm sync without a mouse.
- Serve over `http://` for two-window tests; `BroadcastChannel` and `localStorage` behave differently on `file://` in some browsers.
- `node --check player.js` catches syntax errors after edits.

Quirks seen during development, so nobody chases them again:

- Chrome drops **smooth** scrolls in a window without focus; the ribbon therefore uses instant `scrollLeft` for the arrows, the centre control and the load-time centring, and `scroll-behavior: smooth` must not be set on the ribbon.
- Browser-automation clipped screenshots (CDP `captureScreenshot` with a clip) sometimes time out on this page while it is perfectly responsive; use full screenshots or `__deck()`.
- Extension-driven clicks can land off-target after a window resize; synthetic events in the page are more reliable.
- Over a meeting platform's screen share, the laser and pen mirror with visible stutter and the magnifier arrives late. That is the platform's frame rate, not the player.

## 7. Decision log

- **Single file, no dependencies, no build step.** The whole premise; see DIRECTION.
- **Player injects its own chrome.** So a content file contains only slides, and the player can be swapped without touching content.
- **Player owns slide placement, deck owns slide appearance.** The line between zone 1 and zone 3.
- **Tokens with defaults.** Every colour and face has a `--pk-*` default so a foreign deck looks right untouched; a deck may map its own palette onto them.
- **Ink is session-only.** Reload clears it. Persisting ink invited stale marks on the wrong slide.
- **No tool selected by default.** Nothing reaches the shared window until the presenter chooses to.
- **Colour and width are always pickers.** Showing all swatches on the bar was clutter, and inline width dots broke in compact mode.
- **Named `deck-kit`.** One plain noun that reads naturally after the org path in a prompt; `deck` and `podium` were taken or swamped on GitHub. The brand stays in the path, not the name, so forks and branches feel neutral.
- **Home is the `couchassociates` organisation.** The repo was first created under a separate `couch-associates` user account by mistake and transferred; the old path redirects. Do not create anything under the hyphenated account.
- **MIT.** Maximum reuse; the project is not monetised.
- **`main` is the trunk; one-word branches per deck type; `lab/` and `couch/` prefixes for experiments and personal work.**

## 8. Roadmap, with detail

- **`data-features` on `#stage`**: a space-separated list (`ink clock ribbon sync hold notes`) to switch modules off. Implementation: the player checks the list before injecting each piece of chrome and before binding its keys; absent attribute means all on.
- **In-place text edit**: click a text node in presenter mode, edit, save back to the file. The hard part is writing the file; on a local file the browser cannot, so the likely shape is "copy the updated slide markup" or a download, unless the deck is served by something that can write.
- **Conformance check**: a small script (or a paragraph in the README) an assistant runs on its own output: stage present, only slides inside it, titles present, player files intact (compare a hash), no sample content, `<title>` set.
- **Print and PDF**: a print stylesheet that lays slides out one per page at the stage size.
- **README evaluation**: give the same vague prompt to several assistants with only the repo link and fix whatever the README fails to prevent. Do this before any change to the agent instructions.
- **GitHub Pages**: serve `template.html` from the repo so the live example has a stable address.

Out of scope for `main`: Markdown authoring, animation frameworks, PPTX export, multi-machine sync over a server, a theme marketplace.

## 9. Origin

Extracted in September 2026 from a private deck built for a live session at Couch & Associates. The deck's content changed daily while the presenter tooling had to stay stable, which forced the three-zone separation and the contract. That deck is rebuilt from this kit with `build.py` and is the kit's main consumer; nothing from it is in this repository.
