/* ═══════════════════════════════════════════════════════════════════
   RESPONSIVE · SEGUNDA PASADA · 29 ago 2026
   Acompaña a `assets/css/responsive-2-2026-08-29.css`. Retirar los dos
   ficheros revierte la segunda pasada entera.

   NO TOCA DATOS. No lee, no escribe y no deriva ninguna cifra. Sólo
   actúa sobre dos atributos de presentación de los SVG ya publicados
   (`font-size`) y sobre la afordancia de desplazamiento de su caja.
   Ni un punto, ni una geometría, ni una clasificación cambian.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Cuerpo mínimo REAL en pantalla, en píxeles css. Por debajo de esto
     una etiqueta de territorio deja de ser legible en un teléfono. */
  var MIN_PX = 10.5;

  /* Techo de crecimiento. Los rótulos de la matriz están colocados a
     mano; medido, por encima de +55% empiezan a tocarse entre sí. Vale
     más una etiqueta algo pequeña que dos superpuestas. */
  var MAX_MULT = 1.55;

  var BOXES = '.rl-matrix-plot, .rl-fig-plot';

  /* ── Escala tipográfica dentro del lienzo ─────────────────────────
     Un SVG con viewBox se dibuja escalando TODO, texto incluido. Si el
     lienzo declara 1240 unidades y en pantalla mide 309px, un rótulo
     escrito a 15,5 unidades se ve a 3,9px. Aquí se recalcula ese cuerpo
     EN UNIDADES DE USUARIO para que su tamaño óptico no baje del
     mínimo. El valor original queda guardado en `data-fs0` y se
     restituye exacto en cuanto el ancho vuelve a permitirlo. */
  function scaleText(svg) {
    var r = svg.getBoundingClientRect();
    if (!r.width) return;

    var vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/);
    var vbw = parseFloat(vb[2]);
    if (!vbw) return;

    var k = vbw / r.width;           /* unidades de usuario por píxel css */
    var want = MIN_PX * k;           /* cuerpo necesario, en unidades      */

    var nodes = svg.querySelectorAll('[font-size]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var stored = n.getAttribute('data-fs0');
      if (stored === null) {
        stored = n.getAttribute('font-size');
        n.setAttribute('data-fs0', stored);
      }
      var base = parseFloat(stored);
      if (!base) continue;
      /* nunca por debajo del original, nunca por encima del techo */
      var next = Math.min(base * MAX_MULT, Math.max(base, want));
      n.setAttribute('font-size', next.toFixed(2));
    }
  }

  /* ── Paneo explícito ──────────────────────────────────────────────
     Sólo para lo que aún no entra tras adaptar. Se anuncia con texto,
     se puede recorrer con teclado y queda expuesto a lectores de
     pantalla como región desplazable. Lo que no se hace nunca es
     recortar en silencio, que es como estaba. */
  function announcePan(box) {
    var over = (box.scrollWidth - box.clientWidth) > 4;

    if (!over) {
      box.setAttribute('data-pan', '0');
      box.removeAttribute('tabindex');
      box.removeAttribute('aria-label');
      box.removeAttribute('data-pan-label');
      return;
    }

    var en = (document.documentElement.lang || 'es').toLowerCase().indexOf('en') === 0;
    var label = en
      ? 'Scroll sideways to see the whole matrix'
      : 'Desplazamiento horizontal para ver la matriz completa';

    box.setAttribute('data-pan', '1');
    box.setAttribute('data-pan-label', label);
    box.setAttribute('tabindex', '0');
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', label);
  }

  function run() {
    var boxes = document.querySelectorAll(BOXES);
    for (var i = 0; i < boxes.length; i++) {
      var svg = boxes[i].querySelector('svg');
      if (svg) scaleText(svg);
      announcePan(boxes[i]);
    }
  }

  /* Se planifica con setTimeout y no con requestAnimationFrame: en un
     documento oculto -pestania en segundo plano, iframe fuera de
     pantalla- el navegador no entrega frames, y el ajuste no llegaba
     a ejecutarse nunca. */
  var timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(run, 90);
  }

  function boot() {
    run();
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('orientationchange', schedule, { passive: true });
    /* el conmutador de idioma reescribe los rótulos del SVG y cambia
       html[lang]; el aviso de paneo tiene que seguirlo */
    try {
      new MutationObserver(schedule).observe(document.documentElement, {
        attributes: true, attributeFilter: ['lang']
      });
    } catch (e) {}
    /* las fuentes web cambian el ancho medido de los rótulos */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule).catch(function () {});
    }
    [200, 700].forEach(function (ms) { setTimeout(schedule, ms); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
