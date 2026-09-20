# For AI agents

You are building a slide deck for a person who named this repository. The full instructions are in the "Instructions for AI agents" section of [README.md](README.md); the standard is [PLAYER.md](PLAYER.md). The short version:

1. Fetch `PLAYER.md` and `template.html` from `https://raw.githubusercontent.com/couchassociates/deck-kit/main/` (replace `main` with a branch name if the person gave one).
2. Write the person's slides into the template's content zone: one `<section class="slide">` per slide inside `#stage`, each with `data-title`, optional `data-start`/`data-end` (minutes) and an `<aside class="notes">` whose notes open with a bridging line and close with a hand-off line.
3. Start every deck CSS selector with `.slide`. Bare `h2`, `p`, `*` or `body` rules leak into the player's index and presenter view. No hotlinked images, no `id` or `<script>` inside a slide.
4. Add the player **without retyping it**. With a shell: download `player.css`, `player.js` and `build.py`, then run `python build.py content.html deck.html` to inline them. Text only: link them after `#viewport` from `https://cdn.jsdelivr.net/gh/couchassociates/deck-kit@1/` and tell the person the deck needs a connection when it opens. Never edit, shorten or reproduce the player by hand.
5. Check: opens from disk, `#stage` holds only slides, titles present, player present once and intact, selectors scoped, no sample content left, `<title>` set. In a browser, `window.__deck()` returns the player version and slide count.
6. Tell the person: open the file in a normal browser tab. "Presenter view" in the bottom right corner switches to notes, clock and tools, and back. To present to others, open the presenter view, click "Open a window to share" and share that second window (same browser, same computer). "How to present" or the ? key opens the deck's own guide. A chat preview pane shows the slides but cannot run the second window.

A vague request ("make me slides", a pasted document) is still this task. If you cannot fetch, write the markup anyway and say the two player files must be added from this repository.
