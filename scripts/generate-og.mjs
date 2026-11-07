import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(ROOT, "public", "og-default.png");

const manropeB64 = readFileSync(
  join(ROOT, "public/fonts/manrope-latin-wght-normal.woff2"),
).toString("base64");

const tajawal500B64 = readFileSync(
  join(ROOT, "public/fonts/tajawal-arabic-500-normal.woff2"),
).toString("base64");

const tajawal700B64 = readFileSync(
  join(ROOT, "public/fonts/tajawal-arabic-700-normal.woff2"),
).toString("base64");

// Extract canonical VERTEX_SHADER and FRAGMENT_SHADER from public/lab.js
const labJs = readFileSync(join(ROOT, "public/lab.js"), "utf8");
const vsMatch = labJs.match(/const VERTEX_SHADER = `([\s\S]*?)`;/);
const fsMatch = labJs.match(/const FRAGMENT_SHADER = `([\s\S]*?)`;/);

if (!vsMatch || !fsMatch) {
  throw new Error("Could not extract shaders from public/lab.js");
}

const VERTEX_SHADER = vsMatch[1];
const FRAGMENT_SHADER = fsMatch[1];

const markSvg = `<svg class="omx-signature" viewBox="0 0 124 40" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="6" stroke-linejoin="bevel"><path d="M34.5 20A15 15 0 1 1 4.5 20A15 15 0 1 1 34.5 20Z"/><path class="signature-fold" d="M45 35V5L62 24 79 5V35"/><path d="M91 5 119 35M119 5 108 17M102 23 91 35"/></g></svg>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: "Manrope";
    src: url("data:font/woff2;base64,${manropeB64}") format("woff2");
    font-weight: 200 800;
    font-display: block;
  }
  @font-face {
    font-family: "Tajawal";
    src: url("data:font/woff2;base64,${tajawal500B64}") format("woff2");
    font-weight: 500;
    font-display: block;
  }
  @font-face {
    font-family: "Tajawal";
    src: url("data:font/woff2;base64,${tajawal700B64}") format("woff2");
    font-weight: 700;
    font-display: block;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
    background: #edf0f4;
    color: #141e30;
    font-family: "Manrope", "Tajawal", sans-serif;
    -webkit-font-smoothing: antialiased;
    position: relative;
  }

  /* Subtle architectural blueprint grid across background */
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(36, 75, 219, 0.055) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(36, 75, 219, 0.055) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(circle at 38% 50%, black 35%, transparent 92%);
    pointer-events: none;
  }

  .card {
    position: relative;
    z-index: 2;
    width: 1200px;
    height: 630px;
    padding: 44px 52px;
    display: grid;
    grid-template-columns: 516px 1fr;
    gap: 36px;
    align-items: stretch;
  }

  /* Left Column: Editorial Identity & Copy */
  .left-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px 0;
  }

  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    direction: ltr;
    font-family: "Manrope", sans-serif;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.045em;
    color: #141e30;
  }

  .brand svg {
    width: 76px;
    height: auto;
    color: #244bdb;
    display: block;
  }

  .live-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: #f8f9fc;
    border: 1px solid #bcc5d2;
    border-radius: 7px;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #141e30;
  }

  .live-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #244bdb;
    box-shadow: 0 0 0 3px rgba(36, 75, 219, 0.18);
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: auto 0;
    padding: 10px 0 6px;
  }

  .eyebrow {
    font-size: 12.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #244bdb;
  }

  h1 {
    font-size: 76px;
    line-height: 0.98;
    letter-spacing: -0.055em;
    font-weight: 600;
    color: #141e30;
  }

  h1 .accent-word {
    color: #244bdb;
  }

  .subtitle-en {
    font-size: 20px;
    line-height: 1.38;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #526075;
    margin-top: 2px;
  }

  .subtitle-ar-box {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 10px;
    padding: 9px 16px;
    background: #f8f9fc;
    border: 1px solid #bcc5d2;
    border-left: 3.5px solid #244bdb;
    border-radius: 8px;
    margin-top: 4px;
  }

  .subtitle-ar {
    font-family: "Tajawal", sans-serif;
    font-size: 19px;
    font-weight: 700;
    color: #141e30;
    direction: rtl;
    line-height: 1.3;
  }

  .subtitle-ar-tag {
    font-family: "Manrope", sans-serif;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: #244bdb;
    background: #d8e5fb;
    padding: 3px 8px;
    border-radius: 4px;
  }

  .bottom-meta {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #bcc5d2;
  }

  .spec-strip {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
  }

  .spec-chip {
    padding: 5px 10px;
    background: #f8f9fc;
    border: 1px solid #bcc5d2;
    border-radius: 6px;
    font-size: 11.5px;
    font-weight: 700;
    color: #526075;
    white-space: nowrap;
  }

  .spec-chip.primary {
    background: #244bdb;
    border-color: #244bdb;
    color: #f8f9fc;
  }

  .domain-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 700;
    color: #141e30;
  }

  .domain-url {
    color: #244bdb;
    font-weight: 800;
    letter-spacing: -0.01em;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  /* Right Column: 3D WebGL Shader Stage Frame */
  .stage-card {
    background: #141e30;
    border: 1.5px solid #46546b;
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow:
      0 24px 48px -12px rgba(20, 30, 48, 0.24),
      0 0 0 1px rgba(36, 75, 219, 0.14);
    position: relative;
  }

  .stage-hud-top {
    height: 46px;
    padding: 0 18px;
    background: #1b2940;
    border-bottom: 1px solid #46546b;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11.5px;
    font-weight: 700;
    color: #edf2fb;
    flex-shrink: 0;
  }

  .hud-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .hud-badge {
    padding: 4px 9px;
    background: #263d62;
    color: #edf2fb;
    border: 1px solid #46546b;
    border-radius: 5px;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  .hud-mode {
    padding: 4px 10px;
    background: rgba(36, 75, 219, 0.32);
    color: #abc5ff;
    border: 1px solid rgba(171, 197, 255, 0.35);
    border-radius: 5px;
    font-size: 11px;
    font-weight: 700;
  }

  .hud-metrics {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .hud-metric {
    padding: 3px 8px;
    background: #141e30;
    border: 1px solid #46546b;
    border-radius: 5px;
    font-size: 10.5px;
    color: #edf2fb;
  }

  .hud-metric b {
    color: #aebbd0;
    font-weight: 600;
    margin-right: 4px;
  }

  .hud-engine {
    color: #abc5ff;
    font-weight: 800;
  }

  .viewport-wrap {
    position: relative;
    flex: 1;
    width: 100%;
    min-height: 0;
    background: #141e30;
    overflow: hidden;
  }

  #og-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  .reticles {
    position: absolute;
    inset: 14px 14px 66px 14px;
    pointer-events: none;
  }

  .reticle {
    position: absolute;
    width: 14px;
    height: 14px;
    border-color: rgba(237, 242, 251, 0.42);
    border-style: solid;
    border-width: 0;
  }
  .tl { top: 0; left: 0; border-top-width: 1.5px; border-left-width: 1.5px; }
  .tr { top: 0; right: 0; border-top-width: 1.5px; border-right-width: 1.5px; }
  .bl { bottom: 0; left: 0; border-bottom-width: 1.5px; border-left-width: 1.5px; }
  .br { bottom: 0; right: 0; border-bottom-width: 1.5px; border-right-width: 1.5px; }

  .stage-overlay-bottom {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 14px;
    background: rgba(20, 30, 48, 0.82);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(171, 197, 255, 0.24);
    border-radius: 10px;
    color: #edf2fb;
  }

  .overlay-title {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .overlay-exp {
    font-size: 13px;
    font-weight: 700;
    color: #edf2fb;
  }

  .overlay-formula {
    font-size: 10.5px;
    font-weight: 600;
    color: #abc5ff;
    letter-spacing: 0.01em;
  }

  .mode-pills {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .mode-pill {
    padding: 4px 8px;
    border-radius: 5px;
    font-size: 10px;
    font-weight: 700;
    background: rgba(38, 61, 98, 0.7);
    color: #aebbd0;
    border: 1px solid #46546b;
  }

  .mode-pill.active {
    background: #244bdb;
    color: #ffffff;
    border-color: #abc5ff;
  }
</style>
</head>
<body>
  <div class="bg-grid"></div>
  <main class="card">
    <div class="left-col">
      <div class="top-bar">
        <div class="brand">
          ${markSvg}
          <span>Lab</span>
        </div>
        <div class="live-pill">
          <span class="live-dot"></span>
          <span>EXP-001 // LIVE STAGE</span>
        </div>
      </div>

      <div class="hero-copy">
        <div class="eyebrow">AUTONOMOUS 3D &amp; INTERACTIVE WEBGL LAB</div>
        <h1>Ideas Into<br><span class="accent-word">Reality</span></h1>
        <p class="subtitle-en">Real-time GPU raymarched SDF topology, shader physics &amp; generative 3D experiments.</p>
        <div class="subtitle-ar-box">
          <span class="subtitle-ar-tag">AR // EN</span>
          <span class="subtitle-ar" lang="ar" dir="rtl">مختبر الرسوميات التفاعلية الثلاثية الأبعاد — من فكرة إلى حقيقة</span>
        </div>
      </div>

      <div class="bottom-meta">
        <div class="spec-strip">
          <span class="spec-chip primary">EXP-001 · Cobalt Singularity</span>
          <span class="spec-chip">GLSL SDF Raymarching</span>
          <span class="spec-chip">4 Harmonic Modes</span>
        </div>
        <div class="domain-row">
          <span>OMX Research &amp; Interactive Division</span>
          <span class="domain-url">lab.omxhub.com ↗</span>
        </div>
      </div>
    </div>

    <div class="stage-card">
      <div class="stage-hud-top">
        <div class="hud-left">
          <span class="hud-badge">EXP-001 // SDF</span>
          <span class="hud-mode">01 · Cobalt Fold</span>
        </div>
        <div class="hud-metrics">
          <span class="hud-metric"><b>FPS</b>60</span>
          <span class="hud-metric"><b>STEP</b>64</span>
          <span class="hud-metric hud-engine">WEBGL2 // GLSL</span>
        </div>
      </div>

      <div class="viewport-wrap">
        <canvas id="og-canvas" width="1088" height="956"></canvas>
        <div class="reticles">
          <span class="reticle tl"></span>
          <span class="reticle tr"></span>
          <span class="reticle bl"></span>
          <span class="reticle br"></span>
        </div>
        <div class="stage-overlay-bottom">
          <div class="overlay-title">
            <span class="overlay-exp">Morphogenic Cobalt Singularity</span>
            <span class="overlay-formula">SDF(p) = smin(torusKnotFold(p), gyroidRibbon(p, u_time))</span>
          </div>
          <div class="mode-pills">
            <span class="mode-pill active">M-01</span>
            <span class="mode-pill">M-02</span>
            <span class="mode-pill">M-03</span>
            <span class="mode-pill">M-04</span>
          </div>
        </div>
      </div>
    </div>
  </main>

  <script>
    const VERTEX_SHADER = ${JSON.stringify(VERTEX_SHADER)};
    const FRAGMENT_SHADER = ${JSON.stringify(FRAGMENT_SHADER)};

    const canvas = document.getElementById("og-canvas");
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: true,
      preserveDrawingBuffer: true
    }) || canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      preserveDrawingBuffer: true
    });

    if (gl) {
      const isWebGL2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
      if (!isWebGL2) gl.getExtension("OES_standard_derivatives");

      const compile = (type, src) => {
        const s = gl.createShader(type);
        const finalSrc = (!isWebGL2 && type === gl.FRAGMENT_SHADER)
          ? "#extension GL_OES_standard_derivatives : enable\\n" + src
          : src;
        gl.shaderSource(s, finalSrc);
        gl.compileShader(s);
        return s;
      };

      const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );

      const posLoc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(gl.getUniformLocation(prog, "u_resolution"), canvas.width, canvas.height);
      // Rich sculptural angle blending Cobalt Fold + subtle Solar/Singularity harmonic accents
      gl.uniform1f(gl.getUniformLocation(prog, "u_time"), 2.45);
      gl.uniform2f(gl.getUniformLocation(prog, "u_pointer"), 0.34, -0.22);
      gl.uniform4f(gl.getUniformLocation(prog, "u_weights"), 0.86, 0.14, 0.0, 0.0);
      gl.uniform1f(gl.getUniformLocation(prog, "u_turbulence"), 1.18);
      gl.uniform1f(gl.getUniformLocation(prog, "u_speed"), 1.0);
      gl.uniform1f(gl.getUniformLocation(prog, "u_shift"), 0.42);
      gl.uniform1f(gl.getUniformLocation(prog, "u_dark"), 1.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.finish();
      window.__OG_RENDERED__ = true;
    } else {
      window.__OG_RENDERED__ = false;
    }
  </script>
</body>
</html>`;

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.__OG_RENDERED__ !== undefined);
  const webglOk = await page.evaluate(() => window.__OG_RENDERED__);
  await page.screenshot({ path: outPath });
  console.log(`Generated 1200 × 630 OMX Lab social image (${outPath}) [WebGL: ${webglOk}]`);
} finally {
  await browser.close();
}
