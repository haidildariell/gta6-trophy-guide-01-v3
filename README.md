# Leonida Legend v3 — GTA VI Trophy Guide

[![Leonida Legend v3 on make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01) [![Rank](https://make.fun/badge/gta6-trophy-guide-01/haidildariell/gta6-trophy-guide-01-v3/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01) [![Reward](https://make.fun/badge/gta6-trophy-guide-01/haidildariell/gta6-trophy-guide-01-v3/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

A complete, fully offline trophy tracker and guide for the official 55-trophy PlayStation 5 list of Grand Theft Auto VI — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze, 28 PSN-hidden. Every one of the 55 trophies has a full guide written in our own words, split into 3–6 numbered steps, and **every step cites its source by number** (167 of 167 steps cited). Where sources disagree, both readings are shown side by side with our call — 6 disputes, including the Chapter 1 balcony meditation behind *Positive Mental Attitude*.

## Features

- **Tracker (3-pane ledger)** — searchable, filterable trophy list (kind chips, grade filter, PSN-hidden, disputed, missable, not-earned), a full detail pane per trophy (official description, missable warning box, dispute panel, your-count counter for targeted trophies, per-trophy notes), and a Next Up rail in roadmap order plus the sources for the selected guide.
- **Audit strip** — live counts computed from the data itself: official-list integrity, steps cited, guides citing a source, trophies backed by 2+ sources, missable tiers and dispute count.
- **Roadmap** — 7 stages (S1 Chapter 1 → S7 Platinum) with per-stage progress bars and points (Platinum 300, Gold 90, Silver 30, Bronze 15; 1,350 total).
- **Missables board** — Possibly missable / Watch / Unconfirmed tiers, each flag backed by a note tied to the official description, plus all disputes in one place.
- **Sources tab** — all 16 numbered sources (PowerPyx, PSNProfiles, Exophase, PlayStationTrophies.org, TrueTrophies, OutputLag, KeenGamer, eGamers, GTA-Zone, GTA Vibes, Push Square, IGN and more), each with its read date (20 Nov 2026) and a live "cited by N of 55 guides" count.
- **Spoiler shield** — hidden story trophies you have not earned show as SEALED in the list, the detail pane and Next Up.
- **Your progress, your browser** — earned flags, counters and notes persist in localStorage; Export downloads a JSON backup, Import restores it, Reset clears it. Demo mode: open `?demo=1` for a sample mid-run save.

## Run it

```sh
node serve.ts            # serves app/ on http://localhost:8080
```

Then open http://localhost:8080 in any browser. No build step, no network: the app loads nothing external (system font stack only; source URLs are printed as text, never fetched).

Hand-in check (what `main.ts` does): copies `app/` and `screenshots/` to the output dir and writes `dossier.json` with the vendored make.fun library.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Data & sources

Trophy names, descriptions and grades in `app/data/trophies.json` are the official PlayStation list, unchanged (including "T**s Ass Drug Money" and "In The Beginning…"). Guides, in-short summaries and roadmap staging are original writing for this entry. Each guide step carries `cite` ids into the top-level `sources` array; the structured fields are `inShort`, `steps`, `sources`, `missable`/`missableNote` and, where guides disagree, `dispute` — while the `guide` field itself is the full readable guide text. Steps that sources have not confirmed are labelled unconfirmed in the guide rather than invented.

## License

MIT — see `LICENSE`. No Rockstar logo or artwork is used.
