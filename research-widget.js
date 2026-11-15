/*!
 * Vybrant research library widget
 * Renders a page's research library from research.json.
 * Usage (Elementor HTML block):
 *   <div data-vybrant-research="bpc-157"></div>
 *   <script src="https://atetteh2010vybe.github.io/vybrant-research/research-widget.js" defer></script>
 */
(function () {
  'use strict';
  if (window.__vybrantResearchLoaded) return;
  window.__vybrantResearchLoaded = true;

  var BASE = (function () {
    var s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/[^\/]*$/, '') : 'https://atetteh2010vybe.github.io/vybrant-research/';
  })();
  var DATA_URL = BASE + 'research.json?v=' + Math.floor(Date.now() / 3600000);
  var NEW_DAYS = 30;

  var CSS = [
    '.vr{font-family:"Instrument Sans",Arial,sans-serif;color:#141414;padding:0 20px clamp(56px,8vw,104px);box-sizing:border-box}',
    '.vr *{box-sizing:border-box}',
    '.vr-in{max-width:1240px;margin:0 auto}',
    '.vr-eyebrow{margin:0 0 10px;font-size:13px;font-weight:600;letter-spacing:.07em;color:#8A2433}',
    '.vr-h2{margin:0 0 14px;font-size:clamp(34px,5vw,60px);line-height:1.04;font-weight:500;letter-spacing:-.035em;max-width:900px;color:#141414}',
    '.vr-intro{margin:0 0 26px;max-width:800px;font-size:19px;line-height:1.5;color:#5C5852}',
    '.vr-filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}',
    '.vr-f{min-height:44px;padding:0 16px;border-radius:999px;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;background:#FFFFFF;color:#141414;border:1px solid #DDD6CB}',
    '.vr-f[aria-pressed="true"]{background:#141414;color:#FFFFFF;border-color:#141414}',
    '.vr-f:focus-visible,.vr-s:focus-visible,.vr-a:focus-visible,.vr-reset:focus-visible{outline:2px solid #8A2433;outline-offset:2px}',
    '.vr-bar{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;justify-content:space-between;margin-bottom:20px}',
    '.vr-sw{flex:1 1 320px;max-width:480px;display:flex;flex-direction:column;gap:6px}',
    '.vr-sl{font-size:14px;font-weight:600}',
    '.vr-s{height:50px;border-radius:999px;border:1px solid #DDD6CB;background:#FFFFFF;padding:0 20px;font-family:inherit;font-size:16px;color:#141414;width:100%}',
    '.vr-count{margin:0;font-size:15px;color:#5C5852}',
    '.vr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(320px,100%),1fr));gap:14px;align-items:stretch}',
    '.vr-card{display:flex;flex-direction:column;background:#FFFFFF;border-radius:24px;padding:22px;box-shadow:0 1px 2px rgba(20,20,20,.05)}',
    '.vr-top{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:14px}',
    '.vr-study{display:inline-block;background:#F5F3EF;border-radius:999px;padding:5px 11px;font-size:13px;font-weight:600}',
    '.vr-new{display:inline-block;background:#8A2433;color:#FFFFFF;border-radius:999px;padding:4px 9px;font-size:11px;font-weight:600;letter-spacing:.04em}',
    '.vr-meta{font-size:13px;color:#5C5852}',
    '.vr-title{margin:0 0 8px;font-size:19px;line-height:1.2;font-weight:500;letter-spacing:-.01em;color:#141414}',
    '.vr-p{margin:0 0 8px;font-size:14px;line-height:1.5;color:#5C5852}',
    '.vr-p strong{color:#141414}',
    '.vr-p .vr-lim{color:#8A2433}',
    '.vr-foot{margin-top:auto;padding-top:10px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between}',
    '.vr-b{display:inline-block;border-radius:999px;padding:5px 11px;font-size:12px;font-weight:600}',
    '.vr-b-dark{background:#141414;color:#FFFFFF;border:1px solid #141414}',
    '.vr-b-gold{background:#E0B284;color:#141414;border:1px solid #E0B284}',
    '.vr-b-tint{background:#F5EDE2;color:#6E1C29;border:1px solid #E8D5C4}',
    '.vr-b-dashed{background:#FFFFFF;color:#5C5852;border:1px dashed #A8A196}',
    '.vr-a{font-weight:600;font-size:15px;color:#8A2433;text-decoration:underline}',
    '.vr-a:hover{color:#5A1520}',
    '.vr-empty{background:#FFFFFF;border-radius:24px;padding:28px;text-align:center;color:#5C5852}',
    '.vr-reset{background:none;border:0;padding:0;font:inherit;color:#8A2433;font-weight:600;text-decoration:underline;cursor:pointer}',
    '.vr-upd{margin:18px 0 0;font-size:13px;color:#5C5852}'
  ].join('\n');

  function injectCSS() {
    if (document.getElementById('vr-styles')) return;
    var st = document.createElement('style');
    st.id = 'vr-styles';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = String(text);
    return e;
  }
  function safeUrl(u) {
    return /^https:\/\/[^\s"'<>]+$/i.test(String(u || '')) ? String(u) : null;
  }
  function daysSince(iso) {
    var t = Date.parse(iso);
    return isNaN(t) ? 9999 : (Date.now() - t) / 86400000;
  }
  function fmtDate(iso) {
    var t = Date.parse(iso + 'T12:00:00');
    if (isNaN(t)) return iso;
    return new Date(t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function renderCard(s) {
    var card = el('article', 'vr-card');
    var top = el('div', 'vr-top');
    top.appendChild(el('span', 'vr-study', s.study));
    if (s.meta) top.appendChild(el('span', 'vr-meta', s.meta));
    if (s.auto && daysSince(s.added) <= NEW_DAYS) top.appendChild(el('span', 'vr-new', 'NEW'));
    card.appendChild(top);
    card.appendChild(el('h3', 'vr-title', s.title));
    function line(label, val, limit) {
      if (!val) return;
      var p = el('p', 'vr-p');
      var b = el('strong', limit ? 'vr-lim' : null, label + ': ');
      p.appendChild(b);
      p.appendChild(document.createTextNode(val));
      card.appendChild(p);
    }
    line('Studied', s.studied);
    line('Key point', s.finding);
    line('Limitation', s.limit, true);
    var foot = el('div', 'vr-foot');
    var badge = ['dark', 'gold', 'tint', 'dashed'].indexOf(s.badge) > -1 ? s.badge : 'dashed';
    foot.appendChild(el('span', 'vr-b vr-b-' + badge, s.design));
    var u = safeUrl(s.url);
    if (u) {
      var a = el('a', 'vr-a', 'Read source');
      a.href = u; a.target = '_blank'; a.rel = 'noopener noreferrer';
      foot.appendChild(a);
    }
    card.appendChild(foot);
    return card;
  }

  function mount(root, page, updated) {
    var state = { filter: 'all', q: '' };
    root.innerHTML = '';
    var sec = el('section', 'vr');
    sec.id = 'research';
    var inner = el('div', 'vr-in');
    sec.appendChild(inner);
    if (page.eyebrow) inner.appendChild(el('p', 'vr-eyebrow', page.eyebrow));
    inner.appendChild(el('h2', 'vr-h2', page.heading));
    if (page.intro) inner.appendChild(el('p', 'vr-intro', page.intro));

    var filters = el('div', 'vr-filters');
    filters.setAttribute('role', 'group');
    filters.setAttribute('aria-label', 'Filter research by topic');
    var btns = [];
    (page.filters || []).forEach(function (f) {
      var b = el('button', 'vr-f', f.label);
      b.type = 'button';
      b.setAttribute('aria-pressed', f.key === 'all' ? 'true' : 'false');
      b.addEventListener('click', function () { state.filter = f.key; draw(); });
      b._key = f.key;
      btns.push(b);
      filters.appendChild(b);
    });
    inner.appendChild(filters);

    var bar = el('div', 'vr-bar');
    var sw = el('div', 'vr-sw');
    var id = 'vr-s-' + Math.random().toString(36).slice(2, 8);
    var lab = el('label', 'vr-sl', page.searchLabel || 'Search research');
    lab.htmlFor = id;
    var inp = el('input', 'vr-s');
    inp.type = 'search'; inp.id = id;
    inp.placeholder = page.placeholder || 'Study, topic or keyword';
    inp.addEventListener('input', function () { state.q = inp.value; draw(); });
    sw.appendChild(lab); sw.appendChild(inp);
    var count = el('p', 'vr-count');
    count.setAttribute('aria-live', 'polite');
    bar.appendChild(sw); bar.appendChild(count);
    inner.appendChild(bar);

    var grid = el('div', 'vr-grid');
    inner.appendChild(grid);
    var empty = el('div', 'vr-empty');
    empty.appendChild(document.createTextNode('No research matches that search. Try another word, or '));
    var reset = el('button', 'vr-reset', 'show all research');
    reset.type = 'button';
    reset.addEventListener('click', function () { state.filter = 'all'; state.q = ''; inp.value = ''; draw(); });
    empty.appendChild(reset);
    empty.appendChild(document.createTextNode('.'));
    empty.style.display = 'none';
    inner.appendChild(empty);
    if (updated) inner.appendChild(el('p', 'vr-upd', 'Research library last updated ' + fmtDate(updated) + '.'));

    // newest auto-added first, then original order
    var studies = (page.studies || []).slice().sort(function (a, b) {
      if (!!a.auto !== !!b.auto) return a.auto ? -1 : 1;
      if (a.auto && b.auto) return String(b.added).localeCompare(String(a.added));
      return 0;
    });

    function draw() {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b._key === state.filter ? 'true' : 'false'); });
      var q = state.q.trim().toLowerCase();
      var list = studies.filter(function (s) {
        if (state.filter !== 'all' && (s.cats || []).indexOf(state.filter) === -1) return false;
        if (!q) return true;
        return [s.study, s.meta, s.title, s.studied, s.finding, s.limit, s.design].join(' ').toLowerCase().indexOf(q) !== -1;
      });
      grid.innerHTML = '';
      list.forEach(function (s) { grid.appendChild(renderCard(s)); });
      count.textContent = 'Showing ' + list.length + (list.length === 1 ? ' entry' : ' entries');
      empty.style.display = list.length ? 'none' : 'block';
    }
    draw();
    root.appendChild(sec);
    root._vrSetFilter = function (key) {
      var ok = (page.filters || []).some(function (f) { return f.key === key; });
      state.filter = ok ? key : 'all'; state.q = ''; inp.value = ''; draw();
    };
    if (root._vrPending) { root._vrSetFilter(root._vrPending); root._vrPending = null; }
  }

  // "Explore related research" links elsewhere on the page: <a href="#research" data-vr-filter="liver">
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('[data-vr-filter]');
    if (!a) return;
    var key = a.getAttribute('data-vr-filter');
    Array.prototype.forEach.call(document.querySelectorAll('[data-vybrant-research]'), function (root) {
      if (root._vrSetFilter) root._vrSetFilter(key); else root._vrPending = key;
    });
  });

  function fail(root) {
    root.innerHTML = '';
    var sec = el('section', 'vr');
    var inner = el('div', 'vr-in');
    inner.appendChild(el('p', 'vr-intro', 'The research library is loading slowly. Please refresh the page in a moment.'));
    sec.appendChild(inner);
    root.appendChild(sec);
  }

  function init() {
    var roots = document.querySelectorAll('[data-vybrant-research]');
    if (!roots.length) return;
    injectCSS();
    fetch(DATA_URL, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        Array.prototype.forEach.call(roots, function (root) {
          var page = data.pages && data.pages[root.getAttribute('data-vybrant-research')];
          if (page) mount(root, page, data.updated); else fail(root);
        });
      })
      .catch(function () { Array.prototype.forEach.call(roots, fail); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
