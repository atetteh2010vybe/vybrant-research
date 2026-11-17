# Vybrant research library

Self-updating research libraries for Vybrant Health and Wellness landing pages.

- `research.json` – every page's research entries (updated automatically each Monday)
- `research-widget.js` – renders a page's library from `research.json`
- `RULES.md` – the editorial rules the weekly update must follow
- `CHANGELOG.md` – what was added and when
- `index.html` – preview of all seven libraries

Elementor snippet (change the page key):

```html
<div data-vybrant-research="bpc-157"></div>
<script src="https://atetteh2010vybe.github.io/vybrant-research/research-widget.js" defer></script>
```

Page keys: `tirzepatide`, `semaglutide`, `sermorelin`, `mots-c`, `bpc-157`, `tb-500`, `bpc-157-kpv`, `epithalon`, `semax`, `nad`.
