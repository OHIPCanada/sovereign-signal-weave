import React, { useEffect, useMemo, useRef } from "react";

type Vec = { x: number; y: number; z: number };
type ParticleType = "human" | "ai";
type Particle = {
  id: number;
  type: ParticleType;
  p: Vec;
  v: Vec;
  a: Vec;
  r: number;
  baseR: number;
  mass: number;
  alpha: number;
  glow: number;
  targetIdx: number;
  sparkT: number;
  sparkCd: number;
};

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
function hash(n: number) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}
function noise2(x: number, y: number) {
  const n = x * 12.9898 + y * 78.233;
  return hash(n);
}
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}
function hslToRgba(h: number, s: number, l: number, a: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (h / 60) % 6;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (0 <= hp && hp < 1) (r1 = c), (g1 = x), (b1 = 0);
  else if (1 <= hp && hp < 2) (r1 = x), (g1 = c), (b1 = 0);
  else if (2 <= hp && hp < 3) (r1 = 0), (g1 = c), (b1 = x);
  else if (3 <= hp && hp < 4) (r1 = 0), (g1 = x), (b1 = c);
  else if (4 <= hp && hp < 5) (r1 = x), (g1 = 0), (b1 = c);
  else if (5 <= hp && hp < 6) (r1 = c), (g1 = 0), (b1 = x);
  const m = l - c / 2;
  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);
  return `rgba(${r},${g},${b},${a})`;
}

