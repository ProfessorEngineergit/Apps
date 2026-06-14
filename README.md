# Apps

A little App Store for my apps — **web**, **mobile** and **desktop** — in one
place. Browse, filter by platform, search, and open any app for full details.

It's a zero-build static site (HTML + CSS + vanilla JS, with Three.js & GSAP via
CDN), so it can be hosted anywhere (e.g. GitHub Pages).

## Files

- `index.html` — page structure (hero, store, detail overlay, footer)
- `styles.css` — styling, 3D card tilt, detail overlay
- `app.js` — rendering, filtering, search, 3D tilt, detail overlay, routing
- `apps.js` — **the app catalog** (data source)

## Add a new app

Open `apps.js` and append one object to the `APPS` array. No HTML editing
needed — the card and detail view are generated automatically:

```js
{
  id: "my-app",                       // unique slug, used in the URL: #app/my-app
  name: "My App",
  tagline: "One short line",
  description: "A longer paragraph for the detail view.",
  icon: "🚀",                          // emoji icon
  category: "web",                    // "web" | "mobile" | "desktop"
  platforms: ["Web"],                 // chips shown on the card
  status: "available",                // "available" | "coming-soon"
  price: "Free",
  accent: "#6366f1",                  // subtle per-app icon-tile tint
  featured: true,                     // optional: include in the rotating hero
  iconImage: "https://…/icon.png",    // optional: real icon (falls back to `icon`)
  screenshot: "https://…/shot.png",   // optional: real screenshot (hero + detail)
  links: { web: "https://…", github: "https://…" }, // dmg / appstore also supported
  features: [
    { icon: "⚡", title: "Fast", sub: "No install" }
  ],
  visual: "preview"                   // "ring" | "suffix" | "rename" | "preview"
}
```

The entries tagged with `placeholder: true` (the Web and Mobile examples) are
there to show the layout — replace them with your real apps.
