/* ============================================================
 *  App Store data source
 *  ------------------------------------------------------------
 *  Add a new app by appending one object to the APPS array below.
 *  No HTML editing required — cards & detail views are generated
 *  from this data by app.js.
 *
 *  Fields:
 *    id          unique slug (used in the URL hash: #app/<id>)
 *    name        display name
 *    tagline     one short line shown on the card & detail header
 *    description longer paragraph for the detail view
 *    icon        emoji shown as the app icon
 *    category    "web" | "mobile" | "desktop"
 *    platforms   array of short platform chips, e.g. ["macOS"], ["iOS","Android"]
 *    status      "available" | "coming-soon"
 *    price       free text, e.g. "Free", "€2.99", "Free • €2.99 on App Store"
 *    accent      hex color used for this app's glow/accents
 *    placeholder true => visually marked as an example entry to be replaced
 *    links       { dmg, appstore, github, web } — omit/empty any that don't apply
 *    features    [ { icon, title, sub } ] — up to 4 look best
 *    visual      one of: "ring" | "suffix" | "rename" | "preview"
 *    visualData  optional object feeding the chosen visual (see app.js)
 * ============================================================ */

const APPS = [
  /* ---------------- DESKTOP ---------------- */
  {
    id: "renderstatus",
    name: "RenderStatus",
    tagline: "Track your renders, right in your menu bar",
    description:
      "RenderStatus seamlessly integrates with Final Cut Pro and Blender to provide real-time rendering progress tracking. Watch your exports complete with a beautiful ring-diagram right in your macOS menu bar.",
    icon: "📊",
    category: "desktop",
    platforms: ["macOS"],
    status: "coming-soon",
    price: "Coming Soon",
    accent: "#6366f1",
    links: { github: "https://github.com/ProfessorEngineergit" },
    features: [
      { icon: "🎬", title: "Final Cut Pro", sub: "Track exports & renders" },
      { icon: "🎨", title: "Blender", sub: "Monitor 3D renders" },
      { icon: "📈", title: "Ring Diagram", sub: "Visual progress indicator" },
      { icon: "🔔", title: "Notifications", sub: "Know when renders complete" }
    ],
    visual: "ring",
    visualData: {
      percent: 73,
      label: "Rendering",
      rows: [
        { label: "Final Cut Pro", value: "4K Export" },
        { label: "Time Remaining", value: "12:34" }
      ]
    }
  },
  {
    id: "suffixlinkr",
    name: "SuffixLinkr",
    tagline: "Intelligent file association management",
    description:
      "Take control of which apps open your files. SuffixLinkr provides a beautiful, intuitive interface to manage file suffix associations on macOS. No more struggling with system preferences – just point, click, and link.",
    icon: "🔗",
    category: "desktop",
    platforms: ["macOS"],
    status: "available",
    price: "Free • €2.99 on App Store",
    accent: "#8b5cf6",
    links: {
      dmg: "#",
      appstore: "#",
      github: "https://github.com/ProfessorEngineergit"
    },
    features: [
      { icon: "🎯", title: "Visual Interface", sub: "Intuitive drag & drop" },
      { icon: "⚡", title: "Instant Changes", sub: "Apply immediately" },
      { icon: "📁", title: "All Formats", sub: "Support for any suffix" },
      { icon: "💾", title: "Backup & Restore", sub: "Save your preferences" }
    ],
    visual: "suffix",
    visualData: {
      rows: [
        { type: ".psd", app: "Photoshop" },
        { type: ".mp4", app: "Final Cut", active: true },
        { type: ".json", app: "VS Code" },
        { type: ".blend", app: "Blender" }
      ]
    }
  },
  {
    id: "shotnamrai",
    name: "ShotNamrAI",
    tagline: "AI-powered screenshot organization",
    description:
      'Say goodbye to "Screenshot 2024-01-15 at 10.23.45.png". ShotNamrAI uses local AI to analyze your screenshots and screen recordings, automatically naming them with meaningful, searchable descriptions.',
    icon: "🤖",
    category: "desktop",
    platforms: ["macOS"],
    status: "available",
    price: "Free • €2.99 on App Store",
    accent: "#ec4899",
    links: {
      dmg: "#",
      appstore: "#",
      github: "https://github.com/ProfessorEngineergit"
    },
    features: [
      { icon: "🧠", title: "Local AI", sub: "Private, on-device processing" },
      { icon: "📸", title: "Screenshots", sub: "Intelligent image analysis" },
      { icon: "🎥", title: "Screen Recordings", sub: "Video content recognition" },
      { icon: "📂", title: "Custom Folder", sub: "Organized destination" }
    ],
    visual: "rename",
    visualData: {
      before: "Screenshot 2024-01-15 at 10.23.45.png",
      after: "VSCode-Python-Debug-Session.png"
    }
  },

  /* ---------------- WEB (placeholder examples) ---------------- */
  {
    id: "web-example",
    name: "Example Web App",
    tagline: "Your browser-based tool lives here",
    description:
      "This is a placeholder entry showing how a web app appears in the store. Replace it in apps.js with your real web app: set the name, description, the web link and a few features.",
    icon: "🌐",
    category: "web",
    platforms: ["Web"],
    status: "available",
    price: "Free",
    accent: "#06b6d4",
    placeholder: true,
    links: { web: "#", github: "https://github.com/ProfessorEngineergit" },
    features: [
      { icon: "⚡", title: "Instant", sub: "No install required" },
      { icon: "🔒", title: "Private", sub: "Runs in your browser" },
      { icon: "📱", title: "Responsive", sub: "Works on any screen" },
      { icon: "🧩", title: "Edit in apps.js", sub: "Swap for your real app" }
    ],
    visual: "preview"
  },

  /* ---------------- MOBILE (placeholder examples) ---------------- */
  {
    id: "mobile-example",
    name: "Example Mobile App",
    tagline: "Your iOS / Android app lives here",
    description:
      "This is a placeholder entry showing how a mobile app appears in the store. Replace it in apps.js with your real app: set the name, description, App Store / Play Store links and a few features.",
    icon: "📱",
    category: "mobile",
    platforms: ["iOS", "Android"],
    status: "coming-soon",
    price: "Coming Soon",
    accent: "#22c55e",
    placeholder: true,
    links: { github: "https://github.com/ProfessorEngineergit" },
    features: [
      { icon: "👆", title: "Native Feel", sub: "Built for touch" },
      { icon: "🔔", title: "Notifications", sub: "Stay in the loop" },
      { icon: "☁️", title: "Sync", sub: "Across your devices" },
      { icon: "🧩", title: "Edit in apps.js", sub: "Swap for your real app" }
    ],
    visual: "preview"
  }
];

/* Category metadata used for the filter tabs & labels. */
const CATEGORIES = [
  { id: "all", label: "All Apps", icon: "✨" },
  { id: "web", label: "Web", icon: "🌐" },
  { id: "mobile", label: "Mobile", icon: "📱" },
  { id: "desktop", label: "Desktop", icon: "🖥️" }
];
