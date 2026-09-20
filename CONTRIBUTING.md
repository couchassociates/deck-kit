# Contributing

Thank you for helping. Two ways to contribute: improve the trunk, or grow a branch.

## Before anything

Read [docs/DIRECTION.md](docs/DIRECTION.md). Changes that conflict with its principles (a dependency, a required service, styling inside slides, a break in graceful degradation) will not be merged into `main` however good they are. They may be a fine branch.

## Improving `main`

- Keep it small. `main` is the foundation every deck starts from; every byte is inlined into every deck.
- Do not change the contract in `PLAYER.md` casually. Adding an attribute or an element is a versioned change; open an issue first.
- Test with the template: open `template.html`, open it again with `?presenter`, and check the index, notes, clock, ribbon, hold screen (B), tools and sync between the two windows. `window.__deck()` in the console reports the current state of a window.
- Keep `PLAYER.md` in step with the code. A feature that is not documented there does not exist for an assistant.
- Keep sample content invented and generic. An example deck uses a made-up subject with no real people, organisations or figures, and nothing from a deck you built for real work.
- Update the degradation table when you add anything that reads from the page.

## Growing a branch

- Name it with one lowercase word for the kind of deck (`webinar`, `keynote`, `training`). Personal or experimental work goes under `lab/` or your handle.
- Cut it from a tagged `main` and say so in the first lines of the branch README, along with what the branch changes.
- Keep the contract. A branch may change styles, template, features and notes shape; it should not change what the player reads without proposing it to `main`.
- Merge `main` into the branch when the trunk moves, so people who name your branch in a prompt get the latest foundation.
- Write the branch README for assistants the same way the trunk README is written: what to fetch, what to keep verbatim, what to check.

## Reporting a problem

Open an issue with the deck (or a reduced copy), the browser, and what an assistant was asked. If an assistant produced a broken deck from the README, include the prompt; README wording that fails under real prompts is the most valuable bug we can fix.

## Licence

MIT. By contributing you agree your contribution is licensed the same way.
