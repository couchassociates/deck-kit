# Deck Player kit

A presenter and viewer for single-file HTML slide decks. Drop it under any deck that follows the small contract below and you get: an index of thumbnails, keyboard and click navigation with looping, a presenter view with notes, a session clock with per-slide pace, a scrolling ribbon, two-window sync for screen sharing, a hold screen, and drawing tools (pen, highlighter, laser, oval, magnifier) mirrored to the shared window. No build step is required, no libraries, no network.

Files:

| File | Purpose |
|---|---|
| `player.css` | All player styling. Self-contained, with `--pk-*` tokens a deck may override. |
| `player.js` | All player behaviour. Injects its own chrome at load. |
| `template.html` | A four-slide starter deck showing every part of the contract, including slides that are missing things. |
| `build.py` | Inlines the two files into a content file to produce one self-contained HTML deck. |

## 1. The contract

The player reads exactly this from the page and nothing else.

```html
<title>Deck title</title>                     <!-- used in the index, hold screen and window title -->
<div id="viewport">
<div id="stage" data-brand="Name <i>&amp;</i> Co" data-version="v1" data-duration="60">
  <section class="slide" data-title="Opening" data-start="0" data-end="2">
    ...slide markup...
    <aside class="notes"><p>Presenter notes, any HTML.</p></aside>
  </section>
  <section class="slide" data-title="Next">...</section>
</div>
</div>
<link rel="stylesheet" href="player.css">    <!-- or inline both with build.py -->
<script src="player.js"></script>
```

Required: `#stage` containing one or more `section.slide` in order. Everything else is optional.

| Where | Attribute | Meaning | If missing |
|---|---|---|---|
| `<title>` | | Deck name | "Deck" |
| `#stage` | `data-brand` | HTML shown on the hold screen | Hold screen shows the title only |
| `#stage` | `data-version` | Text in the index header | Omitted |
| `#stage` | `data-duration` | Session length in minutes | 60 |
| `#stage` | `data-width`, `data-height` | Logical slide size in px | 1920 × 1080 |
| `#stage` | `data-channel` | Name for two-window sync | The title. Two different decks open at once do not cross-talk unless they share a title. |
| `section.slide` | `data-title` | Name in index, ribbon, notes | "Slide N" |
| `section.slide` | `data-start`, `data-end` | Scheduled window in minutes | Clock runs; pace line says "no window" for that slide; index and ribbon show no window |
| `section.slide` | `<aside class="notes">` | Presenter notes | Card says "No notes." |
| notes | `<div class="open"><b>Open · Who</b>first line</div>` | The kick-off line, shown first and emphasised | Plain paragraphs are fine |
| notes | `<div class="cue"><b>Label</b>text</div>` | Callout inside notes, for a planned exchange | Plain paragraphs are fine |
| notes | `<div class="next"><b>Into 12 · Who</b>transition line</div>` | The hand-off into the next slide, shown last under a rule | Plain paragraphs are fine |

Recommended note shape: open line first, the body for speaking to the content and any planned exchange, and the transition line last. The open line is a bridge, not a caption: it picks up the previous slide's last thought and says why this slide comes next, in words the slide itself does not use. If reading the headline aloud would produce the same sentence, rewrite it.

Rules the deck must respect:

- Do not position, size or hide `.slide` in deck CSS. The player owns `position`, `inset`, `width`, `height`, `display`, `overflow` and `isolation` on `section.slide`. Style the inside of a slide freely (background, colour, padding, typography).
- Start every deck selector with `.slide` (`.slide h2`, `.slide.dark .card`). The index is a slide the player generates, and the presenter view lives in the same page, so a bare `h2`, `p`, `*` or `body` rule reaches them. The player defends its own layout (it sets `box-sizing` on its chrome and spells out the index heading), but it cannot anticipate every deck rule.
- Each slide is its own stacking context. A `z-index` inside a slide orders things within that slide and never rises above the ink, the magnifier or the hold screen.
- Keep images inside the file (CSS, inline SVG, data URI). A hotlinked image may be blocked, moved or offline when the deck is presented.
- Do not use the ids `viewport`, `stage`, `progress`, `hud`, `ribbonwrap`, `ribbon`, `tools`, `notes`, `hold`, `ink`, `fx`, `lens`, `bottom`, `clock`, `keys`, or any id that starts with `pk-` (`pk-corner`, `pk-present`, `pk-helpbtn`, `pk-help`) for anything else.
- Slides are cloned for thumbnails and the magnifier. Avoid ids inside slides (they would be duplicated) and avoid scripts inside slides.
- A slide's `aside.notes` is never displayed on the slide itself.

