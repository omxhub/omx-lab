export type Locale = "en" | "ar";

const SITE = "https://lab.omxhub.com";

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

/** The canonical OMX Folded Signature mark. Verbatim geometry, never mirrored. */
export const mark = `<svg class="omx-signature" viewBox="0 0 124 40" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="6" stroke-linejoin="bevel"><path d="M34.5 20A15 15 0 1 1 4.5 20A15 15 0 1 1 34.5 20Z"/><path class="signature-fold" d="M45 35V5L62 24 79 5V35"/><path d="M91 5 119 35M119 5 108 17M102 23 91 35"/></g></svg>`;

export const arrow = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>`;

const alternates = `<link rel="alternate" hreflang="en" href="${SITE}/?lang=en"><link rel="alternate" hreflang="ar" href="${SITE}/?lang=ar"><link rel="alternate" hreflang="x-default" href="${SITE}/">`;

interface ExperimentItem {
  day: string;
  code: string;
  status: "live" | "queued";
  statusLabel: { en: string; ar: string };
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  summary: { en: string; ar: string };
  specs: string[];
  glyph: "cobalt" | "attractor" | "globe" | "monolith" | "synth";
}

const EXPERIMENTS: ExperimentItem[] = [
  {
    day: "DAY 01",
    code: "EXP-001",
    status: "live",
    statusLabel: { en: "ACTIVE // LIVE ON STAGE", ar: "نشط // مباشر على المنصة" },
    title: {
      en: "Morphogenic Cobalt Singularity",
      ar: "طاقة الكوبالت التفاعلية",
    },
    subtitle: {
      en: "Interactive WebGL GLSL Raymarched 3D Shader",
      ar: "شيدر ثلاثي الأبعاد تفاعلي بتقنية تتبع الأشعة GLSL",
    },
    summary: {
      en: "Real-time signed distance field (SDF) raymarching of the OMX sculptural cobalt ribbon and harmonic topologies, with analytical surface normals, dual-specular Fresnel lighting, and domain-warped volumetric energy fields.",
      ar: "تتبع أشعة فوري لحقول المسافة الموقعة (SDF) يجسّد شريط الكوبالت النحتي وتشكيلات توافقية ثلاثية الأبعاد مع إضاءة فرينل الانعكاسية وتشويه المجالات الحجمية.",
    },
    specs: ["GLSL ES 3.0 / 1.0", "64-Step SDF Raymarch", "4 Harmonic Topologies", "60 FPS Deterministic"],
    glyph: "cobalt",
  },
  {
    day: "DAY 02",
    code: "EXP-002",
    status: "queued",
    statusLabel: { en: "DAY 02 // QUEUED", ar: "اليوم ٠٢ // قيد الإطلاق" },
    title: {
      en: "100K GPU Particle Attractor",
      ar: "جاذب الجسيمات عبر معالج الرسوميات (100K)",
    },
    subtitle: {
      en: "Floating-Point FBO Strange Attractor Simulation",
      ar: "محاكاة الأنظمة الديناميكية الفوضوية عبر الذاكرة الرسومية",
    },
    summary: {
      en: "Ping-pong floating-point framebuffer velocity integration advecting 100,000 autonomous particles through Aizawa and Thomas strange attractors with curl-noise turbulence.",
      ar: "تكامل سرعات فوري عبر مخازن الإطارات العائمة لتحريك ١٠٠ ألف جسيم داخل جاذبات ديناميكية ثلاثية الأبعاد مع حقول اضطراب دوامية.",
    },
    specs: ["WebGL2 FBO Ping-Pong", "100,000 Instances", "RK4 Integration", "Curl-Noise Field"],
    glyph: "attractor",
  },
  {
    day: "DAY 03",
    code: "EXP-003",
    status: "queued",
    statusLabel: { en: "DAY 03 // QUEUED", ar: "اليوم ٠٣ // قيد الإطلاق" },
    title: {
      en: "Real-Time Orbital Telemetry Globe",
      ar: "مجسّم المدارات الفضائية الفوري",
    },
    subtitle: {
      en: "Geodesic Instanced Mesh & Rayleigh Atmosphere",
      ar: "شبكة جيوديسية ثلاثية الأبعاد وغلاف جوي فيزيائي",
    },
    summary: {
      en: "High-precision spherical planetary projection with physical atmospheric rim scattering, great-circle geodesic telemetry arcs, and spatial coordinate picking.",
      ar: "إسقاط كروي عالي الدقة مع تشتت ضوئي فيزيائي للغلاف الجوي، ومسارات مدارية جيوديسية، وتفاعل إحداثي مباشر.",
    },
    specs: ["Geodesic Subdivisions", "Rayleigh Scattering", "Great-Circle Splines", "Spatial Raycast"],
    glyph: "globe",
  },
  {
    day: "DAY 04",
    code: "EXP-004",
    status: "queued",
    statusLabel: { en: "DAY 04 // QUEUED", ar: "اليوم ٠٤ // قيد الإطلاق" },
    title: {
      en: "Isometric Architectural Light Study",
      ar: "دراسة الإضاءة المعمارية الأيزومترية",
    },
    subtitle: {
      en: "Orthographic Penumbra Soft-Shadow Raymarcher",
      ar: "تتبع أشعة متعامد مع ظلال ناعمة وفيزياء معمارية",
    },
    summary: {
      en: "Procedural brutalist concrete and brushed cobalt monoliths rendered under orthographic projection with multi-bounce ambient occlusion and solar azimuth scrubbing.",
      ar: "كتل معمارية إجرائية من الخرسانة والكوبالت المصقول بإسقاط أيزومتري متعامد مع انسداد محيطي وظلال شمسية متحركة.",
    },
    specs: ["Orthographic Camera", "Soft Penumbra SDF", "4-Tap Ambient Occlusion", "Solar Azimuth"],
    glyph: "monolith",
  },
  {
    day: "DAY 05",
    code: "EXP-005",
    status: "queued",
    statusLabel: { en: "DAY 05 // QUEUED", ar: "اليوم ٠٥ // قيد الإطلاق" },
    title: {
      en: "Generative Sci-Fi Geometry Synthesizer",
      ar: "مركّب الهندسة التوليدية ثلاثي الأبعاد",
    },
    subtitle: {
      en: "Parametric CSG Boolean & KIFS Fractal Folding",
      ar: "عمليات منطقية بارامترية وطيّ هندسي متعدد الأبعاد",
    },
    summary: {
      en: "Constructive solid geometry (CSG) boolean chambers and Kaleidoscopic Iterated Function Systems (KIFS) modulated by multi-band harmonic LFO synthesizers.",
      ar: "هندسة صلبة بنّاءة (CSG) وأنظمة دالّية تكرارية متعددة التناظر (KIFS) مدفوعة بمذبذبات توافقية متعددة النطاقات.",
    },
    specs: ["Smooth CSG Booleans", "KIFS Folding", "Harmonic LFO Matrix", "Analytic Curvature"],
    glyph: "synth",
  },
];

function renderGlyph(glyph: ExperimentItem["glyph"]): string {
  switch (glyph) {
    case "cobalt":
      return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><circle cx="40" cy="40" r="28" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/><path d="M22 52L34 24L46 46L58 26" stroke="currentColor" stroke-width="4" stroke-linejoin="bevel"/><circle cx="40" cy="40" r="10" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="2.5"/></svg>`;
    case "attractor":
      return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><ellipse cx="40" cy="40" rx="28" ry="14" transform="rotate(-28 40 40)" stroke="currentColor" stroke-width="2"/><ellipse cx="40" cy="40" rx="28" ry="14" transform="rotate(32 40 40)" stroke="currentColor" stroke-width="2"/><circle cx="26" cy="34" r="3.5" fill="currentColor"/><circle cx="54" cy="46" r="3.5" fill="currentColor"/><circle cx="40" cy="40" r="4" fill="currentColor"/></svg>`;
    case "globe":
      return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><circle cx="40" cy="40" r="26" stroke="currentColor" stroke-width="2.2"/><ellipse cx="40" cy="40" rx="13" ry="26" stroke="currentColor" stroke-width="1.6"/><path d="M14 40h52M18 28h44M18 52h44" stroke="currentColor" stroke-width="1.4"/></svg>`;
    case "monolith":
      return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 14L64 27V53L40 66L16 53V27L40 14Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="bevel"/><path d="M40 14V66M16 27L40 40L64 27" stroke="currentColor" stroke-width="1.8"/></svg>`;
    case "synth":
      return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><rect x="18" y="18" width="44" height="44" transform="rotate(15 40 40)" stroke="currentColor" stroke-width="2"/><rect x="24" y="24" width="32" height="32" transform="rotate(-15 40 40)" stroke="currentColor" stroke-width="2"/><circle cx="40" cy="40" r="6" stroke="currentColor" stroke-width="2.2"/></svg>`;
  }
}

