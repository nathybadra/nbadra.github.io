/* ══════════════════════════════════════════════════════════════════
   RECO-LAB · v3 site behaviour
   Language toggle, mobile drawer and bilingual href/src swap, carried
   over from index_v2.9 and adapted to a multipage build: the language
   choice now has to survive navigation between pages, and embedded
   outputs are always requested in embed mode.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var LANG_KEY = 'recolab.lang';

  /* Embedded outputs are versioned so a browser never serves a stale copy
     after an output is regenerated. Bump on every outputs/ change. */
  var BUILD = '2026-08-29r2';

  /* ── Bilingual href / src / label swap ──────────────────────────── */
  function swapBilingual(lang) {
    document.querySelectorAll('a[data-href-en][data-href-es]').forEach(function (a) {
      var href = a.getAttribute('data-href-' + lang);
      if (href) a.setAttribute('href', href);
    });

    /* Outputs are always loaded with ?embed=1 so the source suppresses its
       own header and footer. Without it the output's own site chrome renders
       a second time inside the frame. */
    document.querySelectorAll('iframe[data-href-en][data-href-es]').forEach(function (f) {
      var base = f.getAttribute('data-href-' + lang);
      if (!base) return;
      var src = base + (base.indexOf('?') === -1 ? '?embed=1' : '&embed=1') + '&v=' + BUILD;
      if (f.getAttribute('src') !== src) f.setAttribute('src', src);
      var t = f.getAttribute('data-title-' + lang);
      if (t) f.setAttribute('title', t);
    });

    document.querySelectorAll('[data-label-en][data-label-es]').forEach(function (el) {
      var lbl = el.getAttribute('data-label-' + lang);
      if (lbl) el.setAttribute('aria-label', lbl);
    });

    document.querySelectorAll('[data-text-en][data-text-es]').forEach(function (el) {
      var txt = el.getAttribute('data-text-' + lang);
      if (txt) el.textContent = txt;
    });

    /* Alt text is content, so it follows the language like everything else. */
    document.querySelectorAll('img[data-alt-en][data-alt-es]').forEach(function (img) {
      var a = img.getAttribute('data-alt-' + lang);
      if (a) img.setAttribute('alt', a);
    });
  }

  var langButtons = document.querySelectorAll('.rl-lang button, .rlx-lang button');

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'es') lang = 'es';
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    langButtons.forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    swapBilingual(lang);
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang'));
    });
  });

  var initial = 'es';
  try {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'es') initial = saved;
  } catch (e) {}
  setLang(initial);

  /* ── Mood · light / dark / night ─────────────────────────────────
     The handoff ships a written theme control at the end of the nav and
     a full set of dark tokens. Both were implemented but the control was
     never exposed, on the argument that a dark shell around a white
     analytical figure is worse than no dark mode at all. That argument
     is answered in corrections-2026-08.css instead of avoided: every
     embedded output, matrix, plot and table is given back its own light
     paper, as a card, so the figures stay documents in every mood.

     Night is a third step below dark, same hues, less light.

     The switch writes one attribute on <html>. Nothing is re-rendered
     and nothing is re-measured, so the layout the reader is looking at
     cannot move under them. The globe re-reads its attributes every
     frame, so it repaints in place without reloading its geometry. */
  var MOOD_KEY = 'recolab.mood';
  var MOODS = {
    light: { accent: '#5980a6', deep: '#1d2d3d', bar: '#1d2d3d' },
    dark:  { accent: '#7ea6cc', deep: '#cfe0ee', bar: '#16242f' },
    night: { accent: '#6d93b8', deep: '#b6cde0', bar: '#080f17' }
  };
  var moodButtons = document.querySelectorAll('[data-mood]');
  var globeEl = document.querySelector('reco-globe');

  function setMood(mood) {
    if (!MOODS[mood]) mood = 'night';
    document.documentElement.setAttribute('data-theme', mood);
    moodButtons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-mood') === mood ? 'true' : 'false');
    });
    if (globeEl) {
      globeEl.setAttribute('theme', mood);
      globeEl.setAttribute('accent', MOODS[mood].accent);
      globeEl.setAttribute('deep', MOODS[mood].deep);
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', MOODS[mood].bar);
    try { localStorage.setItem(MOOD_KEY, mood); } catch (e) {}
  }

  moodButtons.forEach(function (b) {
    b.addEventListener('click', function () { setMood(b.getAttribute('data-mood')); });
  });

  if (moodButtons.length) {
    var savedMood = null;
    try { savedMood = localStorage.getItem(MOOD_KEY); } catch (e) {}
    if (!MOODS[savedMood]) {
      /* Noche es el modo declarado del sitio: un lector sin preferencia
         guardada abre en noche en las cuatro páginas, no en el modo del
         sistema operativo. Su elección posterior manda y persiste. */
      savedMood = 'night';
    }
    setMood(savedMood);
  }

  /* ── Mobile drawer ───────────────────────────────────────────────
     Open state lives on data-open rather than a class, so the closed
     drawer is inert markup for a reader who cannot run this: the CSS only
     shows it when the attribute says so, and the nav row it duplicates is
     still in the document above 900px. */
  var burger = document.querySelector('.rl-burger, .rlx-burger');
  var drawer = document.getElementById('rlDrawer');
  if (burger && drawer) {
    var setDrawer = function (open) {
      drawer.setAttribute('data-open', open ? 'true' : 'false');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    burger.addEventListener('click', function () {
      setDrawer(drawer.getAttribute('data-open') !== 'true');
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setDrawer(false); });
    });
    /* A drawer left open across a resize would sit under a nav row that is
       already visible, which reads as two navigations. */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setDrawer(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setDrawer(false);
    });
  }

  /* ── Anchor offset · measured from the live header ───────────────
     The bar changes height between breakpoints and between languages, so
     the anchor offset is read from the element instead of hard-coded. The
     CSS ships a 62px fallback for the no-JS case. */
  var siteHeader = document.querySelector('header[role="banner"]');
  function syncHeaderHeight() {
    if (!siteHeader) return;
    var h = Math.round(siteHeader.getBoundingClientRect().height);
    if (h > 0) document.documentElement.style.setProperty('--rl-hdr-h', h + 'px');
  }
  syncHeaderHeight();
  window.addEventListener('resize', function () {
    clearTimeout(window.__rlHdrT);
    window.__rlHdrT = setTimeout(syncHeaderHeight, 120);
  });
  /* Webfonts land after first paint and can change the bar height. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeaderHeight).catch(function () {});
  }

  /* ── Deep links · land on the section, not where it used to be ───
     A module link from the home page arrives as project-02-housing.html
     #section-har. The browser resolves that hash while the page is still
     parsing: at that moment seven frames are lazy and unmeasured, and the
     fit passes below have not run, so the offset it computes belongs to a
     layout that no longer exists a second later. Observed result was a
     hash set on the URL and the page sitting at scrollY 0.

     The target is therefore re-acquired on a short schedule while the page
     settles, and abandoned the instant the reader takes over -- landing is
     a correction, never a fight with the scroll wheel. */
  var landTimers = [];
  var readerTookOver = false;

  function yieldToReader() { readerTookOver = true; }
  ['wheel', 'touchstart', 'pointerdown'].forEach(function (ev) {
    window.addEventListener(ev, yieldToReader, { passive: true });
  });
  window.addEventListener('keydown', function (e) {
    if (/^(Arrow|Page|Home|End)/.test(e.key) || e.key === ' ') yieldToReader();
  });

  function land() {
    if (readerTookOver) return;
    var id = (location.hash || '').slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    /* auto, not smooth: a correction that animates reads as drift */
    var root = document.documentElement;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    el.scrollIntoView({ block: 'start' });
    root.style.scrollBehavior = prev;
  }

  /* A new target means a new landing, so the reader's veto is lifted and the
     previous schedule is cancelled -- otherwise a stale timer would drag the
     page back to the section the reader just left. */
  function scheduleLanding() {
    landTimers.forEach(clearTimeout);
    landTimers = [];
    readerTookOver = false;
    land();
    [120, 400, 900, 1600, 2600, 3600].forEach(function (ms) {
      landTimers.push(setTimeout(land, ms));
    });
  }

  /* The correction chain exists for one situation only: a page whose
     sections are separated by lazy iframes that are still unmeasured when
     the browser resolves the hash. On a page without them the native
     landing is already correct, and re-running it six times over 3.6
     seconds is not a correction -- it is the page appearing to move on
     its own every time the reader clicks a nav item. That is why it is
     now gated on the embeds actually being there.

     Landing offset is CSS (scroll-margin-top) on every page, embeds or
     not, so nothing depends on this running. */
  var hasLazyEmbeds = document.querySelector('.rl-embed-body iframe') !== null;

  if (hasLazyEmbeds) {
    if (location.hash) {
      scheduleLanding();
      window.addEventListener('load', land);
    }
    /* Same-document navigation between modules never reloads the page, so
       the browser fires hashchange and nothing else: without this, the
       second module link leaves the reader wherever the first one landed. */
    window.addEventListener('hashchange', scheduleLanding);
  }

  /* ── Embedded outputs · narrow-viewport fit ─────────────────────
     Some outputs (dense dashboards) have a hard minimum width. Below it
     the frame would scroll sideways inside the page, which is the broken
     inner-scroll failure. Instead the frame is laid out at its minimum
     width and scaled down to the available space, so the whole output
     stays visible and nothing pans. */
  function fitNarrowEmbeds() {
    document.querySelectorAll('.rl-embed-body[data-min-width]').forEach(function (box) {
      var frame = box.querySelector('iframe');
      if (!frame) return;
      var minW = parseInt(box.getAttribute('data-min-width'), 10);
      var declaredH = parseInt(box.getAttribute('data-height'), 10);
      var avail = box.clientWidth;

      if (!minW || !declaredH) return;

      if (avail >= minW) {
        frame.style.width = '';
        frame.style.height = '';
        frame.style.transform = '';
        frame.style.transformOrigin = '';
        box.style.height = declaredH + 'px';
        return;
      }

      var scale = avail / minW;
      frame.style.width = minW + 'px';
      frame.style.transformOrigin = 'top left';
      frame.style.transform = 'scale(' + scale.toFixed(4) + ')';

      /* Laying the output out narrower makes its content reflow taller, so
         the declared height is only a floor. The real height is read from
         the output once it has rendered; otherwise the surplus is clipped
         and the block looks cut off. */
      var h = declaredH;
      try {
        var d = frame.contentDocument;
        if (d && d.body) {
          /* Embed mode clips the output with overflow-y:hidden, which makes
             scrollHeight report the already-clipped height. Overflow is
             lifted for the measurement only, then put straight back. */
          var de = d.documentElement;
          var prevHtml = de.style.overflowY;
          var prevBody = d.body.style.overflowY;
          de.style.overflowY = 'visible';
          d.body.style.overflowY = 'visible';
          h = Math.max(declaredH, de.scrollHeight, d.body.scrollHeight);
          de.style.overflowY = prevHtml;
          d.body.style.overflowY = prevBody;
        }
      } catch (e) {}

      frame.style.height = h + 'px';
      box.style.height = Math.round(h * scale) + 'px';
    });
  }

  /* ── Embedded outputs · trim the declared height to real content ──
     A frame taller than the output leaves an empty band under the figure.
     When a box names the output's content root, the frame is trimmed to
     what that root actually fills, margin included. Skipped while the
     frame is scaled, since fitNarrowEmbeds owns the height in that case. */
  function fitEmbedHeights() {
    document.querySelectorAll('.rl-embed-body[data-fit-height]').forEach(function (box) {
      var frame = box.querySelector('iframe');
      if (!frame || frame.style.transform) return;

      var sel = box.getAttribute('data-fit-height');
      var floor = parseInt(box.getAttribute('data-min-height'), 10) || 320;

      try {
        var d = frame.contentDocument;
        if (!d || !d.body) return;
        var root = d.querySelector(sel);
        if (!root) return;

        /* Embed mode clips the output with overflow-y:hidden, so both the
           rect of the content root and scrollHeight report the height the
           frame already imposes rather than the height the content wants.
           That is how the FAI explorer lost its last panel: it measured the
           clip, pinned the frame to it, and the clip became permanent.
           Overflow is lifted for the measurement only, then put straight
           back, and the frame is sized to whichever reading is tallest. */
        var de = d.documentElement;
        var prevHtml = de.style.overflowY;
        var prevBody = d.body.style.overflowY;
        de.style.overflowY = 'visible';
        d.body.style.overflowY = 'visible';

        /* The output fills the frame, so scrollHeight can never report
           less than the height the frame already imposes: the trim could
           only ever grow. That is how the FAI explorer kept 1120px for a
           panel that fills 890 and left a 230px white band under it, and
           why switching back from a tall panel never gave the space back.
           The frame is collapsed to its floor for the measurement, so the
           reading is the height the content wants, not the one it was
           given. The collapse and the restore happen inside one frame, so
           nothing repaints in between. */
        var prevFrameH = frame.style.height;
        frame.style.height = floor + 'px';
        void d.body.offsetHeight;

        var cs = d.defaultView.getComputedStyle(root);
        var h = Math.ceil(Math.max(
          root.getBoundingClientRect().bottom + (parseFloat(cs.marginBottom) || 0),
          root.scrollHeight,
          de.scrollHeight,
          d.body.scrollHeight
        ));

        frame.style.height = prevFrameH;
        de.style.overflowY = prevHtml;
        d.body.style.overflowY = prevBody;

        /* An output that stretches to whatever box it is given -- a map,
           a full-bleed canvas -- reports exactly the collapsed height back,
           because its content has no intrinsic height of its own. Trimming
           to that reading would pin every such figure to its floor and cut
           the legend off the bottom. When the measurement comes back at the
           floor, the declared height stays. */
        if (!h || h <= floor + 4) return;

        frame.style.height = h + 'px';
        box.style.height = h + 'px';
      } catch (e) {}
    });
  }

  function fitEmbeds() {
    fitNarrowEmbeds();
    fitEmbedHeights();
  }

  fitEmbeds();
  window.addEventListener('resize', function () {
    clearTimeout(window.__rlFitT);
    window.__rlFitT = setTimeout(fitEmbeds, 150);
  });
  /* Re-measure once each output has actually rendered its content. */
  document.querySelectorAll('.rl-embed-body[data-min-width] iframe').forEach(function (f) {
    f.addEventListener('load', function () {
      fitEmbeds();
      setTimeout(fitEmbeds, 900);
      setTimeout(fitEmbeds, 2400);
    });
  });
  /* Interactive outputs reflow when the viewer changes a filter, so the
     trim follows the output instead of being measured once.

     A MutationObserver alone is not enough. The first measurement lands
     before the output's webfonts have arrived, so the frame was pinned to
     a height the content then outgrew -- the FAI explorer measured 620px
     and settled at 801px, and the difference was clipped. The height is
     therefore re-measured on a short schedule after load, and again
     whenever the output's own body changes size. */
  document.querySelectorAll('.rl-embed-body[data-fit-height] iframe').forEach(function (f) {
    f.addEventListener('load', function () {
      fitEmbedHeights();
      [250, 700, 1500, 3000].forEach(function (ms) {
        setTimeout(fitEmbedHeights, ms);
      });

      try {
        var d = f.contentDocument;
        if (!d || !d.body) return;

        if (typeof MutationObserver !== 'undefined') {
          var t;
          new MutationObserver(function () {
            clearTimeout(t);
            t = setTimeout(fitEmbedHeights, 180);
          }).observe(d.body, { childList: true, subtree: true, attributes: true });
        }

        /* Tab switches inside the output change its height without always
           changing its markup, and webfonts change it without any mutation
           at all. Size is the signal that actually matters. */
        var RO = f.contentWindow && f.contentWindow.ResizeObserver;
        if (RO) {
          var rt;
          new RO(function () {
            clearTimeout(rt);
            rt = setTimeout(fitEmbedHeights, 120);
          }).observe(d.body);
        }

        if (d.fonts && d.fonts.ready) {
          d.fonts.ready.then(function () { fitEmbedHeights(); }).catch(function () {});
        }
      } catch (e) {}
    });
  });

  /* ── Animated outputs · start at the declared speed when in view ─
     The animated series exposes speed buttons and a play control, and
     a receiver in the output accepts rl-autoplay. The host only signals
     intent; the output decides how to honour it. Playback pauses again
     once the section leaves the viewport so it is not running unseen. */
  var autoplayBoxes = document.querySelectorAll('.rl-embed-body[data-autoplay]');
  if (autoplayBoxes.length && 'IntersectionObserver' in window) {
    var send = function (box, msg) {
      var frame = box.querySelector('iframe');
      if (!frame || !frame.contentWindow) return;
      try { frame.contentWindow.postMessage(msg, '*'); } catch (e) {}
    };

    /* The output acknowledges with rl-timeline-ready once its controls
       exist. Until that ack arrives the signal keeps being retried --
       a lazy iframe is typically still loading when its section is
       first reached, so a single fire-and-forget would be lost. */
    var acked = new WeakSet();
    window.addEventListener('message', function (ev) {
      if (!ev.data || ev.data.type !== 'rl-timeline-ready') return;
      autoplayBoxes.forEach(function (box) {
        var f = box.querySelector('iframe');
        if (f && f.contentWindow === ev.source) {
          acked.add(box);
          /* The output confirmed it started, so every retry path can stop. */
          box.__rlPlayed = true;
        }
      });
    }, false);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var box = entry.target;
        var speed = parseFloat(box.getAttribute('data-autoplay')) || 2;

        if (box.__rlTick) { clearInterval(box.__rlTick); box.__rlTick = null; }

        if (!entry.isIntersecting) {
          send(box, { type: 'rl-pause' });
          return;
        }

        if (box.__rlPlayed) {
          send(box, { type: 'rl-autoplay', speed: speed });
          return;
        }

        var attempts = 0;
        box.__rlTick = setInterval(function () {
          attempts++;
          send(box, { type: 'rl-autoplay', speed: speed });
          if (acked.has(box)) box.__rlPlayed = true;
          if (box.__rlPlayed || attempts > 24) {
            clearInterval(box.__rlTick);
            box.__rlTick = null;
          }
        }, 500);
      });
    }, { threshold: 0.35 });

    autoplayBoxes.forEach(function (box) {
      io.observe(box);
      var f = box.querySelector('iframe');
      if (f) {
        f.addEventListener('load', function () {
          /* A language switch swaps the src, so this is a brand-new document
             with a fresh receiver. The played flag has to be cleared or the
             retry loop is skipped and the EN twin never starts. */
          box.__rlPlayed = false;
          acked.delete(box);

          if (!visibleEnough(box)) return;

          var speed = parseFloat(box.getAttribute('data-autoplay')) || 2;
          send(box, { type: 'rl-autoplay', speed: speed });

          /* The receiver boots on DOMContentLoaded inside the frame, which
             can land after this load event, so the signal is retried until
             the output acknowledges it. */
          if (box.__rlTick) clearInterval(box.__rlTick);
          var attempts = 0;
          box.__rlTick = setInterval(function () {
            attempts++;
            send(box, { type: 'rl-autoplay', speed: speed });
            if (acked.has(box)) box.__rlPlayed = true;
            if (box.__rlPlayed || attempts > 24) {
              clearInterval(box.__rlTick);
              box.__rlTick = null;
            }
          }, 500);
        });
      }
    });

    /* Geometry fallback. IntersectionObserver only reports when the page is
       actually compositing, so a backgrounded or non-painting context never
       fires it. Measuring the rect on scroll covers that case and costs
       nothing once the section has played. */
    function visibleEnough(box) {
      var r = box.getBoundingClientRect();
      if (r.height <= 0) return false;
      var vis = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
      return vis / r.height >= 0.35;
    }

    var scrollPending = false;
    function checkGeometry() {
      autoplayBoxes.forEach(function (box) {
        var speed = parseFloat(box.getAttribute('data-autoplay')) || 2;
        var visible = visibleEnough(box);
        if (visible) {
          /* Sent on every visible check, not only the first: leaving the
             section pauses playback, so coming back has to resume it. The
             output ignores this once the viewer has touched its controls. */
          send(box, { type: 'rl-autoplay', speed: speed });
        } else if (box.__rlSeen) {
          send(box, { type: 'rl-pause' });
        }
        box.__rlSeen = visible;
      });
    }
    window.addEventListener('scroll', function () {
      if (scrollPending) return;
      scrollPending = true;
      setTimeout(function () { scrollPending = false; checkGeometry(); }, 200);
    }, { passive: true });

    /* Last-resort poll. Neither IntersectionObserver nor scroll events fire
       in a context that is not painting, so a bounded timer guarantees the
       section still starts once it is on screen. It stops as soon as every
       animated block has played. */
    /* The poll stays alive: it is the only resume path in contexts where
       neither IntersectionObserver nor scroll events fire. It idles cheaply
       once every block has started. */
    var polls = 0;
    setInterval(function () {
      polls++;
      var allPlayed = true;
      autoplayBoxes.forEach(function (b) { if (!b.__rlPlayed) allPlayed = false; });
      /* fast while waiting for first play, relaxed afterwards */
      if (allPlayed && polls % 4 !== 0) return;
      checkGeometry();
    }, 400);
  }

  /* ── Methodological note · closed until asked for ────────────────
     The note is the last thing on a project page and it is reference,
     not argument, so it ships closed: the navy header alone, and the
     three modules opening together on click. A module can still be
     collapsed on its own once the block is open; closing the last one
     does not close the block, because the reader who opened it asked to
     see the note, not to have it fold itself away.

     is-collapsible is set here, never in the markup: without JS the
     modules stay in the flow and every summary is still clickable, so
     nothing is hidden from a reader who cannot run this. */
  document.querySelectorAll('.rl-method').forEach(function (methodBlock) {
    var methodToggle = methodBlock.querySelector('.rl-method-toggle');
    var methodMods = methodBlock.querySelectorAll('.rl-method-mod');
    if (!methodToggle || !methodMods.length) return;

    methodBlock.classList.add('is-collapsible');

    var setOpen = function (open) {
      methodBlock.classList.toggle('is-open', open);
      methodToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      methodMods.forEach(function (m) { m.open = open; });
    };

    methodToggle.addEventListener('click', function () {
      setOpen(!methodBlock.classList.contains('is-open'));
    });

    setOpen(false);
  });

  /* ── Embedded outputs · re-measure on language change ───────────
     Frame heights are declared in CSS, so nothing here resizes the
     host. This only nudges an output to relayout after its own copy
     changes length, which otherwise leaves a blank band. */
  document.addEventListener('click', function (e) {
    if (!(e.target && e.target.closest && e.target.closest('[data-lang]'))) return;
    setTimeout(function () {
      document.querySelectorAll('.rl-embed-body iframe').forEach(function (f) {
        try { f.contentWindow.postMessage({ type: 'tf-embed-remeasure' }, '*'); } catch (err) {}
      });
    }, 220);
  }, true);
})();