## 2. Installing

Two-file: place `player.css` and `player.js` beside the deck and add the link and script tags after `#viewport`.

Single-file: `python build.py my-content.html my-deck.html`. The content file is your zones 1 and 2 (styles and slides); the script appends the inlined player. Rebuilding from the output file works too, because the script cuts at the ZONE 3 banner and keeps everything before it.

Link mode: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/couchassociates/deck-kit@1/player.css">` and `<script src="https://cdn.jsdelivr.net/gh/couchassociates/deck-kit@1/player.js"></script>` after `#viewport`. `@1` resolves to the newest 1.x release tag, so a linked deck picks up fixes and never a contract change. A full tag (`@1.1.0`) freezes it. Avoid `@main`: the CDN caches a branch for hours, so it is neither current nor stable. A linked deck needs a connection when it opens and shows nothing from the player until the files arrive.

The player is copied, never retyped. An assistant that cannot download files should use link mode.

Styling the chrome: override any token in your deck CSS, for example `:root{--pk-accent:#E63946;--pk-display:"Inter",sans-serif}`. The player's defaults carry no specificity, so a deck's `:root` block wins wherever it sits in the file. Tokens: `--pk-bg`, `--pk-fg`, `--pk-fg-mute`, `--pk-line`, `--pk-info` (dark chrome); `--pk-paper`, `--pk-ink`, `--pk-mute`, `--pk-rule` (index and notes card); `--pk-accent`, `--pk-accent-ink`, `--pk-accent-tint`; `--pk-mono`, `--pk-display`, `--pk-body`.

## 3. Using it

Open the file. Slide 0 is an index of real thumbnails. Arrows, space, Enter, PageDown advance; the deck loops from the last slide back to the index. `#/12` in the URL opens slide 12.

Two buttons sit in the bottom right corner of a plain window. They are labelled and plain to see on the index, where a person starts, and dim to icons on slides because an audience may be watching that window.

- **Presenter view** switches this window to the presenter view: notes, clock, next-slide preview, ribbon and drawing tools. In the presenter view the same button sits at the end of the toolbar and reads "Exit presenter". N does the same, and `?presenter` on the URL opens a window already in that view.
- **How to present** (or the ? key) opens the built-in help: the two-window setup in three steps, the keys for reading alone, and the keys for presenting.

Presenting to other people takes two windows of the same browser on one machine. Open the presenter view, then click "Open a window to share" beside the sync state. A second, plain window opens on the same slide. Share that window in the meeting, or drag it to the projector and press F. The two stay in step over a browser channel (slide, hold screen, clock, ink, cursor, selection); the sync state reads "in step" and the share button goes away until that window closes. A window that a presenter view is driving keeps its corner buttons dim and unlabelled even on the index. Two different browsers (Chrome beside Edge) do not share a channel and will not sync.

A deck that does not want the corner buttons sets `#pk-corner{display:none}`; N, ? and `?presenter` still work.

The presenter view opens on the index like any other window. The drawing tools act on slides and do nothing on the index, where they are dimmed; a tool picked there is ready on the first slide, and the thumbnails stay clickable.

Keys:

| Key | Action |
|---|---|
| → · space · Enter · click | Next (a click that moved more than a few pixels, or made a text selection, does not advance) |
| ← · Backspace | Previous |
| ? | Help: how to present, the two-window setup, the keys. Esc or ? closes it. |
| G | Index |
| Esc | Drop the active tool; if none, go to the index |
| N | Toggle the presenter panel |
| F | Fullscreen |
| B | Hold screen on the shared view (a quiet slide showing the brand) |
| T | Start or pause the clock |
| Shift+R | Reset the clock |
| V P H L O M | Pointer, pen, highlighter, laser, oval, magnifier. Each is a toggle; press again to drop it. |
| C | Clear ink on the current slide |
| 1 to 9, 0 | Colour (0 is white) |
| [ ] | Width, four presets |
| Home · End | First and last slide |

