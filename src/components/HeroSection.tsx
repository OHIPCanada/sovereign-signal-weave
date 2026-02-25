import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const hash = (n: number) => {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
};

type Vec2 = { x: number; y: number };
type EventKind = "ADMISSION" | "LAB RESULT" | "MED ORDER" | "IMAGING" | "DISCHARGE" | "CARE PLAN";
type Pulse = {
  id: number;
  kind: EventKind;
  from: Vec2;
  to: Vec2;
  t0: number;
  dur: number;
  mid1: Vec2;
  mid2: Vec2;
  severity: number;
};
type Node = {
  id: string;
  label: string;
  p: Vec2;
  role: "EMR" | "INTEL" | "OPS";
};

function pickEventKind(r: number): EventKind {
  if (r < 0.18) return "ADMISSION";
  if (r < 0.40) return "LAB RESULT";
  if (r < 0.58) return "MED ORDER";
  if (r < 0.74) return "IMAGING";
  if (r < 0.86) return "CARE PLAN";
  return "DISCHARGE";
}

function mixColor(a: string, b: string, t: number) {
  const pa = a.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1];
  const pb = b.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1];
  const r = Math.round(lerp(pa[0] ?? 0, pb[0] ?? 0, t));
  const g = Math.round(lerp(pa[1] ?? 0, pb[1] ?? 0, t));
  const b2 = Math.round(lerp(pa[2] ?? 0, pb[2] ?? 0, t));
  const a2 = lerp(pa[3] ?? 1, pb[3] ?? 1, t);
  return `rgba(${r},${g},${b2},${a2})`;
}

function cubicBezier(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  return {
    x: uu * u * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + tt * t * p3.x,
    y: uu * u * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + tt * t * p3.y,
  };
}

