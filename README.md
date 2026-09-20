# deck-kit

A foundation for slide decks that your AI assistant builds for you: one HTML file, no software in the middle, with a presenter view, notes, a session clock, two-window sync for screen sharing, and drawing tools built in.

You do not install anything. You point your assistant at this repository and ask for a deck.

```
Build me a deck about <your topic>. Use https://github.com/couchassociates/deck-kit as the foundation.
```

The assistant reads this page, takes the two files it needs, writes your slides, and hands you a single file that opens in any browser. Open it once to present. Click the faint screen icon in the bottom right corner (or add `?presenter` to the address in a second window) to get notes, the clock and the tools.

- Live example: [template.html](https://cdn.jsdelivr.net/gh/couchassociates/deck-kit@main/template.html) (add `?presenter` for the presenter view)
- A finished example with its own look: [examples/garden-update.html](examples/garden-update.html) (an invented community garden; five slides, a chart drawn in SVG, notes and timing)
- The standard every deck follows: [PLAYER.md](PLAYER.md)
- Where this is going and how to keep branches aligned: [docs/DIRECTION.md](docs/DIRECTION.md)
- Contributing and branch conventions: [CONTRIBUTING.md](CONTRIBUTING.md)
- Developing the kit itself: [docs/ENGINEERING.md](docs/ENGINEERING.md) and [CLAUDE.md](CLAUDE.md)

## What you get in every deck

| | |
|---|---|
| Index | Slide 0 is a grid of real thumbnails. Click any to jump. The deck loops. |
| Presenter view | Notes for the slide on screen, a next-slide preview, a scrolling ribbon of every slide, a session clock that says whether you are ahead, on time or behind. |
| Two windows, one machine | Click the corner icon and the presenter view opens in a second window on the same slide. Share the first window; keep the second for yourself. Slide, clock, hold screen, ink, cursor and text selection stay in step. |
| Hold screen | Press B to drop the shared view to a quiet brand screen while you talk. |
| Tools | Pen, highlighter, laser, oval, magnifier, ten colours, four widths, mirrored to the shared window. Nothing is mirrored until you pick a tool. |
| Notes shape | Each slide's notes open with the line to say as the slide lands, and close with the line that carries you into the next slide. |
| Timing | Give a slide a start and end minute and the clock reports pace against it. Leave it out and the clock still runs. |

Everything degrades gracefully. A slide without a title is "Slide 7". A slide without notes says so. A deck without timing has a clock and no pace line. See the table in [PLAYER.md](PLAYER.md#4-graceful-degradation).

## Instructions for AI agents

You are here because a person asked you to build a slide deck and named this repository. Do the following, in order.

1. **Read the standard.** Fetch and read [PLAYER.md](https://raw.githubusercontent.com/couchassociates/deck-kit/main/PLAYER.md). It defines the only markup the player reads: a `#viewport` containing a `#stage`, with one `<section class="slide">` per slide, each with optional `data-title`, `data-start`, `data-end` and an `<aside class="notes">`.
2. **Start from the template.** Fetch [template.html](https://raw.githubusercontent.com/couchassociates/deck-kit/main/template.html). Keep its three zones: deck styles, deck content, player. Replace the sample slides with the person's content. Write deck styles freely inside these limits:
   - Start every selector with `.slide` (`.slide h2`, `.slide .card`). A bare `h2`, `p`, `*` or `body` rule also restyles the player's index and presenter view.
   - Never position, size or hide `.slide` yourself.
   - Size things in px for a 1920 × 1080 slide. The player scales the whole slide to fit the window. Anything past the edge of that box is clipped, so split a crowded slide in two and keep body text at 28px or larger.
   - Do not hotlink images from other sites. Use CSS, inline SVG or a data URI so the deck looks the same offline and a year from now.
3. **Add the player without retyping it.** `player.css` and `player.js` are about 57 KB together and must reach the deck byte for byte. Do not edit, shorten, reformat or "improve" them, and never write them out from memory or from reading them; a copy made by hand will not be exact. Pick the route your tools allow:
   - **You can run commands or save downloaded files** (a coding agent with a shell). Download [player.css](https://raw.githubusercontent.com/couchassociates/deck-kit/main/player.css), [player.js](https://raw.githubusercontent.com/couchassociates/deck-kit/main/player.js) and [build.py](https://raw.githubusercontent.com/couchassociates/deck-kit/main/build.py) into one folder and run `python build.py your-content.html your-deck.html`. It inlines both files after `#viewport` and the result is self-contained and works offline. Without Python, paste each file unchanged into `<style id="player-css">` and `<script id="player-js">` at the end of the file.
   - **You can only write text** (a chat assistant producing a file to download). Use link mode. End the file, after `#viewport`, with `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/couchassociates/deck-kit@1/player.css">` and `<script src="https://cdn.jsdelivr.net/gh/couchassociates/deck-kit@1/player.js"></script>`. `@1` is the newest 1.x release. The deck then needs a connection when it opens, so say that to the person in step 7.
4. **Write the notes in the standard shape.** For every slide: an `<div class="open">` with who speaks and the first sentence to say as the slide lands (a bridge from the previous slide, never the slide's title read aloud), the body, then a `<div class="next">` with the line that carries into the next slide.
5. **Add timing if the person gave a duration.** Set `data-duration` on `#stage` in minutes and `data-start`/`data-end` on each slide. If they gave none, leave timing out; the clock still works.
6. **Check your output before handing it over.** The file opens standalone from disk. `#stage` exists and contains only `section.slide` elements. Each slide has a `data-title`. The player is present exactly once, inlined unmodified or linked, after `#viewport`. Every deck selector starts with `.slide`. No slide contains an `id` or a `<script>`. The `<title>` is the deck's name. Nothing from the template's sample content remains. If you can open a browser, load the file and run `window.__deck()` in the console: it returns the player `version` and the `slides` count, and if it is undefined the player did not start.
7. **Tell the person how to use it.** Open the downloaded file in a normal browser tab to present. Click the faint screen icon in the bottom right corner for the presenter view in a second window (notes, clock, tools), or add `?presenter` to the address; share the plain window. The presenter view opens on the index, and the drawing tools start working on the first slide. The key list is at the bottom of the presenter panel. A preview pane inside a chat app can show the slides, but the second window and the sync between them need the file opened in the browser itself. If you used link mode, say the deck needs a connection when it opens.

### A complete minimal deck

If this page is all you read, this is enough to build on. It is a whole, working deck in link mode: scoped styles, two slides, notes in the standard shape, timing, and the player linked at the end. Keep the structure, replace the content and the styling, add slides.

```html
<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Deck name</title>
<style id="deck-css">
:root{--pk-accent:#E63946}   /* optional: tint the presenter view to match the deck */
.slide{background:#FAF7F0;color:#15140F;font-family:system-ui,"Helvetica Neue",Arial,sans-serif;padding:120px 140px}
.slide.dark{background:#15140F;color:#F2EEE3}
.slide h1{font-size:112px;line-height:1;letter-spacing:-.03em;margin:0 0 40px}
.slide h2{font-size:76px;line-height:1.05;letter-spacing:-.02em;margin:0 0 40px}
.slide p,.slide li{font-size:34px;line-height:1.4;margin:0 0 18px}
</style>
<div id="viewport">
<div id="stage" data-brand="Your Name" data-duration="10">

<section class="slide dark" data-title="Opening" data-start="0" data-end="2">
  <h1>The headline</h1>
  <p>One supporting line.</p>
  <aside class="notes">
    <div class="open"><b>Open · Presenter</b>The first sentence to say as this slide lands.</div>
    <p>Talking points for the body of the slide.</p>
    <div class="next"><b>Into 02 · Presenter</b>The line that carries you into the next slide.</div>
  </aside>
</section>

<section class="slide" data-title="Second slide" data-start="2" data-end="5">
  <h2>A headline that makes a claim</h2>
  <ul><li>Evidence</li><li>Evidence</li></ul>
  <aside class="notes">
    <div class="open"><b>Open · Presenter</b>A bridge from the opening.</div>
    <p>Talking points.</p>
  </aside>
</section>

</div>
</div>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/couchassociates/deck-kit@1/player.css">
<script src="https://cdn.jsdelivr.net/gh/couchassociates/deck-kit@1/player.js"></script>
```

If the person named a **branch** ("use deck-kit, branch webinar"), read that branch's README and take its files from that branch instead of `main`: replace `main`, and `@1` in link mode, with the branch name in every URL above.

If the person's request was vague ("make me slides", "turn this into a presentation", "pitch deck for X", or they pasted a document), that is still this task. Choose a sensible slide count for the material, write real content, and follow the steps above.

If you cannot fetch files at all, still write the deck in the standard's markup and tell the person to add the two player files from this repository; the format is valid HTML on its own.

## Branches

`main` is the trunk: the foundation every deck starts from, kept small, dependency-free and stable. Branches carry variants for different kinds of deck (for example `webinar`, `keynote`, `training`), each with its own README describing what it changes. A person selects one by naming it in their prompt. Read [docs/DIRECTION.md](docs/DIRECTION.md) before starting a branch so it stays aligned with the trunk.

## Philosophy, in three lines

The future of a slide deck is a single file with only the features you want, built and edited by your own assistant. Nothing should sit between the person and that file: no platform, no account, no export step. A shared, public convention is what lets every assistant produce the same good result.

Maintained by [Couch & Associates](https://couch.associates). MIT licence.
