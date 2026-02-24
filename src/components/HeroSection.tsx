import React, { useEffect, useMemo, useRef } from "react";

type Vec = { x: number; y: number; z: number };
type ParticleType = "human" | "ai" | "hybrid";
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
function hslToRgba(h: number, s: number, l: number, a: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (h / 60) % 6;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (0 <= hp && hp < 1) { r1 = c; g1 = x; b1 = 0; }
  else if (1 <= hp && hp < 2) { r1 = x; g1 = c; b1 = 0; }
  else if (2 <= hp && hp < 3) { r1 = 0; g1 = c; b1 = x; }
  else if (3 <= hp && hp < 4) { r1 = 0; g1 = x; b1 = c; }
  else if (4 <= hp && hp < 5) { r1 = x; g1 = 0; b1 = c; }
  else if (5 <= hp && hp < 6) { r1 = c; g1 = 0; b1 = x; }
  const m = l - c / 2;
  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);
  return `rgba(${r},${g},${b},${a})`;
}
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

function generateHybridAttractors(count: number) {
  const pts: { x: number; y: number; z: number; side: "human" | "ai" | "mix" }[] = [];
  const boundaryCount = Math.floor(count * 0.35);
  for (let i = 0; i < boundaryCount; i++) {
    const t = (i / boundaryCount) * Math.PI * 2;
    let x = Math.cos(t) * 0.62;
    let y = Math.sin(t) * 0.78;
    const face = Math.exp(-Math.pow((t - 0.05) / 0.7, 2)) * 0.18;
    x += face * 0.25;
    const jaw = Math.exp(-Math.pow((t - Math.PI * 1.45) / 0.55, 2)) * 0.28;
    x -= jaw * 0.12;
    y -= jaw * 0.12;
    const dome = Math.exp(-Math.pow((t - Math.PI * 0.5) / 0.6, 2)) * 0.22;
    y += dome * 0.12;
    const z = (noise2(i * 0.13, i * 0.07) - 0.5) * 0.35;
    const side = x < 0 ? "human" : "ai";
    pts.push({ x, y, z, side });
  }
  const interiorCount = count - boundaryCount;
  const centers = [
    { x: -0.18, y: 0.02, w: 0.95 },
    { x: 0.22, y: 0.0, w: 0.95 },
    { x: 0.05, y: -0.12, w: 0.6 },
    { x: 0.08, y: 0.22, w: 0.55 },
  ];
  function randn(seed: number) {
    const u = clamp(hash(seed + 1.234), 1e-6, 1 - 1e-6);
    const v = clamp(hash(seed + 9.876), 1e-6, 1 - 1e-6);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  for (let i = 0; i < interiorCount; i++) {
    const c = centers[i % centers.length];
    const s = i * 3.17;
    let x = c.x + randn(s) * 0.18 * c.w;
    let y = c.y + randn(s + 11.3) * 0.16 * c.w;
    const z = randn(s + 5.9) * 0.22;
    const k = (x * x) / (0.62 * 0.62) + (y * y) / (0.78 * 0.78);
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

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const attractors = useMemo(() => generateHybridAttractors(1200), []);

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
    const N = reduced ? 700 : 1700;
    const particles: Particle[] = [];
    const center = { x: w * 0.5, y: h * 0.56, z: 0 };
    const baseScale = Math.min(w, h) * 0.42;

    for (let i = 0; i < N; i++) {
      const t: ParticleType = i % 2 === 0 ? "human" : "ai";
      const rx = (rng(i) - 0.5) * w * 1.1;
      const ry = (rng(i + 1000) - 0.5) * h * 1.1;
      const rz = (rng(i + 2000) - 0.5) * 0.9;
      const baseR = t === "human" ? 1.4 : 1.25;
      particles.push({
        id: i, type: t,
        p: { x: center.x + rx, y: center.y + ry, z: rz },
        v: { x: (rng(i + 3000) - 0.5) * 0.25, y: (rng(i + 4000) - 0.5) * 0.25, z: (rng(i + 5000) - 0.5) * 0.002 },
        a: { x: 0, y: 0, z: 0 },
        r: baseR, baseR, mass: t === "human" ? 1.05 : 0.95,
        alpha: 0.75, glow: 0.0, targetIdx: -1, sparkT: 0,
        sparkCd: rng(i + 6000) * 2.5,
      });
    }

    const formCount = Math.floor(N * 0.72);
    const shuffled = [...particles].sort((a, b) => rng(a.id) - rng(b.id));
    const formParticles = shuffled.slice(0, formCount);
    const attractorHuman = attractors.filter((p) => p.side === "human");
    const attractorAI = attractors.filter((p) => p.side === "ai");
    const attractorMix = attractors.filter((p) => p.side === "mix");
    let hIdx = 0, aIdx = 0, mIdx = 0;
    for (let i = 0; i < formParticles.length; i++) {
      const p = formParticles[i];
      if (p.type === "human" && attractorHuman.length) {
        p.targetIdx = attractors.indexOf(attractorHuman[hIdx++ % attractorHuman.length]);
      } else if (p.type === "ai" && attractorAI.length) {
        p.targetIdx = attractors.indexOf(attractorAI[aIdx++ % attractorAI.length]);
      } else {
        p.targetIdx = attractors.indexOf(attractorMix[mIdx++ % attractorMix.length]);
      }
    }

    const LOOP = reduced ? 12.5 : 16.0;
    const P2 = reduced ? 2.0 : 3.0;
    const P3 = reduced ? 4.5 : 6.0;
    const P4 = reduced ? 8.2 : 10.0;
    const maxLineDist = reduced ? 72 : 92;
    const maxLineDist2 = maxLineDist * maxLineDist;

    function project(v: Vec, parallax: { x: number; y: number }) {
      const z = v.z;
      const depth = 1 + z * 0.18;
      return {
        x: v.x + parallax.x * (0.35 + z * 0.25),
        y: v.y + parallax.y * (0.35 + z * 0.25),
        s: depth,
      };
    }

    function bgGradient() {
      const g = ctx!.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(238,242,246,1)");
      g.addColorStop(0.42, "rgba(232,237,243,1)");
      g.addColorStop(0.7, "rgba(226,231,239,1)");
      g.addColorStop(1, "rgba(215,222,232,1)");
      return g;
    }

    function auraGradients() {
      const a1 = ctx!.createRadialGradient(w * 0.28, h * 0.52, 10, w * 0.28, h * 0.52, Math.min(w, h) * 0.55);
      a1.addColorStop(0, "rgba(189,166,255,0.35)");
      a1.addColorStop(0.55, "rgba(189,166,255,0.10)");
      a1.addColorStop(1, "rgba(189,166,255,0.0)");
      const a2 = ctx!.createRadialGradient(w * 0.72, h * 0.56, 10, w * 0.72, h * 0.56, Math.min(w, h) * 0.58);
      a2.addColorStop(0, "rgba(232,150,124,0.24)");
      a2.addColorStop(0.6, "rgba(232,150,124,0.08)");
      a2.addColorStop(1, "rgba(232,150,124,0.0)");
      return { a1, a2 };
    }

    function drawSoftVignette() {
      const vg = ctx!.createRadialGradient(w * 0.5, h * 0.58, Math.min(w, h) * 0.15, w * 0.5, h * 0.58, Math.max(w, h) * 0.75);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(10,6,20,0.22)");
      ctx!.fillStyle = vg;
      ctx!.fillRect(0, 0, w, h);
    }

    function colorFor(p: Particle, tMix: number) {
      if (p.type === "human") {
        return hslToRgba(lerp(10, 18, tMix), 0.78, 0.62, p.alpha);
      }
      if (p.type === "ai") {
        return hslToRgba(lerp(255, 265, tMix), 0.80, 0.62, p.alpha);
      }
      return hslToRgba(285, 0.75, 0.67, p.alpha);
    }

    let raf = 0;
    const t0 = performance.now();
    let camZoom = 1;

    function maybeSpark(p: Particle, dt: number) {
      p.sparkCd -= dt;
      if (p.sparkCd <= 0) {
        p.sparkCd = 1.2 + rng(p.id * 3.3 + performance.now() * 0.001) * 3.2;
        p.sparkT = 1;
      }
      if (p.sparkT > 0) p.sparkT = Math.max(0, p.sparkT - dt * 1.1);
    }

    function tick() {
      const now = performance.now();
      const elapsed = (now - t0) / 1000;
      const t = elapsed % LOOP;
      const dt = 1 / 60;

      pmx += (mx - pmx) * 0.06;
      pmy += (my - pmy) * 0.06;
      const par = { x: pmx * 12, y: pmy * 10 };

      const activation = smoothstep(P2, P3, t);
      const emergence = smoothstep(P3, P4, t);
      const stabilized = smoothstep(P4, LOOP, t);

      const zoomTarget = 1 + emergence * 0.06 + stabilized * 0.04;
      camZoom += (zoomTarget - camZoom) * 0.03;

      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = bgGradient();
      ctx!.fillRect(0, 0, w, h);
      const { a1, a2 } = auraGradients();
      ctx!.fillStyle = a1;
      ctx!.fillRect(0, 0, w, h);
      ctx!.fillStyle = a2;
      ctx!.fillRect(0, 0, w, h);

      const attractCenter = { x: w * 0.5, y: h * 0.62, z: 0 };
      const scale = baseScale * camZoom;
      const timeN = elapsed * 0.08;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.a.x = 0; p.a.y = 0; p.a.z = 0;
        const nx = (noise2(p.p.x * 0.002 + timeN, p.p.y * 0.002) - 0.5) * 0.14;
        const ny = (noise2(p.p.y * 0.002 - timeN, p.p.x * 0.002) - 0.5) * 0.14;
        const wobble = p.type === "human" ? 1.15 : 0.95;
        p.a.x += nx * wobble;
        p.a.y += ny * wobble;

        if (t >= P2) {
          const dx = attractCenter.x - p.p.x;
          const dy = attractCenter.y - p.p.y;
          const d2 = dx * dx + dy * dy + 1500;
          const inv = 1 / Math.sqrt(d2);
          const k = lerp(0.0, 0.42, activation) + emergence * 0.52;
          p.a.x += dx * inv * k;
          p.a.y += dy * inv * k;
        }

        if (p.targetIdx >= 0 && t >= P3) {
          const A = attractors[p.targetIdx];
          const tx = attractCenter.x + A.x * scale;
          const ty = attractCenter.y + A.y * scale;
          const tz = A.z;
          const dx = tx - p.p.x;
          const dy = ty - p.p.y;
          const dz = tz - p.p.z;
          const spring = lerp(0.0, 0.85, emergence) * (1 - stabilized * 0.25);
          p.a.x += dx * spring * 0.014;
          p.a.y += dy * spring * 0.014;
          p.a.z += dz * spring * 0.002;
        }

        const damp = lerp(0.985, 0.92, stabilized);
        p.v.x *= damp; p.v.y *= damp;
        p.v.z *= lerp(0.998, 0.985, stabilized);
        p.v.x += p.a.x * dt * (1 / p.mass);
        p.v.y += p.a.y * dt * (1 / p.mass);
        p.v.z += p.a.z * dt * (1 / p.mass);
        p.p.x += p.v.x; p.p.y += p.v.y; p.p.z += p.v.z;

        if (p.targetIdx < 0) {
          const pad = Math.min(w, h) * 0.22;
          if (p.p.x < -pad) p.p.x = w + pad;
          if (p.p.x > w + pad) p.p.x = -pad;
          if (p.p.y < -pad) p.p.y = h + pad;
          if (p.p.y > h + pad) p.p.y = -pad;
        }

        const inForm = p.targetIdx >= 0 ? emergence : 0;
        const pulse = (Math.sin((elapsed + p.id * 0.01) * 1.7) + 1) * 0.5;
        p.glow = lerp(0.02, 0.18, inForm) + pulse * 0.04 * stabilized;
        p.r = p.baseR + inForm * 0.75;
        if (t >= P4) maybeSpark(p, dt);
        else p.sparkT = Math.max(0, p.sparkT - dt * 1.6);
      }

      // Mesh lines
      const meshAlpha = lerp(0.0, 0.34, activation) + emergence * 0.32 + stabilized * 0.22;
      const cellSize = maxLineDist;
      const cols = Math.ceil(w / cellSize);
      const rows = Math.ceil(h / cellSize);
      const bins: number[][] = new Array(cols * rows);
      for (let i = 0; i < bins.length; i++) bins[i] = [];

      const proj = new Array<{ x: number; y: number; s: number }>(particles.length);
      for (let i = 0; i < particles.length; i++) {
        const pr = project(particles[i].p, par);
        proj[i] = pr;
        const cx = clamp(Math.floor(pr.x / cellSize), 0, cols - 1);
        const cy = clamp(Math.floor(pr.y / cellSize), 0, rows - 1);
        bins[cy * cols + cx].push(i);
      }

      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";
      ctx!.lineWidth = 1;

      const lineColor = (a: Particle, b: Particle) => {
        if (a.type === "human" && b.type === "human") return `rgba(232,150,124,${0.12 + meshAlpha * 0.22})`;
        if (a.type === "ai" && b.type === "ai") return `rgba(189,166,255,${0.10 + meshAlpha * 0.22})`;
        return `rgba(210,175,210,${0.10 + meshAlpha * 0.22})`;
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
              const wantsLines = (pi.targetIdx >= 0 && activation > 0.2) || stabilized > 0.2;
              if (!wantsLines) continue;
              let best1 = -1, best2 = -1, dBest1 = Infinity, dBest2 = Infinity;
              for (let oy = -1; oy <= 1; oy++) {
                for (let ox = -1; ox <= 1; ox++) {
                  const nbx = bx + ox, nby = by + oy;
                  if (nbx < 0 || nby < 0 || nbx >= cols || nby >= rows) continue;
                  const nb = bins[nby * cols + nbx];
                  for (let nj = 0; nj < nb.length; nj++) {
                    const jIdx = nb[nj];
                    if (jIdx === iIdx) continue;
                    const pj = particles[jIdx];
                    if (emergence < 0.2 && (pj.targetIdx < 0 || pi.targetIdx < 0)) continue;
                    const p2j = proj[jIdx];
                    const dx = p2i.x - p2j.x, dy = p2i.y - p2j.y;
                    const d = dx * dx + dy * dy;
                    if (d < maxLineDist2) {
                      if (d < dBest1) { dBest2 = dBest1; best2 = best1; dBest1 = d; best1 = jIdx; }
                      else if (d < dBest2) { dBest2 = d; best2 = jIdx; }
                    }
                  }
                }
              }
              const drawLink = (jIdx: number, d: number) => {
                if (jIdx < 0) return;
                const pj = particles[jIdx];
                const p2j = proj[jIdx];
                const fade = 1 - clamp(Math.sqrt(d) / maxLineDist, 0, 1);
                const a = (0.08 + fade * 0.25) * meshAlpha;
                const sparkBoost = Math.max(pi.sparkT, pj.sparkT) * 0.55;
                ctx!.strokeStyle = lineColor(pi, pj).replace(/\d?\.\d+\)$/, `${clamp(a + sparkBoost, 0, 0.55)})`);
                ctx!.beginPath();
                ctx!.moveTo(p2i.x, p2i.y);
                ctx!.lineTo(p2j.x, p2j.y);
                ctx!.stroke();
              };
              drawLink(best1, dBest1);
              drawLink(best2, dBest2);
            }
          }
        }
      }
      ctx!.restore();

      // Draw particles
      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";

      if (t >= P2) {
        const haloT = smoothstep(P2, P4, t);
        const r2 = lerp(44, Math.min(w, h) * 0.26, haloT * 0.9);
        const hg = ctx!.createRadialGradient(attractCenter.x, attractCenter.y, 2, attractCenter.x, attractCenter.y, r2);
        hg.addColorStop(0, `rgba(242,193,174,${0.18 * haloT})`);
        hg.addColorStop(0.35, `rgba(232,150,124,${0.10 * haloT})`);
        hg.addColorStop(0.7, `rgba(189,166,255,${0.08 * haloT})`);
        hg.addColorStop(1, "rgba(189,166,255,0)");
        ctx!.fillStyle = hg;
        ctx!.beginPath();
        ctx!.arc(attractCenter.x, attractCenter.y, r2, 0, Math.PI * 2);
        ctx!.fill();

        const core = 8 + Math.sin(elapsed * 2.2) * 2.2;
        const cg = ctx!.createRadialGradient(attractCenter.x, attractCenter.y, 1, attractCenter.x, attractCenter.y, core * 3.2);
        cg.addColorStop(0, `rgba(255,255,255,${0.18 + stabilized * 0.10})`);
        cg.addColorStop(1, "rgba(255,255,255,0)");
        ctx!.fillStyle = cg;
        ctx!.beginPath();
        ctx!.arc(attractCenter.x, attractCenter.y, core * 3.2, 0, Math.PI * 2);
        ctx!.fill();

        if (t < P4) {
          const r1 = lerp(18, Math.min(w, h) * 0.18, haloT);
          const ringP = smoothstep(P2, P3, t) * (1 - smoothstep(P3, P4, t));
          if (ringP > 0.02) {
            ctx!.strokeStyle = `rgba(232,150,124,${0.22 * ringP})`;
            ctx!.lineWidth = 1.25;
            ctx!.beginPath();
            ctx!.arc(attractCenter.x, attractCenter.y, r1 + ringP * 55, 0, Math.PI * 2);
            ctx!.stroke();
          }
        }
      }

      const order = particles.map((p, i) => ({ i, z: p.p.z })).sort((a, b) => a.z - b.z);
      for (let oi = 0; oi < order.length; oi++) {
        const p = particles[order[oi].i];
        const pr = proj[p.id] ?? project(p.p, par);
        const topFade = smoothstep(0, h * 0.25, pr.y);
        const tMix = clamp(emergence + stabilized * 0.7, 0, 1);
        const base = colorFor(p, tMix);

        const gR = p.r * (3.8 + p.glow * 10) * pr.s;
        const rg = ctx!.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, gR);
        const a = clamp((0.05 + p.glow) * topFade, 0, 0.35);
        rg.addColorStop(0, base.replace(/\d?\.\d+\)$/, `${a})`));
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx!.fillStyle = rg;
        ctx!.beginPath();
        ctx!.arc(pr.x, pr.y, gR, 0, Math.PI * 2);
        ctx!.fill();

        const rr = p.r * pr.s;
        ctx!.fillStyle = base.replace(/\d?\.\d+\)$/, `${clamp(p.alpha * topFade + p.sparkT * 0.35, 0, 0.95)})`);
        ctx!.beginPath();
        ctx!.arc(pr.x, pr.y, rr, 0, Math.PI * 2);
        ctx!.fill();

        if (p.sparkT > 0.01) {
          const sp = p.sparkT;
          ctx!.fillStyle = `rgba(255,255,255,${0.22 * sp})`;
          ctx!.beginPath();
          ctx!.arc(pr.x, pr.y, rr + 1.6 + sp * 2.2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.restore();

      drawSoftVignette();
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, [attractors]);

  return (
    <section className="relative w-full overflow-hidden min-h-screen">
      <div ref={wrapRef} className="relative w-full h-screen">
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ width: "100%", height: "100%" }}
        />
        {/* INTELLIGENCE text overlay */}
        <div className="pointer-events-none absolute inset-0">
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "14vh",
              transform: "translateX(-50%)",
              width: "min(1200px, 92vw)",
              textAlign: "center",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(64px, 12vw, 220px)",
              background: "linear-gradient(90deg, #2E1A6B 0%, #3C2A8E 45%, #4B5ED7 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 10px 38px rgba(0,0,0,0.10))",
              opacity: 0.98,
            }}
          >
            INTELLIGENCE
          </div>
        </div>
        {/* Micro caption */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: "6vh",
            width: "min(980px, 92vw)",
            textAlign: "center",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(20,10,42,0.55)",
            userSelect: "none",
          }}
        >
          Intelligence becomes infrastructure
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
