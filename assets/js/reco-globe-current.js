/* ══════════════════════════════════════════════════════════════════
   RECO-LAB · <reco-globe> · global-current build

   Same web component as assets/js/reco-globe.js (itself ported from
   the RECO-LAB shell design system): same orthographic
   projection, same hypsometric relief, same 18 great-circle flows, same
   city set, same light/dark palettes. Two defects are fixed here, and
   they are the reason the globe was rendering as a black sphere:

   1 · The geometry was fetched with d3.json(). Opened from disk — which
       is how this review file is opened — fetch() on a file:// URL is
       blocked by CORS, the promise rejects, and tick() never runs. The
       ocean circle had already been appended by then with no fill of its
       own, so SVG painted it with its default: solid black. A globe with
       no continents on a black disc is exactly that failure.
       The atlas now arrives as a plain script global (RECO_ATLAS), which
       file:// does allow, and d3.json() stays only as a fallback.

   2 · The ocean circle now carries a real fill from the moment it is
       created. Even if the geometry never arrives, the hero shows a
       tinted sphere in the current mood instead of a black hole.

   The globe is decorative: the territorial scope it draws is carried as
   real text in the strip underneath it.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  const SIZE = 720;
  const ATLAS = 'assets/vendor/countries-110m.json';

  const P = {
    israel: [34.85, 31.9], lebanon: [35.5, 33.9], syria: [38.3, 35.1],
    argentina: [-58.4, -34.6], venezuela: [-66.9, 10.5], colombia: [-74.1, 4.7],
    spain: [-3.7, 40.4], germany: [13.4, 52.5], turkey: [32.8, 39.9], chile: [-70.6, -33.4],
    usa: [-74.0, 40.7], miami: [-80.2, 25.8], france: [2.35, 48.85], australia: [151.2, -33.9],
    brazil: [-46.6, -23.5]
  };
  const FLOWS = [
    ["venezuela", "colombia"], ["venezuela", "argentina"], ["venezuela", "chile"],
    ["syria", "lebanon"], ["lebanon", "turkey"], ["lebanon", "germany"],
    ["israel", "spain"], ["argentina", "spain"],
    ["argentina", "usa"], ["brazil", "miami"], ["argentina", "israel"], ["brazil", "israel"],
    ["france", "israel"], ["usa", "israel"], ["germany", "argentina"], ["australia", "israel"],
    ["spain", "brazil"], ["australia", "argentina"]
  ];
  const NODES = ["israel", "lebanon", "argentina", "venezuela"];
  const CITIES = [
    [35.5, 33.9], [36.3, 33.5], [37.2, 36.2], [34.8, 32.1], [35.2, 31.8], [34.45, 31.5],
    [35.9, 31.95], [44.4, 33.3], [44.0, 36.2], [51.4, 35.7], [44.2, 15.35], [29.0, 41.0],
    [37.4, 37.1], [31.2, 30.05], [46.7, 24.7], [55.3, 25.3],
    [139.7, 35.7], [135.5, 34.7], [140.9, 38.3],
    [37.6, 55.75], [30.3, 59.9], [39.7, 47.2], [60.6, 56.8],
    [30.5, 50.45], [36.2, 50.0], [30.7, 46.5], [24.0, 49.8], [35.0, 48.6],
    [-46.6, -23.5], [-43.2, -22.9], [-47.9, -15.8], [-60.0, -3.1], [-38.5, -12.97],
    [-58.4, -34.6], [-64.2, -31.4], [-60.7, -32.9], [-68.8, -32.9], [-65.2, -26.8],
    [-66.9, 10.5], [-74.1, 4.7], [-70.6, -33.4], [-3.7, 40.4], [13.4, 52.5], [23.7, 38.0],
    [36.8, -1.3], [32.6, 15.5]
  ];

  /* Palettes of the design system, unchanged. "night" is the dark palette taken
     one step down: same hues, less light, so the sphere sits inside the
     night ground instead of glowing on top of it. */
  const PALETTE = {
    light: {
      grat: "#aec6d0", border: "rgba(173,88,63,0.5)",
      low: "#c2cd99", mid: "#e0cd9c", high: "#c39a68",
      shade: "rgba(255,250,236,0.22)", vignette: "rgba(74,62,46,0.32)", shadow: "rgba(88,74,54,0.42)",
      oceanIn: "#dcecf1", oceanOut: "#93b7c8", atm: "rgba(140,185,208,0.5)", rim: "rgba(255,255,255,0.5)"
    },
    dark: {
      grat: "rgba(255,255,255,0.09)", border: "rgba(196,112,80,0.45)",
      low: "#4b5c3f", mid: "#6b6141", high: "#8a6a45",
      shade: "rgba(255,240,214,0.16)", vignette: "rgba(0,0,0,0.55)", shadow: "rgba(0,0,0,0.55)",
      oceanIn: "#1b3040", oceanOut: "#0c1721", atm: "rgba(90,140,175,0.3)", rim: "rgba(180,210,235,0.22)"
    },
    night: {
      grat: "rgba(255,255,255,0.07)", border: "rgba(168,96,68,0.40)",
      low: "#3a4832", mid: "#544c34", high: "#6d5438",
      shade: "rgba(255,240,214,0.11)", vignette: "rgba(0,0,0,0.68)", shadow: "rgba(0,0,0,0.7)",
      oceanIn: "#132434", oceanOut: "#060d15", atm: "rgba(70,110,145,0.24)", rim: "rgba(150,185,215,0.16)"
    }
  };

  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(cb) {
    let waited = 0;
    (function poll() {
      if (window.d3 && window.topojson) return cb();
      waited += 40;
      if (waited > 20000) return;          /* give up quietly, keep the strip */
      setTimeout(poll, 40);
    })();
  }

  /* The atlas as a script global first, the network only as a fallback. */
  function atlas() {
    if (window.RECO_ATLAS) return Promise.resolve(window.RECO_ATLAS);
    return window.d3.json(ATLAS);
  }

  class RecoGlobe extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      this.style.display = "block";
      this.setAttribute('aria-hidden', 'true');
      this.innerHTML = '<svg viewBox="0 0 ' + SIZE + ' ' + SIZE + '" width="100%" height="100%" style="display:block;overflow:visible"></svg>';
      ready(() => this.boot());
    }
    disconnectedCallback() { cancelAnimationFrame(this._raf); }

    boot() {
      const d3 = window.d3;
      const A = () => this.getAttribute("accent") || "#5980a6";
      const D = () => this.getAttribute("deep") || "#1d2d3d";
      const G = () => this.getAttribute("gold") || "#c8901f";
      const SP = () => parseFloat(this.getAttribute("speed") || "1");
      const PAL = () => PALETTE[this.getAttribute("theme")] || PALETTE.light;

      const svg = d3.select(this.querySelector("svg"));
      const R = SIZE / 2 - 22;
      const proj = d3.geoOrthographic().translate([SIZE / 2, SIZE / 2]).scale(R).rotate([50, -14, 0]);
      const path = d3.geoPath(proj);

      const defs = svg.append("defs");
      const shade = defs.append("radialGradient").attr("id", "recoShade")
        .attr("cx", "34%").attr("cy", "26%").attr("r", "52%");
      shade.append("stop").attr("offset", "0%").attr("class", "s0");
      shade.append("stop").attr("offset", "70%").attr("stop-color", "rgba(255,255,255,0)");
      const vig = defs.append("radialGradient").attr("id", "recoVig")
        .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
      vig.append("stop").attr("offset", "62%").attr("stop-color", "rgba(0,0,0,0)");
      vig.append("stop").attr("offset", "100%").attr("class", "v1");
      const f = defs.append("filter").attr("id", "recoRelief")
        .attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
      const fd = f.append("feDropShadow").attr("dx", 0.8).attr("dy", 1.2).attr("stdDeviation", 1.1);

      const oc = defs.append("radialGradient").attr("id", "recoOcean")
        .attr("cx", "36%").attr("cy", "30%").attr("r", "82%");
      /* Seeded from the current mood, not left empty: an unresolved stop
         renders black, which is how the sphere used to fail. */
      const seed = PAL();
      oc.append("stop").attr("offset", "0%").attr("class", "o0").attr("stop-color", seed.oceanIn);
      oc.append("stop").attr("offset", "100%").attr("class", "o1").attr("stop-color", seed.oceanOut);
      const atm = defs.append("radialGradient").attr("id", "recoAtm")
        .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
      atm.append("stop").attr("offset", "84%").attr("stop-color", "rgba(255,255,255,0)");
      atm.append("stop").attr("offset", "91%").attr("class", "a1").attr("stop-color", seed.atm);
      atm.append("stop").attr("offset", "100%").attr("stop-color", "rgba(255,255,255,0)");
      const rim = defs.append("radialGradient").attr("id", "recoRim")
        .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
      rim.append("stop").attr("offset", "88%").attr("stop-color", "rgba(255,255,255,0)");
      rim.append("stop").attr("offset", "97%").attr("class", "r1").attr("stop-color", seed.rim);
      rim.append("stop").attr("offset", "100%").attr("stop-color", "rgba(255,255,255,0)");

      const ocean = svg.append("circle")
        .attr("cx", SIZE / 2).attr("cy", SIZE / 2).attr("r", R)
        .attr("fill", "url(#recoOcean)")
        .attr("stroke", seed.grat).attr("stroke-width", 0.6);

      const gGrat = svg.append("g"), gLand = svg.append("g").attr("filter", "url(#recoRelief)"),
        gShade = svg.append("g"), gArc = svg.append("g"), gLive = svg.append("g"), gNode = svg.append("g");
      gShade.append("circle").attr("cx", SIZE / 2).attr("cy", SIZE / 2).attr("r", R)
        .attr("fill", "url(#recoShade)").attr("pointer-events", "none");
      gShade.append("circle").attr("cx", SIZE / 2).attr("cy", SIZE / 2).attr("r", R)
        .attr("fill", "url(#recoVig)").attr("pointer-events", "none");
      gShade.append("circle").attr("cx", SIZE / 2).attr("cy", SIZE / 2).attr("r", R)
        .attr("fill", "url(#recoRim)").attr("pointer-events", "none");

      const grat = d3.geoGraticule10();
      /* Deterministic phases: a reduced-motion still frame should not be a
         different picture on every load. */
      const interps = FLOWS.map((f2, i) => ({ i: d3.geoInterpolate(P[f2[0]], P[f2[1]]), phase: ((i * 37) % 100) / 100 }));

      atlas().then(topo => {
        const countries = window.topojson.feature(topo, topo.objects.countries).features;
        countries.forEach((c, i) => {
          const ctr = d3.geoCentroid(c);
          const lat = Math.abs(ctr[1]);
          const noise = ((i * 2654435761) % 1000) / 1000;
          c.__t = Math.min(1, Math.max(0, lat / 68 * 0.78 + noise * 0.3));
        });

        const t0 = performance.now();
        let turned = 0, last = t0;

        const tick = (now) => {
          const accent = A(), deep = D(), gold = G(), speed = SP(), pal = PAL();
          const el = still ? 3.4 : (now - t0) / 1000;
          if (!still) {
            turned += (now - last) / 1000 * 3.2 * speed;
            last = now;
          }
          proj.rotate([50 - turned, -14, 0]);

          ocean.attr("stroke", pal.grat);
          oc.select(".o0").attr("stop-color", pal.oceanIn);
          oc.select(".o1").attr("stop-color", pal.oceanOut);
          atm.select(".a1").attr("stop-color", pal.atm);
          rim.select(".r1").attr("stop-color", pal.rim);
          shade.select(".s0").attr("stop-color", pal.shade);
          vig.select(".v1").attr("stop-color", pal.vignette);
          fd.attr("flood-color", pal.shadow).attr("flood-opacity", 0.75);

          const tint = t => t < 0.5
            ? d3.interpolateRgb(pal.low, pal.mid)(t / 0.5)
            : d3.interpolateRgb(pal.mid, pal.high)((t - 0.5) / 0.5);

          gGrat.selectAll("path").data([grat]).join("path")
            .attr("d", path).attr("fill", "none").attr("stroke", pal.grat).attr("stroke-width", 0.5);

          gLand.selectAll("path").data(countries).join("path")
            .attr("d", path).attr("fill", d => tint(d.__t))
            .attr("stroke", pal.border).attr("stroke-width", 0.5);

          const arcs = [], live = [];
          interps.forEach((fl) => {
            const pts = [];
            for (let s = 0; s <= 1.0001; s += 0.02) pts.push(fl.i(s));
            arcs.push({ type: "LineString", coordinates: pts });
            const t = (el * 0.16 * speed + fl.phase) % 1.35;
            if (t <= 1) {
              const a = Math.max(0, t - 0.22), seg = [];
              for (let s = a; s <= t; s += 0.012) seg.push(fl.i(s));
              if (seg.length > 1) live.push({ geo: { type: "LineString", coordinates: seg }, head: fl.i(t) });
            }
          });

          gArc.selectAll("path").data(arcs).join("path")
            .attr("d", path).attr("fill", "none").attr("stroke", accent)
            .attr("stroke-width", 0.9).attr("stroke-opacity", 0.35);

          gLive.selectAll("path").data(live).join("path")
            .attr("d", d => path(d.geo)).attr("fill", "none").attr("stroke", gold)
            .attr("stroke-width", 1.7).attr("stroke-linecap", "round").attr("stroke-opacity", 0.95);

          const center = [-proj.rotate()[0], -proj.rotate()[1]];
          const visible = c => d3.geoDistance(c, center) < Math.PI / 2 - 0.03;
          gLive.selectAll("circle").data(live.filter(d => visible(d.head))).join("circle")
            .attr("cx", d => proj(d.head)[0]).attr("cy", d => proj(d.head)[1])
            .attr("r", 2.4).attr("fill", gold);

          gNode.selectAll("circle.city").data(CITIES.filter(visible)).join(
            e => e.append("circle").attr("class", "city")
          ).attr("cx", d => proj(d)[0]).attr("cy", d => proj(d)[1]).attr("r", 1.5)
            .attr("fill", accent).attr("fill-opacity", 0.9);

          const nodes = NODES.map(n => P[n]).filter(visible);
          const pulse = still ? 1 : 1 + Math.sin(el * 1.6) * 0.35;
          gNode.selectAll("g").data(nodes).join(
            enter => { const g = enter.append("g"); g.append("circle").attr("class", "h"); g.append("circle").attr("class", "c"); return g; }
          ).each(function (d) {
            const g = d3.select(this), xy = proj(d);
            g.select(".h").attr("cx", xy[0]).attr("cy", xy[1]).attr("r", 5 * pulse)
              .attr("fill", "none").attr("stroke", deep).attr("stroke-width", 0.9).attr("stroke-opacity", 0.6);
            g.select(".c").attr("cx", xy[0]).attr("cy", xy[1]).attr("r", 2.6).attr("fill", deep);
          });

          /* A mood change has to repaint whether or not the loop is
             running. requestAnimationFrame does not fire in a tab that is
             not compositing, and it never fires under reduced motion, so
             relying on the next frame to pick the new palette up leaves
             a light-palette sphere sitting on a night page. */
          this._repaint = () => tick(performance.now());

          /* One frame is the whole animation when motion is reduced. */
          if (still) return;
          this._raf = requestAnimationFrame(tick);
        };
        this._raf = requestAnimationFrame(tick);
      }).catch(function () { /* no geometry: the sphere keeps its ocean, the strip keeps the scope */ });
    }

    static get observedAttributes() { return ['theme', 'accent', 'deep']; }
    attributeChangedCallback() { if (this._repaint) this._repaint(); }
  }
  if (!customElements.get("reco-globe")) customElements.define("reco-globe", RecoGlobe);
})();
