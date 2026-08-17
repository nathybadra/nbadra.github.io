# RECO-LAB

Applied urban research portfolio focused on urban economics, housing, displacement, resilience and territorial recovery.

Spanish version: [`README.es.md`](README.es.md)

## Pages

- `index.html` — Home
- `metodos.html` — Methods and publication criteria
- `project-01-ivub.html` — Project 01, Urban Vulnerability Index under Conflict (IVUB)
- `project-02-housing.html` — Project 02, housing pressure and urban dynamics in Israel

## Functional Accessibility Explorer (FAI)

`outputs/p2_israel/{en,es}/functional_accessibility_explorer.html` and its embedded variant under `.../embed/` are the interactive FAI explorers linked from Project 02.

They support the Functional Accessibility Index section by allowing readers to explore the gap between nominal infrastructure capacity and effective functional access under territorial pressure.

## Published data

The files shown under `outputs/` are aggregated or already-processed public visualizations used by the site.

Analysis notebooks, source datasets, internal traceability files and calculation workflows are private and are not part of this public repository.

The UPI and FAI modules referenced on the site are methodological and proxy-informed analytical instruments. They should be interpreted within the scope, assumptions and limitations declared in `metodos.html`; they are not presented as official certified measurements.

## Run locally

This is a static site. Any simple HTTP server from the repository root works, for example:

```bash
python -m http.server 8000
```

Then open:

```
http://localhost:8000
```