function roundRect(ctx2: CanvasRenderingContext2D, x: number, y: number, wR: number, hR: number, r: number) {
  const rr = Math.min(r, wR / 2, hR / 2);
  ctx2.beginPath();
  ctx2.moveTo(x + rr, y);
  ctx2.arcTo(x + wR, y, x + wR, y + hR, rr);
  ctx2.arcTo(x + wR, y + hR, x, y + hR, rr);
  ctx2.arcTo(x, y + hR, x, y, rr);
  ctx2.arcTo(x, y, x + wR, y, rr);
  ctx2.closePath();
}

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

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

    const C = {
      bg0: "rgba(6, 10, 20, 1)",
      bg1: "rgba(10, 14, 28, 1)",
      lavender: "rgba(189,166,255,0.85)",
      coral: "rgba(232,150,124,0.92)",
      mint: "rgba(106, 255, 210, 0.82)",
      lineLav: "rgba(189,166,255,0.16)",
      lineCor: "rgba(232,150,124,0.18)",
      lineMint: "rgba(106,255,210,0.14)",
    };

    const LOOP = 12.5;
    const beatB = (t: number) => smoothstep(0.18, 0.34, t);
    const beatC = (t: number) => smoothstep(0.34, 0.58, t);
    const beatD = (t: number) => smoothstep(0.58, 0.83, t);
    const beatE = (t: number) => smoothstep(0.83, 1.0, t);

    const getNodes = (): Node[] => {
      const cx = w * 0.5, cy = h * 0.60;
      return [
        { id: "emr", label: "EMR EVENTS", p: { x: cx - w * 0.30, y: cy - h * 0.08 }, role: "EMR" },
        { id: "lab", label: "LAB STREAM", p: { x: cx - w * 0.32, y: cy + h * 0.08 }, role: "EMR" },
        { id: "orders", label: "ORDERS", p: { x: cx - w * 0.26, y: cy + h * 0.22 }, role: "EMR" },
        { id: "intel", label: "INTELLIGENCE LAYER", p: { x: cx, y: cy - h * 0.02 }, role: "INTEL" },
        { id: "triage", label: "TRIAGE", p: { x: cx - w * 0.07, y: cy + h * 0.12 }, role: "INTEL" },
        { id: "path", label: "CARE PATHWAY", p: { x: cx + w * 0.08, y: cy + h * 0.10 }, role: "INTEL" },
        { id: "policy", label: "POLICY CHECK", p: { x: cx + w * 0.02, y: cy - h * 0.16 }, role: "INTEL" },
        { id: "ops", label: "CLINICAL OPS", p: { x: cx + w * 0.30, y: cy + h * 0.02 }, role: "OPS" },
        { id: "audit", label: "AUDIT LOG", p: { x: cx + w * 0.30, y: cy - h * 0.14 }, role: "OPS" },
        { id: "access", label: "PATIENT ACCESS", p: { x: cx + w * 0.28, y: cy + h * 0.16 }, role: "OPS" },
      ];
    };

    let pulses: Pulse[] = [];
    let pulseId = 1;

    function spawnPulse(timeAbs: number, tNorm: number) {
      const r = hash(pulseId * 7.13 + timeAbs * 0.31);
      const kind = pickEventKind(r);
      const severity = clamp(hash(pulseId * 1.77 + timeAbs * 0.77), 0, 1);
      const nodes = getNodes();
      const sources = nodes.filter((n) => n.role === "EMR");
      const intel = nodes.filter((n) => n.role === "INTEL");
      const ops = nodes.filter((n) => n.role === "OPS");
      const src = sources[Math.floor(hash(pulseId * 2.01) * sources.length)];
      const intelCore = intel.find((n) => n.id === "intel")!;
      const triage = intel.find((n) => n.id === "triage")!;
      const path = intel.find((n) => n.id === "path")!;
      const policy = intel.find((n) => n.id === "policy")!;
      const out = ops[Math.floor(hash(pulseId * 4.09) * ops.length)];
      const policyFirst = kind === "DISCHARGE" || kind === "MED ORDER" || severity > 0.72;
      const mid1 = policyFirst ? policy.p : triage.p;
      const mid2 = policyFirst ? intelCore.p : path.p;
      const bC = beatC(tNorm);
      const bD = beatD(tNorm);
      const baseDur = lerp(2.2, 1.35, bC + bD * 0.6);
      const dur = baseDur * lerp(1.05, 0.88, severity);
      pulses.push({ id: pulseId++, kind, severity, from: src.p, mid1, mid2, to: out.p, t0: timeAbs, dur });
      if (pulses.length > 64) pulses = pulses.slice(pulses.length - 64);
    }

    function drawGrid(par: Vec2, tNorm: number) {
      ctx.save();
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, C.bg0);
      g.addColorStop(0.55, C.bg1);
      g.addColorStop(1, C.bg0);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const a1 = ctx.createRadialGradient(w * 0.22, h * 0.55, 1, w * 0.22, h * 0.55, Math.min(w, h) * 0.75);
      a1.addColorStop(0, "rgba(189,166,255,0.10)");
      a1.addColorStop(0.6, "rgba(189,166,255,0.03)");
      a1.addColorStop(1, "rgba(189,166,255,0)");
      ctx.fillStyle = a1;
      ctx.fillRect(0, 0, w, h);

      const a2 = ctx.createRadialGradient(w * 0.78, h * 0.58, 1, w * 0.78, h * 0.58, Math.min(w, h) * 0.80);
      a2.addColorStop(0, "rgba(232,150,124,0.08)");
      a2.addColorStop(0.65, "rgba(232,150,124,0.025)");
      a2.addColorStop(1, "rgba(232,150,124,0)");
      ctx.fillStyle = a2;
      ctx.fillRect(0, 0, w, h);

      const cell = Math.max(34, Math.min(56, Math.floor(Math.min(w, h) / 18)));
      const ox = (par.x * 6) % cell;
      const oy = (par.y * 6) % cell;
      const tD = beatD(tNorm);
      ctx.strokeStyle = mixColor("rgba(189,166,255,0.06)", "rgba(189,166,255,0.10)", tD);
      ctx.lineWidth = 1;
      for (let x = -cell; x < w + cell; x += cell) {
        ctx.beginPath(); ctx.moveTo(x + ox, 0); ctx.lineTo(x + ox, h); ctx.stroke();
      }
      for (let y = -cell; y < h + cell; y += cell) {
        ctx.beginPath(); ctx.moveTo(0, y + oy); ctx.lineTo(w, y + oy); ctx.stroke();
      }
      ctx.strokeStyle = `rgba(255,255,255,${0.03 + tD * 0.02})`;
      const sub = cell / 2;
      for (let x = -sub; x < w + sub; x += sub) {
        ctx.beginPath(); ctx.moveTo(x + ox * 0.5, 0); ctx.lineTo(x + ox * 0.5, h); ctx.stroke();
      }

      const vg = ctx.createRadialGradient(w * 0.5, h * 0.55, Math.min(w, h) * 0.10, w * 0.5, h * 0.55, Math.max(w, h) * 0.9);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    function drawNode(n: Node, tNorm: number, par: Vec2) {
      const p = { x: n.p.x + par.x * 8, y: n.p.y + par.y * 6 };
      const bB = beatB(tNorm);
      const bD = beatD(tNorm);
      const bE = beatE(tNorm);
      const r = n.role === "INTEL" ? 14 : 10;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const pulse = (Math.sin((performance.now() / 1000) * 2 + n.p.x * 0.01) + 1) * 0.5;
      const glowA = n.role === "INTEL" ? 0.18 + bB * 0.14 + bD * 0.16 : 0.10 + bB * 0.10 + bE * 0.06;
      const col = n.role === "EMR" ? "rgba(189,166,255,0.55)" : n.role === "OPS" ? "rgba(106,255,210,0.40)" : "rgba(232,150,124,0.50)";
      const gr = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, r * 4.8);
      gr.addColorStop(0, col.replace(/\d?\.\d+\)$/, `${glowA * (0.75 + pulse * 0.5)})`));
      gr.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gr;
      ctx.beginPath(); ctx.arc(p.x, p.y, r * 4.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = n.role === "INTEL" ? "rgba(243,239,255,0.75)" : "rgba(243,239,255,0.55)";
      ctx.beginPath(); ctx.arc(p.x, p.y, r * 0.55, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = n.role === "INTEL" ? `rgba(232,150,124,${0.35 + bD * 0.22})` : n.role === "OPS" ? `rgba(106,255,210,${0.22 + bE * 0.18})` : `rgba(189,166,255,${0.24 + bB * 0.14})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.font = "600 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace";
      ctx.fillStyle = n.role === "INTEL" ? "rgba(243,239,255,0.72)" : "rgba(243,239,255,0.50)";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(n.label, p.x, p.y + 14);
      ctx.restore();
    }

    function drawLink(a: Vec2, b: Vec2, color: string, alpha: number, par: Vec2) {
      const p0 = { x: a.x + par.x * 8, y: a.y + par.y * 6 };
      const p1 = { x: b.x + par.x * 8, y: b.y + par.y * 6 };
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = color.replace(/\d?\.\d+\)$/, `${alpha})`);
      ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
      ctx.restore();
    }

    function drawPulse(p: Pulse, timeAbs: number, tNorm: number, par: Vec2) {
      const age = timeAbs - p.t0;
      const u = clamp(age / p.dur, 0, 1);
      const split = 0.58;
      let pos: Vec2;
      if (u < split) {
        const t = u / split;
        pos = cubicBezier(p.from, p.mid1, { x: lerp(p.mid1.x, p.mid2.x, 0.7), y: lerp(p.mid1.y, p.mid2.y, 0.7) }, p.mid2, t);
      } else {
        const t = (u - split) / (1 - split);
        pos = cubicBezier(p.mid2, { x: lerp(p.mid2.x, p.to.x, 0.35), y: lerp(p.mid2.y, p.to.y, 0.35) }, { x: lerp(p.mid2.x, p.to.x, 0.75), y: lerp(p.mid2.y, p.to.y, 0.75) }, p.to, t);
      }
      const bE = beatE(tNorm);
      const baseCol = mixColor(C.lavender, C.coral, clamp(p.severity * 1.05, 0, 1));
      const col = mixColor(baseCol, C.mint, bE * 0.55);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const tail = 10;
      for (let i = 0; i < tail; i++) {
        const tt = clamp(u - i * 0.018, 0, 1);
        let tp: Vec2;
        if (tt < split) {
          const t = tt / split;
          tp = cubicBezier(p.from, p.mid1, { x: lerp(p.mid1.x, p.mid2.x, 0.7), y: lerp(p.mid1.y, p.mid2.y, 0.7) }, p.mid2, t);
        } else {
          const t = (tt - split) / (1 - split);
          tp = cubicBezier(p.mid2, { x: lerp(p.mid2.x, p.to.x, 0.35), y: lerp(p.mid2.y, p.to.y, 0.35) }, { x: lerp(p.mid2.x, p.to.x, 0.75), y: lerp(p.mid2.y, p.to.y, 0.75) }, p.to, t);
        }
        const a = (1 - i / tail) * 0.24;
        const rr = 2.2 + (1 - i / tail) * 2.0;
        const px = tp.x + par.x * 8;
        const py = tp.y + par.y * 6;
        ctx.fillStyle = col.replace(/\d?\.\d+\)$/, `${a})`);
        ctx.beginPath(); ctx.arc(px, py, rr, 0, Math.PI * 2); ctx.fill();
      }
      const px = pos.x + par.x * 8;
      const py = pos.y + par.y * 6;
      const halo = ctx.createRadialGradient(px, py, 0, px, py, 22);
      halo.addColorStop(0, col.replace(/\d?\.\d+\)$/, `0.22)`));
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      if ((p.id % 5 === 0) && u > 0.35 && u < 0.65) {
        const labels = ["ROUTED", "VERIFIED", "LOGGED", "TRIAGED", "CLEARED"];
        const txt = labels[p.id % labels.length];
        const bD = beatD(tNorm);
        const a = 0.42 + bD * 0.18;
        ctx.save();
        ctx.font = "700 10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        const wP = 92, hP = 24, rx = 12;
        const sx = px, sy = py - 16;
        ctx.fillStyle = mixColor("rgba(189,166,255,0.10)", "rgba(232,150,124,0.12)", clamp(p.severity, 0, 1)).replace(/\d?\.\d+\)$/, `${a})`);
        roundRect(ctx, sx - wP / 2, sy - hP / 2, wP, hP, rx); ctx.fill();
        ctx.strokeStyle = "rgba(243,239,255,0.22)"; ctx.lineWidth = 1;
        roundRect(ctx, sx - wP / 2, sy - hP / 2, wP, hP, rx); ctx.stroke();
        ctx.fillStyle = "rgba(243,239,255,0.80)";
        ctx.fillText(txt, sx, sy);
        ctx.restore();
      }
    }

    function drawOpsMeters(tNorm: number, par: Vec2) {
      const x = w * 0.07 + par.x * 6;
      const y = h * 0.74 + par.y * 4;
      const bC = beatC(tNorm);
      const bD = beatD(tNorm);
      const bE = beatE(tNorm);
      const latency = lerp(840, 220, clamp(bD * 0.85 + bE, 0, 1));
      const throughput = lerp(58, 112, clamp(bC * 0.7 + bD * 0.85, 0, 1));
      const compliance = lerp(72, 98, clamp(bD * 0.9 + bE, 0, 1));

      ctx.save();
      ctx.font = "600 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace";
      ctx.fillStyle = "rgba(243,239,255,0.70)";
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText("SYSTEM METRICS", x, y - 28);
      ctx.fillStyle = "rgba(243,239,255,0.48)";
      ctx.fillText("Latency", x, y);
      ctx.fillText("Throughput", x, y + 18);
      ctx.fillText("Compliance", x, y + 36);

      const barX = x + 112, barW = 160, barH = 6;
      const drawBar = (xb: number, yb: number, ww: number, hh: number, t: number, col: string) => {
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(xb, yb, ww, hh);
        ctx.strokeStyle = "rgba(189,166,255,0.14)"; ctx.lineWidth = 1;
        ctx.strokeRect(xb, yb, ww, hh);
        if (col.includes("106,255,210")) {
          ctx.fillStyle = "rgba(106,255,210,0.72)";
        } else {
          const gg = ctx.createLinearGradient(xb, 0, xb + ww, 0);
          gg.addColorStop(0, "rgba(189,166,255,0.85)");
          gg.addColorStop(0.55, "rgba(232,150,124,0.80)");
          gg.addColorStop(1, "rgba(242,193,174,0.78)");
          ctx.fillStyle = gg;
        }
        ctx.shadowColor = "rgba(232,150,124,0.22)"; ctx.shadowBlur = 10;
        ctx.fillRect(xb, yb, ww * clamp(t, 0, 1), hh);
        ctx.shadowBlur = 0;
      };

      drawBar(barX, y + 5, barW, barH, 1 - clamp((latency - 200) / 700, 0, 1), C.coral);
      drawBar(barX, y + 23, barW, barH, clamp((throughput - 50) / 70, 0, 1), C.lavender);
      drawBar(barX, y + 41, barW, barH, compliance / 100, C.mint);

      ctx.fillStyle = "rgba(243,239,255,0.78)";
      ctx.fillText(`${Math.round(latency)}ms`, barX + barW + 10, y);
      ctx.fillText(`${Math.round(throughput)}/min`, barX + barW + 10, y + 18);
      ctx.fillText(`${Math.round(compliance)}%`, barX + barW + 10, y + 36);
      ctx.restore();
    }

    function drawSystemLinks(tNorm: number, par: Vec2) {
      const nodes = getNodes();
      const get = (id: string) => nodes.find((n) => n.id === id)!.p;
      const bB = beatB(tNorm), bC = beatC(tNorm), bD = beatD(tNorm), bE = beatE(tNorm);
      const baseA = 0.10 + bB * 0.10;
      const intelA = baseA + bC * 0.22 + bD * 0.18;
      const opsA = 0.10 + bD * 0.18 + bE * 0.18;
      drawLink(get("emr"), get("intel"), C.lineLav, intelA, par);
      drawLink(get("lab"), get("intel"), C.lineLav, intelA * 0.92, par);
      drawLink(get("orders"), get("intel"), C.lineLav, intelA * 0.88, par);
      drawLink(get("policy"), get("intel"), C.lineCor, 0.10 + bC * 0.22, par);
      drawLink(get("intel"), get("triage"), C.lineCor, 0.12 + bC * 0.22, par);
      drawLink(get("intel"), get("path"), C.lineCor, 0.12 + bC * 0.22, par);
      drawLink(get("intel"), get("ops"), mixColor(C.lineLav, C.lineMint, bE * 0.7), opsA, par);
      drawLink(get("policy"), get("audit"), mixColor(C.lineCor, C.lineMint, bE * 0.7), opsA * 0.92, par);
      drawLink(get("triage"), get("access"), mixColor(C.lineLav, C.lineMint, bE * 0.7), opsA * 0.86, par);
    }

    function drawTitleMaskEnergy(tNorm: number, par: Vec2) {
      const bD = beatD(tNorm);
      if (bD <= 0.02) return;
      const bandY = h * 0.18 + par.y * 2;
      const bandH = h * 0.22;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createLinearGradient(0, bandY, 0, bandY + bandH);
      g.addColorStop(0, "rgba(189,166,255,0)");
      g.addColorStop(0.45, `rgba(189,166,255,${0.06 + bD * 0.08})`);
      g.addColorStop(0.65, `rgba(232,150,124,${0.05 + bD * 0.06})`);
      g.addColorStop(1, "rgba(232,150,124,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, bandY, w, bandH);
      ctx.restore();
    }

    let raf = 0;
    const t0 = performance.now();
    let lastSpawn = 0;

    const frame = () => {
      const now = performance.now();
      const timeAbs = now / 1000;
      const elapsed = (now - t0) / 1000;
      const tNorm = (elapsed % LOOP) / LOOP;
      pmx += (mx - pmx) * 0.08;
      pmy += (my - pmy) * 0.08;
      const par = { x: pmx, y: pmy };

      drawGrid(par, tNorm);
      drawTitleMaskEnergy(tNorm, par);
      drawSystemLinks(tNorm, par);
      const nodes = getNodes();
      for (const n of nodes) drawNode(n, tNorm, par);

      const bC = beatC(tNorm), bD = beatD(tNorm), bE = beatE(tNorm);
      const desiredPerSec = lerp(3.0, 5.4, bC + bD * 0.6) * (1 - bE * 0.35);
      if (timeAbs - lastSpawn > 1 / desiredPerSec) {
        lastSpawn = timeAbs;
        spawnPulse(timeAbs, tNorm);
      }

      pulses = pulses.filter((p) => timeAbs - p.t0 < p.dur + 0.4);
      for (const p of pulses) drawPulse(p, timeAbs, tNorm, par);
      drawOpsMeters(tNorm, par);

      const fadeOut = smoothstep(0.965, 1.0, tNorm);
      if (fadeOut > 0.001) {
        ctx.save();
        ctx.fillStyle = `rgba(0,0,0,${fadeOut * 0.55})`;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100vh" }}>
      <div ref={wrapRef} className="relative w-full" style={{ height: "100vh" }}>
        <canvas ref={canvasRef} className="absolute inset-0" style={{ width: "100%", height: "100%", willChange: "transform" }} />
        <div className="pointer-events-none absolute inset-0 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute left-1/2 -translate-x-1/2 w-[min(1500px,94vw)] text-center"
            style={{
              top: "8vh",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              fontWeight: 900,
              fontSize: "clamp(64px, 12vw, 260px)",
              background: "linear-gradient(90deg, #BDA6FF 0%, #E8967C 55%, #7B61FF 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 18px 55px rgba(0,0,0,0.65))",
            }}
          >
            INTELLIGENCE
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute left-1/2 -translate-x-1/2 w-[min(980px,92vw)] text-center"
            style={{
              bottom: "6vh",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color: "rgba(243,239,255,0.60)",
              userSelect: "none" as const,
            }}
          >
            INTELLIGENCE BECOMES INFRASTRUCTURE
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
