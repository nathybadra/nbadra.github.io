# RECO-LAB

Applied urban research portfolio — urban economics, housing, displacement, resilience and
territorial recovery.

## Pages

- `index.html` — home
- `metodos.html` — methods and publication criteria
- `project-01-ivub.html` — Project 01, Urban Vulnerability Index under Conflict (IVUB)
- `project-02-housing.html` — Project 02, housing pressure and urban dynamics in Israel
- `RECO_LAB_GLOBAL_CURRENT.html` — reference export, identical to `index.html`

## Functional Accessibility Explorer (FAI)

`outputs/p2_israel/{en,es}/functional_accessibility_explorer.html` (and the embedded variant
under `.../embed/`) is the interactive FAI explorer linked from Project 02. It supports the
Functional Accessibility Index (FAI) section of that page, letting readers explore the gap
between nominal infrastructure capacity and functional, effective access under territorial
pressure.

## About the published data

The data and figures shown under `outputs/` are aggregated or already-processed
visualizations intended for public reading. **Analysis notebooks, source datasets and the
internal calculation methodology are not part of this repository and are not published.**
The UPI and FAI modules referenced on the site are methodological / proxy-informed
instruments with declared sources and limits — not certified measurements and not a
mathematically integrated index. Scope and limits are detailed in `metodos.html`.

## Run locally

This is a static site; any simple HTTP server from the repo root works, for example:

```bash
python -m http.server 8000
```

then open `http://localhost:8000`.

---

## Nota en español

Este repositorio publica únicamente el portfolio público de RECO-LAB: las páginas del sitio,
sus estilos, scripts, imágenes y las visualizaciones ya procesadas bajo `outputs/` que esas
páginas enlazan. **Los notebooks de análisis, los datasets fuente y la trazabilidad interna
del cálculo son privados y no forman parte de este repositorio.** Los módulos UPI y FAI son
instrumentos metodológicos / proxy-informados, no mediciones certificadas ni un índice
matemáticamente integrado; el detalle de alcance y límites está en `metodos.html`. El
explorador `functional_accessibility_explorer.html` es el FAI explorer interactivo del
Proyecto 02.
