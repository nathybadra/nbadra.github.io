# RECO-LAB

Applied urban research laboratory focused on urban economics, housing, displacement,
resilience and territorial recovery.

**[nbadra.com](https://nbadra.com)**

Spanish version of this document: [`README.es.md`](README.es.md)

---

## Overview

RECO-LAB studies how urban systems absorb pressure — demographic, residential and
functional — and what happens to territories when that absorption capacity is exceeded.

The laboratory works on territories under stress: places where population moves faster
than housing supply responds, where infrastructure exists nominally but is not
functionally reachable, and where conflict reorganises the economic geography of a
region. Its object is not the shock itself but the territorial condition the shock
leaves behind.

RECO-LAB produces territorial readings, not data deliveries. Each published case study
states what it measures, on which territorial base, over which period, and under which
declared limits. The public site is the presentation layer of that work; the analytical
layer that supports it is maintained privately.

## Research Focus

- **Urban economics** — housing markets under demographic and territorial stress, and
  the relationship between price formation and absorption capacity.
- **Housing** — the gap between completed supply and effective demand, read at
  subnational resolution rather than as a national aggregate.
- **Displacement and mobility** — population flows read as territorial movement rather
  than as administrative categories, including flows whose administrative definition
  does not match their analytical meaning.
- **Resilience** — the functional capacity a territory retains under sustained pressure,
  as distinct from the infrastructure it nominally holds.
- **Territorial recovery** — the conditions under which a territory regains absorption
  capacity, and the segmentation of territories into comparable regimes for monitoring
  and prioritisation.
- **Public management and evidence systems** — indicator systems that declare their own
  evidentiary status, so institutional users can see what is observed, what is derived
  and what is modelled.

## Analytical Framework

RECO-LAB develops five analytical modules. They are **successive analytical layers, not
components of a single formula.** Each retains its own sources, units, territorial base
and declared limits. Where one module informs another, it does so as a reading — there
is no arithmetic integration across the five, and none is claimed.

### IVUB — Urban Vulnerability Baseline

A composite territorial reading of urban vulnerability under conflict conditions,
combining exposure, fragility and territorial pressure at first-level administrative
resolution. Published as a territorial map, an integrated dashboard and a conflict
intensity series.

### TMD — Territorial Mobility Dynamics

Population flows read as territorial movement: arrivals, returns, internal displacement,
and the destinations where those flows concentrate. The module separates the
administrative label of a flow from its territorial effect.

### HAR — Housing Absorption Ratio

The relationship between completed housing units and effective demand, by subdistrict
and by year. Reported with its sensitivity scenarios and with a permanent caveat: in a
territory under stress, a high ratio may signal demand contraction rather than available
supply. The ratio is a diagnostic, not a supply indicator.

### FAI — Functional Accessibility Index

The distance between the infrastructure a territory nominally holds and the access its
population effectively retains under pressure. FAI is a **methodological,
proxy-informed sensitivity instrument** with declared sources and limits. It is not a
certified measurement, and it is published with its own data-sources tab so that the
evidentiary status of each input is visible.

### UPI — Urban Pressure Index

A matrix relating accumulated territorial pressure to available functional capacity.
Its result is a **segmentation of territories into regimes — not a ranking and not a
single score.** Territories with comparable pressure can fall into different regimes
because their capacity to absorb that pressure differs. Component weights and internal
thresholds are not published.

## Featured Projects

### Project 01 · IVUB — Urban Vulnerability Under Conflict

A territorial vulnerability reading for **Israel and Lebanon, 2021–2026**, built across
**14 first-level administrative units**.

The project separates two evidentiary registers that are commonly conflated: recorded
lethal conflict and reported material event activity. They are drawn from different
sources, carry different coverage properties, and are **never summed together** on the
page.

Published as an interactive territorial map, an integrated dashboard and an animated
conflict-intensity timeline, in Spanish and English.

Institutional evidence: armed-conflict event and fatality records, global event-media
monitoring, gridded population estimates, and open administrative boundaries.

### Project 02 · Housing Pressure and Urban Dynamics in Israel

Urban absorption under conflict-induced demographic stress, at **subdistrict
resolution** across **15 subdistricts**, with **2024** as the declared reference year.

The project covers five connected readings:

- **Demographic mobility** — arrivals and returns by country of origin, and the
  territorial destinations where they concentrate.
- **Housing absorption** — completed units against effective demand, by subdistrict.
- **Rental dynamics** — modelled rent and sale variation across the reference period.
- **Functional accessibility** — the gap between nominal infrastructure and effective
  access, as an interactive explorer.
- **Territorial pressure regimes** — the segmentation of subdistricts by pressure and
  capacity.

This project is a reading of Israel. It is **not** framed as an Israel–Lebanon
comparison.

Institutional evidence: national statistical office, central bank, national immigration
agency, parliamentary research service, civil-defence authority, and the national
geographic portal.

## Research Questions

**Project 01**

- How does the territorial geography of vulnerability change after a structural break in
  conflict activity?
- Where does lethal burden concentrate relative to where material activity concentrates,
  and do those two geographies coincide?
- Which territorial units carry composite vulnerability that is not explained by conflict
  intensity alone?

**Project 02**

- Does housing supply respond where demographic pressure actually lands, or elsewhere?
- When a territory records a high absorption ratio, is that available capacity or
  contracting demand?
- Does the infrastructure a territory holds correspond to the access its population
  retains under pressure?
- Which territories share a pressure–capacity regime, and therefore warrant comparable
  monitoring?

## Key Public Findings

The findings below are those published on the site and supported by the canonical
analysis.

**Project 01**

- A structural break is confirmed at **October 2023**: about **74 %** of material
  conflict activity concentrates after that point. The break is described on a monthly
  basis, not as an exact daily cut.
- Lethal burden is concentrated in Lebanon, which accounts for **6,622 of 8,059**
  recorded conflict fatalities — **82 %** of the total.
- Lebanon's southern border axis carries the highest composite vulnerability in the
  study area: **Nabatiyeh (IVUB 0.858)**, followed by **South Lebanon (0.801)**.

**Project 02**

- The absorption deficit concentrates in two metropolitan cores: **Tel Aviv** completes
  **6,864** units against an effective demand of **11,045**, and **Jerusalem** **2,552**
  against **4,024**.
- **A high absorption ratio does not always mean greater capacity.** Golan records the
  deepest absorption deficit of the series (**HAR 0.173**) while simultaneously showing
  high vacancy — together these describe a demand problem, not a supply surplus.
- Observed cumulative returns for **2021–2024** total **67,000**, with the United States
  the largest single country of origin.

Figures are valid for the reference period declared on the page that publishes them.

## Data & Evidence

Sources are listed at institutional level. Each figure credits its sources on the page
that publishes it, and the full evidentiary framing is in `metodos.html`.

**Project 01**

- UCDP — armed conflict event and fatality records
- GDELT (BigQuery) — reported material event activity
- WorldPop — gridded population estimates
- geoBoundaries — administrative boundaries

**Project 02**

- Israel Central Bureau of Statistics
- Bank of Israel
- The Jewish Agency
- Knesset Research and Information Center
- Home Front Command (Pikud HaOref)
- GOVMAP — national geographic portal

Cartographic basemaps and their attribution are carried inside each published map.

Inputs are classified by evidentiary status — observed, derived, modelled or
proxy-informed. That classification is maintained in the private analytical layer and is
surfaced on the site wherever a figure depends on it. Modelled and proxy-informed inputs
are never presented as observed measurements.

## Analytical Workflow

The public architecture of the work, at high level:

```
evidence acquisition
   → harmonization
      → territorial processing
         → derived indicators
            → validation and sensitivity
               → visualization
                  → publication
```

Each stage carries its own acceptance criteria. Evidence that cannot be attributed to a
declared source does not reach the derived-indicator stage; a derived indicator that
cannot state its evidentiary status does not reach publication.

## Public Outputs

Twenty-four processed visualizations are published across the two case studies, in
Spanish and English:

- **Interactive maps** — territorial vulnerability, arrival flows, return flows, and
  return pressure by destination.
- **Dashboards** — the integrated IVUB dashboard, in full and embedded form.
- **Temporal visualizations** — animated conflict-intensity timeline, and animated rent
  variation.
- **Territorial comparisons** — housing absorption against market pressure.
- **Regime matrices** — the territorial pressure–capacity segmentation.
- **Analytical tables** — subdistrict absorption with its regime classification.
- **Interactive explorer** — functional accessibility, with its own sources tab.

Every published output is reachable from a public page. There are no orphan outputs in
this repository.

## Public Repository Structure

```
/
├── index.html
├── metodos.html
├── project-01-ivub.html
├── project-02-housing.html
├── README.md
├── README.es.md
├── CNAME
├── .gitignore
│
├── assets/
│   ├── css/
│   ├── js/
│   ├── img/
│   ├── cv/
│   └── vendor/
│
└── outputs/
    ├── p1_ivub/
    │   ├── es/
    │   └── en/
    │
    └── p2_israel/
        ├── es/
        └── en/
```

All four pages are bilingual. Spanish and English are at real parity within the same
document and switch in place; there is no separate per-language build.

## Methods & Publication Criteria

- Results distinguish **observed, derived, modelled and proxy-informed** evidence. These
  are not interchangeable and are not presented as equivalent.
- Each analytical module declares its own scope, territorial base, reference period and
  limitations.
- Sources that measure different things are reported separately and never aggregated
  into a single figure.
- A figure is published only when its evidentiary status can be stated.

The complete interpretation framework is in **`metodos.html`**. No reading on this site
is intended to be used without it.

## Reproducibility and Research Governance

The public repository contains the **presentation layer and approved processed
outputs**.

Research notebooks, source datasets, internal traceability records and calculation
workflows are maintained in a **private research environment**. This separation is a
methodological decision, not an omission: the site publishes results and the conditions
under which they hold, not the calculation layer.

Public outputs pass a **publication gate** covering evidence, privacy, licensing and
methodological scope. An output that cannot state its sources, or whose evidentiary
status cannot be declared, is not published.

Published outputs are aggregated or already-processed figures. They contain no raw
records, no event-level geodata and no model weights.

## Run Locally

The site is static and has no build step. Serve the repository root with any HTTP
server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

Opening the files directly from disk does not work on all pages: some embeds are loaded
over HTTP and require a served origin.

## Scope and Limitations

- **Territorial resolution differs by module.** Project 01 works with first-level
  administrative units; Project 02 works at subdistrict level. Readings are not
  interchangeable across those bases.
- **Several inputs are modelled, derived or proxy-informed** rather than directly
  observed. Where this is the case, the page declares it.
- **UPI and FAI are methodological, proxy-informed analytical instruments.** They are
  designed to compare territories within the universe analysed and do not constitute
  official or certified measurements.
- **UPI regimes are diagnostic categories, not policy instructions.** The analysis
  identifies a territorial condition; acting on it requires institutional assessment.
- **Calibration is relative** to the universe analysed and to the reference period
  declared on each page. Results do not transfer to other countries or periods without
  recalibration.
- **The five modules are not arithmetically integrated.** No combined score across IVUB,
  TMD, HAR, FAI and UPI is published, and none should be inferred.
- **Coverage effects are not trends.** Where a period is only partially covered, the
  page says so; an apparent decline at the edge of a series may be coverage, not change.

## Citation

> Badra, N. *RECO-LAB — Applied Urban Research Laboratory.* Available at
> https://nbadra.com

To cite a specific reading, cite the case-study page together with the reference period
declared on it.

No DOI is assigned to this work.

## License and Attribution

**No formal license has been adopted for this repository.** The wording below states
current practice and is deliberately conservative; it is not a license grant.

- **Own code** — the site's stylesheets and frontend scripts are published for
  consultation. No redistribution license is granted.
- **Own content** — text, analysis and figures are published for consultation and
  citation **with attribution**. They are not released for redistribution as a dataset.
- **External sources** — public statistical, geographic and institutional sources retain
  the terms of their own providers. They are credited on the page that uses them and in
  `metodos.html`.
- **Cartography** — basemaps and their attribution are carried inside each published map
  and remain subject to their providers' terms.
- **Vendor libraries** — third-party libraries under `assets/vendor/` retain their
  original licenses and attribution headers.

For any use beyond consultation and attributed citation, please ask first.
