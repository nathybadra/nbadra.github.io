# RECO-LAB

Portfolio de investigación urbana aplicada enfocado en economía urbana, vivienda, desplazamiento, resiliencia y recuperación territorial.

Versión principal en inglés: [`README.md`](README.md)

## Páginas del sitio

- `index.html` — Inicio
- `metodos.html` — Métodos y criterios de publicación
- `project-01-ivub.html` — Página pública del caso de estudio del Proyecto 01
- `project-02-housing.html` — Página pública del caso de estudio del Proyecto 02

## Explorador de Accesibilidad Funcional (FAI)

`outputs/p2_israel/{en,es}/functional_accessibility_explorer.html` y su variante embebida bajo `.../embed/` corresponden al explorador interactivo FAI enlazado desde el Proyecto 02.

El explorador acompaña la sección del Índice de Accesibilidad Funcional y permite observar la brecha entre capacidad nominal de infraestructura y acceso funcional efectivo bajo presión territorial.

## Datos publicados

Los archivos publicados bajo `outputs/` son visualizaciones agregadas o ya procesadas utilizadas por el sitio.

Los notebooks de análisis, datasets fuente, archivos internos de trazabilidad y flujos de cálculo son privados y no forman parte de este repositorio público.

Los módulos UPI y FAI referenciados en el sitio son instrumentos analíticos metodológicos y proxy-informados. Deben interpretarse dentro del alcance, supuestos y límites declarados en `metodos.html`; no se presentan como mediciones oficiales certificadas.

## Ejecutar localmente

Este es un sitio estático. Puede probarse con cualquier servidor HTTP simple desde la raíz del repositorio, por ejemplo:

```bash
python -m http.server 8000
```

Luego abrir:

```
http://localhost:8000
```
