(() => {
  const root = document.documentElement;
  const isAr = root.lang === "ar";

  // Clean ?lang=en / ?lang=ar from address bar while keeping other query params
  const initialParams = new URLSearchParams(location.search);
  const autoCinema = initialParams.get("cinema") === "1";
  if (location.search && /[?&](lang|en|ar)\b/.test(location.search)) {
    const p = new URLSearchParams(location.search);
    ["lang", "en", "ar"].forEach((k) => p.delete(k));
    const q = p.toString();
    history.replaceState(null, "", "/" + (q ? "?" + q : "") + location.hash);
  }

  // Theme Toggle Setup
  const themeBtn = document.getElementById("theme-toggle");
  const metaTheme = document.getElementById("meta-theme");
  if (themeBtn) {
    const [darkLabel, lightLabel] = (
      themeBtn.dataset.labels || "Dark theme|Light theme"
    ).split("|");
    const syncTheme = () => {
      const dark = root.getAttribute("data-theme") === "dark";
      themeBtn.setAttribute("aria-pressed", String(dark));
      themeBtn.setAttribute("aria-label", dark ? lightLabel : darkLabel);
      if (metaTheme) {
        metaTheme.setAttribute("content", dark ? "#141e30" : "#edf0f4");
      }
    };
    syncTheme();
    themeBtn.addEventListener("click", () => {
      const next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("omxhub-theme", next);
      } catch {}
      syncTheme();
    });
  }

  // Language Switch Setup
  const langSwitch = document.getElementById("lang-switch");
  if (langSwitch) {
    langSwitch.addEventListener("click", (e) => {
      e.preventDefault();
      const targetLang = root.lang === "ar" ? "en" : "ar";
      document.cookie =
        "omx_lang=" + targetLang + ";path=/;max-age=31536000;SameSite=Lax";
      location.href = "/?lang=" + targetLang;
    });
  }

  // Mode Metadata
  const MODES = [
    {
      id: 0,
      nameEn: "01 · Cobalt Fold",
      nameAr: "٠١ · طية الكوبالت",
      formula: "SDF(p) = smin(torusKnotFold(p), gyroidRibbon(p, u_time))",
    },
    {
      id: 1,
      nameEn: "02 · Solar Pulse",
      nameAr: "٠٢ · النبض الشمسي",
      formula: "SDF(p) = harmonicShell(p, u_freq) + cos(length(p)*12.0 - u_time)",
    },
    {
      id: 2,
      nameEn: "03 · Quantum Lattice",
      nameAr: "٠٣ · الشبكة الكمية",
      formula: "SDF(p) = kifsOctaFold(mod(p, l_cell), u_turbulence)",
    },
    {
      id: 3,
      nameEn: "04 · Singularity Vortex",
      nameAr: "٠٤ · دوامة التفرد",
      formula: "SDF(p) = accretionSpiral(rot(p, 1.0/r), schwarzschildLens(p))",
    },
  ];

  // State
  const state = {
    mode: 0,
    weights: [1, 0, 0, 0],
    turbulence: 1.0,
    speed: 1.0,
    shift: 0.35,
    pointer: { x: 0.18, y: 0.12 },
    targetPointer: { x: 0.18, y: 0.12 },
    cinema: false,
    cinemaStartTime: 0,
    cinemaBaseMode: 0,
    paused: false,
    time: 1.4,
    darkMix: root.getAttribute("data-theme") === "dark" ? 1.0 : 0.0,
    fps: 60,
    frameCount: 0,
    engine: "WEBGL",
  };

  // DOM Elements
  const canvas = document.getElementById("shader-canvas");
  const stageFrame = document.getElementById("stage-frame");
  const hudModeName = document.getElementById("hud-mode-name");
  const hudFps = document.getElementById("hud-fps");
  const hudTime = document.getElementById("hud-time");
  const hudCoords = document.getElementById("hud-coords");
  const hudEngine = document.getElementById("hud-engine");
  const overlayFormula = document.getElementById("overlay-formula");
  const cinemaBanner = document.getElementById("cinema-banner");
  const cinemaExitBtn = document.getElementById("cinema-exit-btn");
  const cinemaModeBtn = document.getElementById("cinema-mode-btn");
  const resetParamsBtn = document.getElementById("reset-params-btn");
  const motionToggle = document.getElementById("motion-toggle");

  const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));
  const sliderTurbulence = document.getElementById("param-turbulence");
  const sliderSpeed = document.getElementById("param-speed");
  const sliderShift = document.getElementById("param-shift");
  const outTurbulence = document.getElementById("val-turbulence");
  const outSpeed = document.getElementById("val-speed");
  const outShift = document.getElementById("val-shift");

  // UI Sync Helpers
  function setMode(index) {
    const clamped = ((Math.round(index) % 4) + 4) % 4;
    state.mode = clamped;
    modeButtons.forEach((btn, i) => {
      btn.setAttribute("aria-pressed", String(i === clamped));
    });
    const m = MODES[clamped];
    if (hudModeName) {
      hudModeName.textContent = isAr ? m.nameAr : m.nameEn;
    }
    if (overlayFormula) {
      overlayFormula.textContent = m.formula;
    }
    return state.mode;
  }

  function setParams(params = {}) {
    if (typeof params.turbulence === "number" && !Number.isNaN(params.turbulence)) {
      state.turbulence = Math.max(0, Math.min(2, params.turbulence));
      if (sliderTurbulence) sliderTurbulence.value = state.turbulence.toFixed(2);
      if (outTurbulence) outTurbulence.textContent = state.turbulence.toFixed(2);
    }
    if (typeof params.speed === "number" && !Number.isNaN(params.speed)) {
      state.speed = Math.max(0, Math.min(2.5, params.speed));
      if (sliderSpeed) sliderSpeed.value = state.speed.toFixed(2);
      if (outSpeed) outSpeed.textContent = state.speed.toFixed(2);
    }
    if (typeof params.shift === "number" && !Number.isNaN(params.shift)) {
      state.shift = Math.max(0, Math.min(1, params.shift));
      if (sliderShift) sliderShift.value = state.shift.toFixed(2);
      if (outShift) outShift.textContent = state.shift.toFixed(2);
    }
    return {
      turbulence: state.turbulence,
      speed: state.speed,
      shift: state.shift,
    };
  }

  function setPointer(x, y) {
    const nx = Math.max(-1, Math.min(1, Number(x) || 0));
    const ny = Math.max(-1, Math.min(1, Number(y) || 0));
    state.targetPointer.x = nx;
    state.targetPointer.y = ny;
    state.pointer.x = nx;
    state.pointer.y = ny;
    updateCoordHud();
    return { x: nx, y: ny };
  }

  function updateCoordHud() {
    if (!hudCoords) return;
    const fx = (state.pointer.x >= 0 ? "+" : "") + state.pointer.x.toFixed(2);
    const fy = (state.pointer.y >= 0 ? "+" : "") + state.pointer.y.toFixed(2);
    hudCoords.textContent = `${fx}, ${fy}`;
  }

  function setCinema(active) {
    state.cinema = Boolean(active);
    if (state.cinema) {
      state.paused = false;
      state.cinemaStartTime = performance.now();
      state.cinemaBaseMode = state.mode;
      syncMotionUI();
    }
    if (stageFrame) {
      stageFrame.setAttribute("data-cinema", String(state.cinema));
    }
    if (cinemaBanner) {
      cinemaBanner.hidden = !state.cinema;
    }
    if (cinemaModeBtn) {
      cinemaModeBtn.setAttribute("aria-pressed", String(state.cinema));
      const [enterLabel, exitLabel] = (
        cinemaModeBtn.dataset.labels || "Cinema Demo Mode|Exit Cinema Mode"
      ).split("|");
      const labelSpan = cinemaModeBtn.querySelector(".cinema-btn-label");
      if (labelSpan) {
        labelSpan.textContent = state.cinema ? exitLabel : enterLabel;
      }
    }
    return state.cinema;
  }

  function syncMotionUI() {
    if (!motionToggle) return;
    const [pauseLabel, resumeLabel] = (
      motionToggle.dataset.labels || "Pause motion|Resume motion"
    ).split("|");
    motionToggle.setAttribute("aria-pressed", String(state.paused));
    const textEl = motionToggle.querySelector(".motion-label");
    if (textEl) {
      textEl.textContent = state.paused ? resumeLabel : pauseLabel;
    }
  }

  // Wire UI Events
  modeButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      setMode(index);
    });
    btn.addEventListener("keydown", (e) => {
      const step = root.dir === "rtl" ? -1 : 1;
      let next;
      if (e.key === "ArrowRight") next = (index + step + 4) % 4;
      if (e.key === "ArrowLeft") next = (index - step + 4) % 4;
      if (next !== undefined) {
        e.preventDefault();
        setMode(next);
        modeButtons[next].focus();
      }
    });
  });

  if (sliderTurbulence) {
    sliderTurbulence.addEventListener("input", (e) => {
      setParams({ turbulence: parseFloat(e.target.value) });
    });
  }
  if (sliderSpeed) {
    sliderSpeed.addEventListener("input", (e) => {
      setParams({ speed: parseFloat(e.target.value) });
    });
  }
  if (sliderShift) {
    sliderShift.addEventListener("input", (e) => {
      setParams({ shift: parseFloat(e.target.value) });
    });
  }

  if (cinemaModeBtn) {
    cinemaModeBtn.addEventListener("click", () => {
      setCinema(!state.cinema);
    });
  }
  if (cinemaExitBtn) {
    cinemaExitBtn.addEventListener("click", () => {
      setCinema(false);
    });
  }

  if (resetParamsBtn) {
    resetParamsBtn.addEventListener("click", () => {
      setCinema(false);
      setMode(0);
      setParams({ turbulence: 1.0, speed: 1.0, shift: 0.35 });
      setPointer(0.18, 0.12);
    });
  }

  if (motionToggle) {
    motionToggle.addEventListener("click", () => {
      state.paused = !state.paused;
      syncMotionUI();
    });
  }

  // Pointer & Keyboard interaction on Canvas
  if (canvas) {
    let isDragging = false;
    const updateFromClient = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
      state.targetPointer.x = Math.max(-1, Math.min(1, nx));
      state.targetPointer.y = Math.max(-1, Math.min(1, ny));
    };

    canvas.addEventListener("pointerdown", (e) => {
      isDragging = true;
      updateFromClient(e.clientX, e.clientY);
    });
    window.addEventListener("pointermove", (e) => {
      if (isDragging) {
        updateFromClient(e.clientX, e.clientY);
      }
    });
    window.addEventListener("pointerup", () => {
      isDragging = false;
    });
    canvas.addEventListener("mousemove", (e) => {
      if (!state.cinema && !isDragging) {
        updateFromClient(e.clientX, e.clientY);
      }
    });
    canvas.addEventListener("keydown", (e) => {
      if (e.key >= "1" && e.key <= "4") {
        setMode(parseInt(e.key, 10) - 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPointer(state.targetPointer.x - 0.1, state.targetPointer.y);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPointer(state.targetPointer.x + 0.1, state.targetPointer.y);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setPointer(state.targetPointer.x, state.targetPointer.y + 0.1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setPointer(state.targetPointer.x, state.targetPointer.y - 0.1);
      }
    });
  }

  // WebGL Shader Setup
  const VERTEX_SHADER = `
    attribute vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const FRAGMENT_SHADER = `
    precision highp float;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_pointer;
    uniform vec4 u_weights;
    uniform float u_turbulence;
    uniform float u_speed;
    uniform float u_shift;
    uniform float u_dark;

    mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
    }

    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }

    float sdTorus(vec3 p, vec2 t) {
      vec2 q = vec2(length(p.xz) - t.x, p.y);
      return length(q) - t.y;
    }

    float sdBox(vec3 p, vec3 b) {
      vec3 q = abs(p) - b;
      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
    }

    float gyroid(vec3 p, float scale) {
      p *= scale;
      return abs(dot(sin(p), cos(p.zxy))) / scale;
    }

    // Mode 0: Cobalt Fold — Sculptural folded ribbon & torus-knot morph
    float mapCobaltFold(vec3 p, float t, float turb) {
      vec3 q = p;
      q.xy *= rot(t * 0.35 + q.z * 0.42 * turb);
      q.xz *= rot(t * 0.25);

      float angle = atan(q.z, q.x);
      float radius = 1.18 + 0.24 * sin(angle * 3.0 + t * 1.4) * turb;
      vec2 ring = vec2(length(q.xz) - radius, q.y + 0.28 * cos(angle * 2.0 - t));
      ring *= rot(angle * 1.5 + t * 0.5);
      float ribbon = max(abs(ring.x) - 0.38, abs(ring.y) - 0.11);

      vec3 k = p;
      k.yz *= rot(-t * 0.4);
      float core = length(k) - 0.68 - 0.12 * sin(k.x * 4.0 + t * 2.0) * turb;
      float flute = gyroid(q + vec3(0.0, 0.0, t * 0.4), 3.6 + turb * 1.5) - 0.035;
      ribbon = smin(ribbon, core, 0.42);
      ribbon = mix(ribbon, max(ribbon, -flute * 0.45), 0.55);
      return ribbon * 0.75;
    }

    // Mode 1: Solar Pulse — Harmonic plasma shells & interference rings
    float mapSolarPulse(vec3 p, float t, float turb) {
      vec3 q = p;
      q.xz *= rot(t * 0.3);
      q.yz *= rot(sin(t * 0.4) * 0.5);

      float r = length(q);
      float wave = sin(r * (7.0 + turb * 3.0) - t * 3.2) * 0.12;
      float harmonic = cos(q.x * 3.5 + t) * sin(q.y * 3.5 - t) * cos(q.z * 3.5) * 0.18 * turb;
      float sphere = r - (1.05 + wave + harmonic);

      vec3 r1 = q;
      r1.xy *= rot(t * 0.6);
      float halo1 = sdTorus(r1, vec2(1.55, 0.075));

      vec3 r2 = q;
      r2.yz *= rot(-t * 0.5);
      float halo2 = sdTorus(r2, vec2(1.88, 0.055));

      return smin(sphere, smin(halo1, halo2, 0.25), 0.32) * 0.75;
    }

    // Mode 2: Quantum Lattice — Crystalline KIFS Octree & Hyperbolic Folding
    float mapQuantumLattice(vec3 p, float t, float turb) {
      vec3 q = p;
      q.xy *= rot(t * 0.22);
      q.yz *= rot(t * 0.18);

      for (int i = 0; i < 3; i++) {
        q = abs(q) - vec3(0.52, 0.48, 0.55) * (0.85 + 0.15 * sin(t * 0.7 + float(i)));
        q.xy *= rot(0.45 + 0.18 * turb);
        q.xz *= rot(0.38);
      }

      float struts = min(
        sdBox(q, vec3(0.16, 0.85, 0.16)),
        min(sdBox(q, vec3(0.85, 0.16, 0.16)), sdBox(q, vec3(0.16, 0.16, 0.85)))
      );
      float node = length(q) - 0.32;
      float bound = length(p) - 2.15;
      return max(smin(struts, node, 0.14), bound) * 0.72;
    }

    // Mode 3: Singularity Vortex — Gravitational lens warp & spiral filaments
    float mapSingularity(vec3 p, float t, float turb) {
      vec3 q = p;
      float r = length(q.xz) + 0.001;
      float twist = (1.6 + turb * 0.9) / (r + 0.35) - t * 1.1;
      q.xz *= rot(twist);

      float disk = sdTorus(vec3(q.x, q.y * (2.2 + r * 0.6), q.z), vec2(1.38, 0.22));
      float spiral = sin(atan(q.z, q.x) * 4.0 + r * 5.0 - t * 2.5) * 0.09 * turb;
      disk += spiral;

      float horizon = length(p) - 0.58;
      vec3 jetP = p;
      jetP.xz *= rot(p.y * 2.5 - t * 2.0);
      float jet = length(jetP.xz) - (0.12 + 0.08 * abs(p.y)) + 0.04 * sin(p.y * 8.0 - t * 4.0);
      jet = max(jet, abs(p.y) - 1.95);

      return smin(smin(disk, horizon, 0.35), jet, 0.25) * 0.7;
    }

    // Combined blended SDF across the 4 harmonic modes
    float mapScene(vec3 p) {
      float t = u_time;
      float turb = u_turbulence;

      float d = 0.0;
      if (u_weights.x > 0.001) d += u_weights.x * mapCobaltFold(p, t, turb);
      if (u_weights.y > 0.001) d += u_weights.y * mapSolarPulse(p, t, turb);
      if (u_weights.z > 0.001) d += u_weights.z * mapQuantumLattice(p, t, turb);
      if (u_weights.w > 0.001) d += u_weights.w * mapSingularity(p, t, turb);
      return d;
    }

    vec3 calcNormal(vec3 p) {
      const float h = 0.0025;
      const vec2 k = vec2(1.0, -1.0);
      return normalize(
        k.xyy * mapScene(p + k.xyy * h) +
        k.yyx * mapScene(p + k.yyx * h) +
        k.yxy * mapScene(p + k.yxy * h) +
        k.xxx * mapScene(p + k.xxx * h)
      );
    }

    // Canonical OMX Cobalt Palette + Chromatic Shift transfer
    vec3 cobaltPalette(float v, float shift) {
      vec3 cDeep = vec3(0.063, 0.161, 0.471);   // #102978
      vec3 cCore = vec3(0.141, 0.294, 0.859);   // #244bdb (OMX Cobalt)
      vec3 cMid  = vec3(0.349, 0.506, 0.953);   // #5981f3
      vec3 cIce  = vec3(0.702, 0.808, 1.000);   // #b3ceff
      vec3 cWarm = vec3(0.920, 0.680, 0.340);   // Harmonic gold accent for Solar/Chromatic

      float x = fract(v + shift * 0.35);
      vec3 base = mix(cDeep, cCore, smoothstep(0.0, 0.38, x));
      base = mix(base, cMid, smoothstep(0.35, 0.72, x));
      base = mix(base, cIce, smoothstep(0.70, 1.0, x));
      float warmFactor = shift * 0.55 + u_weights.y * 0.42;
      base = mix(base, cWarm, warmFactor * pow(sin(v * 3.14159), 2.0) * 0.65);
      return base;
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / max(u_resolution.y, 1.0);

      // Camera setup with interactive pointer orbit
      float yaw = u_pointer.x * 1.65 + u_time * 0.12;
      float pitch = clamp(u_pointer.y * 1.05, -1.1, 1.1);

      vec3 ro = vec3(0.0, 0.0, 3.85);
      ro.yz *= rot(-pitch);
      ro.xz *= rot(-yaw);

      vec3 ta = vec3(0.0, 0.0, 0.0);
      vec3 ww = normalize(ta - ro);
      vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
      vec3 vv = normalize(cross(uu, ww));
      vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.45 * ww);

      // Background environment (Light Porcelain #edf0f4 / #d8e5fb vs Dark Carbon #141e30 / #263d62)
      vec3 bgLightTop = vec3(0.847, 0.898, 0.984); // #d8e5fb
      vec3 bgLightBot = vec3(0.929, 0.941, 0.957); // #edf0f4
      vec3 bgDarkTop  = vec3(0.078, 0.118, 0.188); // #141e30
      vec3 bgDarkBot  = vec3(0.149, 0.239, 0.384); // #263d62

      float skyGrad = clamp(uv.y * 0.65 + 0.5, 0.0, 1.0);
      vec3 bgLight = mix(bgLightBot, bgLightTop, skyGrad);
      vec3 bgDark  = mix(bgDarkTop, bgDarkBot, 1.0 - skyGrad * 0.65);
      vec3 bg = mix(bgLight, bgDark, u_dark);

      // Subtle architectural coordinate grid in background
      vec2 gridUv = uv * 8.0;
      vec2 gridDist = abs(fract(gridUv - 0.5) - 0.5);
      float gridAlpha = 1.0 - smoothstep(0.0, 0.035, min(gridDist.x, gridDist.y));
      vec3 gridColor = mix(vec3(0.141, 0.294, 0.859), vec3(0.671, 0.773, 1.0), u_dark);
      bg = mix(bg, gridColor, gridAlpha * 0.065 * (1.0 - smoothstep(0.2, 1.1, length(uv))));

      // Raymarch loop with volumetric energy accumulation
      float t = 0.0;
      float hit = 0.0;
      vec3 glowAcc = vec3(0.0);

      for (int i = 0; i < 60; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);

        // Volumetric energy field accumulation
        float glowStep = 0.014 / (0.045 + d * d * 5.5);
        vec3 gCol = cobaltPalette(length(p) * 0.45 - u_time * 0.25, u_shift);
        glowAcc += gCol * glowStep;

        if (d < 0.0025) {
          hit = 1.0;
          break;
        }
        t += d;
        if (t > 8.5) break;
      }

      vec3 col = bg;

      if (hit > 0.5) {
        vec3 p = ro + rd * t;
        vec3 n = calcNormal(p);
        vec3 v = normalize(ro - p);

        // Dual Studio Lighting
        vec3 l1 = normalize(vec3(2.2, 2.8, 2.4));
        vec3 l2 = normalize(vec3(-2.4, -1.6, 1.5));

        float diff1 = max(dot(n, l1), 0.0);
        float diff2 = max(dot(n, l2), 0.0);

        vec3 h1 = normalize(l1 + v);
        vec3 h2 = normalize(l2 + v);
        float spec1 = pow(max(dot(n, h1), 0.0), 42.0);
        float spec2 = pow(max(dot(n, h2), 0.0), 20.0);

        float fresnel = pow(1.0 - max(dot(n, v), 0.0), 3.2);

        // Analytic ambient occlusion approximation
        float ao = clamp(0.5 + 0.5 * mapScene(p + n * 0.18) / 0.18, 0.15, 1.0);

        float matCoord = dot(n, vec3(0.4, 0.7, 0.3)) * 0.5 + 0.5 + length(p) * 0.25;
        vec3 baseAlbedo = cobaltPalette(matCoord, u_shift);

        vec3 ambient = mix(vec3(0.82, 0.88, 0.98), vec3(0.12, 0.20, 0.38), u_dark) * 0.42;
        vec3 rimColor = mix(vec3(0.141, 0.294, 0.859), vec3(0.85, 0.92, 1.0), 0.55 + 0.45 * u_dark);

        vec3 surf = baseAlbedo * (ambient + diff1 * 0.88 + diff2 * 0.34) * ao;
        surf += vec3(0.92, 0.96, 1.0) * spec1 * 0.78;
        surf += cobaltPalette(matCoord + 0.35, u_shift) * spec2 * 0.35;
        surf = mix(surf, rimColor, fresnel * 0.68);

        // Depth fog blend into studio background
        float fog = exp(-0.045 * t * t);
        col = mix(bg, surf, fog);
      }

      // Add volumetric field radiance (adapted for light vs dark theme)
      vec3 glowStrength = mix(glowAcc * 0.22, glowAcc * 0.42, u_dark);
      col = mix(col - glowStrength * 0.28 + glowStrength * 0.55, col + glowStrength, u_dark);

      // Subtle vignette & tone mapping
      float vig = 1.0 - 0.18 * dot(uv, uv);
      col *= vig;
      col = clamp(col, 0.0, 1.0);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  let gl = null;
  let program = null;
  let uniforms = {};
  let ctx2d = null;

  function initRenderer() {
    if (!canvas) return;
    try {
      gl =
        canvas.getContext("webgl2", {
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }) ||
        canvas.getContext("webgl", {
          alpha: false,
          antialias: true,
          preserveDrawingBuffer: true,
        });
    } catch {}

    if (gl) {
      const isWebGL2 =
        typeof WebGL2RenderingContext !== "undefined" &&
        gl instanceof WebGL2RenderingContext;
      state.engine = isWebGL2 ? "WEBGL2 // SDF" : "WEBGL1 // SDF";
      if (hudEngine) hudEngine.textContent = state.engine;

      // Enable derivatives in WebGL1 if available for fwidth
      if (!isWebGL2) {
        gl.getExtension("OES_standard_derivatives");
      }

      const compile = (type, src) => {
        const shader = gl.createShader(type);
        let finalSrc = src;
        if (!isWebGL2 && type === gl.FRAGMENT_SHADER) {
          finalSrc =
            "#extension GL_OES_standard_derivatives : enable\n" + finalSrc;
        }
        gl.shaderSource(shader, finalSrc);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.warn("Shader compile info:", gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

      if (vs && fs) {
        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          gl.useProgram(program);

          const buf = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW,
          );

          const posLoc = gl.getAttribLocation(program, "a_pos");
          gl.enableVertexAttribArray(posLoc);
          gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

          uniforms = {
            u_resolution: gl.getUniformLocation(program, "u_resolution"),
            u_time: gl.getUniformLocation(program, "u_time"),
            u_pointer: gl.getUniformLocation(program, "u_pointer"),
            u_weights: gl.getUniformLocation(program, "u_weights"),
            u_turbulence: gl.getUniformLocation(program, "u_turbulence"),
            u_speed: gl.getUniformLocation(program, "u_speed"),
            u_shift: gl.getUniformLocation(program, "u_shift"),
            u_dark: gl.getUniformLocation(program, "u_dark"),
          };
          return;
        }
      }
    }

    // Fallback to 2D Canvas if WebGL is unavailable
    gl = null;
    program = null;
    ctx2d = canvas.getContext("2d");
    state.engine = "CANVAS2D // FALLBACK";
    if (hudEngine) hudEngine.textContent = state.engine;
  }

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(320, Math.floor((rect.width || 1280) * dpr));
    const h = Math.max(200, Math.floor((rect.height || 720) * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  function render2DFallback() {
    if (!ctx2d || !canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const isDark = root.getAttribute("data-theme") === "dark";

    const grad = ctx2d.createLinearGradient(0, 0, 0, h);
    if (isDark) {
      grad.addColorStop(0, "#141e30");
      grad.addColorStop(1, "#263d62");
    } else {
      grad.addColorStop(0, "#d8e5fb");
      grad.addColorStop(1, "#edf0f4");
    }
    ctx2d.fillStyle = grad;
    ctx2d.fillRect(0, 0, w, h);

    const cx = w * 0.5 + state.pointer.x * w * 0.12;
    const cy = h * 0.5 - state.pointer.y * h * 0.12;
    const baseR = Math.min(w, h) * 0.28;

    for (let i = 0; i < 18; i++) {
      const phase = state.time * 0.8 + i * 0.35;
      const rx = baseR * (0.45 + 0.55 * Math.sin(phase * 0.7 + state.mode));
      const ry = baseR * (0.45 + 0.55 * Math.cos(phase * 0.5));
      ctx2d.save();
      ctx2d.translate(cx, cy);
      ctx2d.rotate(phase * 0.3 + i * 0.2);
      ctx2d.beginPath();
      ctx2d.ellipse(0, 0, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
      ctx2d.strokeStyle =
        i % 2 === 0
          ? isDark
            ? "rgba(171, 197, 255, 0.55)"
            : "rgba(36, 75, 219, 0.55)"
          : isDark
            ? "rgba(89, 129, 243, 0.38)"
            : "rgba(16, 41, 120, 0.35)";
      ctx2d.lineWidth = 3;
      ctx2d.stroke();
      ctx2d.restore();
    }
  }

  function stepSimulation(dt) {
    // Smooth theme transition
    const targetDark = root.getAttribute("data-theme") === "dark" ? 1.0 : 0.0;
    state.darkMix += (targetDark - state.darkMix) * Math.min(1, dt * 8);

    // Cinema Choreography
    if (state.cinema) {
      const elapsed = (performance.now() - state.cinemaStartTime) * 0.001;
      // Cycle across all 4 modes every 2.4s starting from cinemaBaseMode
      const cycleMode = (state.cinemaBaseMode + Math.floor(elapsed / 2.4)) % 4;
      if (cycleMode !== state.mode) {
        setMode(cycleMode);
      }
      state.targetPointer.x = Math.sin(elapsed * 1.15) * 0.68;
      state.targetPointer.y = Math.cos(elapsed * 0.85) * 0.42;
      const dynTurb = 0.85 + 0.55 * Math.sin(elapsed * 0.9);
      const dynShift = 0.3 + 0.35 * (0.5 + 0.5 * Math.cos(elapsed * 0.7));
      setParams({ turbulence: dynTurb, shift: dynShift });
    }

    // Smooth pointer interpolation
    state.pointer.x +=
      (state.targetPointer.x - state.pointer.x) * Math.min(1, dt * 7.5);
    state.pointer.y +=
      (state.targetPointer.y - state.pointer.y) * Math.min(1, dt * 7.5);

    // Smooth mode weight crossfading
    let weightSum = 0;
    for (let i = 0; i < 4; i++) {
      const targetW = i === state.mode ? 1.0 : 0.0;
      state.weights[i] +=
        (targetW - state.weights[i]) * Math.min(1, dt * 6.5);
      weightSum += state.weights[i];
    }
    if (weightSum > 0.0001) {
      for (let i = 0; i < 4; i++) {
        state.weights[i] /= weightSum;
      }
    }

    if (!state.paused) {
      state.time += dt * state.speed;
    }
  }

  function drawFrame() {
    resizeCanvas();
    if (gl && program) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.u_time, state.time);
      gl.uniform2f(uniforms.u_pointer, state.pointer.x, state.pointer.y);
      gl.uniform4f(
        uniforms.u_weights,
        state.weights[0],
        state.weights[1],
        state.weights[2],
        state.weights[3],
      );
      gl.uniform1f(uniforms.u_turbulence, state.turbulence);
      gl.uniform1f(uniforms.u_speed, state.speed);
      gl.uniform1f(uniforms.u_shift, state.shift);
      gl.uniform1f(uniforms.u_dark, state.darkMix);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else {
      render2DFallback();
    }
    state.frameCount++;
  }

  // Main Animation Loop
  let lastTime = performance.now();
  let fpsTimer = lastTime;
  let fpsFrames = 0;

  function tick(now) {
    const dt = Math.min(0.1, Math.max(0.001, (now - lastTime) * 0.001));
    lastTime = now;
    fpsFrames++;

    if (now - fpsTimer >= 400) {
      state.fps = Math.min(
        120,
        Math.max(1, Math.round((fpsFrames * 1000) / (now - fpsTimer))),
      );
      fpsFrames = 0;
      fpsTimer = now;
      if (hudFps) hudFps.textContent = String(state.fps);
    }

    if (!state.paused) {
      stepSimulation(dt);
      drawFrame();
      if (hudTime) {
        hudTime.textContent = state.time.toFixed(1) + "s";
      }
      updateCoordHud();
    }

    if (!state.manualLoop) {
      requestAnimationFrame(tick);
    }
  }

  // Initialize Renderer & Reduced Motion check
  initRenderer();

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  if (reducedMotionQuery.matches && !autoCinema) {
    state.paused = true;
    syncMotionUI();
  }
  reducedMotionQuery.addEventListener("change", (e) => {
    if (!state.cinema) {
      state.paused = e.matches;
      syncMotionUI();
    }
  });

  if (autoCinema) {
    setCinema(true);
  }

  // Render immediate initial frame & start loop
  drawFrame();
  requestAnimationFrame(tick);

  // Expose Deterministic Automation API on window.__OMX_LAB__
  window.__OMX_LAB__ = {
    setMode(index) {
      const m = setMode(index);
      // Snap weights closer for instant visual feedback when driven by automation
      for (let i = 0; i < 4; i++) {
        state.weights[i] = i === m ? 1.0 : 0.0;
      }
      drawFrame();
      return m;
    },
    setParams(params) {
      const p = setParams(params);
      drawFrame();
      return p;
    },
    setPointer(x, y) {
      const pt = setPointer(x, y);
      drawFrame();
      return pt;
    },
    startCinema() {
      setCinema(true);
      drawFrame();
      return true;
    },
    stopCinema() {
      setCinema(false);
      drawFrame();
      return false;
    },
    stepFrame(dtSeconds = 1 / 60, substeps = 1) {
      state.manualLoop = true;
      const wasPaused = state.paused;
      state.paused = false;
      for (let i = 0; i < substeps; i++) {
        stepSimulation(dtSeconds);
      }
      state.paused = wasPaused;
      drawFrame();
      if (gl) gl.finish();
      if (hudTime) hudTime.textContent = state.time.toFixed(1) + "s";
      updateCoordHud();
      return this.getState();
    },
    getState() {
      return {
        mode: state.mode,
        modeName: MODES[state.mode].nameEn,
        weights: [...state.weights],
        turbulence: state.turbulence,
        speed: state.speed,
        shift: state.shift,
        pointer: { x: state.pointer.x, y: state.pointer.y },
        cinema: state.cinema,
        paused: state.paused,
        theme: root.getAttribute("data-theme") || "light",
        locale: root.lang || "en",
        engine: state.engine,
        fps: state.fps,
        time: state.time,
        frameCount: state.frameCount,
      };
    },
  };
})();
