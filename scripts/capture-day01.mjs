import { mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "@playwright/test";

const SITE_URL = process.env.LAB_URL || "https://lab.omxhub.com";
const SCREENSHOTS_DIR = join(
  process.env.LOCALAPPDATA || "C:/Users/q2p/AppData/Local",
  "hermes",
  "cache",
  "screenshots"
);
const FRAMES_DIR = join(
  process.env.LOCALAPPDATA || "C:/Users/q2p/AppData/Local",
  "hermes",
  "cache",
  "scratch",
  "omx-lab-day01-frames"
);

mkdirSync(SCREENSHOTS_DIR, { recursive: true });
if (existsSync(FRAMES_DIR)) {
  rmSync(FRAMES_DIR, { recursive: true, force: true });
}
mkdirSync(FRAMES_DIR, { recursive: true });

console.log(`Starting OMX Lab Day 01 Showcase Capture from ${SITE_URL}...`);

const browser = await chromium.launch({
  headless: true,
});

try {
  // 1. Capture High-Res Screenshots (Arabic Dark Mode + English Light Mode)
  const shotContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  const shotPage = await shotContext.newPage();

  // Arabic Dark Theme — Mode 01 (Cobalt Fold)
  await shotPage.goto(`${SITE_URL}/?lang=ar&cb=${Date.now()}`, { waitUntil: "domcontentloaded" });
  await shotPage.waitForFunction(() => Boolean(window.__OMX_LAB__));
  const stateInfo = await shotPage.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("omxhub-theme", "dark");
    window.__OMX_LAB__.setMode(0);
    window.__OMX_LAB__.setParams({ turbulence: 1.05, speed: 1.0, shift: 0.35 });
    window.__OMX_LAB__.setPointer(0.28, -0.18);
    return window.__OMX_LAB__.stepFrame(1 / 30, 45);
  });
  console.log("Engine State (AR Dark):", JSON.stringify(stateInfo));

  const darkArPath = join(SCREENSHOTS_DIR, "omx-lab-day01-ar-dark.png");
  await shotPage.screenshot({ path: darkArPath, fullPage: false, animations: "allow" });
  console.log(`Saved Arabic Dark screenshot: ${darkArPath}`);

  // Stage-only close-up in Dark Mode (Mode 04: Singularity Vortex)
  await shotPage.evaluate(() => {
    window.__OMX_LAB__.setMode(3);
    window.__OMX_LAB__.setParams({ turbulence: 1.35, speed: 1.2, shift: 0.65 });
    window.__OMX_LAB__.setPointer(-0.32, 0.24);
    window.__OMX_LAB__.stepFrame(1 / 30, 60);
  });
  const stageVortexPath = join(SCREENSHOTS_DIR, "omx-lab-day01-vortex.png");
  const stageCard = shotPage.locator(".stage-frame");
  await stageCard.screenshot({ path: stageVortexPath, animations: "allow" });
  console.log(`Saved Stage Vortex close-up: ${stageVortexPath}`);

  // English Light Theme — Mode 03 (Quantum Lattice)
  await shotPage.goto(`${SITE_URL}/?lang=en&cb=${Date.now()}`, { waitUntil: "domcontentloaded" });
  await shotPage.waitForFunction(() => Boolean(window.__OMX_LAB__));
  await shotPage.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("omxhub-theme", "light");
    window.__OMX_LAB__.setMode(2);
    window.__OMX_LAB__.setParams({ turbulence: 1.15, speed: 1.0, shift: 0.45 });
    window.__OMX_LAB__.setPointer(0.22, 0.25);
    window.__OMX_LAB__.stepFrame(1 / 30, 45);
  });
  const lightEnPath = join(SCREENSHOTS_DIR, "omx-lab-day01-en-light.png");
  await shotPage.screenshot({ path: lightEnPath, fullPage: false, animations: "allow" });
  console.log(`Saved English Light screenshot: ${lightEnPath}`);

  await shotContext.close();

  // 2. Record Deterministic 30fps MP4 Showcase Video (5 seconds = 150 frames)
  const vidContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  const vidPage = await vidContext.newPage();
  await vidPage.goto(`${SITE_URL}/?lang=ar&cb=${Date.now()}`, { waitUntil: "domcontentloaded" });
  await vidPage.waitForFunction(() => Boolean(window.__OMX_LAB__));

  await vidPage.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("omxhub-theme", "dark");
    const stageEl = document.querySelector(".stage-frame");
    if (stageEl) {
      stageEl.scrollIntoView({ behavior: "instant", block: "center" });
    }
  });

  const TOTAL_FRAMES = 150; // 5 seconds at 30fps
  const FPS = 30;
  console.log(`Rendering ${TOTAL_FRAMES} deterministic WebGL frames for X showcase video...`);

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const t = f / FPS;
    const modeIdx = Math.min(3, Math.floor(t / 1.25));
    const px = Math.sin(t * 1.9) * 0.68;
    const py = Math.cos(t * 1.4) * 0.44;
    const turb = 0.9 + 0.55 * Math.sin(t * 1.5);
    const shift = 0.2 + 0.65 * (0.5 + 0.5 * Math.cos(t * 1.2));

    await vidPage.evaluate(
      ({ modeIdx, px, py, turb, shift }) => {
        const buttons = document.querySelectorAll(".preset-btn");
        if (buttons[modeIdx] && !buttons[modeIdx].classList.contains("active")) {
          buttons[modeIdx].click();
        }
        window.__OMX_LAB__.setPointer(px, py);
        window.__OMX_LAB__.setParams({ turbulence: turb, speed: 1.4, shift });
        window.__OMX_LAB__.stepFrame(1 / 30, 1);
        const fpsEl = document.getElementById("hud-fps");
        if (fpsEl) fpsEl.textContent = "60";
      },
      { modeIdx, px, py, turb, shift }
    );

    const frameFile = join(
      FRAMES_DIR,
      `frame_${String(f).padStart(4, "0")}.png`
    );
    await vidPage.screenshot({ path: frameFile, animations: "allow" });
    if ((f + 1) % 30 === 0) {
      console.log(`  Captured frame ${f + 1}/${TOTAL_FRAMES}`);
    }
  }

  await vidContext.close();

  // 3. Encode MP4 with FFmpeg (H.264, yuv420p, faststart for X & Telegram inline playback)
  const mp4Path = join(SCREENSHOTS_DIR, "omx-lab-day01-showcase.mp4");
  console.log(`Encoding MP4 video to ${mp4Path}...`);
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-framerate",
      String(FPS),
      "-i",
      join(FRAMES_DIR, "frame_%04d.png"),
      "-vf",
      "scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "18",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      mp4Path,
    ],
    { stdio: "inherit" }
  );

  console.log(`SUCCESS! Video encoded at: ${mp4Path}`);
} finally {
  await browser.close();
}
