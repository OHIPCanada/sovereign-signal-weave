import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

type Vec2 = { x: number; y: number };
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const dist2 = (a: Vec2, b: Vec2) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
};
const len = (v: Vec2) => Math.hypot(v.x, v.y);
const norm = (v: Vec2) => {
  const l = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / l, y: v.y / l };
};
const add = (a: Vec2, b: Vec2) => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: Vec2, b: Vec2) => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (a: Vec2, s: number) => ({ x: a.x * s, y: a.y * s });

function hash(n: number) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r | 0},${g | 0},${b | 0},${a})`;
}

type Particle = {
  id: number;
  p: Vec2;
  v: Vec2;
  grid: Vec2;
  face: Vec2;
  loopA: Vec2;
  loopB: Vec2;
  kind: 0 | 1 | 2;
  hue: 0 | 1;
  C: number;
  temp: number;
  alive: boolean;
};

function buildFaceTargets(n: number): Vec2[] {
  const out: Vec2[] = [];
  const ovalCount = Math.floor(n * 0.35);
  for (let i = 0; i < ovalCount; i++) {
    const t = (i / ovalCount) * Math.PI * 2;
    const rx = 0.55 + 0.05 * Math.sin(t * 2);
    const ry = 0.78 + 0.05 * Math.cos(t * 3);
    out.push({ x: Math.cos(t) * rx, y: Math.sin(t) * ry });
  }
  const eyeCount = Math.floor(n * 0.18);
  for (let i = 0; i < eyeCount; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const k = Math.floor(i / 2);
    const t = (k / (eyeCount / 2)) * Math.PI * 2;
    out.push({ x: 0.22 * side + Math.cos(t) * 0.16, y: -0.16 + Math.sin(t) * 0.09 });
  }
  const pupilCount = Math.floor(n * 0.05);
  for (let i = 0; i < pupilCount; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const r = Math.sqrt(hash(i * 19.7)) * 0.04;
    const a = hash(i * 3.3) * Math.PI * 2;
    out.push({ x: 0.22 * side + Math.cos(a) * r, y: -0.16 + Math.sin(a) * r });
  }
  const noseCount = Math.floor(n * 0.12);
  for (let i = 0; i < noseCount; i++) {
    const t = i / Math.max(1, noseCount - 1);
    out.push({ x: (hash(i * 4.1) - 0.5) * 0.02, y: lerp(-0.08, 0.26, t) });
  }
  const mouthCount = Math.floor(n * 0.12);
  for (let i = 0; i < mouthCount; i++) {
    const t = i / Math.max(1, mouthCount - 1);
    const a = lerp(-Math.PI * 0.1, Math.PI * 1.1, t);
    out.push({ x: Math.cos(a) * 0.22, y: 0.38 + Math.sin(a) * 0.08 });
  }
  while (out.length < n) {
    const r = Math.sqrt(Math.random());
    const a = Math.random() * Math.PI * 2;
    const x = Math.cos(a) * 0.48 * r;
    const y = Math.sin(a) * 0.70 * r;
    if ((x * x) / (0.55 * 0.55) + (y * y) / (0.78 * 0.78) <= 1.0) out.push({ x, y });
  }
  return out.slice(0, n);
}

type BucketKey = string;
function bucketKey(ix: number, iy: number): BucketKey {
  return `${ix},${iy}`;
}

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = Math.max(1, Math.floor(r.width));
      h = Math.max(1, Math.floor(r.height));
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let mx = 0, my = 0, pmx = 0, pmy = 0;
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
      my = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const PAL = {
      bgTop: "#070B14",
      bgMid: "#0A0F1E",
      bgBot: "#060A14",
      cool: { r: 155, g: 123, b: 255 },
      lav: { r: 189, g: 166, b: 255 },
      coral: { r: 232, g: 150, b: 124 },
      peach: { r: 242, g: 193, b: 174 },
      mint: { r: 106, g: 255, b: 210 },
      white: { r: 243, g: 239, b: 255 },
    };

    const LOOP = prefersReducedMotion ? 10.0 : 18.0;
    const S1 = 0.0;
    const S2 = prefersReducedMotion ? 2.0 : 3.4;
    const S3 = prefersReducedMotion ? 4.0 : 7.2;
    const S4 = prefersReducedMotion ? 6.6 : 12.0;
    const S5 = prefersReducedMotion ? 8.2 : 15.3;

    const N = (() => {
      const area = w * h;
      if (prefersReducedMotion) return Math.floor(clamp(area / 22000, 900, 1800));
      return Math.floor(clamp(area / 9000, 2500, 7200));
    })();

    const particles: Particle[] = new Array(N);
    const GRID_COLS = 22;
    const GRID_ROWS = 12;
    const GRID_PAD = 64;

    function gridPoint(ix: number, iy: number): Vec2 {
      const gw = w - GRID_PAD * 2;
      const gh = h - GRID_PAD * 2;
      return { x: GRID_PAD + (ix / (GRID_COLS - 1)) * gw, y: GRID_PAD + (iy / (GRID_ROWS - 1)) * gh };
    }

    let faceTargetsNorm: Vec2[] = buildFaceTargets(N);

    const workflowLoops: { a: Vec2; r: number; speed: number }[] = [];
    function buildWorkflowLoops() {
      workflowLoops.length = 0;
      const cx = w * 0.5, cy = h * 0.55;
      const count = prefersReducedMotion ? 3 : 5;
      for (let i = 0; i < count; i++) {
        const rr = lerp(Math.min(w, h) * 0.10, Math.min(w, h) * 0.22, i / Math.max(1, count - 1));
        workflowLoops.push({ a: { x: cx, y: cy }, r: rr, speed: lerp(0.22, 0.45, i / Math.max(1, count - 1)) });
      }
    }
    buildWorkflowLoops();

    for (let i = 0; i < N; i++) {
      const r = Math.random();
      const kind = (r < 0.45 ? 0 : r < 0.78 ? 1 : 2) as 0 | 1 | 2;
      const hue = (hash(i * 11.7) > 0.62 ? 1 : 0) as 0 | 1;
      const ix = i % GRID_COLS;
      const iy = Math.floor(i / GRID_COLS) % GRID_ROWS;
      const gp = gridPoint(ix, iy);
      particles[i] = {
        id: i,
        p: { x: Math.random() * w, y: Math.random() * h },
        v: { x: (Math.random() - 0.5) * 0.8, y: (Math.random() - 0.5) * 0.8 },
        grid: { x: gp.x + (hash(i * 2.1) - 0.5) * 14, y: gp.y + (hash(i * 3.9) - 0.5) * 14 },
        face: { x: 0, y: 0 },
        loopA: { x: 0, y: 0 },
        loopB: { x: 0, y: 0 },
        kind, hue,
        C: 0.02 + hash(i * 7.7) * 0.06,
        temp: 1.0,
        alive: true,
      };
    }

    function recomputeTargetsOnResize() {
      faceTargetsNorm = buildFaceTargets(N);
      for (let i = 0; i < N; i++) {
        const ix = i % GRID_COLS;
        const iy = Math.floor(i / GRID_COLS) % GRID_ROWS;
        const gp = gridPoint(ix, iy);
        particles[i].grid = { x: gp.x + (hash(i * 2.1) - 0.5) * 14, y: gp.y + (hash(i * 3.9) - 0.5) * 14 };
      }
      const cx = w * 0.5, cy = h * 0.57, scale = Math.min(w, h) * 0.34;
      for (let i = 0; i < N; i++) {
        const ft = faceTargetsNorm[i];
        particles[i].face = { x: cx + ft.x * scale, y: cy + ft.y * scale };
      }
      buildWorkflowLoops();
      for (let i = 0; i < N; i++) {
        const lp = workflowLoops[i % workflowLoops.length];
        const a = hash(i * 5.3) * Math.PI * 2;
        particles[i].loopA = { x: lp.a.x + Math.cos(a) * lp.r, y: lp.a.y + Math.sin(a) * lp.r * 0.65 };
        particles[i].loopB = { x: lp.a.x + Math.cos(a + 1.1) * lp.r, y: lp.a.y + Math.sin(a + 1.1) * lp.r * 0.65 };
      }
    }
    recomputeTargetsOnResize();

    const ro2 = new ResizeObserver(() => { resize(); recomputeTargetsOnResize(); });
    ro2.observe(wrap);

    const film = {
      t: 0, entropy: 1.0, temperature: 1.0, coherence: 0.03,
      field: 0.0, wave: 0.0, graph: 0.0, spiral: 0.0,
      face: 0.0, gaze: 0.0, os: 0.0, memoryCore: 0.0, safety: 0.0,
    };

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
    tl.to(film, { t: S2, duration: S2 - S1 });
    tl.to(film, { entropy: 1.0, temperature: 1.0, coherence: 0.03, field: 0.0, wave: 0.0, graph: 0.0, spiral: 0.0, face: 0.0, gaze: 0.0, os: 0.0, memoryCore: 0.0, safety: 0.0, duration: S2 - S1 }, 0);
    tl.to(film, { t: S3, duration: S3 - S2 }, S2);
    tl.to(film, { entropy: prefersReducedMotion ? 0.55 : 0.35, temperature: prefersReducedMotion ? 0.55 : 0.30, coherence: prefersReducedMotion ? 0.28 : 0.36, field: 1.0, wave: 1.0, duration: S3 - S2, ease: "power2.out" }, S2);
    tl.to(film, { t: S4, duration: S4 - S3 }, S3);
    tl.to(film, { coherence: prefersReducedMotion ? 0.44 : 0.56, graph: 1.0, spiral: 1.0, wave: 0.65, duration: S4 - S3, ease: "sine.inOut" }, S3);
    tl.to(film, { t: S5, duration: S5 - S4 }, S4);
    tl.to(film, { face: 1.0, gaze: 1.0, graph: 0.65, spiral: 0.55, coherence: prefersReducedMotion ? 0.52 : 0.62, duration: S5 - S4, ease: "power2.inOut" }, S4);
    tl.to(film, { t: LOOP, duration: LOOP - S5 }, S5);
    tl.to(film, { os: 1.0, memoryCore: 1.0, safety: 1.0, face: 0.0, gaze: 0.0, coherence: prefersReducedMotion ? 0.58 : 0.68, entropy: prefersReducedMotion ? 0.34 : 0.22, temperature: prefersReducedMotion ? 0.32 : 0.20, duration: LOOP - S5, ease: "sine.inOut" }, S5);
    tl.call(() => { film.t = 0; });

    const seed = { x: w * 0.5, y: h * 0.55 };
    const dists = particles.map((p) => Math.sqrt(dist2(p.p, seed)));
    let dMin = Infinity, dMax = -Infinity;
    for (const d of dists) { dMin = Math.min(dMin, d); dMax = Math.max(dMax, d); }

    let raf = 0;
    let last = performance.now();
    const BUCKET = 70;
    const buckets = new Map<BucketKey, number[]>();

    function rebuildBuckets() {
      buckets.clear();
      for (let i = 0; i < N; i++) {
        const p = particles[i].p;
        const key = bucketKey(Math.floor(p.x / BUCKET), Math.floor(p.y / BUCKET));
        const arr = buckets.get(key);
        if (arr) arr.push(i); else buckets.set(key, [i]);
      }
    }

    function neighborsFor(i: number, k: number): number[] {
      const p = particles[i].p;
      const ix = Math.floor(p.x / BUCKET), iy = Math.floor(p.y / BUCKET);
      const candidates: number[] = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const arr = buckets.get(bucketKey(ix + dx, iy + dy));
        if (arr) candidates.push(...arr);
      }
      const scored: { j: number; d: number }[] = [];
      for (const j of candidates) {
        if (j === i) continue;
        scored.push({ j, d: dist2(p, particles[j].p) });
      }
      scored.sort((a, b) => a.d - b.d);
      return scored.slice(0, k).map((s) => s.j);
    }

    function bg() {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, PAL.bgTop); g.addColorStop(0.5, PAL.bgMid); g.addColorStop(1, PAL.bgBot);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const a1 = ctx.createRadialGradient(w * 0.22, h * 0.58, 1, w * 0.22, h * 0.58, Math.min(w, h) * 0.85);
      a1.addColorStop(0, "rgba(189,166,255,0.11)"); a1.addColorStop(0.65, "rgba(189,166,255,0.03)"); a1.addColorStop(1, "rgba(189,166,255,0)");
      ctx.fillStyle = a1; ctx.fillRect(0, 0, w, h);
      const a2 = ctx.createRadialGradient(w * 0.78, h * 0.52, 1, w * 0.78, h * 0.52, Math.min(w, h) * 0.90);
      a2.addColorStop(0, "rgba(232,150,124,0.09)"); a2.addColorStop(0.65, "rgba(232,150,124,0.025)"); a2.addColorStop(1, "rgba(232,150,124,0)");
      ctx.fillStyle = a2; ctx.fillRect(0, 0, w, h);
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.55, Math.min(w, h) * 0.12, w * 0.5, h * 0.55, Math.max(w, h) * 0.92);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.65)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    }

    function drawGridField(fieldAlpha: number, par: Vec2) {
      if (fieldAlpha <= 0.001) return;
      const cell = Math.max(34, Math.min(58, Math.floor(Math.min(w, h) / 18)));
      const ox = (par.x * 10) % cell, oy = (par.y * 10) % cell;
      ctx.save(); ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(189,166,255,${0.05 + fieldAlpha * 0.09})`;
      for (let x = -cell; x < w + cell; x += cell) { ctx.beginPath(); ctx.moveTo(x + ox, 0); ctx.lineTo(x + ox, h); ctx.stroke(); }
      for (let y = -cell; y < h + cell; y += cell) { ctx.beginPath(); ctx.moveTo(0, y + oy); ctx.lineTo(w, y + oy); ctx.stroke(); }
      ctx.globalCompositeOperation = "lighter";
      const t = (performance.now() / 1000) * (prefersReducedMotion ? 0.6 : 1.1);
      const pulseCount = prefersReducedMotion ? 10 : 20;
      for (let i = 0; i < pulseCount; i++) {
        const gx = Math.floor(hash(i * 7.1 + t * 0.3) * GRID_COLS);
        const gy = Math.floor(hash(i * 9.3 + t * 0.22) * GRID_ROWS);
        const p = gridPoint(gx, gy);
        const rr = 8 + 14 * hash(i * 3.7 + t);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr);
        grad.addColorStop(0, `rgba(242,193,174,${0.14 + fieldAlpha * 0.12})`);
        grad.addColorStop(0.5, `rgba(232,150,124,${0.06 + fieldAlpha * 0.09})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    function drawMemoryCore(alpha: number, par: Vec2) {
      if (alpha <= 0.001) return;
      const cx = w * 0.5 + par.x * 10, cy = h * 0.56 + par.y * 8;
      const t = performance.now() / 1000;
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      const r0 = (Math.min(w, h) * 0.06) * (0.9 + 0.08 * Math.sin(t * 1.8));
      const r1 = (Math.min(w, h) * 0.18) * (0.95 + 0.10 * Math.sin(t * 0.9));
      const g = ctx.createRadialGradient(cx, cy, r0 * 0.25, cx, cy, r1);
      g.addColorStop(0, `rgba(243,239,255,${0.10 + alpha * 0.20})`);
      g.addColorStop(0.35, `rgba(189,166,255,${0.08 + alpha * 0.18})`);
      g.addColorStop(0.65, `rgba(232,150,124,${0.05 + alpha * 0.12})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r1, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(232,150,124,${0.12 + alpha * 0.18})`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, r0 * 1.25, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    function drawSafetyInterlocks(alpha: number, par: Vec2) {
      if (alpha <= 0.001) return;
      ctx.save();
      ctx.strokeStyle = `rgba(189,166,255,${0.05 + alpha * 0.10})`; ctx.lineWidth = 1;
      const pad = 34, rx = 22;
      ctx.beginPath();
      const x = pad + par.x * 6, y = pad + par.y * 6, ww = w - pad * 2, hh = h - pad * 2;
      const r = Math.min(rx, ww / 2, hh / 2);
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + ww, y, x + ww, y + hh, r);
      ctx.arcTo(x + ww, y + hh, x, y + hh, r);
      ctx.arcTo(x, y + hh, x, y, r);
      ctx.arcTo(x, y, x + ww, y, r);
      ctx.closePath(); ctx.stroke();
      ctx.restore();
    }

    function particleColor(p: Particle, warmthMix: number, competenceMix: number, a: number) {
      const cool = p.kind === 1 ? PAL.lav : PAL.cool;
      const warm = p.kind === 2 ? PAL.peach : PAL.coral;
      const col = p.hue === 1 ? warm : cool;
      const r = lerp(col.r, PAL.mint.r, warmthMix * 0.18) * (0.92 + competenceMix * 0.08);
      const g = lerp(col.g, PAL.mint.g, warmthMix * 0.22) * (0.92 + competenceMix * 0.08);
      const b = lerp(col.b, PAL.mint.b, warmthMix * 0.10) * (0.92 + competenceMix * 0.08);
      return rgba(r, g, b, a);
    }

    function drawGraph(graphAlpha: number, maxLinksPerParticle: number, maxDist: number, lineAlpha: number, colorMode: "lav" | "warm" | "mint") {
      if (graphAlpha <= 0.001) return;
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.lineWidth = 1;
      const col = colorMode === "lav" ? `rgba(189,166,255,${lineAlpha})` : colorMode === "mint" ? `rgba(106,255,210,${lineAlpha})` : `rgba(232,150,124,${lineAlpha})`;
      ctx.strokeStyle = col;
      rebuildBuckets();
      const step = prefersReducedMotion ? 3 : 2;
      const maxD2 = maxDist * maxDist;
      for (let i = 0; i < N; i += step) {
        const a = particles[i].p;
        const neigh = neighborsFor(i, maxLinksPerParticle);
        for (const j of neigh) {
          const b = particles[j].p;
          const d2v = dist2(a, b);
          if (d2v > maxD2) continue;
          ctx.globalAlpha = graphAlpha * (1 - clamp(Math.sqrt(d2v) / maxDist, 0, 1));
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.restore(); ctx.globalAlpha = 1;
    }

    const waveFront = { val: 0 };

    function update(dt: number) {
      pmx += (mx - pmx) * 0.08;
      pmy += (my - pmy) * 0.08;
      const par = { x: pmx, y: pmy };
      const t = film.t;
      const w1 = smoothstep(S1, S2, t) * (1 - smoothstep(S2, S2 + 0.6, t));
      const w2 = smoothstep(S2 - 0.6, S2 + 0.6, t) * (1 - smoothstep(S3, S3 + 0.6, t));
      const w3 = smoothstep(S3 - 0.6, S3 + 0.6, t) * (1 - smoothstep(S4, S4 + 0.6, t));
      const w4 = smoothstep(S4 - 0.6, S4 + 0.6, t) * (1 - smoothstep(S5, S5 + 0.6, t));
      const w5 = smoothstep(S5 - 0.6, S5 + 0.6, t);
      const temp = film.temperature;
      const entropy = film.entropy;
      const targetC = film.coherence;
      waveFront.val = lerp(dMin, dMax, clamp((t - S2) / Math.max(0.001, S3 - S2), 0, 1));
      const spiral = film.spiral;
      const gazeOffset = { x: pmx * 14 * film.gaze, y: pmy * 10 * film.gaze };
      const os = film.os;

      for (let i = 0; i < N; i++) {
        const p = particles[i];
        if (w1 > 0.001) {
          const jx = (hash((i + 1) * 9.7 + t * 3.1) - 0.5) * 2;
          const jy = (hash((i + 1) * 6.3 + t * 2.7) - 0.5) * 2;
          const a = 38 * temp * entropy;
          p.v.x += jx * a * dt; p.v.y += jy * a * dt;
          p.p.x += (hash(i * 2.3 + t * 9.1) - 0.5) * 6.0 * temp;
          p.p.y += (hash(i * 4.7 + t * 7.3) - 0.5) * 6.0 * temp;
          p.C = lerp(p.C, 0.03, 0.03);
        }
        if (w2 > 0.001) {
          const d = Math.sqrt(dist2(p.p, seed));
          const captured = d <= waveFront.val ? 1 : 0;
          const captureEase = captured ? smoothstep(waveFront.val - 90, waveFront.val + 20, d) : 0;
          const k = (0.9 * film.field + 0.2) * w2 * (0.25 + captureEase * 0.75);
          const to = sub(p.grid, p.p);
          p.v.x += to.x * 2.6 * k * dt; p.v.y += to.y * 2.6 * k * dt;
          p.temp = lerp(p.temp, temp, 0.06);
          p.C = lerp(p.C, targetC, 0.05);
        }
        if (w3 > 0.001) {
          const center = { x: w * 0.5, y: h * 0.55 };
          const rV = sub(p.p, center);
          const rN = norm(rV);
          const perp = { x: -rN.y, y: rN.x };
          const rMag = len(rV);
          const inner = 1 - clamp(rMag / (Math.min(w, h) * 0.55), 0, 1);
          const spiralStrength = spiral * (0.6 + inner * 1.2) * w3;
          p.v.x += perp.x * 24 * spiralStrength * dt; p.v.y += perp.y * 24 * spiralStrength * dt;
          p.v.x += -rN.x * 10 * spiralStrength * dt; p.v.y += -rN.y * 10 * spiralStrength * dt;
          p.C = lerp(p.C, targetC, 0.06);
        }
        if (w4 > 0.001) {
          let faceTarget = p.face;
          const eyeL = { x: w * 0.5 - Math.min(w, h) * 0.34 * 0.22, y: h * 0.57 - Math.min(w, h) * 0.34 * 0.16 };
          const eyeR = { x: w * 0.5 + Math.min(w, h) * 0.34 * 0.22, y: h * 0.57 - Math.min(w, h) * 0.34 * 0.16 };
          const nearEye = Math.min(Math.sqrt(dist2(p.face, eyeL)), Math.sqrt(dist2(p.face, eyeR))) < Math.min(w, h) * 0.05;
          if (nearEye) faceTarget = add(faceTarget, gazeOffset);
          const to = sub(faceTarget, p.p);
          const snap = (0.85 + film.coherence * 0.8) * film.face * w4;
          p.v.x += to.x * 3.4 * snap * dt; p.v.y += to.y * 3.4 * snap * dt;
          const micro = prefersReducedMotion ? 0.3 : 1.0;
          p.v.x += (hash(i * 8.2 + t * 5.4) - 0.5) * 10 * micro * dt;
          p.v.y += (hash(i * 3.8 + t * 6.1) - 0.5) * 10 * micro * dt;
          p.C = lerp(p.C, targetC, 0.08);
        }
        if (w5 > 0.001) {
          const lp = workflowLoops[i % workflowLoops.length];
          const tt = (t - S5) * lp.speed;
          const px = lp.a.x + Math.cos(tt * 2.1 + i * 0.01) * lp.r * 0.9;
          const py = lp.a.y + Math.sin(tt * 1.7 + i * 0.01) * lp.r * 0.6;
          const to = sub({ x: px, y: py }, p.p);
          const k = (0.75 + os * 0.9) * w5;
          p.v.x += to.x * 2.0 * k * dt; p.v.y += to.y * 2.0 * k * dt;
          const pad = 34;
          if (p.p.x < pad) p.v.x += (pad - p.p.x) * 0.8 * w5;
          if (p.p.x > w - pad) p.v.x -= (p.p.x - (w - pad)) * 0.8 * w5;
          if (p.p.y < pad) p.v.y += (pad - p.p.y) * 0.8 * w5;
          if (p.p.y > h - pad) p.v.y -= (p.p.y - (h - pad)) * 0.8 * w5;
          p.C = lerp(p.C, targetC, 0.05);
        }
        const damp = lerp(0.90, 0.965, 1 - p.C) * lerp(0.92, 0.985, 1 - temp);
        p.v.x *= damp; p.v.y *= damp;
        p.p.x += p.v.x * dt; p.p.y += p.v.y * dt;
        if (t < S3) {
          if (p.p.x < -24) p.p.x = w + 24;
          if (p.p.x > w + 24) p.p.x = -24;
          if (p.p.y < -24) p.p.y = h + 24;
          if (p.p.y > h + 24) p.p.y = -24;
        }
      }
      render(par);
    }

    function render(par: Vec2) {
      bg();
      const t = film.t;
      const s1 = 1 - smoothstep(S2 - 0.6, S2 + 0.6, t);
      const s2 = smoothstep(S2 - 0.6, S2 + 0.6, t) * (1 - smoothstep(S3 - 0.6, S3 + 0.6, t));
      const s3 = smoothstep(S3 - 0.6, S3 + 0.6, t) * (1 - smoothstep(S4 - 0.6, S4 + 0.6, t));
      const s4 = smoothstep(S4 - 0.6, S4 + 0.6, t) * (1 - smoothstep(S5 - 0.6, S5 + 0.6, t));
      const s5 = smoothstep(S5 - 0.6, S5 + 0.6, t);

      drawGridField(film.field * s2, par);
      const warmthMix = clamp(s3 * 0.9 + s5 * 0.6, 0, 1);
      const competenceMix = clamp(s2 * 0.8 + s3 * 0.9 + s5 * 1.0, 0, 1);
      drawGraph(film.graph * (s3 * 0.95 + s4 * 0.5), prefersReducedMotion ? 1 : 2, Math.min(w, h) * 0.12, 0.22, "lav");
      if (s3 > 0.05) drawGraph(film.graph * s3 * 0.6, 1, Math.min(w, h) * 0.10, 0.16, "warm");

      if (s4 > 0.02) {
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = `rgba(243,239,255,${0.06 + s4 * 0.08})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(w * 0.5 + par.x * 6, h * 0.57 + par.y * 5, Math.min(w, h) * 0.19, Math.min(w, h) * 0.27, 0, 0, Math.PI * 2);
        ctx.stroke(); ctx.restore();
      }

      drawMemoryCore(film.memoryCore * s5, par);
      drawSafetyInterlocks(film.safety * s5, par);
      if (s5 > 0.05) drawGraph(0.55 * s5, 1, Math.min(w, h) * 0.11, 0.16, "mint");

      ctx.save(); ctx.globalCompositeOperation = "lighter";
      if (s1 > 0.05 && !prefersReducedMotion) {
        ctx.globalAlpha = 0.08 * s1;
        for (let i = 0; i < 140; i++) {
          const x = hash(i * 8.1 + performance.now() * 0.001) * w;
          const y = hash(i * 4.7 + performance.now() * 0.0012) * h;
          ctx.fillStyle = "rgba(243,239,255,0.03)"; ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1;
      }

      const baseR = prefersReducedMotion ? 1.6 : 1.9;
      for (let i = 0; i < N; i++) {
        const p = particles[i];
        const r = baseR + p.C * 1.9 + (p.kind === 1 ? 0.35 : 0);
        const a = 0.10 + p.C * 0.48 + s4 * 0.12;
        ctx.fillStyle = particleColor(p, warmthMix, competenceMix, a);
        ctx.beginPath(); ctx.arc(p.p.x + par.x * (0.8 + p.C * 1.4), p.p.y + par.y * (0.6 + p.C * 1.2), r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      drawSceneHUD(t, s1, s2, s3, s4, s5);
      endFade(t);
    }

    function drawSceneHUD(t: number, s1: number, s2: number, s3: number, s4: number, s5: number) {
      const alpha = 0.10 + (s2 + s3 + s5) * 0.16;
      ctx.save();
      ctx.font = "600 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace";
      ctx.fillStyle = `rgba(243,239,255,${alpha})`; ctx.textAlign = "left"; ctx.textBaseline = "top";
      const x = 24, y = h - 92;
      let label = "FRAGMENTATION / DATA SILOS";
      if (t >= S2 && t < S3) label = "FIELD / INFRASTRUCTURE EMERGES";
      else if (t >= S3 && t < S4) label = "MEANING / UNIFIED KNOWLEDGE GRAPH";
      else if (t >= S4 && t < S5) label = "PERCEPTION / ACCOUNTABILITY";
      else if (t >= S5) label = "STABILIZED INTELLIGENCE / OPERATING SYSTEM";
      ctx.fillText(label, x, y);
      const barW = 190, barH = 6, bx = x, by = y + 20;
      ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(bx, by, barW, barH);
      ctx.strokeStyle = "rgba(189,166,255,0.16)"; ctx.strokeRect(bx, by, barW, barH);
      const c = clamp(film.coherence, 0, 1);
      const gg = ctx.createLinearGradient(bx, 0, bx + barW, 0);
      gg.addColorStop(0, "rgba(189,166,255,0.85)"); gg.addColorStop(0.55, "rgba(232,150,124,0.80)"); gg.addColorStop(1, "rgba(106,255,210,0.78)");
      ctx.fillStyle = gg; ctx.fillRect(bx, by, barW * c, barH);
      ctx.fillStyle = `rgba(243,239,255,${alpha})`;
      ctx.fillText(`COHERENCE  ${(c * 100).toFixed(0)}%`, bx + barW + 12, y + 14);
      ctx.restore();
    }

    function endFade(t: number) {
      const fade = smoothstep(LOOP - 0.55, LOOP, t);
      if (fade <= 0.001) return;
      ctx.save(); ctx.fillStyle = `rgba(0,0,0,${fade * 0.55})`; ctx.fillRect(0, 0, w, h); ctx.restore();
    }

    gsap.ticker.fps(60);
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      film.t = film.t % LOOP;
      update(dt);
    };
    gsap.ticker.add(tick);
    const rafLoop = () => { raf = requestAnimationFrame(rafLoop); };
    raf = requestAnimationFrame(rafLoop);

    return () => {
      cancelAnimationFrame(raf);
      gsap.ticker.remove(tick);
      tl.kill();
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
      ro2.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100vh" }}>
      <div ref={wrapRef} className="relative w-full" style={{ height: "100vh" }}>
        <canvas ref={canvasRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0">
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "7vh",
              transform: "translateX(-50%)",
              width: "min(1600px, 94vw)",
              textAlign: "center",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(64px, 12vw, 260px)",
              background: "linear-gradient(90deg, #BDA6FF 0%, #E8967C 55%, #7B61FF 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 18px 55px rgba(0,0,0,0.70))",
              opacity: 0.98,
              userSelect: "none",
            }}
          >
            INTELLIGENCE
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "6vh",
              transform: "translateX(-50%)",
              width: "min(980px, 92vw)",
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color: "rgba(243,239,255,0.62)",
              userSelect: "none",
            }}
          >
            INTELLIGENCE BECOMES INFRASTRUCTURE
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
