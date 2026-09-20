# Working on deck-kit

This file is for an AI agent developing this repository (as opposed to an agent building a deck from it, which should read README.md and AGENTS.md).

Read first, in this order: `docs/DIRECTION.md` (what we believe and the principles that decide changes), `PLAYER.md` (the contract every deck follows), `docs/ENGINEERING.md` (architecture, sync design, testing, quirks, decision log, roadmap).

Rules:

- `main` stays dependency-free and single-file capable. Never add a library, a build step or a required service.
- The player reads only what `PLAYER.md` describes. Adding to the contract is a versioned decision; open an issue and update `PLAYER.md` in the same change.
- The player never styles the inside of a slide. It owns placement and chrome; the deck owns appearance.
- Everything must degrade gracefully when an attribute, notes, fonts, sync or storage are missing. Update the degradation table in `PLAYER.md` when you add anything that reads from the page.
- Test in a browser with two windows (one plain, one `?presenter`), served over http. `window.__deck()` and synthetic `PointerEvent`s let you verify sync without a mouse. Run `node --check player.js` after edits.
- Keep `template.html` a conformance example: it must show a slide with everything, one with no timing, one with no notes, and one with no attributes at all.
- Keep the README's agent instructions true. If you change what an agent must fetch or do, change the README and `AGENTS.md` in the same commit, and re-run a vague-prompt test with at least one assistant.
- Branches: one lowercase word per deck type; `lab/` or a handle for experiments; cut from a tagged `main`; state in the branch README what changed and from which tag.
- Copy in prose: no em dashes, no filler phrases, no restating headings. Write for the model that lands on the page and the person who skims it.

Maintainer facts: the repository belongs to the `couchassociates` organisation. A separate `couch-associates` user account exists and redirects here; do not create anything under it. Releases are tags on `main` (`v1.0.0` is the first).
