/* ============================================================
 *  Apps — store logic (Minimal Mono)
 *  Depends on apps.js (APPS, CATEGORIES) and GSAP.
 * ============================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const grid = document.getElementById("app-grid");
  const tabsEl = document.getElementById("filter-tabs");
  const searchInput = document.getElementById("search");
  const emptyEl = document.getElementById("store-empty");
  const countEl = document.getElementById("store-count");
  const featuredEl = document.getElementById("featured");
  const detailEl = document.getElementById("detail");
  const detailBody = document.getElementById("detail-body");

  let activeFilter = "all";
  let searchTerm = "";
  let lastFocused = null;

  const byId = (id) => APPS.find((a) => a.id === id);
  const catLabel = (id) =>
    ({ web: "Web", mobile: "Mobile", desktop: "Desktop" }[id] || id);

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

  /* ---------- SVG icon set (no emoji) ---------- */
  const ICONS = {
    app: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 12h6M12 9v6"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/>',
    smartphone: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
    monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    palette: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><circle cx="16.75" cy="16.75" r="3.25"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L6 20"/>',
    shield: '<path d="M12 3l7 3v5c0 4.6-3 8.3-7 10-4-1.7-7-5.4-7-10V6l7-3z"/><path d="M9.5 12l1.8 1.8L15 10"/>',
    "check-square": '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><path d="M8 12.2l2.6 2.6L16.5 9"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3.5 12.5L12 17l8.5-4.5"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z"/>',
    orbit: '<circle cx="12" cy="12" r="2.6"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)"/>',
    key: '<circle cx="8" cy="15" r="4.2"/><path d="M10.8 12.2L20 3M17 6l2.5 2.5M14.2 8.8l2.4 2.4"/>',
    sparkles: '<path d="M12 3.5l1.7 4 4 1.7-4 1.7L12 15l-1.7-4.1-4-1.7 4-1.7z"/><path d="M5.5 15l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z"/>',
    wand: '<path d="M15 6l3 3M5.5 20.5L16 10l-2-2L3.5 18.5z"/><path d="M17 3.5l.7 1.6 1.6.7-1.6.7L17 8l-.7-1.5-1.6-.7 1.6-.7z"/>',
    activity: '<path d="M3 12h3.5l2.5 7 4-14 2.5 7H21"/>',
    link: '<path d="M9.5 14.5l5-5"/><path d="M11 6.5l1.2-1.2a3.8 3.8 0 0 1 5.5 5.5L16.5 12"/><path d="M13 17.5l-1.2 1.2a3.8 3.8 0 0 1-5.5-5.5L7.5 12"/>',
    mask: '<circle cx="12" cy="12" r="9"/><path d="M8 14c1 1.3 2.4 2 4 2s3-.7 4-2"/><path d="M9 9.5h.01M15 9.5h.01"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 9.5l3 2.5-3 2.5M13 15h4"/>',
    check: '<path d="M5 12.5l4 4 10-10.5"/>'
  };
  const APP_ICONS = {
    looksmith: "palette", openimagelabel: "image", opensiteblocker: "shield",
    tasks: "check-square", "ui-swipe": "layers", "things-i-wish-for": "star",
    "splat-viewer": "orbit", screentimehacker: "key", caelum: "sparkles",
    renderstatus: "activity", suffixlinkr: "link", shotnamrai: "wand",
    "loki-prank": "mask", sshmanager: "terminal"
  };
  const CAT_ICONS = { all: "grid", web: "globe", mobile: "smartphone", desktop: "monitor" };

  function svgIcon(key, size) {
    const p = ICONS[key] || ICONS.app;
    const s = size || 24;
    return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  }

  /* ---------- shared bits ---------- */
  function iconTile(app, cls) {
    const tint = app.accent || "#7c5cff";
    const key = app.iconKey || APP_ICONS[app.id] || "app";
    const img = app.iconImage
      ? `<img src="${esc(app.iconImage)}" alt="" loading="lazy" onerror="this.remove()">`
      : "";
    return `<div class="icon-tile ${cls || ""}" style="--tile:${tint}"><span class="glyph">${svgIcon(key)}</span>${img}</div>`;
  }

  function statusPill(app) {
    const cls = app.status === "available" ? "available" : "coming-soon";
    const label = app.status === "available" ? "Available" : "Soon";
    return `<span class="status ${cls}"><span class="dot"></span>${label}</span>`;
  }

  /* ---------- visuals (reused in hero + detail) ---------- */
  function renderVisual(app) {
    const d = app.visualData || {};
    switch (app.visual) {
      case "ring": {
        const pct = d.percent ?? 0;
        const dash = 502, off = dash - (dash * pct) / 100;
        const rows = (d.rows || [])
          .map((r) => `<div><span class="k">${esc(r.label)}</span><span class="v">${esc(r.value)}</span></div>`)
          .join("");
        return `<div class="viz ring-wrap">
          <div class="ring"><svg viewBox="0 0 200 200">
            <circle class="bg" cx="100" cy="100" r="80"/>
            <circle class="fg" cx="100" cy="100" r="80" style="stroke-dasharray:${dash};stroke-dashoffset:${off}"/>
          </svg><div class="lbl"><span class="pct">${pct}%</span><span class="cap">${esc(d.label || "")}</span></div></div>
          <div class="ring-rows">${rows}</div></div>`;
      }
      case "suffix": {
        const rows = (d.rows || [])
          .map((r) => `<div class="row${r.active ? " on" : ""}"><span class="type">${esc(r.type)}</span><span class="arr">→</span><span class="app">${esc(r.app)}</span></div>`)
          .join("");
        return `<div class="viz rows">${rows}</div>`;
      }
      case "rename":
        return `<div class="viz rename">
          <div><span class="k">Before</span><div class="fname old">${esc(d.before || "")}</div></div>
          <div class="ai">AI</div>
          <div><span class="k">After</span><div class="fname new">${esc(d.after || "")}</div></div></div>`;
      default:
        return `<div class="preview-viz"><div class="mock">
          <div class="mock-bar"><i></i><i></i><i></i></div>
          <div class="mock-body">${iconTile(app)}
            <div class="mock-name">${esc(app.name)}</div>
            <div class="mock-plat">${esc((app.platforms || []).join(" · "))}</div>
            <div class="mock-lines"><span></span><span></span><span></span></div>
          </div></div></div>`;
    }
  }

  /* ---------- cards ---------- */
  function cardMarkup(app) {
    return `<article class="store-card" data-id="${app.id}" tabindex="0" role="button"
      aria-label="${esc(app.name)} — details">
      ${app.placeholder ? '<span class="card-tag-example">Example</span>' : ""}
      <div class="card-head">
        ${iconTile(app)}
        <div class="card-headings">
          <div class="card-name">${esc(app.name)}</div>
          <div class="card-platform">${esc((app.platforms || []).join(" · "))}</div>
        </div>
      </div>
      <p class="card-tagline">${esc(app.tagline)}</p>
      <div class="card-foot">
        <span class="card-price">${esc(app.price)}</span>
        ${statusPill(app)}
      </div>
    </article>`;
  }

  /* ---------- filter tabs ---------- */
  function renderTabs() {
    tabsEl.innerHTML = CATEGORIES.map(
      (c) => `<button class="filter-tab${c.id === activeFilter ? " active" : ""}" data-filter="${c.id}" role="tab" aria-selected="${c.id === activeFilter}"><span class="tab-icon">${svgIcon(CAT_ICONS[c.id] || "grid", 15)}</span>${c.label}</button>`
    ).join("");
  }

  function setFilter(filter) {
    if (!CATEGORIES.some((c) => c.id === filter)) filter = "all";
    activeFilter = filter;
    tabsEl.querySelectorAll(".filter-tab").forEach((t) => {
      const on = t.dataset.filter === filter;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on);
    });
    applyFilter();
  }

  function matches(app) {
    if (activeFilter !== "all" && app.category !== activeFilter) return false;
    if (!searchTerm) return true;
    return (app.name + " " + app.tagline + " " + (app.platforms || []).join(" "))
      .toLowerCase().includes(searchTerm);
  }

  function applyFilter() {
    const cards = Array.from(grid.children);
    const visible = [];
    cards.forEach((card) => {
      const app = byId(card.dataset.id);
      const show = app && matches(app);
      card.hidden = !show;
      if (show) visible.push(card);
    });
    emptyEl.hidden = visible.length > 0;
    if (countEl) countEl.textContent = " " + visible.length;
    if (!reduce && window.gsap) {
      gsap.fromTo(visible,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power2.out", overwrite: true });
    }
  }

  /* ---------- detail modal ---------- */
  function linkButtons(app) {
    const l = app.links || {};
    const out = [];
    if (l.web) out.push(`<a href="${l.web}" class="btn btn-primary" target="_blank" rel="noopener">Open Web App</a>`);
    if (l.dmg) out.push(`<a href="${l.dmg}" class="btn btn-primary">Download .dmg</a>`);
    if (l.appstore) out.push(`<a href="${l.appstore}" class="btn btn-ghost">App Store</a>`);
    if (app.status === "coming-soon" && !l.web && !l.dmg && !l.appstore)
      out.push(`<button class="btn btn-disabled">Coming Soon</button>`);
    if (l.github) out.push(`<a href="${l.github}" class="btn btn-quiet" target="_blank" rel="noopener">GitHub</a>`);
    return out.join("");
  }

  function detailMarkup(app) {
    const feats = (app.features || [])
      .map((f) => `<div class="feat"><span class="f-ic">${svgIcon("check", 16)}</span><div><strong>${esc(f.title)}</strong><span>${esc(f.sub)}</span></div></div>`)
      .join("");
    const media = app.screenshot
      ? `<div class="detail-shot media"><img src="${esc(app.screenshot)}" alt="${esc(app.name)} screenshot" loading="lazy" onerror="this.closest('.detail-shot').remove()"></div>`
      : `<div class="detail-shot is-visual">${renderVisual(app)}</div>`;
    return `
      ${app.placeholder ? '<span class="detail-example">Example — replace in apps.js</span>' : ""}
      <div class="detail-top">
        ${iconTile(app)}
        <div><div class="detail-title" id="detail-title">${esc(app.name)}</div>
        <div class="detail-tagline">${esc(app.tagline)}</div></div>
      </div>
      <div class="detail-metarow">
        <span class="meta-pill">${esc(catLabel(app.category))}</span>
        <span class="meta-pill">${esc((app.platforms || []).join(" · "))}</span>
        <span class="meta-pill">${esc(app.price)}</span>
      </div>
      ${media}
      <p class="detail-desc">${esc(app.description)}</p>
      <div class="feature-grid">${feats}</div>
      <div class="detail-actions">${linkButtons(app)}</div>`;
  }

  function openDetail(id) {
    const app = byId(id);
    if (!app) return;
    lastFocused = document.activeElement;
    detailBody.innerHTML = detailMarkup(app);
    detailEl.classList.add("open");
    detailEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("detail-open");
    if (!reduce && window.gsap) {
      gsap.fromTo(detailEl.querySelector(".detail-backdrop"), { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(detailEl.querySelector(".detail-panel"),
        { y: 24, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
    }
    const c = detailEl.querySelector(".detail-close");
    if (c) c.focus();
  }

  function closeDetail(updateHash) {
    if (!detailEl.classList.contains("open")) return;
    const finish = () => {
      detailEl.classList.remove("open");
      detailEl.setAttribute("aria-hidden", "true");
      document.body.classList.remove("detail-open");
      detailBody.innerHTML = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };
    if (!reduce && window.gsap) {
      gsap.to(detailEl.querySelector(".detail-panel"),
        { y: 18, opacity: 0, scale: 0.985, duration: 0.22, ease: "power2.in", onComplete: finish });
    } else finish();
    if (updateHash !== false && location.hash.startsWith("#app/"))
      history.pushState("", document.title, location.pathname + location.search + "#store");
  }

  /* ---------- featured rotation ---------- */
  let featuredApps = [];
  let fIndex = 0;
  let fTimer = null;

  function renderFeaturedShell() {
    featuredApps = APPS.filter((a) => a.featured);
    if (!featuredApps.length) { featuredEl.style.display = "none"; return; }
    featuredEl.innerHTML = `
      <div class="featured-grid">
        <div class="featured-info fade-swap" id="f-info"></div>
        <div class="featured-visual fade-swap" id="f-visual"></div>
      </div>
      <div class="featured-dots" id="f-dots">${featuredApps
        .map((_, i) => `<button data-i="${i}" aria-label="Featured ${i + 1}"></button>`)
        .join("")}</div>`;

    featuredEl.querySelector("#f-dots").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b) { showFeatured(+b.dataset.i); restartTimer(); }
    });
    featuredEl.addEventListener("mouseenter", stopTimer);
    featuredEl.addEventListener("mouseleave", restartTimer);
    showFeatured(0, false);
    restartTimer();
  }

  function showFeatured(i, animate) {
    if (!featuredApps.length) return;
    fIndex = (i + featuredApps.length) % featuredApps.length;
    const app = featuredApps[fIndex];
    const info = featuredEl.querySelector("#f-info");
    const visual = featuredEl.querySelector("#f-visual");
    const dots = featuredEl.querySelectorAll("#f-dots button");
    dots.forEach((d, k) => d.classList.toggle("active", k === fIndex));
    featuredEl.style.setProperty("--tile", app.accent || "#7c5cff");

    const fill = () => {
      info.innerHTML = `
        <span class="featured-eyebrow eyebrow"><span class="dot"></span>Featured</span>
        <div class="featured-head">${iconTile(app)}
          <div><div class="featured-name">${esc(app.name)}</div>
          <div class="featured-meta">${esc(catLabel(app.category))} · ${esc((app.platforms || []).join(" · "))} · ${esc(app.price)}</div></div>
        </div>
        <p class="featured-tagline">${esc(app.tagline)}</p>
        <div class="featured-actions">
          <button class="btn btn-primary" data-open="${app.id}">View app</button>
          ${app.links && app.links.github ? `<a class="btn btn-quiet" href="${app.links.github}" target="_blank" rel="noopener">GitHub</a>` : ""}
        </div>`;
      visual.innerHTML =
        `<div class="visual-pad">${renderVisual(app)}</div>` +
        (app.screenshot
          ? `<img class="shot-abs" src="${esc(app.screenshot)}" alt="${esc(app.name)} screenshot" loading="lazy" onerror="this.remove()">`
          : "");
      info.querySelector("[data-open]").addEventListener("click", () => {
        history.pushState({ app: app.id }, "", "#app/" + app.id);
        openDetail(app.id);
      });
      visual.style.cursor = "pointer";
      visual.onclick = () => {
        history.pushState({ app: app.id }, "", "#app/" + app.id);
        openDetail(app.id);
      };
    };

    if (animate === false || reduce) { fill(); return; }
    info.classList.add("is-out");
    visual.classList.add("is-out");
    setTimeout(() => {
      fill();
      info.classList.remove("is-out");
      visual.classList.remove("is-out");
    }, 280);
  }

  function nextFeatured() { showFeatured(fIndex + 1); }
  function stopTimer() { if (fTimer) { clearInterval(fTimer); fTimer = null; } }
  function restartTimer() { stopTimer(); if (!reduce && featuredApps.length > 1) fTimer = setInterval(nextFeatured, 5200); }

  /* ---------- hash routing ---------- */
  function syncFromHash() {
    const m = location.hash.match(/^#app\/(.+)$/);
    if (m && byId(m[1])) openDetail(m[1]);
    else closeDetail(false);
  }

  /* ---------- build ---------- */
  function render() {
    renderTabs();
    grid.innerHTML = APPS.map(cardMarkup).join("");
    Array.from(grid.children).forEach((card) => {
      const open = () => {
        const id = card.dataset.id;
        history.pushState({ app: id }, "", "#app/" + id);
        openDetail(id);
      };
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
    applyFilter();
    renderFeaturedShell();
  }

  function bindEvents() {
    tabsEl.addEventListener("click", (e) => {
      const t = e.target.closest(".filter-tab");
      if (t) setFilter(t.dataset.filter);
    });

    document.querySelectorAll("[data-filter]").forEach((el) => {
      if (el.classList.contains("filter-tab")) return;
      el.addEventListener("click", () => setFilter(el.dataset.filter));
    });

    let t;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(t);
      const v = e.target.value.trim().toLowerCase();
      t = setTimeout(() => { searchTerm = v; applyFilter(); }, 110);
    });

    detailEl.querySelectorAll("[data-close]").forEach((el) =>
      el.addEventListener("click", () => closeDetail(true)));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDetail(true);
      if (e.key === "/" && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    });

    window.addEventListener("popstate", syncFromHash);

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#" || href.startsWith("#app/")) return;
        const target = document.querySelector(href);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
      });
    });

    const nav = document.querySelector(".nav");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    onScroll();
  }

  function intro() {
    if (reduce || !window.gsap) return;
    gsap.from(".hero-head", { opacity: 0, y: 18, duration: 0.7, ease: "power2.out" });
    gsap.from(".featured", { opacity: 0, y: 26, duration: 0.8, delay: 0.1, ease: "power3.out" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    bindEvents();
    intro();
    syncFromHash();
  });
})();
