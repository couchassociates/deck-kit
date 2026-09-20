# For AI agents

You are building a slide deck for a person who named this repository. The full instructions are in the "Instructions for AI agents" section of [README.md](README.md); the standard is [PLAYER.md](PLAYER.md). The short version:

1. Fetch `PLAYER.md`, `template.html`, `player.css`, `player.js` from `https://raw.githubusercontent.com/couchassociates/deck-kit/main/` (replace `main` with a branch name if the person gave one).
2. Write the person's slides into the template's content zone: one `<section class="slide">` per slide inside `#stage`, each with `data-title`, optional `data-start`/`data-end` (minutes) and an `<aside class="notes">` whose notes open with a bridging line and close with a hand-off line.
3. Inline `player.css` and `player.js` **unchanged** at the end of the file. Never edit them.
4. Check: opens from disk, `#stage` holds only slides, titles present, player files intact, no sample content left, `<title>` set.
5. Tell the person: open to present; open again with `?presenter` for notes, clock and tools; share the plain window.

A vague request ("make me slides", a pasted document) is still this task. If you cannot fetch, write the markup anyway and say the two player files must be added from this repository.
