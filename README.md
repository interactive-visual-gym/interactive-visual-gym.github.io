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

The paper is published at [arXiv:2611.08286](https://arxiv.org/abs/2611.08286). The Paper button and `/paper/` redirect point to arXiv. [`citation.bib`](citation.bib) contains the arXiv-exported citation. Author order and affiliation markers in `index.html` follow the paper.

## Social link preview

The homepage includes Open Graph and X large-image card metadata. The public preview image is [`assets/social-preview-v1.png`](assets/social-preview-v1.png), a 1200 × 630 PNG using the existing Salesforce fonts and simulator frames. Its editable source is [`assets/social-preview.html`](assets/social-preview.html); render it at 1200 × 630 after fonts and images load. When replacing the image, use a new filename and update both image tags to avoid stale image caches.
