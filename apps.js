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
 *    platforms   array of short platform chips, e.g. ["macOS"], ["iOS"]
 *    status      "available" | "coming-soon"
 *    price       free text, e.g. "Free", "€2.99", "Free • Open Source"
 *    accent      hex color used for this app's glow/accents
 *    placeholder true => visually marked as an example entry to be replaced
 *    links       { web, dmg, appstore, github } — omit/empty any that don't apply
 *    features    [ { icon, title, sub } ] — up to 4 look best
 *    visual      one of: "ring" | "suffix" | "rename" | "preview"
 *    visualData  optional object feeding the chosen visual (see app.js)
 * ============================================================ */

const APPS = [
  /* ============================================================
   *  WEB — browser-based tools
   * ============================================================ */
  {
    id: "looksmith",
    name: "Looksmith",
    tagline: "Design an app aesthetic, get the AI prompt",
    description:
      "Looksmith is a visual design tool: mix backdrops, surfaces, shapes, textures and type to compose a custom look, then generate a precise Markdown prompt — with design tokens — to hand to any AI coding assistant. Move beyond the default AI aesthetic.",
    icon: "🎨",
    category: "web",
    platforms: ["Web", "PWA"],
    status: "available",
    price: "Free • Open Source",
    accent: "#a855f7",
    links: {
      web: "https://professorengineergit.github.io/Looksmith/",
      github: "https://github.com/ProfessorEngineergit/Looksmith"
    },
    features: [
      { icon: "🧩", title: "46 Styles", sub: "Liquid Glass to Cyberpunk" },
      { icon: "🪟", title: "Real Effects", sub: "SVG-based liquid glass" },
      { icon: "🔤", title: "34 Type Pairs", sub: "Plus custom fonts" },
      { icon: "📝", title: "Prompt Export", sub: "Markdown + design tokens" }
    ],
    visual: "preview"
  },
  {
    id: "openimagelabel",
    name: "OpenImageLabel",
    tagline: "Turn photos + metadata into polished labels",
    description:
      "Upload your photos, add metadata, and OpenImageLabel produces clean, professionally styled labeled images — perfect for portfolios, listings and documentation. Everything runs right in your browser.",
    icon: "🏷️",
    category: "web",
    platforms: ["Web"],
    status: "available",
    price: "Free • Open Source",
    accent: "#06b6d4",
    links: {
      web: "https://professorengineergit.github.io/OpenImageLabel/",
      github: "https://github.com/ProfessorEngineergit/OpenImageLabel"
    },
    features: [
      { icon: "📤", title: "Upload", sub: "Photos with metadata" },
      { icon: "✨", title: "Auto-Style", sub: "Clean, pro layout" },
      { icon: "🖼️", title: "Labeled Output", sub: "Ready to share" },
      { icon: "🔒", title: "In-Browser", sub: "No upload to a server" }
    ],
    visual: "preview"
  },
  {
    id: "opensiteblocker",
    name: "OpenSiteBlocker",
    tagline: "Generate snippets that lock down a web page",
    description:
      "Build personalized HTML/JS snippets that disable text selection, zooming, scrolling, right-click, copy/paste, drag & drop and dev tools — pick exactly what to restrict and copy the code. Vanilla JS, glassmorphism UI, light & dark mode.",
    icon: "🛡️",
    category: "web",
    platforms: ["Web"],
    status: "available",
    price: "Free • Open Source",
    accent: "#f43f5e",
    links: {
      web: "https://professorengineergit.github.io/OpenSitezoomBlocker/",
      github: "https://github.com/ProfessorEngineergit/OpenSitezoomBlocker"
    },
    features: [
      { icon: "🚫", title: "Pick & Block", sub: "Selection, zoom, scroll…" },
      { icon: "📋", title: "Copy Guard", sub: "Copy / cut / paste off" },
      { icon: "🧪", title: "Dev Tools", sub: "Optional lock-down" },
      { icon: "🌗", title: "Light & Dark", sub: "Responsive glass UI" }
    ],
    visual: "preview"
  },
  {
    id: "tasks",
    name: "Tasks",
    tagline: "A modern to-do app that syncs in real time",
    description:
      "A clean to-do app with GitHub sign-in and real-time Firestore sync. Move tasks through Todo → In Progress → Done, set deadlines, and define daily recurring tasks that reset automatically. Your tasks stay private to you.",
    icon: "✅",
    category: "web",
    platforms: ["Web"],
    status: "available",
    price: "Free • Open Source",
    accent: "#22c55e",
    links: {
      web: "https://professorengineergit.github.io/tasks/",
      github: "https://github.com/ProfessorEngineergit/tasks"
    },
    features: [
      { icon: "🔐", title: "GitHub Login", sub: "Secure OAuth" },
      { icon: "🔄", title: "Realtime Sync", sub: "Firestore-backed" },
      { icon: "📊", title: "3 Stages", sub: "Todo · Doing · Done" },
      { icon: "🔁", title: "Daily Tasks", sub: "Auto-reset recurring" }
    ],
    visual: "preview"
  },
  {
    id: "ui-swipe",
    name: "UI-Swipe",
    tagline: "Tinder-style swiping for any JSON feed",
    description:
      "An interactive card-swiping interface that pulls items from a JSON API and lets you accept or reject them with smooth, Tinder-like gestures. A ready-to-use building block for triage, curation and review flows.",
    icon: "🃏",
    category: "web",
    platforms: ["Web"],
    status: "available",
    price: "Free • Open Source",
    accent: "#ec4899",
    links: {
      web: "https://professorengineergit.github.io/UI-Swipe/",
      github: "https://github.com/ProfessorEngineergit/UI-Swipe"
    },
    features: [
      { icon: "👈", title: "Swipe", sub: "Accept or reject" },
      { icon: "🔌", title: "JSON API", sub: "Bring your own data" },
      { icon: "✨", title: "Smooth", sub: "Fluid card motion" },
      { icon: "🧱", title: "Reusable", sub: "Drop into any flow" }
    ],
    visual: "preview"
  },
  {
    id: "things-i-wish-for",
    name: "Things I Wish For",
    tagline: "A shareable wishlist you actually control",
    description:
      "Sign in with Google to manage your private wishlist — add a title, link, photo and description — and mark individual wishes public so visitors can browse them on the landing page. Backed by Firebase Firestore with a dark glass design.",
    icon: "⭐",
    category: "web",
    platforms: ["Web"],
    status: "available",
    price: "Free • Open Source",
    accent: "#fbbf24",
    links: {
      web: "https://professorengineergit.github.io/things_I_wish_for/",
      github: "https://github.com/ProfessorEngineergit/things_I_wish_for"
    },
    features: [
      { icon: "🔓", title: "Google Sign-In", sub: "Owner-only editing" },
      { icon: "🌐", title: "Public Wishes", sub: "Share what you choose" },
      { icon: "🖼️", title: "Rich Items", sub: "Link + photo + notes" },
      { icon: "🔥", title: "Firestore", sub: "Cloud-synced" }
    ],
    visual: "preview"
  },
  {
    id: "splat-viewer",
    name: "Paasleben Splat Viewer",
    tagline: "View 3D Gaussian Splat scenes in the browser",
    description:
      "A browser-based renderer for 3D Gaussian Splat scenes — point it at a splat file and explore. Early preview: a preliminary minimal version that's still under active development.",
    icon: "🌌",
    category: "web",
    platforms: ["Web"],
    status: "coming-soon",
    price: "Free • Beta",
    accent: "#14b8a6",
    links: {
      web: "https://professorengineergit.github.io/Paasleben--Splat-Styling-Tester/",
      github: "https://github.com/ProfessorEngineergit/Paasleben--Splat-Styling-Tester"
    },
    features: [
      { icon: "🟣", title: "Gaussian Splats", sub: "Real-time render" },
      { icon: "🖥️", title: "WebGL", sub: "Runs in the browser" },
      { icon: "📂", title: "Load a File", sub: "Drop in your scene" },
      { icon: "🚧", title: "In Development", sub: "Preview build" }
    ],
    visual: "preview"
  },

  /* ============================================================
   *  MOBILE — iOS
   * ============================================================ */
  {
    id: "screentimehacker",
    name: "ScreenTime Hacker",
    tagline: "Recover your own Screen Time passcode",
    description:
      "An educational tool to recover a forgotten Screen Time passcode from an unencrypted iPhone backup. It reads the relevant .plist, extracts the hashed code and salt, and brute-forces 4–6 digit codes locally (PBKDF2-HMAC-SHA1). Processing stays on-device with no storage — intended for your own device or with the owner's explicit permission.",
    icon: "🔓",
    category: "mobile",
    platforms: ["iOS"],
    status: "available",
    price: "Free • Open Source",
    accent: "#3b82f6",
    links: { github: "https://github.com/ProfessorEngineergit/ScreentimeHackerIOS" },
    features: [
      { icon: "📦", title: "From Backup", sub: "Reads local .plist" },
      { icon: "🔢", title: "4–6 Digits", sub: "PBKDF2 brute-force" },
      { icon: "🔒", title: "On-Device", sub: "No data stored" },
      { icon: "🎓", title: "Educational", sub: "Own device / consent" }
    ],
    visual: "preview"
  },

  /* ============================================================
   *  DESKTOP — macOS
   * ============================================================ */
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
    links: { github: "https://github.com/ProfessorEngineergit/RenderStatus" },
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
  {
    id: "loki-prank",
    name: "Loki",
    tagline: "Harmless, reversible macOS menu-bar pranks",
    description:
      "Loki is an open-source macOS menu-bar app with 32 harmless, fully reversible pranks — browser tricks, screen effects, fake dialogs and more — chained into orchestrated modes. Consent-gated by design, with a global panic key (⌃⌥⌘P) to instantly undo everything and an auto-resolve timer.",
    icon: "🎭",
    category: "desktop",
    platforms: ["macOS"],
    status: "available",
    price: "Free • Open Source",
    accent: "#f97316",
    links: { github: "https://github.com/ProfessorEngineergit/loki-prank" },
    features: [
      { icon: "🎲", title: "32 Pranks", sub: "All reversible" },
      { icon: "🧯", title: "Panic Key", sub: "⌃⌥⌘P undoes all" },
      { icon: "✅", title: "Consent-Gated", sub: "No data theft" },
      { icon: "⏱️", title: "Auto-Resolve", sub: "Self-reveal timer" }
    ],
    visual: "preview"
  },
  {
    id: "sshmanager",
    name: "SSHmanager",
    tagline: "Your SSH connections, visual and one click away",
    description:
      "Store, name and organize your SSH connections in a clean graphical interface and launch them in the terminal with a single click — no memorizing commands. Group by project, search instantly and star your favorites. Built for macOS (Windows secondary).",
    icon: "🔌",
    category: "desktop",
    platforms: ["macOS"],
    status: "coming-soon",
    price: "Free • Open Source",
    accent: "#10b981",
    links: { github: "https://github.com/ProfessorEngineergit/SSHmanager" },
    features: [
      { icon: "🗂️", title: "Organize", sub: "Group & name hosts" },
      { icon: "⚡", title: "One Click", sub: "Launch in terminal" },
      { icon: "🔎", title: "Search", sub: "Find any connection" },
      { icon: "⭐", title: "Favorites", sub: "Pin frequent hosts" }
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
