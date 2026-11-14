# Weekly research update rules

These rules govern the automatic Monday update of `research.json`. They exist because new
entries go live on Vybrant Health and Wellness landing pages **without human review**.

## What the update may change
- It may **only add** study entries to `research.json`, bump `updated`, and append to `CHANGELOG.md`.
- It never edits or removes existing entries, page headings, filters, `research-widget.js`,
  `validate.py`, `sources.json` or this file. Removals happen only when Alfred asks.

## Eligible sources
- Peer-reviewed articles indexed in PubMed (must have a PMID), published in the last 60 days
  and not already in the file (match on PMID, DOI or title).
- Official FDA, HHS or Federal Register documents about compounding status of a listed peptide or GLP-1.
- Not eligible: preprints, press releases, news, blogs, vendor or clinic sites, conference abstracts,
  retracted or "expression of concern" papers, letters/comments/editorials, case reports with < 5 patients,
  papers in journals on predatory/hijacked lists or without an abstract.

## Limits
- Max per page per week: see `sources.json` (2 for GLP-1 pages, 3 for peptide pages).
- Priority: human RCT > meta-analysis/systematic review > human observational > animal > cell.
- When unsure whether a paper qualifies or how to label it, **skip it** and list it as "held back" in the summary.

## How to write an entry
- Fields: `id` (slug), `cats` (existing filter keys of that page only), `study` (first author "et al." or
  trial name), `meta` ("YYYY · Journal abbrev."), `title` (the paper's real title), `studied` (who/what, incl.
  sample size and species), `finding` (one neutral sentence from the abstract), `limit` (one sentence, required),
  `design` (see badge table), `badge`, `url` (`https://pubmed.ncbi.nlm.nih.gov/PMID/`), `pmid`, `added`
  (today, YYYY-MM-DD), `auto: true`.
- Plain language, 8th-grade reading level, past tense, no hype. Never write cure, guarantee, miracle,
  "proven to", dosing, protocols, or stacking. Report what the paper found, not what patients will get.
- Animal and cell findings must name the species/model in `studied` and say "not tested in people" in `limit`
  unless humans were studied.

## Badge and design labels
| Study type | `design` example | `badge` |
|---|---|---|
| Human randomized trial | "Human randomized trial" | dark |
| Meta-analysis / systematic review | "Systematic review" | dark |
| Human observational / small human study | "Small human study" | gold |
| Animal study | "Animal study" | tint |
| Cell / lab study | "Cell study" | tint |
| FDA / HHS / Federal Register | "Regulatory record" | dashed |

On the BPC-157 & KPV page, prefix `design` with the peptide: "KPV · Animal study".

## Before publishing
Run `python3 validate.py`. If it fails, fix the new entries or drop them. Never push a failing file.
