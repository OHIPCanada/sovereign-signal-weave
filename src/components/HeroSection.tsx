import React, { useEffect, useMemo, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   DocG AI — Hero Film  "INTELLIGENCE — It's a Convergence"
   ─────────────────────────────────────────────────────────────
   16–18 s auto-loop · 5 cinematic acts · 3 depth layers
   Canvas 2D — no libs beyond React.
   ───────────────────────────────────────────────────────────── */

// ── math helpers ────────────────────────────────────────────
type Pt = { x: number; y: number };
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const rand = (s: number) => {
  const x = Math.sin(s) * 10000;
  return x - Math.floor(x);
};

// ── particle types ──────────────────────────────────────────
type ShardKind = 0 | 1 | 2; // 0=doc fragment, 1=pixel block, 2=dna squiggle
type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  layer: number;    // 0=bg, 1=mid, 2=fg  (depth)
  kind: ShardKind;
  s: number;        // base size
  seed: number;
  rot: number;
  spin: number;
  tx: number; ty: number;
  warm: number;
};

// ── silhouette generator (high-fidelity side-profile) ───────
function buildHeadPoints(count: number): Pt[] {
  const pts: Pt[] = [];
  let tries = 0;

  // SDF-like test for a recognisable side-profile head shape
  const inside = (x: number, y: number) => {
    // Cranium – large ellipse, offset left
    const cranium =
      ((x + 0.08) * (x + 0.08)) / (0.48 * 0.48) +
      ((y + 0.12) * (y + 0.12)) / (0.62 * 0.62) < 1;

    // Forehead bulge
    const forehead =
      ((x - 0.15) * (x - 0.15)) / (0.30 * 0.30) +
      ((y + 0.42) * (y + 0.42)) / (0.28 * 0.28) < 1;

    // Jaw
    const jaw =
      ((x + 0.02) * (x + 0.02)) / (0.38 * 0.38) +
      ((y - 0.32) * (y - 0.32)) / (0.34 * 0.34) < 1;

    // Nose bump
    const nose =
      ((x - 0.50) * (x - 0.50)) / (0.09 * 0.09) +
      ((y + 0.02) * (y + 0.02)) / (0.07 * 0.07) < 1;

    // Brow ridge
    const brow =
      ((x - 0.38) * (x - 0.38)) / (0.14 * 0.14) +
      ((y + 0.18) * (y + 0.18)) / (0.08 * 0.08) < 1;

    // Lips/chin
    const chin =
      ((x - 0.38) * (x - 0.38)) / (0.12 * 0.12) +
      ((y - 0.22) * (y - 0.22)) / (0.10 * 0.10) < 1;

    // Neck (narrow column)
    const neck = Math.abs(x + 0.05) < 0.16 && y > 0.35 && y < 0.72;

    // Carve: back of head (avoid blob)
    const backCarve = x > -0.58;

    // Carve: under chin hollow
    const underChin = !(
      ((x - 0.20) * (x - 0.20)) / (0.14 * 0.14) +
      ((y - 0.42) * (y - 0.42)) / (0.10 * 0.10) < 1
    );

    // Carve: front face plane
    const facePlane = x < 0.56;

    const base = (cranium || forehead || jaw || nose || brow || chin || neck) && backCarve && underChin && facePlane;
    return base;
  };

  while (pts.length < count && tries < count * 80) {
    tries++;
    const x = lerp(-0.75, 0.65, Math.random());
    const y = lerp(-0.80, 0.75, Math.random());
    if (!inside(x, y)) continue;

    // Density bias: more points in brain + face contour regions
    const brainBias = smoothstep(-0.1, 0.5, -y) * smoothstep(-0.4, 0.3, x) * 0.6;
    const faceBias = smoothstep(0.1, 0.55, x) * smoothstep(-0.3, 0.2, -Math.abs(y)) * 0.5;
    // Edge density boost for readable contour
    const edgeDist = Math.min(
      Math.abs(((x + 0.08) ** 2) / (0.48 ** 2) + ((y + 0.12) ** 2) / (0.62 ** 2) - 1),
      0.3
    );
    const edgeBias = smoothstep(0.15, 0.0, edgeDist) * 0.4;

    if (Math.random() < clamp(0.25 + brainBias + faceBias + edgeBias, 0.08, 0.95)) {
      pts.push({ x, y });
    }
  }
  while (pts.length < count) pts.push({ x: lerp(-0.5, 0.5, Math.random()), y: lerp(-0.5, 0.5, Math.random()) });
  return pts;
}

