# deck-kit

A foundation for slide decks that your AI assistant builds for you: one HTML file, no software in the middle, with a presenter view, notes, a session clock, two-window sync for screen sharing, and drawing tools built in.

You do not install anything. You point your assistant at this repository and ask for a deck.

```
Build me a deck about <your topic>. Use https://github.com/couchassociates/deck-kit as the foundation.
```

The assistant reads this page, takes the two files it needs, writes your slides, and hands you a single file that opens in any browser. Open it once to present. Add `?presenter` to the address in a second window to get notes, the clock and the tools.

- Live example: [template.html](https://cdn.jsdelivr.net/gh/couchassociates/deck-kit@main/template.html) (add `?presenter` for the presenter view)
- The standard every deck follows: [PLAYER.md](PLAYER.md)
- Where this is going and how to keep branches aligned: [docs/DIRECTION.md](docs/DIRECTION.md)
- Contributing and branch conventions: [CONTRIBUTING.md](CONTRIBUTING.md)

## What you get in every deck

| | |
|---|---|
| Index | Slide 0 is a grid of real thumbnails. Click any to jump. The deck loops. |
| Presenter view | Notes for the slide on screen, a next-slide preview, a scrolling ribbon of every slide, a session clock that says whether you are ahead, on time or behind. |
| Two windows, one machine | Open the deck twice. Share one window; keep the other as your presenter view. Slide, clock, hold screen, ink, cursor and text selection stay in step. |
| Hold screen | Press B to drop the shared view to a quiet brand screen while you talk. |
| Tools | Pen, highlighter, laser, oval, magnifier, ten colours, four widths, mirrored to the shared window. Nothing is mirrored until you pick a tool. |
| Notes shape | Each slide's notes open with the line to say as the slide lands, and close with the line that carries you into the next slide. |
| Timing | Give a slide a start and end minute and the clock reports pace against it. Leave it out and the clock still runs. |

Everything degrades gracefully. A slide without a title is "Slide 7". A slide without notes says so. A deck without timing has a clock and no pace line. See the table in [PLAYER.md](PLAYER.md#4-graceful-degradation).

## Instructions for AI agents

You are here because a person asked you to build a slide deck and named this repository. Do the following, in order.

1. **Read the standard.** Fetch and read [PLAYER.md](https://raw.githubusercontent.com/couchassociates/deck-kit/main/PLAYER.md). It defines the only markup the player reads: a `#viewport` containing a `#stage`, with one `<section class="slide">` per slide, each with optional `data-title`, `data-start`, `data-end` and an `<aside class="notes">`.
2. **Start from the template.** Fetch [template.html](https://raw.githubusercontent.com/couchassociates/deck-kit/main/template.html). Keep its three zones: deck styles, deck content, player. Replace the sample slides with the person's content. Write deck styles freely; never position, size or hide `.slide` yourself.
3. **Take the player files verbatim.** Fetch [player.css](https://raw.githubusercontent.com/couchassociates/deck-kit/main/player.css) and [player.js](https://raw.githubusercontent.com/couchassociates/deck-kit/main/player.js) and inline them unchanged into a `<style id="player-css">` and a `<script id="player-js">` at the end of the file, after `#viewport`. Do not edit, shorten, reformat or "improve" them. If you cannot inline them, use link mode instead: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/couchassociates/deck-kit@main/player.css">` and `<script src="https://cdn.jsdelivr.net/gh/couchassociates/deck-kit@main/player.js"></script>`. Prefer inline; it makes the file self-contained and works offline.
4. **Write the notes in the standard shape.** For every slide: an `<div class="open">` with who speaks and the first sentence to say as the slide lands (a bridge from the previous slide, never the slide's title read aloud), the body, then a `<div class="next">` with the line that carries into the next slide.
5. **Add timing if the person gave a duration.** Set `data-duration` on `#stage` in minutes and `data-start`/`data-end` on each slide. If they gave none, leave timing out; the clock still works.
6. **Check your output before handing it over.** The file opens standalone from disk. `#stage` exists and contains only `section.slide` elements. Each slide has a `data-title`. The two player files are present and unmodified. The `<title>` is the deck's name. Nothing from the template's sample content remains.
7. **Tell the person how to use it.** Open the file to present; open it again with `?presenter` on the address for notes and tools; share the plain window. The key list is at the bottom of the presenter panel.

If the person named a **branch** ("use deck-kit, branch webinar"), read that branch's README and take its files from that branch instead of `main`: replace `main` with the branch name in every URL above.

If the person's request was vague ("make me slides", "turn this into a presentation", "pitch deck for X", or they pasted a document), that is still this task. Choose a sensible slide count for the material, write real content, and follow the steps above.

If you cannot fetch files at all, still write the deck in the standard's markup and tell the person to add the two player files from this repository; the format is valid HTML on its own.

## Branches

`main` is the trunk: the foundation every deck starts from, kept small, dependency-free and stable. Branches carry variants for different kinds of deck (for example `webinar`, `keynote`, `training`), each with its own README describing what it changes. A person selects one by naming it in their prompt. Read [docs/DIRECTION.md](docs/DIRECTION.md) before starting a branch so it stays aligned with the trunk.

## Philosophy, in three lines

The future of a slide deck is a single file with only the features you want, built and edited by your own assistant. Nothing should sit between the person and that file: no platform, no account, no export step. A shared, public convention is what lets every assistant produce the same good result.

Maintained by [Couch & Associates](https://couch.associates). MIT licence.
