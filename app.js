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

  /* ---------- shared bits ---------- */
  function iconTile(app, cls) {
    const tint = app.accent || "#7c5cff";
    const img = app.iconImage
      ? `<img src="${esc(app.iconImage)}" alt="" loading="lazy" onerror="this.remove()">`
      : "";
    return `<div class="icon-tile ${cls || ""}" style="--tile:${tint}"><span class="glyph">${app.icon || "📦"}</span>${img}</div>`;
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
        return `<div class="preview-viz">${iconTile(app)}<div class="pv-name">${esc(app.name)}</div><div class="pv-plat">${esc((app.platforms || []).join(" · "))}</div></div>`;
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
      (c) => `<button class="filter-tab${c.id === activeFilter ? " active" : ""}" data-filter="${c.id}" role="tab" aria-selected="${c.id === activeFilter}"><span class="tab-icon">${c.icon}</span>${c.label}</button>`
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
      .map((f) => `<div class="feat"><span class="f-ic">${f.icon}</span><div><strong>${esc(f.title)}</strong><span>${esc(f.sub)}</span></div></div>`)
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