function buildEyePoints(count: number): Pt[] {
  const pts: Pt[] = [];
  const cx = 0.32, cy = -0.04;
  // Almond shape: ellipse with pointed ends
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.5);
    // Almond warp
    const ax = cx + Math.cos(t) * 0.10 * r;
    const ay = cy + Math.sin(t) * 0.05 * r * (1 - 0.3 * Math.abs(Math.cos(t)));
    pts.push({ x: ax, y: ay });
  }
  return pts;
}

function buildOrbitTargets(count: number) {
  const coreN = Math.floor(count * 0.18);
  const core: Pt[] = [];
  for (let i = 0; i < coreN; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.6) * 0.10;
    core.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
  }
  const rings: Pt[] = [];
  const meta = [
    { r: 0.24, w: 0.04 },
    { r: 0.38, w: 0.05 },
    { r: 0.54, w: 0.06 },
  ];
  for (let i = 0; i < count - coreN; i++) {
    const { r, w } = meta[i % 3];
    const a = Math.random() * Math.PI * 2;
    const rr = r + (Math.random() - 0.5) * w;
    rings.push({ x: Math.cos(a) * rr, y: Math.sin(a) * rr });
  }
  return { core, rings };
}

// ── component ───────────────────────────────────────────────
export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);

  const formations = useMemo(() => ({
    head: buildHeadPoints(6000),
    eye: buildEyePoints(1200),
    orbits: buildOrbitTargets(6000),
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const titleEl = titleRef.current;
    const subEl = subRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // ── sizing ──
    let W = 0, H = 0;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // ── mouse ──
    let mx = 0, my = 0, smx = 0, smy = 0;
    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      mx = clamp(((e.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      my = clamp(((e.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // ── particles ──
    const base = prefersReduced ? 1800 : 3200;
    const max = prefersReduced ? 3000 : 6000;
    const N = clamp(Math.floor((W * H / (1200 * 700)) * base), base, max);

    const particles: Particle[] = Array.from({ length: N }, (_, i) => {
      const layer = i % 3; // 0=bg, 1=mid, 2=fg
      const kindRoll = rand(i * 4.3);
      const kind: ShardKind = kindRoll < 0.45 ? 0 : kindRoll < 0.78 ? 1 : 2;
      return {
        x: (rand(i * 1.7) - 0.5) * W,
        y: (rand(i * 2.7) - 0.5) * H,
        vx: (rand(i * 5.1) - 0.5) * 40,
        vy: (rand(i * 6.3) - 0.5) * 40,
        layer,
        kind,
        s: 0.7 + rand(i * 11.3) * 1.0,
        seed: i + 1,
        rot: rand(i * 8.2) * Math.PI * 2,
        spin: (rand(i * 9.9) - 0.5) * 2.5,
        tx: 0, ty: 0,
        warm: rand(i * 19.1) > 0.55 ? 1 : 0,
      };
    });

    // ── timing (seconds) ──
    const ACT = {
      chaos:    { a: 0.0,  b: 2.5  },
      field:    { a: 2.5,  b: 5.0  },
      converge: { a: 5.0,  b: 9.0  },
      aware:    { a: 9.0,  b: 12.0 },
      os:       { a: 12.0, b: 16.0 },
      dissolve: { a: 16.0, b: 17.5 },
    };
    const LOOP = ACT.dissolve.b;

    // ── formations sliced ──
    const headPts = formations.head.slice(0, N);
    const eyePts = formations.eye.slice(0, Math.floor(N * 0.20));
    const orbitCore = formations.orbits.core.slice(0, Math.floor(N * 0.18));
    const orbitRings = formations.orbits.rings.slice(0, N - orbitCore.length);

    const toScreen = (p: Pt, scale = 0.86, ox = 0, oy = 0) => {
      const s = Math.min(W, H) * 0.50 * scale;
      return { x: p.x * s + ox, y: p.y * s + oy };
    };

    // ── grid for field ──
    const GCOLS = 28, GROWS = 16;

    // ── camera state ──
    let camT = 0, camX = 0, camY = 0;
    let camZoom = 1.0; // for push-in

    // ── typography state ──
    let titleReveal = 0; // 0..1 mask progress
    let subAlpha = 0;
    let typoDone = false;

    // ── depth parallax multipliers ──
    const LAYER_SPEED = [0.3, 0.65, 1.0]; // bg, mid, fg
    const LAYER_SIZE = [0.7, 0.9, 1.1];

    // ── helper: roundRect ──
    const rrPath = (x: number, y: number, w: number, h: number, r: number) => {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    };

    // ── draw background ──
    const drawBG = () => {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#080614");
      g.addColorStop(0.45, "#0A0818");
      g.addColorStop(1, "#0B0613");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    // ── draw haze ──
    const drawHaze = (strength: number) => {
      if (strength < 0.001) return;
      ctx.save();
      ctx.globalAlpha = strength;
      let g = ctx.createRadialGradient(
        W * 0.32 + camX * 0.2, H * 0.50 + camY * 0.15, 0,
        W * 0.32, H * 0.50, Math.min(W, H) * 0.70
      );
      g.addColorStop(0, "rgba(123,97,255,0.16)");
      g.addColorStop(1, "rgba(123,97,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      g = ctx.createRadialGradient(
        W * 0.72 + camX * 0.12, H * 0.58 + camY * 0.1, 0,
        W * 0.72, H * 0.58, Math.min(W, H) * 0.75
      );
      g.addColorStop(0, "rgba(232,150,124,0.12)");
      g.addColorStop(1, "rgba(232,150,124,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    };

    // ── draw grid ──
    const drawGrid = (alpha: number) => {
      if (alpha < 0.002) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "rgba(189,166,255,0.07)";
      ctx.lineWidth = 1;
      const step = Math.max(36, Math.min(60, Math.floor(Math.min(W, H) / 16)));
      const dx = camX * 0.08 * LAYER_SPEED[0];
      const dy = camY * 0.06 * LAYER_SPEED[0];
      for (let x = -step; x < W + step; x += step) {
        ctx.beginPath(); ctx.moveTo(x + dx, 0); ctx.lineTo(x + dx, H); ctx.stroke();
      }
      for (let y = -step; y < H + step; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y + dy); ctx.lineTo(W, y + dy); ctx.stroke();
      }
      ctx.restore();
    };

    // ── draw eye glow ──
    const drawEyeGlow = (t: number, alpha: number) => {
      if (alpha < 0.002) return;
      const anchor = toScreen({ x: 0.32, y: -0.04 }, 0.90, W * 0.02, H * 0.04);
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.5);
      const r = Math.min(W, H) * 0.09 * (0.80 + 0.15 * pulse);
      ctx.save();
      ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(anchor.x + W / 2, anchor.y + H / 2, 0, anchor.x + W / 2, anchor.y + H / 2, r);
      g.addColorStop(0, "rgba(255,220,160,0.30)"); // gold highlight
      g.addColorStop(0.30, "rgba(242,193,174,0.18)");
      g.addColorStop(0.65, "rgba(189,166,255,0.08)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    };

    // ── draw vignette ──
    const drawVignette = () => {
      const g = ctx.createRadialGradient(W * 0.5, H * 0.5, Math.min(W, H) * 0.08, W * 0.5, H * 0.5, Math.max(W, H) * 0.78);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.60)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    // ── draw memory core (scene 5) ──
    const drawCore = (alpha: number, t: number) => {
      if (alpha < 0.002) return;
      const cx = W * 0.5 + camX * 0.05;
      const cy = H * 0.52 + camY * 0.04;
      const pulse = 0.92 + 0.08 * Math.sin(t * 1.6);
      const r = Math.min(W, H) * 0.055 * pulse;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, Math.min(W, H) * 0.18);
      g.addColorStop(0, "rgba(243,239,255,0.18)");
      g.addColorStop(0.30, "rgba(189,166,255,0.12)");
      g.addColorStop(0.65, "rgba(123,97,255,0.06)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(W, H) * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // ── main loop ──
    let raf = 0;
    const startTime = performance.now();
    let last = startTime;

    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const elapsed = (now - startTime) / 1000;
      const t = elapsed % LOOP;

      // smooth mouse
      smx += (mx - smx) * 0.06;
      smy += (my - smy) * 0.06;

      // camera drift
      camT += dt;
      camX = Math.sin(camT * 0.15) * 14 + smx * 8;
      camY = Math.cos(camT * 0.12) * 10 + smy * 6;

      // camera zoom: push in during convergence (8% max)
      const zoomTarget = 1.0 + 0.08 * smoothstep(ACT.converge.a, ACT.converge.b, t)
        - 0.04 * smoothstep(ACT.os.a, ACT.os.b, t);
      camZoom += (zoomTarget - camZoom) * 0.03;

      // ── act weights ──
      const wChaos = (1 - smoothstep(ACT.chaos.a, ACT.field.a, t));
      const wField = smoothstep(ACT.chaos.b - 0.5, ACT.field.a + 0.5, t) * (1 - smoothstep(ACT.field.b - 0.5, ACT.converge.a + 0.5, t));
      const wConv = smoothstep(ACT.field.b - 0.8, ACT.converge.a + 1.0, t) * (1 - smoothstep(ACT.converge.b - 0.5, ACT.aware.a + 0.5, t));
      const wAware = smoothstep(ACT.converge.b - 0.8, ACT.aware.a + 0.8, t) * (1 - smoothstep(ACT.aware.b - 0.5, ACT.os.a + 0.5, t));
      const wOS = smoothstep(ACT.aware.b - 0.8, ACT.os.a + 1.0, t) * (1 - smoothstep(ACT.os.b - 0.3, ACT.dissolve.a + 0.3, t));
      const wDissolve = smoothstep(ACT.dissolve.a - 0.3, ACT.dissolve.b, t);

      // ── physics knobs ──
      // Temperature: high in chaos, drops sharply after field
      const temperature = clamp(
        1.0 * wChaos +
        0.45 * wField +
        0.08 * wConv +
        0.03 * wAware +
        0.02 * wOS +
        0.6 * wDissolve,
        0, 1
      );

      // Coherence: how hard particles snap to target
      const coherence = clamp(
        0.02 * wChaos +
        0.25 * wField +
        0.82 * wConv +
        0.90 * wAware +
        0.85 * wOS +
        0.10 * wDissolve,
        0, 1
      );

      // Warmth ramp
      const warmAmp = clamp(
        0.0 * wChaos +
        0.05 * wField +
        0.50 * wConv +
        0.70 * wAware +
        0.55 * wOS,
        0, 1
      );

      // ── grid coordinates ──
      const padX = W * 0.08, padY = H * 0.14;
      const gx = (W - padX * 2) / (GCOLS - 1);
      const gy = (H - padY * 2) / (GROWS - 1);
      const cx = W * 0.02, cy = H * 0.04;

      // ── typography animation ──
      // Title mask reveal starts at t=2.0, completes by t=3.5
      const titleTarget = smoothstep(2.0, 3.5, t) * (1 - wDissolve);
      titleReveal += (titleTarget - titleReveal) * 0.08;

      // Sub text fades in at t=3.5..4.5
      const subTarget = smoothstep(3.5, 4.8, t) * (1 - wDissolve);
      subAlpha += (subTarget - subAlpha) * 0.06;

      // Apply to DOM
      if (titleEl) {
        titleEl.style.clipPath = `inset(0 ${(1 - titleReveal) * 100}% 0 0)`;
        titleEl.style.opacity = `${clamp(titleReveal * 1.2, 0, 1)}`;
        titleEl.style.transform = `scale(${lerp(1.04, 1.0, titleReveal)})`;
      }
      if (subEl) {
        subEl.style.opacity = `${clamp(subAlpha, 0, 1)}`;
      }

      // ── mesh / bucket setup ──
      const wantMesh = !prefersReduced && (wConv + wAware + wOS) > 0.12;
      const bucketSize = 85;
      const buckets = wantMesh ? new Map<string, number[]>() : null;
      const bKey = (x: number, y: number) => `${Math.floor(x / bucketSize)}:${Math.floor(y / bucketSize)}`;

      // ── draw ──
      drawBG();
      drawHaze(0.30 + 0.20 * wConv + 0.25 * wAware + 0.15 * wOS);

      // Grid (bg layer, slow parallax) — fades in during late chaos, full in field
      const gridAlpha = 0.04 * smoothstep(1.8, 2.5, t) + 0.12 * wField + 0.18 * wConv + 0.20 * wAware + 0.14 * wOS;
      drawGrid(gridAlpha * (1 - wDissolve));

      // Eye glow (gold tint)
      drawEyeGlow(t, 0.75 * wAware);

      // Core glow (scene 5)
      drawCore(wOS, elapsed);

      // ── update + draw particles ──
      ctx.save();

      for (let i = 0; i < N; i++) {
        const p = particles[i];
        const layerMul = LAYER_SPEED[p.layer];
        const layerSz = LAYER_SIZE[p.layer];
        const jj = (rand(p.seed * 3.1 + elapsed * 1.1) - 0.5) * 2;
        const kk = (rand(p.seed * 8.7 + elapsed * 1.4) - 0.5) * 2;

        // ── target blending ──
        // Field grid target
        const gi = i % (GCOLS * GROWS);
        const fieldX = padX + (gi % GCOLS) * gx - W / 2 + cx;
        const fieldY = padY + (Math.floor(gi / GCOLS) % GROWS) * gy - H / 2 + cy;

        // Head silhouette target
        const hp = headPts[i] || headPts[i % headPts.length];
        const hs = toScreen(hp, 0.90, cx, cy);

        // Eye cluster target (subset)
        const isEye = i < eyePts.length;
        const es = isEye ? toScreen(eyePts[i], 0.96, cx, cy) : null;

        // Orbit target
        const isCore = i < orbitCore.length;
        const op = isCore ? orbitCore[i] : orbitRings[i - orbitCore.length] || { x: 0, y: 0 };
        // Rotate orbits slowly
        const orbAngle = elapsed * (isCore ? 0.08 : 0.15 + (i % 3) * 0.04);
        const cosA = Math.cos(orbAngle), sinA = Math.sin(orbAngle);
        const rotOp = { x: op.x * cosA - op.y * sinA, y: op.x * sinA + op.y * cosA };
        const os = toScreen(rotOp, 0.88, 0, cy * 0.5);

        let tx = p.x, ty = p.y;

        // Chaos: just drift (tx stays current pos)
        // Field pull
        tx = lerp(tx, fieldX, 0.40 * wField);
        ty = lerp(ty, fieldY, 0.40 * wField);

        // Convergence → head
        tx = lerp(tx, hs.x, 0.85 * wConv + 0.50 * wAware);
        ty = lerp(ty, hs.y, 0.85 * wConv + 0.50 * wAware);

        // Awareness → eye cluster (subset)
        if (isEye && es) {
          tx = lerp(tx, es.x, 0.70 * wAware);
          ty = lerp(ty, es.y, 0.70 * wAware);
        }

        // OS → orbits
        tx = lerp(tx, os.x, 0.80 * wOS);
        ty = lerp(ty, os.y, 0.80 * wOS);

        // Dissolve outward
        if (wDissolve > 0.001) {
          const outX = p.x * 1.6 + (rand(p.seed * 2.2) - 0.5) * W * 0.5;
          const outY = p.y * 1.6 + (rand(p.seed * 5.6) - 0.5) * H * 0.5;
          tx = lerp(tx, outX, 0.80 * wDissolve);
          ty = lerp(ty, outY, 0.80 * wDissolve);
        }

        p.tx = tx;
        p.ty = ty;

        // Physics
        const pull = 0.50 * coherence + 0.15;
        const noise = 28 * temperature;
        p.vx = (p.vx + (p.tx - p.x) * pull + jj * noise * 0.015) * (1 - 0.14 * coherence);
        p.vy = (p.vy + (p.ty - p.y) * pull + kk * noise * 0.015) * (1 - 0.14 * coherence);
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;

        // Rotation (slows with coherence)
        p.rot += p.spin * dt * (1 - coherence * 0.7);

        // Screen position with depth parallax + camera zoom
        const px = (p.x * camZoom + camX * layerMul * 0.25) + W / 2;
        const py = (p.y * camZoom + camY * layerMul * 0.20) + H / 2;

        // Wrap during chaos
        if (wChaos > 0.3 && wConv < 0.1) {
          const edge = 30;
          if (p.x < -W / 2 - edge) p.x = W / 2 + edge;
          if (p.x > W / 2 + edge) p.x = -W / 2 - edge;
          if (p.y < -H / 2 - edge) p.y = H / 2 + edge;
          if (p.y > H / 2 + edge) p.y = -H / 2 - edge;
        }

        // ── color ──
        // Cool: lavender/violet. Warm: coral/peach.
        const warmness = p.warm ? warmAmp : 0;
        // Front-face particles (high x in head space) get warmer tint
        const faceWarm = wConv > 0.2 ? clamp((hp.x - 0.1) * 1.5, 0, 1) * wConv * 0.3 : 0;
        const totalWarm = clamp(warmness + faceWarm, 0, 1);

        const r = Math.floor(lerp(172, 242, totalWarm));
        const g = Math.floor(lerp(158, 193, totalWarm));
        const b = Math.floor(lerp(255, 174, totalWarm));

        // Alpha: subtle during chaos, stronger during formations
        const baseAlpha = clamp(
          0.18 * wChaos +
          0.32 * wField +
          0.50 * wConv +
          0.55 * wAware +
          0.45 * wOS +
          0.12 * wDissolve,
          0.05, 0.85
        );

        const size = (1.0 + 0.8 * wConv + 1.4 * wAware + 0.9 * wOS) * p.s * layerSz;

        // ── draw shard ──
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = baseAlpha;
        ctx.translate(px, py);
        ctx.rotate(p.rot * (1 - coherence * 0.8)); // rotation diminishes with coherence

        if (p.kind === 0) {
          // doc fragment: thin rounded rectangle
          ctx.fillStyle = `rgba(${r},${g},${b},1)`;
          const ww = size * 5.5, hh = size * 1.6;
          rrPath(-ww / 2, -hh / 2, ww, hh, 2);
          ctx.fill();
        } else if (p.kind === 1) {
          // pixel block
          ctx.fillStyle = `rgba(${r},${g},${b},1)`;
          const ss = size * 2.0;
          ctx.fillRect(-ss / 2, -ss / 2, ss, ss);
        } else {
          // dna squiggle stroke
          ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(-size * 2.2, 0);
          // Small sine wave
          const segs = 4;
          for (let si = 1; si <= segs; si++) {
            const sx = lerp(-size * 2.2, size * 2.2, si / segs);
            const sy = Math.sin(si * 1.5) * size * 0.8;
            ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }

        ctx.restore();

        // Sparkle during awareness (gold accent)
        if (wAware > 0.15 && i % 42 === 0) {
          const sparkle = 0.20 + 0.30 * (0.5 + 0.5 * Math.sin(elapsed * 7.0 + i));
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = sparkle * wAware;
          ctx.fillStyle = "rgba(255,220,160,1)";
          ctx.beginPath();
          ctx.arc(px, py, 0.5 * size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // bucket for mesh
        if (wantMesh && buckets) {
          const bk = bKey(px, py);
          const arr = buckets.get(bk);
          if (arr) arr.push(i);
          else buckets.set(bk, [i]);
        }
      }

      // ── mesh lines ──
      if (wantMesh && buckets) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const meshAlpha = clamp(0.10 * wConv + 0.18 * wAware + 0.15 * wOS, 0, 0.20);
        ctx.globalAlpha = meshAlpha;
        ctx.lineWidth = 0.8;
        const maxD2 = 110 * 110;
        for (const [k, arr] of buckets.entries()) {
          const [bxI, byI] = k.split(":").map(Number);
          for (let ox = -1; ox <= 1; ox++) {
            for (let oy = -1; oy <= 1; oy++) {
              const other = buckets.get(`${bxI + ox}:${byI + oy}`);
              if (!other) continue;
              for (let a = 0; a < arr.length; a++) {
                const ii = arr[a];
                const p1 = particles[ii];
                const x1 = (p1.x * camZoom + camX * LAYER_SPEED[p1.layer] * 0.25) + W / 2;
                const y1 = (p1.y * camZoom + camY * LAYER_SPEED[p1.layer] * 0.20) + H / 2;
                let links = 0;
                for (let bb = 0; bb < other.length && links < 2; bb++) {
                  const jj2 = other[bb];
                  if (jj2 <= ii) continue;
                  const p2 = particles[jj2];
                  const x2 = (p2.x * camZoom + camX * LAYER_SPEED[p2.layer] * 0.25) + W / 2;
                  const y2 = (p2.y * camZoom + camY * LAYER_SPEED[p2.layer] * 0.20) + H / 2;
                  const d2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
                  if (d2 < maxD2) {
                    const fade = 1 - Math.sqrt(d2) / 110;
                    const ww = warmAmp;
                    ctx.strokeStyle = `rgba(${Math.floor(lerp(189, 232, ww))},${Math.floor(lerp(166, 150, ww))},${Math.floor(lerp(255, 124, ww))},${fade * 0.3})`;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                    links++;
                  }
                }
              }
            }
          }
        }
        ctx.restore();
      }

      ctx.restore();
      drawVignette();

      // End-of-loop fade for seamless reset
      if (wDissolve > 0.5) {
        ctx.save();
        ctx.globalAlpha = smoothstep(0.5, 1.0, wDissolve) * 0.65;
        ctx.fillStyle = "#080614";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [formations]);

  return (
    <section
      ref={wrapRef}
      className="relative w-full overflow-hidden"
      style={{
        height: "min(94vh, 880px)",
        minHeight: "560px",
        background:
          "radial-gradient(circle at 32% 52%, rgba(123,97,255,0.22), rgba(10,8,20,0) 58%)," +
          "radial-gradient(circle at 76% 60%, rgba(232,150,124,0.15), rgba(10,8,20,0) 60%)," +
          "linear-gradient(180deg, #080614 0%, #0A0818 35%, #0B0613 100%)",
      }}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
      />

      {/* Film grain overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 28%, rgba(255,255,255,0.04), transparent 40%)," +
            "radial-gradient(circle at 82% 62%, rgba(255,255,255,0.03), transparent 45%)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Typography — Mask reveal from left */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "clamp(18px, 3.5vw, 52px)",
          right: "clamp(18px, 3.5vw, 52px)",
          top: "clamp(24px, 5vh, 64px)",
        }}
      >
        <div
          ref={titleRef}
          style={{
            fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
            fontWeight: 900,
            letterSpacing: "-0.025em",
            lineHeight: 0.88,
            fontSize: "clamp(52px, 11.5vw, 200px)",
            textTransform: "uppercase",
            background:
              "linear-gradient(92deg, rgba(189,166,255,0.96) 0%, rgba(242,193,174,0.93) 48%, rgba(123,97,255,0.96) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 16px 50px rgba(0,0,0,0.45))",
            userSelect: "none",
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
            transformOrigin: "left center",
            willChange: "clip-path, opacity, transform",
          }}
        >
          INTELLIGENCE
        </div>
        <div
          ref={subRef}
          style={{
            marginTop: "clamp(10px, 1.5vh, 18px)",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            fontSize: "11px",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "rgba(243,239,255,0.58)",
            userSelect: "none",
            opacity: 0,
            willChange: "opacity",
          }}
        >
          Intelligence is not a model — it&apos;s a convergence
        </div>
      </div>

      {/* Bottom label */}
      <div
        className="absolute left-0 right-0 text-center pointer-events-none"
        style={{
          bottom: "20px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          fontSize: "10px",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "rgba(243,239,255,0.32)",
          userSelect: "none",
        }}
      >
        DOCG AI • Cognitive Infrastructure
      </div>
    </section>
  );
}