function generateFrontHeadAttractors(count: number) {
  const pts: { x: number; y: number; z: number; side: "human" | "ai" | "mix" | "eyeL" | "eyeR" }[] = [];

  const boundary = Math.floor(count * 0.33);
  for (let i = 0; i < boundary; i++) {
    const t = (i / boundary) * Math.PI * 2;
    let x = Math.cos(t) * 0.58;
    let y = Math.sin(t) * 0.78;
    const jaw = Math.exp(-Math.pow((t - Math.PI * 1.52) / 0.55, 2));
    x *= 1 - jaw * 0.16;
    y -= jaw * 0.06;
    const temple = Math.exp(-Math.pow((Math.abs(t - 0) - 0.85) / 0.55, 2));
    x *= 1 - temple * 0.08;
    const z = (noise2(i * 0.11, i * 0.07) - 0.5) * 0.28;
    const side = x < 0 ? "human" : "ai";
    pts.push({ x, y, z, side });
  }

  const eyeL = { x: -0.18, y: -0.08 };
  const eyeR = { x: 0.18, y: -0.08 };
  const eyeRingCount = Math.floor(count * 0.08);
  for (let i = 0; i < eyeRingCount; i++) {
    const t = (i / eyeRingCount) * Math.PI * 2;
    const r = 0.085 + (noise2(i * 0.3, i * 0.13) - 0.5) * 0.01;
    const z = (noise2(i * 0.17, i * 0.29) - 0.5) * 0.08;
    const which = i % 2 === 0 ? "eyeL" : "eyeR";
    const c = which === "eyeL" ? eyeL : eyeR;
    pts.push({ x: c.x + Math.cos(t) * r, y: c.y + Math.sin(t) * r, z, side: which });
  }

  const interior = count - boundary - eyeRingCount;
  const centers = [
    { x: -0.16, y: 0.02, w: 0.9 },
    { x: 0.16, y: 0.02, w: 0.9 },
    { x: 0.0, y: 0.02, w: 0.6 },
    { x: 0.0, y: 0.22, w: 0.55 },
    { x: 0.0, y: -0.18, w: 0.45 },
  ];
  function randn(seed: number) {
    const u = clamp(hash(seed + 1.234), 1e-6, 1 - 1e-6);
    const v = clamp(hash(seed + 9.876), 1e-6, 1 - 1e-6);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  for (let i = 0; i < interior; i++) {
    const c = centers[i % centers.length];
    const s = i * 3.41;
    let x = c.x + randn(s) * 0.20 * c.w;
    let y = c.y + randn(s + 11.1) * 0.18 * c.w;
    const z = randn(s + 5.3) * 0.18;
    const k = (x * x) / (0.58 * 0.58) + (y * y) / (0.78 * 0.78);
    if (k > 0.98) {
      const scale = Math.sqrt(0.98 / k);
      x *= scale;
      y *= scale;
    }
    let side: "human" | "ai" | "mix" = "mix";
    if (x < -0.08) side = "human";
    else if (x > 0.08) side = "ai";
    pts.push({ x, y, z, side });
  }
  return pts;
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const attractors = useMemo(() => generateFrontHeadAttractors(1500), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const reduced = prefersReducedMotion();
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
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
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      mx = clamp(nx, -1, 1);
      my = clamp(ny, -1, 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const rng = (i: number) => hash(i * 999.91 + 17.7);
    const N = reduced ? 900 : 2100;
    const particles: Particle[] = [];
    const center = { x: w * 0.5, y: h * 0.58, z: 0 };
    const baseScale = Math.min(w, h) * 0.44;

    for (let i = 0; i < N; i++) {
      const type: ParticleType = i % 2 === 0 ? "human" : "ai";
      const sideBias = type === "human" ? -1 : 1;
      const rx = (rng(i) - 0.5) * w * 1.25 + sideBias * w * 0.12;
      const ry = (rng(i + 1000) - 0.5) * h * 1.15;
      const rz = (rng(i + 2000) - 0.5) * 0.9;
      const baseR = type === "human" ? 1.55 : 1.45;
      particles.push({
        id: i, type,
        p: { x: center.x + rx, y: center.y + ry, z: rz },
        v: { x: (rng(i + 3000) - 0.5) * 0.65, y: (rng(i + 4000) - 0.5) * 0.65, z: (rng(i + 5000) - 0.5) * 0.003 },
        a: { x: 0, y: 0, z: 0 },
        r: baseR, baseR, mass: type === "human" ? 1.05 : 0.95,
        alpha: 0.82, glow: 0, targetIdx: -1,
        sparkT: 0, sparkCd: rng(i + 6000) * 2.0,
      });
    }

    const formCount = Math.floor(N * 0.78);
    const shuffled = [...particles].sort((a, b) => rng(a.id) - rng(b.id));
    const formParticles = shuffled.slice(0, formCount);
    const A_h = attractors.filter((p) => p.side === "human");
    const A_a = attractors.filter((p) => p.side === "ai");
    const A_m = attractors.filter((p) => p.side === "mix");
    const A_eL = attractors.filter((p) => p.side === "eyeL");
    const A_eR = attractors.filter((p) => p.side === "eyeR");
    let hI = 0, aI = 0, mI = 0, eLI = 0, eRI = 0;
    for (let i = 0; i < formParticles.length; i++) {
      const p = formParticles[i];
      if (i < A_eL.length * 0.9 && A_eL.length) {
        p.targetIdx = attractors.indexOf(A_eL[eLI++ % A_eL.length]);
        continue;
      }
      if (i >= A_eL.length * 0.9 && i < (A_eL.length + A_eR.length) * 0.9 && A_eR.length) {
        p.targetIdx = attractors.indexOf(A_eR[eRI++ % A_eR.length]);
        continue;
      }
      if (p.type === "human" && A_h.length) p.targetIdx = attractors.indexOf(A_h[hI++ % A_h.length]);
      else if (p.type === "ai" && A_a.length) p.targetIdx = attractors.indexOf(A_a[aI++ % A_a.length]);
      else p.targetIdx = attractors.indexOf(A_m[mI++ % A_m.length]);
    }

    const LOOP = reduced ? 11.5 : 13.5;
    const P2 = reduced ? 1.6 : 2.0;
    const P3 = reduced ? 3.3 : 4.0;
    const P4 = reduced ? 6.8 : 7.8;
    const maxLineDist = reduced ? 78 : 96;
    const maxLineDist2 = maxLineDist * maxLineDist;

    function project(v: Vec, par: { x: number; y: number }) {
      const z = v.z;
      const depth = 1 + z * 0.18;
      return { x: v.x + par.x * (0.35 + z * 0.25), y: v.y + par.y * (0.35 + z * 0.25), s: depth };
    }

    function colorFor(p: Particle, tMix: number) {
      if (p.type === "human") return hslToRgba(lerp(10, 18, tMix), 0.86, 0.62, p.alpha);
      return hslToRgba(lerp(255, 268, tMix), 0.88, 0.64, p.alpha);
    }

    function maybeSpark(p: Particle, dt: number) {
      p.sparkCd -= dt;
      if (p.sparkCd <= 0) {
        p.sparkCd = 0.7 + rng(p.id * 3.3 + performance.now() * 0.001) * 2.1;
        p.sparkT = 1;
      }
      if (p.sparkT > 0) p.sparkT = Math.max(0, p.sparkT - dt * 1.35);
    }

    function drawBackground() {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(8,6,18,1)");
      g.addColorStop(0.55, "rgba(14,8,34,1)");
      g.addColorStop(1, "rgba(8,6,18,1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const a1 = ctx.createRadialGradient(w * 0.26, h * 0.55, 10, w * 0.26, h * 0.55, Math.min(w, h) * 0.62);
      a1.addColorStop(0, "rgba(189,166,255,0.22)");
      a1.addColorStop(0.6, "rgba(189,166,255,0.06)");
      a1.addColorStop(1, "rgba(189,166,255,0)");
      const a2 = ctx.createRadialGradient(w * 0.74, h * 0.58, 10, w * 0.74, h * 0.58, Math.min(w, h) * 0.68);
      a2.addColorStop(0, "rgba(232,150,124,0.18)");
      a2.addColorStop(0.65, "rgba(232,150,124,0.05)");
      a2.addColorStop(1, "rgba(232,150,124,0)");
      ctx.fillStyle = a1;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = a2;
      ctx.fillRect(0, 0, w, h);

      const vg = ctx.createRadialGradient(w * 0.5, h * 0.55, Math.min(w, h) * 0.12, w * 0.5, h * 0.55, Math.max(w, h) * 0.82);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
    }

    function drawEyesOverlay(
      anchor: { x: number; y: number }, scale: number, stabilized: number, emergence: number, gaze: { x: number; y: number }
    ) {
      if (emergence < 0.35) return;
      const t = clamp((emergence - 0.35) / 0.65, 0, 1);
      const op = (0.12 + 0.18 * stabilized) * t;
      const eyeL = { x: anchor.x + (-0.18) * scale, y: anchor.y + (-0.08) * scale };
      const eyeR = { x: anchor.x + (0.18) * scale, y: anchor.y + (-0.08) * scale };
      const pupilOffset = { x: gaze.x * 6, y: gaze.y * 4 };

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const drawOne = (c: { x: number; y: number }, warm: boolean) => {
        const ring2 = 46 + stabilized * 14;
        const rg = ctx.createRadialGradient(c.x, c.y, 2, c.x, c.y, ring2);
        rg.addColorStop(0, warm ? `rgba(242,193,174,${0.22 * op})` : `rgba(189,166,255,${0.22 * op})`);
        rg.addColorStop(0.4, warm ? `rgba(232,150,124,${0.10 * op})` : `rgba(123,97,255,${0.10 * op})`);
        rg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(c.x, c.y, ring2, 0, Math.PI * 2);
        ctx.fill();
        const ring = 22 + stabilized * 8;
        ctx.strokeStyle = warm ? `rgba(242,193,174,${0.22 * op})` : `rgba(189,166,255,${0.22 * op})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(c.x, c.y, ring, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${0.30 * op})`;
        ctx.beginPath();
        ctx.arc(c.x + pupilOffset.x, c.y + pupilOffset.y, 5.2, 0, Math.PI * 2);
        ctx.fill();
      };
      drawOne(eyeL, true);
      drawOne(eyeR, false);
      ctx.restore();
    }

    let raf = 0;
    const t0 = performance.now();
    let camZoom = 1;

    const tick = () => {
      const now = performance.now();
      const elapsed = (now - t0) / 1000;
      const t = elapsed % LOOP;
      const dt = 1 / 60;

      pmx += (mx - pmx) * 0.085;
      pmy += (my - pmy) * 0.085;
      const par = { x: pmx * 14, y: pmy * 12 };

      const activation = smoothstep(P2, P3, t);
      const emergence = smoothstep(P3, P4, t);
      const stabilized = smoothstep(P4, LOOP, t);

      const zoomTarget = 1 + emergence * 0.09 + stabilized * 0.06;
      camZoom += (zoomTarget - camZoom) * 0.045;

      drawBackground();

      const anchor = { x: w * 0.5, y: h * 0.60 };
      const scale = baseScale * camZoom;
      const timeN = elapsed * 0.10;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.a.x = p.a.y = p.a.z = 0;
        const nx = (noise2(p.p.x * 0.002 + timeN, p.p.y * 0.002) - 0.5) * 0.22;
        const ny = (noise2(p.p.y * 0.002 - timeN, p.p.x * 0.002) - 0.5) * 0.22;
        const wobble = p.type === "human" ? 1.15 : 0.95;
        p.a.x += nx * wobble;
        p.a.y += ny * wobble;

        if (t >= P2) {
          const dx = anchor.x - p.p.x;
          const dy = anchor.y - p.p.y;
          const d2 = dx * dx + dy * dy + 900;
          const inv = 1 / Math.sqrt(d2);
          const k = lerp(0.0, 0.70, activation) + emergence * 0.90;
          p.a.x += dx * inv * k;
          p.a.y += dy * inv * k;
        }

        if (p.targetIdx >= 0 && t >= P3) {
          const A = attractors[p.targetIdx];
          const tx = anchor.x + A.x * scale;
          const ty = anchor.y + A.y * scale;
          const tz = A.z;
          const dx = tx - p.p.x;
          const dy = ty - p.p.y;
          const dz = tz - p.p.z;
          const spring = lerp(0.0, 1.25, emergence) * (1 - stabilized * 0.22);
          p.a.x += dx * spring * 0.018;
          p.a.y += dy * spring * 0.018;
          p.a.z += dz * spring * 0.0025;
        }

        const damp = lerp(0.985, 0.90, stabilized);
        p.v.x *= damp;
        p.v.y *= damp;
        p.v.z *= lerp(0.998, 0.985, stabilized);
        p.v.x += p.a.x * dt * (1 / p.mass);
        p.v.y += p.a.y * dt * (1 / p.mass);
        p.v.z += p.a.z * dt * (1 / p.mass);
        p.p.x += p.v.x;
        p.p.y += p.v.y;
        p.p.z += p.v.z;

        if (p.targetIdx < 0) {
          const pad = Math.min(w, h) * 0.25;
          if (p.p.x < -pad) p.p.x = w + pad;
          if (p.p.x > w + pad) p.p.x = -pad;
          if (p.p.y < -pad) p.p.y = h + pad;
          if (p.p.y > h + pad) p.p.y = -pad;
        }

        const inForm = p.targetIdx >= 0 ? emergence : 0;
        const pulse = (Math.sin((elapsed + p.id * 0.01) * 2.1) + 1) * 0.5;
        p.glow = lerp(0.04, 0.24, inForm) + pulse * 0.06 * stabilized;
        p.r = p.baseR + inForm * 0.95;
        if (t >= P4) maybeSpark(p, dt);
        else p.sparkT = Math.max(0, p.sparkT - dt * 1.8);
      }

      const proj = new Array<{ x: number; y: number; s: number }>(particles.length);
      const cellSize = maxLineDist;
      const cols = Math.ceil(w / cellSize);
      const rows = Math.ceil(h / cellSize);
      const bins: number[][] = new Array(cols * rows);
      for (let i = 0; i < bins.length; i++) bins[i] = [];
      for (let i = 0; i < particles.length; i++) {
        const pr = project(particles[i].p, par);
        proj[i] = pr;
        const cx = clamp(Math.floor(pr.x / cellSize), 0, cols - 1);
        const cy = clamp(Math.floor(pr.y / cellSize), 0, rows - 1);
        bins[cy * cols + cx].push(i);
      }

      const meshAlpha = lerp(0.0, 0.40, activation) + emergence * 0.45 + stabilized * 0.28;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1;
      const lineColor = (a: Particle, b: Particle, aMul: number) => {
        if (a.type === "human" && b.type === "human") return `rgba(232,150,124,${aMul})`;
        if (a.type === "ai" && b.type === "ai") return `rgba(189,166,255,${aMul})`;
        return `rgba(210,175,220,${aMul})`;
      };

      if (meshAlpha > 0.01) {
        for (let by = 0; by < rows; by++) {
          for (let bx = 0; bx < cols; bx++) {
            const bin = bins[by * cols + bx];
            if (!bin.length) continue;
            for (let bi = 0; bi < bin.length; bi++) {
              const iIdx = bin[bi];
              const pi = particles[iIdx];
              const p2i = proj[iIdx];
              if (emergence < 0.15 && pi.targetIdx < 0) continue;
              let best1 = -1, best2 = -1;
              let d1 = Infinity, d2x = Infinity;
              for (let oy = -1; oy <= 1; oy++) {
                for (let ox = -1; ox <= 1; ox++) {
                  const nbx = bx + ox;
                  const nby = by + oy;
                  if (nbx < 0 || nby < 0 || nbx >= cols || nby >= rows) continue;
                  const nb = bins[nby * cols + nbx];
                  for (let nj = 0; nj < nb.length; nj++) {
                    const jIdx = nb[nj];
                    if (jIdx === iIdx) continue;
                    const pj = particles[jIdx];
                    if (emergence < 0.2 && (pj.targetIdx < 0 || pi.targetIdx < 0)) continue;
                    const p2j = proj[jIdx];
                    const dx = p2i.x - p2j.x;
                    const dy = p2i.y - p2j.y;
                    const d = dx * dx + dy * dy;
                    if (d < maxLineDist2) {
                      if (d < d1) { d2x = d1; best2 = best1; d1 = d; best1 = jIdx; }
                      else if (d < d2x) { d2x = d; best2 = jIdx; }
                    }
                  }
                }
              }
              const drawLink = (jIdx: number, d: number) => {
                if (jIdx < 0) return;
                const pj = particles[jIdx];
                const p2j = proj[jIdx];
                const fade = 1 - clamp(Math.sqrt(d) / maxLineDist, 0, 1);
                const baseA = (0.10 + fade * 0.30) * meshAlpha;
                const sparkBoost = Math.max(pi.sparkT, pj.sparkT) * 0.55;
                ctx.strokeStyle = lineColor(pi, pj, clamp(baseA + sparkBoost, 0, 0.62));
                ctx.beginPath();
                ctx.moveTo(p2i.x, p2i.y);
                ctx.lineTo(p2j.x, p2j.y);
                ctx.stroke();
              };
              drawLink(best1, d1);
              drawLink(best2, d2x);
            }
          }
        }
      }
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      if (t >= P2) {
        const haloT = smoothstep(P2, P4, t);
        const r2 = lerp(90, Math.min(w, h) * 0.24, haloT);
        const hg = ctx.createRadialGradient(anchor.x, anchor.y, 2, anchor.x, anchor.y, r2);
        hg.addColorStop(0, `rgba(242,193,174,${0.16 * haloT})`);
        hg.addColorStop(0.35, `rgba(232,150,124,${0.10 * haloT})`);
        hg.addColorStop(0.75, `rgba(189,166,255,${0.10 * haloT})`);
        hg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, r2, 0, Math.PI * 2);
        ctx.fill();
      }

      const order = particles.map((p, i) => ({ i, z: p.p.z })).sort((a, b) => a.z - b.z);
      const tMix = clamp(emergence + stabilized * 0.75, 0, 1);
      for (let oi = 0; oi < order.length; oi++) {
        const p = particles[order[oi].i];
        const pr = proj[p.id];
        const base = colorFor(p, tMix);
        const gR = p.r * (4.2 + p.glow * 10) * pr.s;
        const rg = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, gR);
        const a = clamp(0.05 + p.glow, 0, 0.42);
        rg.addColorStop(0, base.replace(/\d?\.\d+\)$/, `${a})`));
        rg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, gR, 0, Math.PI * 2);
        ctx.fill();
        const rr = p.r * pr.s;
        ctx.fillStyle = base.replace(/\d?\.\d+\)$/, `${clamp(p.alpha + p.sparkT * 0.35, 0, 0.95)})`);
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, rr, 0, Math.PI * 2);
        ctx.fill();
        if (p.sparkT > 0.01) {
          const sp = p.sparkT;
          ctx.fillStyle = `rgba(255,255,255,${0.18 * sp})`;
          ctx.beginPath();
          ctx.arc(pr.x, pr.y, rr + 1.6 + sp * 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      const gaze = { x: pmx, y: pmy };
      drawEyesOverlay(anchor, scale, stabilized, emergence, gaze);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, [attractors]);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100vh" }}>
      <div ref={wrapRef} className="relative w-full" style={{ height: "100vh" }}>
        <canvas ref={canvasRef} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />
        <div className="pointer-events-none absolute inset-0">
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "10vh",
              transform: "translateX(-50%)",
              width: "min(1400px, 94vw)",
              textAlign: "center",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(64px, 12vw, 240px)",
              background: "linear-gradient(90deg, rgba(189,166,255,1) 0%, rgba(232,150,124,1) 52%, rgba(123,97,255,1) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 18px 55px rgba(0,0,0,0.55))",
              opacity: 0.98,
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
              color: "rgba(243,239,255,0.55)",
              userSelect: "none" as const,
            }}
          >
            INTELLIGENCE BECOMES INFRASTRUCTURE
          </div>
        </div>
      </div>
    </section>
  );
}
