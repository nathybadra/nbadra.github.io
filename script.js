/* ════════════════════════════════════════════
   NATHALY BADRA — PORTFOLIO
   script.js
   ════════════════════════════════════════════ */

/* ── Language toggle ── */
function setLang(lang) {
  var enEls = document.querySelectorAll('.en');
  var esEls = document.querySelectorAll('.es');
  var btnEn = document.getElementById('btn-en');
  var btnEs = document.getElementById('btn-es');

  if (lang === 'es') {
    enEls.forEach(function(el) { el.style.display = 'none'; });
    esEls.forEach(function(el) { el.style.display = 'inline'; });
    if (btnEn) btnEn.classList.remove('active');
    if (btnEs) btnEs.classList.add('active');
    document.documentElement.lang = 'es';
  } else {
    enEls.forEach(function(el) { el.style.display = 'inline'; });
    esEls.forEach(function(el) { el.style.display = 'none'; });
    if (btnEn) btnEn.classList.add('active');
    if (btnEs) btnEs.classList.remove('active');
    document.documentElement.lang = 'en';
  }
}

/* ── Dashboard embed ──
 *
 * Root cause of previous failure:
 *   #dash-wrap had no height defined (or height:0 inherited),
 *   so the iframe's height:100% resolved to 0px.
 *   Additionally, dash-ph was visible and overlaid the invisible iframe.
 *
 * Fix:
 *   - #dash-box has explicit height: 640px in CSS.
 *   - #dash-wrap is position:absolute; inset:0 so it fills the box.
 *   - #dash-ph is position:absolute; inset:0 and gets hidden immediately
 *     on click (not waiting for iframe.onload).
 *   - iframe gets width:100%; height:100% and fills dash-wrap completely.
 */
function loadDash() {
  var dashboardUrl = 'https://nathybadra.github.io/conflict-urban-vulnerability/conflict_dashboard.html';
  var ph   = document.getElementById('dash-ph');
  var wrap = document.getElementById('dash-wrap');
  var btn  = document.getElementById('dash-load-btn');

  if (!wrap) return;

  /* Prevent double-clicking */
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'not-allowed';
  }

  /* ── Step 1: show wrap container IMMEDIATELY ──
     This is the critical fix. dash-wrap must be visible BEFORE
     the iframe is appended so height:100% resolves to the box height. */
  wrap.style.display = 'block';

  /* ── Step 2: hide placeholder IMMEDIATELY ──
     Don't wait for iframe.onload — it creates a visual race condition. */
  if (ph) {
    ph.classList.add('hidden');
    ph.style.display = 'none';
  }

  /* ── Step 3: build iframe ── */
  var iframe = document.createElement('iframe');
  iframe.src              = dashboardUrl;
  iframe.title            = 'Conflict & Urban Vulnerability Dashboard';
  iframe.style.cssText    = 'width:100%;height:100%;border:none;display:block;background:#fff;';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  iframe.setAttribute('allowfullscreen', '');

  /* ── Failsafe: if iframe doesn't load in 12s, show fallback ── */
  var loaded = false;

  var failSafe = setTimeout(function() {
    if (!loaded) {
      iframe.remove();
      showFallback(ph, dashboardUrl);
    }
  }, 12000);

  iframe.onload = function() {
    loaded = true;
    clearTimeout(failSafe);
    /* Ensure container stays visible (belt-and-suspenders) */
    wrap.style.display = 'block';
    if (ph) ph.style.display = 'none';
  };

  iframe.onerror = function() {
    loaded = true; /* prevent failsafe double-firing */
    clearTimeout(failSafe);
    iframe.remove();
    showFallback(ph, dashboardUrl);
  };

  /* ── Step 4: inject iframe ── */
  wrap.appendChild(iframe);
}

/* ── Fallback: replaces the placeholder with a direct link ── */
function showFallback(ph, dashboardUrl) {
  var wrap = document.getElementById('dash-wrap');
  if (wrap) wrap.style.display = 'none';

  if (!ph) return;

  ph.style.display = 'flex';
  ph.classList.remove('hidden');

  /* Clear placeholder content and show a simple fallback link */
  ph.innerHTML =
    '<p style="font-size:0.9rem;color:#555;margin-bottom:12px;">' +
      '<span class="en">Dashboard could not be embedded.</span>' +
      '<span class="es">El dashboard no pudo cargarse aquí.</span>' +
    '</p>' +
    '<a ' +
      'href="' + dashboardUrl + '" ' +
      'target="_blank" ' +
      'rel="noopener noreferrer" ' +
      'class="btn-primary"' +
    '>' +
      '<span class="en">Open dashboard ↗</span>' +
      '<span class="es">Abrir dashboard ↗</span>' +
    '</a>' +
    '<p style="font-size:0.75rem;color:#aaa;margin-top:8px;">' +
      '<span class="en">Opens in a new tab</span>' +
      '<span class="es">Se abre en una nueva pestaña</span>' +
    '</p>';

  /* Re-apply current language to the new nodes */
  var currentLang = document.documentElement.lang || 'en';
  setLang(currentLang);
}

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', function() {
  /* Default language: English */
  setLang('en');

  /* Smooth nav highlight on scroll (optional quality-of-life) */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');

  function onScroll() {
    var scrollY = window.scrollY + 80;
    sections.forEach(function(section) {
      if (
        scrollY >= section.offsetTop &&
        scrollY < section.offsetTop + section.offsetHeight
      ) {
        navLinks.forEach(function(link) {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('nav-active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
});
