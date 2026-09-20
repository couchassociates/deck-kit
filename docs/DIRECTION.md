# Direction

This document records why deck-kit exists and what keeps it coherent as people branch it. Read it before opening a branch or proposing a change to `main`.

## The belief

Slide decks made with AI will not need intermediate software. Not PowerPoint, not a web platform, not an export pipeline. A person will ask their own assistant for a deck, and the result will be one file, on their machine, containing exactly the features they want and nothing else. Assistants can already do this today. In two years they will do it without effort. What they still benefit from is a shared convention, so that a deck built by one assistant behaves like a deck built by another, and so that the person presenting has the same keys, the same notes shape and the same presenter view every time.

deck-kit is that convention plus one reference implementation. The convention is [PLAYER.md](../PLAYER.md). The implementation is `player.css` and `player.js`. The template shows both in use.

## What it is and is not

It is a **standard an assistant can build against by link**. A person names the repository in a prompt; the assistant reads the README, takes the files it needs, and produces a finished deck. There is no product, no service and nothing to install.

It is not a harness. A harness is the machinery that runs an assistant (its loop, tools, permissions, memory). deck-kit is what the assistant is pointed at. It is not a platform either: it holds no decks, no accounts, no data.

It will not be monetised. It exists so that anyone can get from a decent deck to an excellent one with one URL.

## Principles that decide changes to `main`

1. **One file, no dependencies.** A deck must open from disk in a browser with no network and no build step. `main` never adds a library, a font requirement, a server, or a service. Link mode via a CDN is a convenience, never a requirement.
2. **The standard is small and the player reads only the standard.** The player reads `#stage`, `section.slide`, four attributes on a slide, a handful on the stage, and `aside.notes`. Nothing else. Adding to the contract is a bigger decision than adding a feature.
3. **Everything degrades gracefully.** Any attribute may be missing. A slide with nothing but content still presents. Fonts may fail to load. Sync may be unavailable. The deck must never break; it should quietly do less.
4. **The player never styles the inside of a slide.** Deck styles belong to the deck. The player owns placement of slides and everything outside them.
5. **Agents first, people second, on the page.** The README is written so that a model landing on it knows exactly what to emit, including when the person's prompt was vague. People get the short version at the top.
6. **Presenter over spectator.** Features earn their place by helping the person deliver the talk: notes that bridge slides, a clock that reports pace, tools that reach the shared window. Decoration and transitions do not.
7. **Verbatim player files.** Assistants must not edit `player.css` or `player.js` when building a deck. Improvements go through this repository so every deck benefits.

## How branches fit

`main` is the trunk and stays general. A branch is a variant for a kind of deck: a longer keynote, a training deck with exercises, a webinar with a co-presenter, a lightning talk with the tools switched off. A branch may change the template, the deck styles, the default notes shape, the feature set and its README. It should not change the contract in PLAYER.md without proposing the change to `main` first, because a deck that only works on one branch defeats the purpose.

Naming: one lowercase word that says the kind of deck (`webinar`, `keynote`, `training`, `board`, `pitch`). Experiments and personal work go under a prefix (`lab/`, `couch/`) so plain names stay meaningful. Each branch README states in its first lines what it changes from `main` and which `main` tag it was cut from. Merge `main` into a branch when the trunk moves.

A branch earns promotion into `main` when its change is useful to every kind of deck and keeps the principles above.

## Roadmap for `main`

- A `data-features` attribute on `#stage` to switch modules on or off (ink, clock, ribbon, sync, hold screen), so an assistant can produce a stripped deck for a five-minute update and a full one for a keynote.
- An in-place text edit for the person presenting (click a line, fix a word, save), because the first request after a deck exists is "let me fix this myself".
- A conformance check an assistant can run against its own output.
- Print and PDF that respect the slide size.

Things deliberately out of scope for `main`: Markdown authoring, animation frameworks, PPTX export, multi-machine sync over a server, themes as a marketplace.

## Origin

deck-kit was extracted from a real deck built for a live session at Couch & Associates in September 2026, where the content and the player were separated so the content could change daily while the presenter tooling stayed stable. That separation is the whole design: content changes, the foundation does not.
