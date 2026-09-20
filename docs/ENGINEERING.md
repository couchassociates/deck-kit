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
- `{bye: 1}` sent on `pagehide`. A presenter view that hears it goes back to "solo" and shows the share button again.
- `{hello: 1}` sent by every window on load. A presenter window answers with `{inkAll}`, its state and its clock. A plain window answers `{here: 1}`, which is how a presenter opened second learns it has company and shows "in step" instead of "solo".

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
- `window.__deck()` returns `{version, slides, cur, tool, strokes, ellipses, mag, presenter, remoteHover, remoteSel}` for the window it is called in. Drive the page with synthetic `PointerEvent`s on `#ink` (coordinates from `#stage.getBoundingClientRect()`) and read `__deck()` in both windows to confirm sync without a mouse.
- Serve over `http://` for two-window tests; `BroadcastChannel` and `localStorage` behave differently on `file://` in some browsers.
- `node --check player.js` catches syntax errors after edits.

Quirks seen during development, so nobody chases them again:

- Chrome drops **smooth** scrolls in a window without focus; the ribbon therefore uses instant `scrollLeft` for the arrows, the centre control and the load-time centring, and `scroll-behavior: smooth` must not be set on the ribbon.
- Browser-automation clipped screenshots (CDP `captureScreenshot` with a clip) sometimes time out on this page while it is perfectly responsive; use full screenshots or `__deck()`.
- Extension-driven clicks can land off-target after a window resize; synthetic events in the page are more reliable.
- Over a meeting platform's screen share, the laser and pen mirror with visible stutter and the magnifier arrives late. That is the platform's frame rate, not the player.
- In a sandboxed preview (a chat app's canvas, any `srcdoc` iframe) `history.replaceState` throws a `SecurityError`. In 1.0.0 that call sat unguarded in the middle of `go()`, so every slide change stopped there: the title, next preview, ribbon mark, clock pace, ink redraw and the sync broadcast never ran, while the chrome stayed on screen looking fine. It is wrapped in `try` now. Treat any browser API that depends on the origin the same way.
- The player was written inside a deck that had `*{box-sizing:border-box}` in its own styles, and the chrome depended on it without saying so. Under the template, which had no reset, the notes panel came out 721 px wide against the 660 px that `fit()` reserves, and it covered the right end of the toolbar and the ribbon arrow. `player.css` now sets `box-sizing` on its own elements, listed one by one so a cloned slide keeps the deck's choice.
- The presenter view opens on the index, and ink is refused there (`cur===0`). In 1.0.0 a tool picked on the index still set `tool-on`, so the canvas took the pointer: the button lit up, nothing drew, and the thumbnails stopped responding to clicks. To someone trying the tools for the first time that reads as "everything is there and none of it works", and it was the main complaint from the first outside test. `armInk()` now sets `tool-on` only when `cur>0`, the tool buttons dim on the index (`body.pk-index`), and the index notes say the tools work on slides. Every test in this file that exercises a tool should be run once from the index without advancing first.
- Token overrides did nothing in 1.0.0. The defaults were declared on `:root` in `player.css`, the deck's overrides on `:root` in zone 1, and the player comes later in the file, so at equal specificity the defaults won. Nobody saw it because the template's palette is the default palette. The first deck with its own accent got the default yellow in its presenter view. The defaults now sit in `:where(:root)`, which has no specificity. The two glows that hard-coded the yellow (`.rthumb.current .rf`, `#notes .cue`) follow `--pk-accent` through `color-mix`, with the old value left in front as the fallback. Test any token change against a deck whose palette is not the default; `examples/garden-update.html` is one.
- A cloned slide inherits from the chrome it is placed in. The ribbon button centres its text and the notes panel sets a face, size, line height and colour, so in 1.0.0 every ribbon thumbnail of a left-aligned slide came out centred. `likeStage()` copies the inherited text properties of `#stage` onto each clone's frame (index, ribbon, next preview, lens), which is what a real slide inherits. It has to be done in script: CSS cannot say "inherit from that other element", and resetting to `initial` would be wrong for a deck that sets its face on `body`.
- A deck element with a `z-index` above 2 used to sit over the ink canvas (blocking the pen there) and one above 5 showed through the hold screen. `section.slide` now has `isolation:isolate`.

Testing what an assistant produced: run the deck three ways, because they fail differently. Over `http://`, from `file://`, and inside `<iframe sandbox="allow-scripts" srcdoc="...">`. Keep a hostile deck around (bare `h1,h2` rules, a `.grid` and `.row` class, a global reset or none, a `z-index:50` block in a slide) and check that the index heading, the panel width and `document.elementFromPoint` over the block with the pen active all come out the same as under the template. Headless Chrome with `--remote-debugging-port` and Node's built-in `WebSocket` is enough to script this with no dependencies.

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
- **Link mode is a first-class route, pinned to `@1`.** The first outside test (a chat assistant, a short prompt, September 2026) chose link mode although the README said to prefer inline. A chat assistant cannot download a file into its output, and emitting 57 KB by hand is slow and inexact, so linking is the right call for it. The README now sorts agents by what their tools allow, and the link points at the `@1` release range because `@main` is cached by the CDN for up to twelve hours and can change under a deck.
- **The player defends itself against deck CSS.** Asking agents to scope selectors under `.slide` helps, and the template models it, but the instruction will be missed. Anything the player draws inside `#stage` sets every property a plausible deck rule could leak into it.
- **One button in and out of the presenter view, and the second window is asked for by name.** 1.1.0 put a faint icon in the corner that opened the presenter view in a new window. In the next outside test the person could not tell how to get back, because the way back was to close a window, and the icon had vanished from the view they were in. 1.2.0 makes `#pk-present` a plain toggle of `body.notes-open` in the same window. `placePresent()` moves it, with the help button, between `#pk-corner` (fixed, bottom right) and the end of `#tools`, where it reads "Exit presenter" and where `fitTools()` measures it. The second window became an explicit button in the sync line, `#pkAudience`, which opens the same URL without `presenter` at the current `#/n`, named `deck-audience`. That order matches how the view is used: the person is looking at their console and needs a clean window to share.
- **The deck explains itself.** The two-window setup is the main reason to use the kit and nobody can discover it from a slide. `#pk-help` (the ? key, or "How to present" in the corner) gives the three steps, the keys, and a button that does the next step for the person. It is built from `div` and `span` only and styled under its id, so a deck's bare `h2`, `p` or `li` rule cannot reach it. While it is open the key handler returns early for everything except Esc and ?.
- **Quiet on the shared window.** Labels and full opacity show on the index only when the window is not being driven. `applyPeer()` sets `body.pk-following` on a plain window the first time a presenter moves it.
- **Toolbar labels go in three levels.** Full, `compact` (tool labels off), `tight` (the exit label off too). "Exit presenter" is the last label to go.
- **The player carries a version.** `VERSION` in `player.js`, in the `player.css` header and in `window.__deck().version`, bumped together with the tag, so a deck can say which player it is running.
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