function structuredData(locale: Locale): string {
  const isAr = locale === "ar";
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE}/#webapp`,
    name: isAr ? "مختبر OMX — OMX Lab" : "OMX Lab — Autonomous 3D & Interactive Lab",
    url: `${SITE}/`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (WebGL / Browser)",
    inLanguage: locale,
    description: isAr
      ? "مختبر OMX للتجارب التفاعلية ثلاثية الأبعاد، الشيدرز الفورية WebGL GLSL، والهندسة الحاسوبية — من فكرة إلى حقيقة."
      : "OMX Lab is the autonomous 3D, WebGL GLSL shader, and interactive graphics research division of OMX — Ideas Into Reality.",
    creator: {
      "@type": "Organization",
      name: "OMX",
      url: "https://omxhub.com/",
      logo: `${SITE}/favicon.svg`,
    },
  }).replace(/</g, "\\u003c");
}

export function page(locale: Locale = "en"): string {
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const metaTitle = isAr
    ? "OMX Lab — من فكرة إلى حقيقة | مختبر الرسوميات التفاعلية WebGL"
    : "OMX Lab — Ideas Into Reality | Autonomous 3D & Interactive WebGL Lab";

  const metaDesc = isAr
    ? "مختبر OMX للتجارب البصرية ثلاثية الأبعاد والشيدرز الفورية (WebGL GLSL). استكشف تجربة اليوم ٠١: طاقة الكوبالت التفاعلية بتقنية تتبع الأشعة."
    : "OMX Lab is an autonomous 3D, WebGL GLSL, and interactive shader laboratory. Explore Day 01 (EXP-001): Morphogenic Cobalt Singularity in real time.";

  const modes = [
    {
      index: "01",
      indexAr: "٠١",
      id: 0,
      nameEn: "01 · Cobalt Fold",
      nameAr: "٠١ · طية الكوبالت",
      shortEn: "Cobalt Fold",
      shortAr: "طية الكوبالت",
      descEn: "Liquid metallic ribbon torus-knot morphing with iridescent rim lighting",
      descAr: "تشكّل شريط الكوبالت المعدني السائل مع إضاءة حواف طيفية",
    },
    {
      index: "02",
      indexAr: "٠٢",
      id: 1,
      nameEn: "02 · Solar Pulse",
      nameAr: "٠٢ · النبض الشمسي",
      shortEn: "Solar Pulse",
      shortAr: "النبض الشمسي",
      descEn: "High-energy harmonic plasma waves & golden-cobalt interference rings",
      descAr: "موجات بلازما توافقية عالية الطاقة وحلقات تداخل ذهبية وكوبالتية",
    },
    {
      index: "03",
      indexAr: "٠٣",
      id: 2,
      nameEn: "03 · Quantum Lattice",
      nameAr: "٠٣ · الشبكة الكمية",
      shortEn: "Quantum Lattice",
      shortAr: "الشبكة الكمية",
      descEn: "Crystalline 3D SDF octree & geometric hyperbolic folding",
      descAr: "شبكة بلورية ثلاثية الأبعاد وطيّ هندسي زائدي متعدد المستويات",
    },
    {
      index: "04",
      indexAr: "٠٤",
      id: 3,
      nameEn: "04 · Singularity Vortex",
      nameAr: "٠٤ · دوامة التفرد",
      shortEn: "Singularity Vortex",
      shortAr: "دوامة التفرد",
      descEn: "Gravitational lens distortion with reactive energy filaments",
      descAr: "انحناء عدسي ثقالي مع خيوط طاقة تفاعلية فورية",
    },
  ];

  const modeButtonsHtml = modes
    .map((m, idx) => {
      const label = isAr ? m.nameAr : m.nameEn;
      const desc = isAr ? m.descAr : m.descEn;
      return `<button type="button" class="mode-btn" id="mode-btn-${m.id}" data-mode="${m.id}" data-name-en="${esc(m.nameEn)}" data-name-ar="${esc(m.nameAr)}" aria-pressed="${idx === 0 ? "true" : "false"}" title="${esc(desc)}"><span class="mode-btn-top"><span class="mode-index" dir="ltr">M-0${m.id + 1}</span><span class="mode-dot" aria-hidden="true"></span></span><span class="mode-title">${esc(label)}</span><span class="mode-sub">${esc(desc)}</span></button>`;
    })
    .join("");

  const experimentsHtml = EXPERIMENTS.map((exp) => {
    const isLive = exp.status === "live";
    const statusText = isAr ? exp.statusLabel.ar : exp.statusLabel.en;
    const title = isAr ? exp.title.ar : exp.title.en;
    const subtitle = isAr ? exp.subtitle.ar : exp.subtitle.en;
    const summary = isAr ? exp.summary.ar : exp.summary.en;
    const actionHtml = isLive
      ? `<a class="exp-cta exp-cta-live" href="#stage">${isAr ? "تفاعل مع التجربة الحية ↑" : "Interact on live stage ↑"}</a>`
      : `<span class="exp-cta exp-cta-queued"><span class="pulse-dot" aria-hidden="true"></span>${isAr ? "مجدول في خط الإطلاق" : "Scheduled in lab pipeline"}</span>`;

    return `<li class="exp-card ${isLive ? "exp-card-live" : "exp-card-queued"}" data-exp="${esc(exp.code)}">
      <article class="exp-article" aria-labelledby="exp-title-${esc(exp.code)}">
        <div class="exp-scene" aria-hidden="true">
          <div class="exp-glyph">${renderGlyph(exp.glyph)}</div>
          <div class="exp-scene-meta" dir="ltr">
            <span class="exp-day">${esc(exp.day)}</span>
            <span class="exp-code">${esc(exp.code)}</span>
          </div>
        </div>
        <div class="exp-body">
          <div class="exp-head">
            <span class="exp-status ${isLive ? "status-live" : "status-queued"}">${esc(statusText)}</span>
            <span class="exp-sub">${esc(subtitle)}</span>
          </div>
          <h3 id="exp-title-${esc(exp.code)}">${esc(title)}</h3>
          <p>${esc(summary)}</p>
          <ul class="exp-specs" dir="ltr" aria-label="${isAr ? "المواصفات التقنية" : "Technical specifications"}">
            ${exp.specs.map((s) => `<li>${esc(s)}</li>`).join("")}
          </ul>
          <div class="exp-foot">${actionHtml}</div>
        </div>
      </article>
    </li>`;
  }).join("");

  return `<!doctype html>
<html lang="${locale}" dir="${dir}" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(metaTitle)}</title>
  <meta name="description" content="${esc(metaDesc)}">
  <link rel="canonical" href="${SITE}/">
  <meta name="robots" content="index,follow">
  <link rel="llms-txt" href="/llms.txt">
  ${alternates}
  ${
    isAr
      ? `<meta property="og:locale" content="ar_SA"><meta property="og:locale:alternate" content="en_US">`
      : `<meta property="og:locale" content="en_US"><meta property="og:locale:alternate" content="ar_SA">`
  }
  <meta name="theme-color" content="#edf0f4" id="meta-theme">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="preload" href="/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/arabic-font.css">
  <link rel="stylesheet" href="/lab.css">
  <script src="/theme.js"></script>
  <script src="/lab.js" defer></script>
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="OMX Lab">
  <meta property="og:title" content="${esc(metaTitle)}">
  <meta property="og:description" content="${esc(metaDesc)}">
  <meta property="og:url" content="${SITE}/">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(metaTitle)}">
  <meta name="twitter:description" content="${esc(metaDesc)}">
  <script type="application/ld+json">${structuredData(locale)}</script>
</head>
<body>
  <a class="skip" href="#main">${isAr ? "تخطَّ إلى المحتوى الرئيسي" : "Skip to main content"}</a>

  <header class="header">
    <a class="brand" href="/" aria-label="OMX Lab home">
      ${mark}
      <span>OMX Lab</span>
    </a>

    <nav class="header-nav" aria-label="${isAr ? "التنقل الرئيسي" : "Main navigation"}">
      <a href="#stage">${isAr ? "المنصة التفاعلية" : "Live Stage"}</a>
      <a href="#experiments">${isAr ? "سجل التجارب" : "Experiment Log"}</a>
      <a href="#architecture">${isAr ? "البنية التقنية" : "Architecture"}</a>
      <a href="https://omxhub.com" class="parent-link">${isAr ? "استوديو OMX ↗" : "OMX Studio ↗"}</a>
    </nav>

    <div class="header-actions">
      <button
        id="motion-toggle"
        class="motion-control"
        type="button"
        aria-pressed="false"
        data-labels="${isAr ? "إيقاف الحركة|تشغيل الحركة" : "Pause motion|Resume motion"}"
        title="${isAr ? "إيقاف أو تشغيل الحركة" : "Pause or resume shader animation"}"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path class="motion-icon-pause" d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
        <span class="motion-label">${isAr ? "إيقاف الحركة" : "Pause motion"}</span>
      </button>

      ${
        isAr
          ? `<a id="lang-switch" lang="en" dir="ltr" hreflang="en" href="/?lang=en" title="Switch to English">English</a>`
          : `<a id="lang-switch" lang="ar" dir="rtl" hreflang="ar" href="/?lang=ar" title="التبديل إلى العربية">العربية</a>`
      }

      <button
        id="theme-toggle"
        class="theme"
        type="button"
        aria-label="${isAr ? "الوضع الداكن" : "Dark theme"}"
        aria-pressed="false"
        data-labels="${isAr ? "الوضع الداكن|الوضع الفاتح" : "Dark theme|Light theme"}"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/>
          <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </header>

  <main id="main">
    <section class="hero wrap" id="stage" aria-labelledby="hero-title">
      <div class="hero-top">
        <span class="intro-label">
          <span class="live-indicator" aria-hidden="true"></span>
          ${isAr ? "EXP-001 // شيدر تفاعلي مباشر — من فكرة إلى حقيقة" : "EXP-001 // LIVE INTERACTIVE SHADER — IDEAS INTO REALITY"}
        </span>
        <span class="hero-side" dir="ltr">DAY 01 · GLSL RAYMARCHING · 60 FPS</span>
      </div>

      <div class="hero-header">
        <div class="hero-title-col">
          <p class="eyebrow">${isAr ? "اليوم ٠١ · طاقة الكوبالت التفاعلية" : "DAY 01 · EXP-001 // INTERACTIVE WEBGL GLSL SHADER"}</p>
          <h1 id="hero-title">${isAr ? "طاقة الكوبالت التفاعلية" : "Morphogenic Cobalt Singularity"}</h1>
        </div>
        <div class="hero-desc-col">
          <p class="hero-lead">
            ${
              isAr
                ? "هندسة الحقول المسافية الموقعة (SDF) بتقنية تتبع الأشعة الفوري على معالج الرسوميات. حرّك المؤشر أو بدّل الأنماط التوافقية لاستكشاف طيات الكوبالت السائلة وتشويه المجالات الحجمية."
                : "Real-time GPU raymarched signed distance field (SDF) topology inspired by the OMX Folded Signature. Drag across the viewport or switch harmonic presets to bend light, curvature, and domain-warped cobalt fields."
            }
          </p>
        </div>
      </div>

      <div class="stage-frame" id="stage-frame" data-cinema="false">
        <div class="stage-hud-top">
          <div class="hud-left">
            <span class="hud-badge" id="hud-preset-badge" dir="ltr">EXP-001 // GLSL RAYMARCHING</span>
            <span class="hud-active-mode" id="hud-mode-name">${isAr ? "٠١ · طية الكوبالت" : "01 · Cobalt Fold"}</span>
          </div>
          <div class="hud-metrics" dir="ltr" aria-label="${isAr ? "قراءات الأداء الفورية" : "Real-time shader telemetry"}">
            <span class="hud-metric"><b class="hud-key">FPS</b> <span id="hud-fps">60</span></span>
            <span class="hud-metric"><b class="hud-key">TIME</b> <span id="hud-time">00.0s</span></span>
            <span class="hud-metric"><b class="hud-key">VEC</b> <span id="hud-coords">+0.00, +0.00</span></span>
            <span class="hud-metric hud-engine" id="hud-engine">WEBGL</span>
          </div>
        </div>

        <div class="canvas-viewport" id="canvas-viewport">
          <canvas
            id="shader-canvas"
            width="1280"
            height="720"
            tabindex="0"
            role="img"
            aria-label="${
              isAr
                ? "لوحة WebGL ثلاثية الأبعاد تفاعلية تعرض تجربة طاقة الكوبالت التفاعلية. استخدم مفاتيح الأسهم أو المؤشر للتحكم في زاوية الكاميرا."
                : "Interactive 3D WebGL Raymarched Shader canvas rendering Morphogenic Cobalt Singularity. Use pointer or arrow keys to orbit."
            }"
          ></canvas>

          <div class="viewport-reticles" aria-hidden="true">
            <span class="reticle reticle-tl"></span>
            <span class="reticle reticle-tr"></span>
            <span class="reticle reticle-bl"></span>
            <span class="reticle reticle-br"></span>
          </div>

          <div class="viewport-overlay-bottom" aria-hidden="true">
            <div class="overlay-tag" dir="ltr">
              <span class="overlay-dot"></span>
              <span id="overlay-formula">SDF(p) = min(ribbonFold(p), harmonicField(p, u_time))</span>
            </div>
            <div class="overlay-hint">
              ${isAr ? "اسحب لتدوير المدار · ١-٤ لتبديل النمط" : "Drag to orbit camera · Keys 1–4 switch harmonic mode"}
            </div>
          </div>

          <div class="cinema-hud-banner" id="cinema-banner" hidden>
            <span class="cinema-rec-dot" aria-hidden="true"></span>
            <span class="cinema-banner-text" dir="ltr">CINEMA CHOREOGRAPHY // AUTO-ORBIT &amp; HARMONIC CYCLE</span>
            <button type="button" class="cinema-exit-btn" id="cinema-exit-btn">
              ${isAr ? "إنهاء العرض السينمائي" : "Exit Cinema"}
            </button>
          </div>
        </div>

        <div class="stage-controls" aria-label="${isAr ? "أدوات التحكم في الشيدر" : "Shader harmonic controls"}">
          <div class="controls-section-head">
            <span class="controls-label">${isAr ? "الأنماط التوافقية الأربعة (Harmonic Presets)" : "Harmonic Topology Modes (4 Presets)"}</span>
            <span class="controls-sublabel" dir="ltr">UNIFORM u_mode [0..3]</span>
          </div>

          <div class="mode-selector" role="toolbar" aria-label="${isAr ? "اختيار نمط الشيدر" : "Shader mode presets"}">
            ${modeButtonsHtml}
          </div>

          <div class="param-controls">
            <div class="slider-group">
              <div class="slider-header">
                <label for="param-turbulence">${isAr ? "التردد / الاضطراب" : "Turbulence / Frequency"}</label>
                <output id="val-turbulence" for="param-turbulence" dir="ltr">1.00</output>
              </div>
              <input
                type="range"
                id="param-turbulence"
                min="0"
                max="2"
                step="0.01"
                value="1.00"
              >
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <label for="param-speed">${isAr ? "سرعة التشكّل" : "Morph Speed"}</label>
                <output id="val-speed" for="param-speed" dir="ltr">1.00</output>
              </div>
              <input
                type="range"
                id="param-speed"
                min="0"
                max="2.5"
                step="0.01"
                value="1.00"
              >
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <label for="param-shift">${isAr ? "الطيف اللوني" : "Chromatic Shift"}</label>
                <output id="val-shift" for="param-shift" dir="ltr">0.35</output>
              </div>
              <input
                type="range"
                id="param-shift"
                min="0"
                max="1"
                step="0.01"
                value="0.35"
              >
            </div>

            <div class="control-actions">
              <button
                type="button"
                id="cinema-mode-btn"
                class="cinema-btn"
                aria-pressed="false"
                data-labels="${isAr ? "تشغيل العرض السينمائي|إيقاف العرض السينمائي" : "Cinema Demo Mode|Exit Cinema Mode"}"
              >
                <span class="cinema-dot" aria-hidden="true"></span>
                <span class="cinema-btn-label">${isAr ? "تشغيل العرض السينمائي" : "Cinema Demo Mode"}</span>
              </button>

              <button
                type="button"
                id="reset-params-btn"
                class="reset-btn"
                title="${isAr ? "إعادة ضبط المتغيرات" : "Reset shader parameters"}"
              >
                ${isAr ? "إعادة ضبط" : "Reset"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="experiments-section" id="experiments" aria-labelledby="experiments-title">
      <div class="wrap">
        <div class="section-heading">
          <div>
            <span class="section-eyebrow">${isAr ? "سجل المختبر وخارطة الطريق" : "EXPERIMENT LOG & PIPELINE"}</span>
            <h2 id="experiments-title">${isAr ? "سلسلة التجارب البصرية اليومية." : "Autonomous Daily Graphics Log."}</h2>
          </div>
          <p>
            ${
              isAr
                ? "كل تجربة في مختبر OMX تُبنى من الصفر باستخدام الرياضيات الصرفة ومعالجات الرسوميات دون مكتبات خارجية ثقيلة — لتحويل الأفكار المعقدة إلى واقع بصري ملموس."
                : "Every experiment in OMX Lab is engineered from first principles—zero heavy runtime dependencies, pure mathematical signed distance fields, and deterministic GPU pipelines."
            }
          </p>
        </div>

        <ul class="exp-grid">
          ${experimentsHtml}
        </ul>
      </div>
    </section>

    <section class="architecture-section wrap" id="architecture" aria-labelledby="arch-title">
      <div class="arch-header">
        <div class="small-mark" aria-hidden="true">${mark}</div>
        <div>
          <span class="section-eyebrow">${isAr ? "هندسة النظام والمواصفات" : "PIPELINE ARCHITECTURE & DETERMINISM"}</span>
          <h2 id="arch-title">${isAr ? "مصمّم للدقة البصرية والتحكم البرمجي." : "Engineered for visual precision and deterministic control."}</h2>
        </div>
      </div>

      <div class="arch-grid">
        <article class="arch-card">
          <span class="arch-num" dir="ltr">01 // SDF RAYMARCHING</span>
          <h3>${isAr ? "تتبع الأشعة التحليلي" : "Analytical SDF Raymarching"}</h3>
          <p>
            ${
              isAr
                ? "يتم حساب المسافة الموقعة لكل بكسل عبر ٦٤ خطوة شعاعية مع اشتقاق المتجهات العمودية (Normals) برباعيات السطوح لحساب انعكاسات فرينل والظلال الناعمة."
                : "Each fragment evaluates a 64-step sphere-tracing loop through domain-warped 3D coordinates, computing tetrahedral gradient normals, soft penumbra shadows, and Fresnel rim reflections."
            }
          </p>
        </article>

        <article class="arch-card">
          <span class="arch-num" dir="ltr">02 // DUAL-THEME TRANSFER</span>
          <h3>${isAr ? "تكيّف لوني مزدوج للهوية" : "Adaptive Cobalt Materiality"}</h3>
          <p>
            ${
              isAr
                ? "يقرأ المحرك حالة السمة الفاتحة أو الداكنة لحظياً، فيعيد ضبط إضاءة المشهد بين الخزف الفاتح (#edf0f4) والكربون الأزرق الداكن (#141e30) مع الحفاظ على نقاء معدن الكوبالت."
                : "The shader dynamically interpolates its environment radiance between OMX Porcelain (#edf0f4) and Carbon Blue (#141e30), preserving the signature cobalt ribbon gradient across both themes."
            }
          </p>
        </article>

        <article class="arch-card">
          <span class="arch-num" dir="ltr">03 // AUTOMATION BRIDGE</span>
          <h3>${isAr ? "واجهة تحكم برمجية للتصوير" : "Telemetry & Cinema Hook"}</h3>
          <p>
            ${
              isAr
                ? "يتيح الكائن البرمجي window.__OMX_LAB__ التحكم الكامل في الأنماط التوافقية، المتغيرات، ومسار الكاميرا السينمائي لتسجيل العروض بدقة ٦٠ إطاراً في الثانية."
                : "Exposes window.__OMX_LAB__ for deterministic camera choreography, smooth multi-mode crossfades, and automated 60fps showcase capture."
            }
          </p>
        </article>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="wrap">
      <div class="footer-top">
        <div>
          <p class="footer-motto">${isAr ? "من فكرة إلى حقيقة." : "Ideas Into Reality."}</p>
          <p class="footer-sub">${isAr ? "مختبر OMX للرسوميات التفاعلية والتجارب ثلاثية الأبعاد." : "OMX Lab — Autonomous 3D, WebGL & Interactive Systems."}</p>
        </div>
        <nav aria-label="${isAr ? "روابط منظومة OMX" : "OMX Ecosystem navigation"}">
          <a href="https://omxhub.com"><span>OMX Studio</span>${arrow}</a>
          <a href="#stage"><span>EXP-001 Live Stage</span>${arrow}</a>
          <a href="#experiments"><span>Experiment Log</span>${arrow}</a>
        </nav>
      </div>
      <div class="footer-word" aria-hidden="true">OMX</div>
      <div class="footer-bottom">
        <span>© ${new Date().getUTCFullYear()} OMX. ${isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}</span>
        <span>${isAr ? "من فكرة إلى حقيقة — مختبر OMX" : "Ideas Into Reality — lab.omxhub.com"}</span>
        <a href="#main">${isAr ? "العودة إلى الأعلى ↑" : "Back to top ↑"}</a>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

export const pageEn = () => page("en");
export const pageAr = () => page("ar");
