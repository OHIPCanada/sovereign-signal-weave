import React, { useEffect, useMemo, useRef } from "react";

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

function hash(n: number) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

type ShardKind = 0 | 1 | 2;

type Particle = {
  id: number;
  kind: ShardKind;
  p: Vec2;
  v: Vec2;
  rot: number;
  spin: number;
  size: number;
  C: number;
  E: number;
  T: number;
  X: number;
  R: number;
  grid: Vec2;
  graph: Vec2;
  eye: Vec2;
  os: Vec2;
  group: number;
};

type BucketKey = string;

const bucketKey = (ix: number, iy: number): BucketKey => `${ix},${iy}`;

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
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

    const PAL = {
      bgTop: "rgba(7, 10, 18, 1)",
      bgMid: "rgba(10, 14, 28, 1)",
      bgBot: "rgba(6, 9, 18, 1)",
      lav: { r: 189, g: 166, b: 255 },
      violet: { r: 123, g: 97, b: 255 },
      coral: { r: 232, g: 150, b: 124 },
      peach: { r: 242, g: 193, b: 174 },
      mint: { r: 106, g: 255, b: 210 },
      white: { r: 243, g: 239, b: 255 },
    };

    let mx = 0, my = 0, pmx = 0, pmy = 0;
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      mx = clamp(nx, -1, 1);
      my = clamp(ny, -1, 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let userHasScrolled = false;
    let scrollProgress = 0;
    const onScroll = () => {
      userHasScrolled = true;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const passed = window.innerHeight - rect.top;
      scrollProgress = clamp(passed / total, 0, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const S1 = 0.0, S2 = 0.22, S3 = 0.46, S4 = 0.70, S5 = 0.86;

    const area = w * h;
    const N = prefersReducedMotion
      ? Math.floor(clamp(area / 28000, 900, 1700))
      : Math.floor(clamp(area / 11500, 2600, 7200));

    const particles: Particle[] = new Array(N);

    const GRID_COLS = 24;
    const GRID_ROWS = 14;
    const GRID_PAD = 64;

    const gridPoint = (ix: number, iy: number): Vec2 => {
      const gw = w - GRID_PAD * 2;
      const gh = h - GRID_PAD * 2;
      return { x: GRID_PAD + (ix / (GRID_COLS - 1)) * gw, y: GRID_PAD + (iy / (GRID_ROWS - 1)) * gh };
    };

    const eyeCenter = () => ({ x: w * 0.5, y: h * 0.56 });
    const eyeRx = () => Math.min(w, h) * 0.26;
    const eyeRy = () => Math.min(w, h) * 0.14;

    function eyeTarget(i: number): Vec2 {
      const c = eyeCenter();
      const rx = eyeRx();
      const ry = eyeRy();
      const n = N;
      const band = i / n;

      if (band < 0.30) {
        const t = (i / (n * 0.30)) * Math.PI * 2;
        const wob = 1 + 0.06 * Math.sin(t * 3);
        return { x: c.x + Math.cos(t) * rx * wob, y: c.y + Math.sin(t) * ry * wob };
      }
      if (band < 0.55) {
        const k = i - Math.floor(n * 0.30);
        const t = (k / (n * 0.25)) * Math.PI * 2;
        const r = 0.55;
        return { x: c.x + Math.cos(t) * rx * r, y: c.y + Math.sin(t) * ry * r };
      }
      if (band < 0.78) {
        const k = i - Math.floor(n * 0.55);
        const r = Math.sqrt(hash(k * 9.3)) * 0.48;
        const a = hash(k * 3.1) * Math.PI * 2;
        return { x: c.x + Math.cos(a) * rx * r * 0.72, y: c.y + Math.sin(a) * ry * r * 0.72 };
      }
      if (band < 0.90) {
        const k = i - Math.floor(n * 0.78);
        const t = (k / (n * 0.12)) * Math.PI;
        const top = k % 2 === 0;
        const yOff = top ? -ry * 0.95 : ry * 0.95;
        return { x: c.x + (t / Math.PI - 0.5) * rx * 2.0, y: c.y + yOff + (top ? 1 : -1) * Math.sin(t) * ry * 0.20 };
      }
      const k = i - Math.floor(n * 0.90);
      const r = Math.sqrt(hash(k * 8.7)) * 0.09;
      const a = hash(k * 2.9) * Math.PI * 2;
      return { x: c.x + Math.cos(a) * rx * r, y: c.y + Math.sin(a) * ry * r };
    }

    function osTarget(i: number, t: number): Vec2 {
      const c = { x: w * 0.5, y: h * 0.58 };
      const ring = (i % 6) / 5;
      const rad = lerp(Math.min(w, h) * 0.10, Math.min(w, h) * 0.26, ring);
      const spd = lerp(0.55, 1.1, ring);
      const a = t * spd + i * 0.013;
      return { x: c.x + Math.cos(a) * rad * 1.1, y: c.y + Math.sin(a * 1.12) * rad * 0.75 };
    }

    for (let i = 0; i < N; i++) {
      const r = Math.random();
      const kind: ShardKind = r < 0.45 ? 0 : r < 0.78 ? 1 : 2;
      const size = kind === 0 ? 2.2 : kind === 1 ? 2.0 : 2.4;
      const p0 = { x: Math.random() * w, y: Math.random() * h };
      const v0 = { x: (Math.random() - 0.5) * 60, y: (Math.random() - 0.5) * 60 };
      const ix = i % GRID_COLS;
      const iy = Math.floor(i / GRID_COLS) % GRID_ROWS;
      const g = gridPoint(ix, iy);

      particles[i] = {
        id: i, kind, p: p0, v: v0,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 2.8,
        size,
        C: 0.04 + hash(i * 7.7) * 0.04,
        E: 0.95, T: 0.95, X: 0.10, R: 0.08,
        grid: { x: g.x + (hash(i * 3.2) - 0.5) * 14, y: g.y + (hash(i * 5.9) - 0.5) * 14 },
        graph: { x: g.x, y: g.y },
        eye: { x: 0, y: 0 },
        os: { x: 0, y: 0 },
        group: i % 12,
      };
    }

    function recomputeTargets() {
      for (let i = 0; i < N; i++) {
        const ix = i % GRID_COLS;
        const iy = Math.floor(i / GRID_COLS) % GRID_ROWS;
        const g = gridPoint(ix, iy);
        particles[i].grid = { x: g.x + (hash(i * 3.2) - 0.5) * 14, y: g.y + (hash(i * 5.9) - 0.5) * 14 };
        particles[i].graph = { x: g.x, y: g.y };
        particles[i].eye = eyeTarget(i);
      }
    }

    recomputeTargets();

    const ro2 = new ResizeObserver(() => {
      resize();
      recomputeTargets();
    });
    ro2.observe(wrap);

    const BUCKET = 72;
    const buckets = new Map<BucketKey, number[]>();

    function rebuildBuckets() {
      buckets.clear();
      for (let i = 0; i < N; i++) {
        const p = particles[i].p;
        const ix = Math.floor(p.x / BUCKET);
        const iy = Math.floor(p.y / BUCKET);
        const key = bucketKey(ix, iy);
        const arr = buckets.get(key);
        if (arr) arr.push(i);
        else buckets.set(key, [i]);
      }
    }

    function neighborsFor(i: number, k: number): number[] {
      const p = particles[i].p;
      const ix = Math.floor(p.x / BUCKET);
      const iy = Math.floor(p.y / BUCKET);
      const candidates: number[] = [];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const arr = buckets.get(bucketKey(ix + dx, iy + dy));
          if (arr) candidates.push(...arr);
        }
      }
      const scored: { j: number; d: number }[] = [];
      for (const j of candidates) {
        if (j === i) continue;
        const d = dist2(p, particles[j].p);
        scored.push({ j, d });
      }
      scored.sort((a, b) => a.d - b.d);
      return scored.slice(0, k).map((s) => s.j);
    }

    const CERTX = {
      Cstar: 0.68,
      C: 0.06, E: 0.95, R: 0.08, T: 0.95, X: 0.12,
      P: 0,
    };

    function sawtooth(t: number) {
      const period = 1.0;
      const pause = 1 / (14.56 + 1);
      const flow = 1 - pause;
      const x = (t % period) / period;
      if (x < flow) return x / flow;
      return 1 - (x - flow) / pause;
    }

    function drawBG(par: Vec2) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, PAL.bgTop);
      g.addColorStop(0.55, PAL.bgMid);
      g.addColorStop(1, PAL.bgBot);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const a1 = ctx.createRadialGradient(w * 0.20, h * 0.60, 1, w * 0.20, h * 0.60, Math.min(w, h) * 0.95);
      a1.addColorStop(0, "rgba(189,166,255,0.11)");
      a1.addColorStop(0.65, "rgba(189,166,255,0.03)");
      a1.addColorStop(1, "rgba(189,166,255,0)");
      ctx.fillStyle = a1;
      ctx.fillRect(0, 0, w, h);

      const a2 = ctx.createRadialGradient(w * 0.80, h * 0.55, 1, w * 0.80, h * 0.55, Math.min(w, h) * 0.98);
      a2.addColorStop(0, "rgba(232,150,124,0.095)");
      a2.addColorStop(0.65, "rgba(232,150,124,0.028)");
      a2.addColorStop(1, "rgba(232,150,124,0)");
      ctx.fillStyle = a2;
      ctx.fillRect(0, 0, w, h);

      const vg = ctx.createRadialGradient(w * 0.5, h * 0.58, Math.min(w, h) * 0.12, w * 0.5, h * 0.58, Math.max(w, h) * 0.95);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.70)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      if (!prefersReducedMotion) {
        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        for (let i = 0; i < 140; i++) {
          const x = hash(i * 7.1 + performance.now() * 0.0007) * w;
          const y = hash(i * 3.9 + performance.now() * 0.0009) * h;
          ctx.fillRect(x, y, 1, 1);
        }
        ctx.restore();
      }
    }

    function drawFieldGrid(alpha: number, par: Vec2) {
      if (alpha <= 0.001) return;
      const cell = Math.max(34, Math.min(62, Math.floor(Math.min(w, h) / 18)));
      const ox = (par.x * 10) % cell;
      const oy = (par.y * 10) % cell;
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(189,166,255,${0.05 + alpha * 0.10})`;
      for (let x = -cell; x < w + cell; x += cell) {
        ctx.beginPath(); ctx.moveTo(x + ox, 0); ctx.lineTo(x + ox, h); ctx.stroke();
      }
      for (let y = -cell; y < h + cell; y += cell) {
        ctx.beginPath(); ctx.moveTo(0, y + oy); ctx.lineTo(w, y + oy); ctx.stroke();
      }
      ctx.globalCompositeOperation = "lighter";
      const t = performance.now() / 1000;
      const pulses = prefersReducedMotion ? 10 : 22;
      for (let i = 0; i < pulses; i++) {
        const gx = Math.floor(hash(i * 11.1 + t * 0.22) * GRID_COLS);
        const gy = Math.floor(hash(i * 9.7 + t * 0.18) * GRID_ROWS);
        const p = gridPoint(gx, gy);
        const rr = 10 + 18 * hash(i * 3.3 + t);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr);
        grad.addColorStop(0, `rgba(242,193,174,${0.12 + alpha * 0.12})`);
        grad.addColorStop(0.45, `rgba(232,150,124,${0.06 + alpha * 0.10})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    function drawGraph(alpha: number, color: "lav" | "warm" | "mint", maxDist: number, k: number) {
      if (alpha <= 0.001) return;
      const col =
        color === "lav" ? `rgba(189,166,255,${0.16})`
        : color === "mint" ? `rgba(106,255,210,${0.14})`
        : `rgba(232,150,124,${0.16})`;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      rebuildBuckets();
      const step = prefersReducedMotion ? 3 : 2;
      const maxD2 = maxDist * maxDist;
      for (let i = 0; i < N; i += step) {
        const a = particles[i].p;
        const neigh = neighborsFor(i, k);
        for (const j of neigh) {
          const b = particles[j].p;
          const d2 = dist2(a, b);
          if (d2 > maxD2) continue;
          const dd = 1 - clamp(Math.sqrt(d2) / maxDist, 0, 1);
          ctx.globalAlpha = alpha * dd;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function drawEyeOverlay(alpha: number, par: Vec2, gaze: Vec2) {
      if (alpha <= 0.001) return;
      const c = add(eyeCenter(), { x: par.x * 8, y: par.y * 6 });
      const rx = eyeRx();
      const ry = eyeRy();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const g1 = ctx.createRadialGradient(c.x, c.y, 1, c.x, c.y, rx * 1.2);
      g1.addColorStop(0, `rgba(243,239,255,${0.06 + alpha * 0.10})`);
      g1.addColorStop(0.45, `rgba(189,166,255,${0.05 + alpha * 0.10})`);
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.beginPath(); ctx.ellipse(c.x, c.y, rx * 1.08, ry * 1.08, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(232,150,124,${0.10 + alpha * 0.18})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(c.x, c.y, rx * 0.55, ry * 0.55, 0, 0, Math.PI * 2); ctx.stroke();
      const gp = add(c, gaze);
      const g2 = ctx.createRadialGradient(gp.x, gp.y, 0, gp.x, gp.y, rx * 0.20);
      g2.addColorStop(0, `rgba(0,0,0,${0.22 + alpha * 0.28})`);
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.arc(gp.x, gp.y, rx * 0.10, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(189,166,255,${0.08 + alpha * 0.12})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(c.x, c.y, rx * 1.05, ry * 1.05, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(c.x, c.y, rx * 1.05, ry * 1.05, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
      ctx.restore();
    }

    function drawMemoryCore(alpha: number, par: Vec2) {
      if (alpha <= 0.001) return;
      const c = { x: w * 0.5 + par.x * 10, y: h * 0.58 + par.y * 8 };
      const t = performance.now() / 1000;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const r0 = Math.min(w, h) * 0.06 * (0.92 + 0.08 * Math.sin(t * 1.8));
      const r1 = Math.min(w, h) * 0.20;
      const g = ctx.createRadialGradient(c.x, c.y, r0 * 0.2, c.x, c.y, r1);
      g.addColorStop(0, `rgba(243,239,255,${0.10 + alpha * 0.20})`);
      g.addColorStop(0.35, `rgba(189,166,255,${0.09 + alpha * 0.18})`);
      g.addColorStop(0.65, `rgba(106,255,210,${0.06 + alpha * 0.12})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(c.x, c.y, r1, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(232,150,124,${0.10 + alpha * 0.16})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(c.x, c.y, r0 * 1.25, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    function drawSafetyRing(alpha: number, par: Vec2) {
      if (alpha <= 0.001) return;
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = `rgba(189,166,255,${0.05 + alpha * 0.10})`;
      ctx.lineWidth = 1;
      const pad = 34;
      roundRectPath(ctx, pad + par.x * 6, pad + par.y * 6, w - pad * 2, h - pad * 2, 22);
      ctx.stroke();
      ctx.restore();
    }

    function drawShard(p: Particle, alpha: number, warmth: number, competence: number, par: Vec2) {
      const px = p.p.x + par.x * (0.8 + p.C * 1.4);
      const py = p.p.y + par.y * (0.6 + p.C * 1.2);
      const cool = p.kind === 1 ? PAL.lav : PAL.violet;
      const warm = p.kind === 2 ? PAL.peach : PAL.coral;
      const mix = clamp(warmth, 0, 1) * 0.75;
      const r = lerp(cool.r, warm.r, mix);
      const g = lerp(cool.g, warm.g, mix);
      const b = lerp(cool.b, warm.b, mix);
      const a = alpha * (0.10 + p.C * 0.55) * (0.85 + competence * 0.15);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.translate(px, py);
      ctx.rotate(p.rot);

      if (p.kind === 0) {
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${a})`;
        const ww = p.size * 6.2;
        const hh = p.size * 2.0;
        roundRectPath(ctx, -ww / 2, -hh / 2, ww, hh, 2.5);
        ctx.fill();
      } else if (p.kind === 1) {
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${a})`;
        const s = p.size * 2.2;
        ctx.fillRect(-s / 2, -s / 2, s, s);
      } else {
        ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${a})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(-p.size * 2.2, 0); ctx.lineTo(p.size * 2.2, 0); ctx.stroke();
      }

      if (p.C > 0.5) {
        ctx.globalAlpha = a * 0.35;
        const rr = p.size * 7;
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rr);
        grad.addColorStop(0, `rgba(${r | 0},${g | 0},${b | 0},${0.10})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();
    }

    let raf = 0;
    let last = performance.now();
    const autoStart = performance.now();
    const AUTO_LOOP_SEC = prefersReducedMotion ? 12 : 18;

    let dMin = Infinity, dMax = -Infinity;
    const seed = () => ({ x: w * 0.5, y: h * 0.58 });
    const dCache = new Float32Array(N);

    function rebuildDistances() {
      const s = seed();
      for (let i = 0; i < N; i++) {
        const d = Math.sqrt(dist2(particles[i].p, s));
        dCache[i] = d;
        dMin = Math.min(dMin, d);
        dMax = Math.max(dMax, d);
      }
    }

    rebuildDistances();

    const ro3 = new ResizeObserver(() => {
      dMin = Infinity;
      dMax = -Infinity;
      rebuildDistances();
    });
    ro3.observe(wrap);

    function tick() {
      const now = performance.now();
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      pmx += (mx - pmx) * 0.08;
      pmy += (my - pmy) * 0.08;
      const par = { x: pmx, y: pmy };

      let P = scrollProgress;
      if (!userHasScrolled) {
        const t = (now - autoStart) / 1000;
        P = (t % AUTO_LOOP_SEC) / AUTO_LOOP_SEC;
      }
      CERTX.P = P;

      const breathe = sawtooth((now / 1000) * (prefersReducedMotion ? 0.45 : 0.7));
      const Cstar = CERTX.Cstar;

      const w1 = 1 - smoothstep(S2 - 0.05, S2 + 0.05, P);
      const w2 = smoothstep(S2 - 0.06, S2 + 0.06, P) * (1 - smoothstep(S3 - 0.06, S3 + 0.06, P));
      const w3 = smoothstep(S3 - 0.06, S3 + 0.06, P) * (1 - smoothstep(S4 - 0.06, S4 + 0.06, P));
      const w4 = smoothstep(S4 - 0.06, S4 + 0.06, P) * (1 - smoothstep(S5 - 0.06, S5 + 0.06, P));
      const w5 = smoothstep(S5 - 0.06, S5 + 0.06, P);

      CERTX.E = lerp(0.95, 0.22, smoothstep(S2, S5, P));
      CERTX.T = lerp(0.95, 0.20, smoothstep(S2, S5, P));
      CERTX.X = lerp(0.12, 0.78, smoothstep(S3, S5, P));
      CERTX.R = lerp(0.10, 0.62, smoothstep(S2, S4, P));
      CERTX.C = lerp(0.06, Cstar, smoothstep(S2, S5, P));

      if (w5 > 0.01) {
        CERTX.C = lerp(Cstar - 0.04, Cstar + 0.02, breathe);
      }

      const wave = clamp((P - S2) / Math.max(0.001, S3 - S2), 0, 1);
      const waveFront = lerp(dMin, dMax, wave);

      const gaze = { x: pmx * Math.min(w, h) * 0.018, y: pmy * Math.min(w, h) * 0.012 };

      const s = seed();
      const time = now / 1000;

      for (let i = 0; i < N; i++) {
        const p = particles[i];
        p.rot += p.spin * dt;

        if (w1 > 0.001) {
          const a = 220 * CERTX.T * CERTX.E * (prefersReducedMotion ? 0.45 : 1.0);
          p.v.x += (hash(i * 9.7 + time * 2.7) - 0.5) * a * dt;
          p.v.y += (hash(i * 6.3 + time * 3.1) - 0.5) * a * dt;
          p.p.x += (hash(i * 2.3 + time * 9.1) - 0.5) * 7.0 * CERTX.T;
          p.p.y += (hash(i * 4.7 + time * 7.3) - 0.5) * 7.0 * CERTX.T;
          p.C = lerp(p.C, 0.05, 0.03);
        }

        if (w2 > 0.001) {
          const d = dCache[i];
          const captured = d <= waveFront ? 1 : 0;
          const captureEase = captured ? smoothstep(waveFront - 120, waveFront + 30, d) : 0;
          const k = (0.14 + captureEase * 0.86) * w2;
          const to = sub(p.grid, p.p);
          p.v.x += to.x * (2.6 * k) * dt;
          p.v.y += to.y * (2.6 * k) * dt;
          p.C = lerp(p.C, CERTX.C, 0.05);
          p.X = lerp(p.X, 0.35, 0.03);
        }

        if (w3 > 0.001) {
          const rv = sub(p.p, s);
          const rn = norm(rv);
          const perp = { x: -rn.y, y: rn.x };
          const rMag = len(rv);
          const inner = 1 - clamp(rMag / (Math.min(w, h) * 0.58), 0, 1);
          const spiralStrength = (0.35 + inner * 0.9) * w3 * (prefersReducedMotion ? 0.55 : 1.0);
          p.v.x += perp.x * (34 * spiralStrength) * dt;
          p.v.y += perp.y * (34 * spiralStrength) * dt;
          p.v.x += -rn.x * (14 * spiralStrength) * dt;
          p.v.y += -rn.y * (14 * spiralStrength) * dt;
          p.C = lerp(p.C, clamp(CERTX.C + 0.06, 0, 1), 0.05);
          p.R = lerp(p.R, 0.55, 0.03);
          p.X = lerp(p.X, 0.55, 0.03);
        }

        if (w4 > 0.001) {
          let target = p.eye;
          if (i > Math.floor(N * 0.90)) {
            target = add(target, gaze);
          }
          const to = sub(target, p.p);
          const snap = (0.55 + CERTX.C * 1.0) * w4;
          p.v.x += to.x * (3.1 * snap) * dt;
          p.v.y += to.y * (3.1 * snap) * dt;
          if (!prefersReducedMotion) {
            p.v.x += (hash(i * 8.2 + time * 5.4) - 0.5) * 18 * dt;
            p.v.y += (hash(i * 3.8 + time * 6.1) - 0.5) * 18 * dt;
          }
          p.C = lerp(p.C, clamp(CERTX.C + 0.02, 0, 1), 0.06);
          p.X = lerp(p.X, 0.65, 0.04);
        }

        if (w5 > 0.001) {
          const target = osTarget(i, time * (prefersReducedMotion ? 0.6 : 1.0));
          const to = sub(target, p.p);
          const k = (0.75 + breathe * 0.35) * w5;
          p.v.x += to.x * (2.1 * k) * dt;
          p.v.y += to.y * (2.1 * k) * dt;
          const pad = 34;
          if (p.p.x < pad) p.v.x += (pad - p.p.x) * 0.9 * w5;
          if (p.p.x > w - pad) p.v.x -= (p.p.x - (w - pad)) * 0.9 * w5;
          if (p.p.y < pad) p.v.y += (pad - p.p.y) * 0.9 * w5;
          if (p.p.y > h - pad) p.v.y -= (p.p.y - (h - pad)) * 0.9 * w5;
          p.C = lerp(p.C, CERTX.C, 0.05);
          p.X = lerp(p.X, 0.78, 0.04);
          p.R = lerp(p.R, 0.62, 0.03);
        }

        const damp = lerp(0.88, 0.965, p.C) * lerp(0.92, 0.985, 1 - CERTX.T);
        p.v.x *= damp;
        p.v.y *= damp;
        p.p.x += p.v.x * dt;
        p.p.y += p.v.y * dt;

        if (P < S3) {
          const edge = 24;
          if (p.p.x < -edge) p.p.x = w + edge;
          if (p.p.x > w + edge) p.p.x = -edge;
          if (p.p.y < -edge) p.p.y = h + edge;
          if (p.p.y > h + edge) p.p.y = -edge;
        }
      }

      drawBG(par);
      drawFieldGrid(w2 * 1.0, par);

      if (w3 > 0.01) {
        drawGraph(w3 * 0.70, "lav", Math.min(w, h) * 0.12, prefersReducedMotion ? 1 : 2);
        drawGraph(w3 * 0.45, "warm", Math.min(w, h) * 0.10, 1);
      }

      if (w4 > 0.01) {
        drawEyeOverlay(w4 * 1.0, par, gaze);
      }

      if (w5 > 0.01) {
        drawMemoryCore(w5 * 1.0, par);
        drawSafetyRing(w5 * 1.0, par);
        drawGraph(w5 * 0.55, "mint", Math.min(w, h) * 0.11, 1);
      }

      const warmth = clamp(w3 * 0.75 + w5 * 0.85 + w4 * 0.35, 0, 1);
      const competence = clamp(w2 * 0.85 + w3 * 1.0 + w5 * 1.0, 0, 1);
      const alphaBase = 0.9;

      for (let i = 0; i < N; i++) {
        drawShard(particles[i], alphaBase, warmth, competence, par);
      }

      if (!userHasScrolled) {
        const fade = smoothstep(0.965, 1.0, P);
        if (fade > 0.001) {
          ctx.save();
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = `rgba(0,0,0,${fade * 0.55})`;
          ctx.fillRect(0, 0, w, h);
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      ro2.disconnect();
      ro3.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100vh" }}>
      <div ref={wrapRef} className="relative w-full" style={{ height: "100vh" }}>
        <canvas ref={canvasRef} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />
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
              filter: "drop-shadow(0 18px 55px rgba(0,0,0,0.75))",
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
              textTransform: "uppercase",
              color: "rgba(243,239,255,0.62)",
              userSelect: "none",
            }}
          >
            INTELLIGENCE IS NOT A MODEL — IT'S A CONVERGENCE
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
