# Interactive Visual Gym

Project website: https://interactive-visual-gym.salesforceairesearch.com/

This repository publishes the project’s redesign page at the site root. It includes the
interaction demos, leaderboard, and technical illustrations; historical homepages and
design-review pages are excluded.

## Preview locally

```bash
python -m http.server 8000
```

Open http://localhost:8000/. GitHub Pages publishes the root of `main`.

## Updating the website

Edit `index.html` for the page, `demo-slides/` for interaction demonstrations,
`leaderboard/` and `data/leaderboard.json` for results, and `technical/` for technical illustrations.

Initial source: `hellomuffin/ive-benchmark`, `docs/redesign/`, commit `584ed5548b8a6eafc91b71cdbc2e61443bf930ff`.
The shared leaderboard data and favicon were copied alongside it; only deployment paths
and indexing metadata changed.

The current paper is served at [`paper/interactive-visual-gym.pdf`](paper/interactive-visual-gym.pdf). Update it from the compiled arXiv/Overleaf version when publishing paper changes. Author order and affiliation markers in `index.html` follow the paper.