Presenter panel, top to bottom: the notes card (scrolls internally), then anchored to the bottom the clock line (elapsed of total, pace, play/pause, dots to expand reset and a "set to mm:ss" field and "this slide's start"), the next-slide preview (click to advance), the sync state, and a one-line key reference with a toggle.

Ribbon: every slide as a thumbnail with its number; title and window on hover; click to jump. Side arrows and the mouse wheel scroll it; the centre control jumps to first, current or last without changing the slide.

Toolbar: pointer, pen, highlighter, laser, oval, magnifier (with a caret for its size), colour picker, width picker, clear. Labels drop to icons when the bar is narrow; it never scrolls. With no tool selected nothing is mirrored and a click advances. Pointer mirrors the cursor and any text selection to the shared window. Pen and highlighter draw; oval is drag to draw, Shift for a circle; laser is a fading dot; magnifier follows until clicked, then stays, one per slide, click elsewhere to move, caret to choose one of four diameters. Ink is per slide for the session and clears on reload.

## 4. Graceful degradation

| Situation | Behaviour |
|---|---|
| No `#stage` | Console warning, nothing else happens; the page renders as plain HTML. |
| `#stage` with no slides | Index shows "No slides found". |
| Slide without `data-title` | Listed as "Slide N". |
| Slide without timing | Clock runs; pace line reads "No window"; no window in captions. |
| Some slides timed, some not | Pace is reported only on timed slides. |
| No `data-duration` | Clock counts to 60:00. |
| No `data-brand` | Hold screen shows the title. |
| No notes | Card reads "No notes." |
| Fonts blocked or offline | Fallback faces; layout holds. |
| Opened inside a sandboxed preview pane (a chat app's canvas, an `srcdoc` iframe) | The browser refuses to update the URL hash; the player carries on without it. Navigation, notes, clock and tools work. There is no second window, so nothing to sync with. |
| Deck has no `box-sizing` reset, or a global one | The chrome sets its own; layout is the same either way. |
| Deck uses a high `z-index` inside a slide | Stays inside the slide; ink, magnifier and hold screen remain on top. |
| Link mode and no connection | The page renders as plain HTML, all slides stacked, until the player files load. |
| `BroadcastChannel` unavailable | Slide and clock still sync via `localStorage` events; ink and cursor do not. |
| `localStorage` blocked | Everything works in one window; the clock does not survive a reload. |
| Second window never opened | Presenter view works alone; sync state says "solo". |
| Browser refuses the second window (popup blocked, sandboxed preview pane) | The share button says so and asks the person to open the file again in a second window. The presenter view itself is unaffected; it never needs a new window. |
| The shared window is closed | It says goodbye on the way out; the presenter view goes back to "solo" and offers the share button again. |
| Tool selected while on the index | Nothing draws and nothing is captured; thumbnails stay clickable; the tool is live on the next slide. |
| Window loses focus | Instant scrolls are used for the ribbon so nothing is dropped. |
| Different aspect ratio | Set `data-width` and `data-height`; thumbnails and ribbon follow. |
| Reduced-motion preference | Panel and progress transitions are disabled. |

## 5. Testing without a mouse

`window.__deck()` returns `{version, slides, cur, tool, strokes, ellipses, mag, presenter, remoteHover, remoteSel}` for the current window. `version` is the player release and `slides` the number of content slides; if `__deck` is undefined the player did not start. The rest is enough to drive the page with synthetic `PointerEvent`s from a console or an automation tool and confirm that ink, cursor and selection reached the other window. Note that some browser automation captures (clipped screenshots) can time out on a page with an active canvas even though the page is responsive; prefer full screenshots and `window.__deck()`.

## 6. Known limits

- Sync is between windows on one machine only. A second presenter on another machine sees the shared screen, not the channel.
- Ink is session-only by design; a reload clears it.
- Slides are cloned for thumbnails, so very heavy slides (large inline images, hundreds of nodes) make the index and ribbon slower to build.
- The magnifier magnifies a DOM clone, so content that depends on scripts or external state inside a slide will not appear inside the lens.
