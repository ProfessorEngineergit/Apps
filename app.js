/* ============================================================
 *  App Store — rendering, filtering, 3D tilt, detail overlay
 *  Depends on apps.js (APPS, CATEGORIES) and GSAP + Three.js.
 * ============================================================ */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isTouch = window.matchMedia("(hover: none)").matches;

  const grid = document.getElementById("app-grid");
  const tabsEl = document.getElementById("filter-tabs");
  const searchInput = document.getElementById("store-search-input");
  const emptyEl = document.getElementById("store-empty");
  const detailEl = document.getElementById("app-detail");
  const detailBody = document.getElementById("app-detail-body");

  let activeFilter = "all";
  let searchTerm = "";
  let lastFocused = null;

  const byId = (id) => APPS.find((a) => a.id === id);
  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  /* ---------------- Card markup ---------------- */
  function statusBadge(app) {
    const cls = app.status === "available" ? "available" : "coming-soon";
    const label = app.status === "available" ? "Available" : "Coming Soon";
    return `<span class="preview-status ${cls}">${label}</span>`;
  }

  function chips(app) {
    return app.platforms
      .map((p) => `<span class="platform-chip">${escapeHtml(p)}</span>`)
      .join("");
  }

  function cardMarkup(app) {
    return `
      <article class="store-card" data-id="${app.id}" data-category="${app.category}"
               tabindex="0" role="button" aria-label="${escapeHtml(app.name)} — view details"
               style="--accent:${app.accent}">
        <div class="card-shine"></div>
        <div class="card-inner">
          <div class="card-top">
            <div class="card-icon-3d">${app.icon}</div>
            ${statusBadge(app)}
          </div>
          <h3 class="card-name">${escapeHtml(app.name)}</h3>
          <p class="card-tagline">${escapeHtml(app.tagline)}</p>
          <div class="card-chips">${chips(app)}</div>
          <div class="card-footer">
            <span class="card-price">${escapeHtml(app.price)}</span>
            <span class="card-cta">Details
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
          ${app.placeholder ? '<span class="card-placeholder">Example</span>' : ""}
        </div>
      </article>`;
  }

  /* ---------------- Filter tabs ---------------- */
  function renderTabs() {
    tabsEl.innerHTML = CATEGORIES.map(
      (c) => `
        <button class="filter-tab${c.id === activeFilter ? " active" : ""}"
                data-filter="${c.id}" role="tab"
                aria-selected="${c.id === activeFilter}">
          <span class="tab-icon">${c.icon}</span>${c.label}
        </button>`
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

  /* ---------------- Filtering + search ---------------- */
  function matches(app) {
    const catOk = activeFilter === "all" || app.category === activeFilter;
    if (!catOk) return false;
    if (!searchTerm) return true;
    const hay = (
      app.name +
      " " +
      app.tagline +
      " " +
      app.platforms.join(" ")
    ).toLowerCase();
    return hay.includes(searchTerm);
  }

  function applyFilter() {
    const cards = Array.from(grid.children);
    const visible = [];
    cards.forEach((card) => {
      const app = byId(card.dataset.id);
      if (app && matches(app)) {
        card.hidden = false;
        visible.push(card);
      } else {
        card.hidden = true;
      }
    });

    emptyEl.hidden = visible.length > 0;

    if (!prefersReducedMotion && window.gsap) {
      gsap.fromTo(
        visible,
        { opacity: 0, y: 24, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.06,
          ease: "power3.out",
          overwrite: true
        }
      );
    }
  }

  /* ---------------- 3D tilt / glare ---------------- */
  function attachTilt(card) {
    if (prefersReducedMotion || isTouch) return;
    const MAX = 10; // degrees
    let raf = null;

    function onMove(e) {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * MAX * 2;
      const ry = (px - 0.5) * MAX * 2;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.setProperty("--rx", rx.toFixed(2) + "deg");
        card.style.setProperty("--ry", ry.toFixed(2) + "deg");
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });
    }
    function reset() {
      if (raf) cancelAnimationFrame(raf);
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    }
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", reset);
  }

  /* ---------------- Visuals (detail view) ---------------- */
  function renderVisual(app) {
    const d = app.visualData || {};
    switch (app.visual) {
      case "ring": {
        const pct = d.percent ?? 0;
        const dash = 502;
        const offset = dash - (dash * pct) / 100;
        const rows = (d.rows || [])
          .map(
            (r) =>
              `<div class="render-item"><span class="item-label">${escapeHtml(
                r.label
              )}</span><span class="item-value">${escapeHtml(
                r.value
              )}</span></div>`
          )
          .join("");
        return `
          <div class="render-visual">
            <div class="render-ring">
              <svg viewBox="0 0 200 200">
                <circle class="ring-bg" cx="100" cy="100" r="80"/>
                <circle class="ring-progress" cx="100" cy="100" r="80"
                        style="stroke-dasharray:${dash};stroke-dashoffset:${offset};stroke:${app.accent}"/>
              </svg>
              <div class="ring-content">
                <span class="ring-percent">${pct}%</span>
                <span class="ring-label">${escapeHtml(d.label || "")}</span>
              </div>
            </div>
            <div class="render-info">${rows}</div>
          </div>`;
      }
      case "suffix": {
        const rows = (d.rows || [])
          .map(
            (r) => `
            <div class="suffix-row${r.active ? " active" : ""}">
              <div class="suffix-type">${escapeHtml(r.type)}</div>
              <div class="suffix-arrow">→</div>
              <div class="suffix-app">${escapeHtml(r.app)}</div>
            </div>`
          )
          .join("");
        return `<div class="suffix-visual"><div class="suffix-demo">${rows}</div></div>`;
      }
      case "rename": {
        return `
          <div class="shot-visual">
            <div class="shot-demo">
              <div class="shot-before">
                <span class="shot-label">Before</span>
                <div class="shot-filename old">${escapeHtml(d.before || "")}</div>
              </div>
              <div class="shot-arrow"><div class="ai-badge">AI</div></div>
              <div class="shot-after">
                <span class="shot-label">After</span>
                <div class="shot-filename new">${escapeHtml(d.after || "")}</div>
              </div>
            </div>
          </div>`;
      }
      default: {
        return `
          <div class="preview-visual" style="--accent:${app.accent}">
            <div class="preview-visual-glow"></div>
            <div class="preview-visual-icon">${app.icon}</div>
            <div class="preview-visual-name">${escapeHtml(app.name)}</div>
            <div class="preview-visual-chips">${chips(app)}</div>
          </div>`;
      }
    }
  }

  function linkButtons(app) {
    const l = app.links || {};
    const out = [];
    if (l.web)
      out.push(
        `<a href="${l.web}" class="btn btn-primary" target="_blank" rel="noopener"><span>Open Web App</span></a>`
      );
    if (l.dmg)
      out.push(
        `<a href="${l.dmg}" class="btn btn-primary download-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg><span>Download .dmg</span></a>`
      );
    if (l.appstore)
      out.push(
        `<a href="${l.appstore}" class="btn btn-appstore"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg><span>App Store</span></a>`
      );
    if (app.status === "coming-soon" && !l.web && !l.dmg && !l.appstore)
      out.push(`<button class="btn btn-disabled"><span>Coming Soon</span></button>`);
    if (l.github)
      out.push(
        `<a href="${l.github}" class="btn btn-outline" target="_blank" rel="noopener"><span>View on GitHub</span></a>`
      );
    return out.join("");
  }

  function detailMarkup(app) {
    const features = app.features
      .map(
        (f) => `
        <div class="feature">
          <div class="feature-icon">${f.icon}</div>
          <div class="feature-text"><strong>${escapeHtml(
            f.title
          )}</strong><span>${escapeHtml(f.sub)}</span></div>
        </div>`
      )
      .join("");
    return `
      <div class="detail-grid" style="--accent:${app.accent}">
        <div class="detail-info">
          ${
            app.placeholder
              ? '<span class="detail-placeholder">Example entry — replace in apps.js</span>'
              : ""
          }
          ${statusBadge(app)}
          <h2 class="app-title"><span class="app-icon">${app.icon}</span>${escapeHtml(
      app.name
    )}</h2>
          <p class="app-tagline">${escapeHtml(app.tagline)}</p>
          <div class="card-chips detail-chips">${chips(app)}</div>
          <p class="app-description">${escapeHtml(app.description)}</p>
          <div class="app-features">${features}</div>
          <div class="app-buttons">${linkButtons(app)}</div>
        </div>
        <div class="app-visual">${renderVisual(app)}</div>
      </div>`;
  }

  /* ---------------- Detail open / close ---------------- */
  function openDetail(id, fromCard) {
    const app = byId(id);
    if (!app) return;
    lastFocused = document.activeElement;
    detailBody.innerHTML = detailMarkup(app);
    detailEl.classList.add("open");
    detailEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("detail-open");

    const panel = detailEl.querySelector(".app-detail-panel");
    if (!prefersReducedMotion && window.gsap) {
      const backdrop = detailEl.querySelector(".app-detail-backdrop");
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      // Shared-element-ish: grow from the originating card.
      if (fromCard) {
        const r = fromCard.getBoundingClientRect();
        const pr = panel.getBoundingClientRect();
        const sx = r.width / pr.width;
        const sy = r.height / pr.height;
        const dx = r.left + r.width / 2 - (pr.left + pr.width / 2);
        const dy = r.top + r.height / 2 - (pr.top + pr.height / 2);
        gsap.fromTo(
          panel,
          { x: dx, y: dy, scaleX: sx, scaleY: sy, opacity: 0.6 },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out"
          }
        );
      } else {
        gsap.fromTo(
          panel,
          { y: 40, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }
        );
      }
    }
    const closeBtn = detailEl.querySelector(".app-detail-close");
    if (closeBtn) closeBtn.focus();
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
    if (!prefersReducedMotion && window.gsap) {
      const panel = detailEl.querySelector(".app-detail-panel");
      gsap.to(panel, {
        y: 30,
        opacity: 0,
        scale: 0.97,
        duration: 0.28,
        ease: "power2.in",
        onComplete: finish
      });
    } else {
      finish();
    }
    if (updateHash !== false && location.hash.startsWith("#app/")) {
      history.pushState("", document.title, location.pathname + location.search + "#store");
    }
  }

  /* ---------------- Hash routing ---------------- */
  function syncFromHash() {
    const m = location.hash.match(/^#app\/(.+)$/);
    if (m && byId(m[1])) {
      openDetail(m[1], null);
    } else {
      closeDetail(false);
    }
  }

  /* ---------------- Build ---------------- */
  function render() {
    renderTabs();
    grid.innerHTML = APPS.map(cardMarkup).join("");
    Array.from(grid.children).forEach((card) => {
      attachTilt(card);
      const open = () => {
        const id = card.dataset.id;
        history.pushState({ app: id }, "", "#app/" + id);
        openDetail(id, card);
      };
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });
    applyFilter();
  }

  /* ---------------- Events ---------------- */
  function bindEvents() {
    tabsEl.addEventListener("click", (e) => {
      const tab = e.target.closest(".filter-tab");
      if (tab) setFilter(tab.dataset.filter);
    });

    // Nav / footer links that carry a data-filter
    document.querySelectorAll("[data-filter]").forEach((el) => {
      if (el.classList.contains("filter-tab")) return;
      el.addEventListener("click", () => setFilter(el.dataset.filter));
    });

    let t;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(t);
      const val = e.target.value.trim().toLowerCase();
      t = setTimeout(() => {
        searchTerm = val;
        applyFilter();
      }, 120);
    });

    detailEl.querySelectorAll("[data-close]").forEach((el) =>
      el.addEventListener("click", () => closeDetail(true))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDetail(true);
    });

    window.addEventListener("popstate", syncFromHash);

    // Smooth scroll for in-page anchors (skip app links)
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#" || href.startsWith("#app/")) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Nav background on scroll
    const nav = document.querySelector(".nav");
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  /* ---------------- GSAP intro ---------------- */
  function introAnimations() {
    if (prefersReducedMotion || !window.gsap) return;
    gsap.from(".hero-badge", { opacity: 0, y: 30, duration: 1, delay: 0.2 });
    gsap.from(".hero-title .title-line", {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      delay: 0.4
    });
    gsap.from(".hero-description", { opacity: 0, y: 30, duration: 1, delay: 0.8 });
    gsap.from(".hero-buttons", { opacity: 0, y: 30, duration: 1, delay: 1 });
    gsap.from(".floating-card", {
      opacity: 0,
      scale: 0.5,
      duration: 1.5,
      stagger: 0.2,
      delay: 1.2,
      ease: "elastic.out(1, 0.5)"
    });
    gsap.to(".card-1", { y: -20, rotateY: 10, rotateX: -5, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".card-2", { y: -15, rotateY: -8, rotateX: 5, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });
    gsap.to(".card-3", { y: -25, rotateY: 12, rotateX: -8, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(".store-controls", {
        scrollTrigger: { trigger: ".store-controls", start: "top 85%" },
        opacity: 0,
        y: 30,
        duration: 0.8
      });
    }
  }

  /* ---------------- Three.js background ---------------- */
  function initBackground() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas || typeof THREE === "undefined") return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const colors = [0x6366f1, 0x8b5cf6, 0xec4899, 0x06b6d4];
    const spheres = [];
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    for (let i = 0; i < 50; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.1 + Math.random() * 0.2
      });
      const sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.position.x = (Math.random() - 0.5) * 100;
      sphere.position.y = (Math.random() - 0.5) * 100;
      sphere.position.z = (Math.random() - 0.5) * 50 - 25;
      sphere.scale.setScalar(Math.random() * 2 + 0.5);
      sphere.userData = {
        originalY: sphere.position.y,
        speed: Math.random() * 0.5 + 0.2,
        amplitude: Math.random() * 2 + 1
      };
      spheres.push(sphere);
      scene.add(sphere);
    }

    const torusKnots = [];
    const torusGeometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
    for (let i = 0; i < 5; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.05,
        wireframe: true
      });
      const torus = new THREE.Mesh(torusGeometry, material);
      torus.position.x = (Math.random() - 0.5) * 60;
      torus.position.y = (Math.random() - 0.5) * 60;
      torus.position.z = -30 - Math.random() * 20;
      torus.scale.setScalar(Math.random() * 2 + 1);
      torusKnots.push(torus);
      scene.add(torus);
    }

    camera.position.z = 30;
    let mouseX = 0;
    let mouseY = 0;
    if (!isTouch) {
      document.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });
    }

    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;
      spheres.forEach((sphere, i) => {
        sphere.position.y =
          sphere.userData.originalY +
          Math.sin(time * sphere.userData.speed + i) * sphere.userData.amplitude;
        sphere.rotation.x += 0.001;
        sphere.rotation.y += 0.001;
      });
      torusKnots.forEach((torus) => {
        torus.rotation.x += 0.002;
        torus.rotation.y += 0.003;
      });
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    render();
    bindEvents();
    introAnimations();
    initBackground();
    syncFromHash();
  });
})();
