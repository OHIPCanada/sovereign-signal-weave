import React, { useEffect, useRef, useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";

// --- Utilities ---
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

function cubicBezier(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  return {
    x: uu * u * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + tt * t * p3.x,
    y: uu * u * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + tt * t * p3.y,
  };
}

// --- Types ---
type Vec2 = { x: number; y: number };
type NodeDef = {
  id: string;
  label: string;
  p: Vec2;
  role: "EMR" | "INTEL" | "OPS";
  stress: number;
};
type Pulse = {
  id: number;
  path: Vec2[];
  t0: number;
  dur: number;
  severity: number;
  sourceId: string;
  targetId: string;
  intelId: string;
  event: string;
};
type LogEntry = {
  id: string;
  text: string;
  time: string;
  type: "INFO" | "WARN" | "SUCCESS";
};

const LOOP = 12.5;

const EVENT_LABELS = [
  "ADMISSION",
  "LAB_RESULT",
  "DISCHARGE",
  "MED_ORDER",
  "VITALS_SYNC",
  "IMAGING_REQ",
  "CARE_PATH",
  "SEPSIS_ALERT",
];

const EVENT_MESSAGES: Record<string, string[]> = {
  ADMISSION: ["Patient #%id verified", "Bed assignment routed"],
  LAB_RESULT: ["Electrolyte panel processed", "CBC flagged for review"],
  DISCHARGE: ["Discharge summary generated", "Follow-up scheduled"],
  MED_ORDER: ["Rx compliance validated", "Dosage cross-checked"],
  VITALS_SYNC: ["HR/SpO2 stream captured", "Anomaly threshold met"],
  IMAGING_REQ: ["CT scan queued", "DICOM routed to PACS"],
  CARE_PATH: ["Sepsis protocol initialized", "Pathway step confirmed"],
  SEPSIS_ALERT: ["qSOFA score elevated", "Alert dispatched to team"],
};

const HeroSection = () => {
  const [load, setLoad] = useState(0.4);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<NodeDef[]>([]);
  const loadRef = useRef(load);
  const logsRef = useRef(setLogs);
  logsRef.current = setLogs;

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  const addLog = useCallback(
    (text: string, type: "INFO" | "WARN" | "SUCCESS") => {
      const entry: LogEntry = {
        id: Math.random().toString(36).slice(2, 11),
        text,
        time: new Date().toLocaleTimeString([], {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        type,
      };
      logsRef.current((prev) => [entry, ...prev].slice(0, 14));
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // --- Colors ---
    const C = {
      bg0: "#020408",
      bg1: "#050C18",
      cyan: "rgba(0, 217, 255, 0.85)",
      cyanDim: "rgba(0, 217, 255, 0.35)",
      pink: "rgba(255, 0, 110, 0.92)",
      pinkDim: "rgba(255, 0, 110, 0.25)",
      matrix: "rgba(0, 255, 157, 0.82)",
      matrixDim: "rgba(0, 255, 157, 0.18)",
      lineCyan: "rgba(0, 217, 255, 0.07)",
      amber: "rgba(255, 191, 0, 0.9)",
      white: "rgba(243, 239, 255, 0.7)",
      whiteDim: "rgba(243, 239, 255, 0.12)",
    };

    let w = 0,
      h = 0,
      dpr = 1;
    let pmx = 0,
      pmy = 0,
      mx = 0,
      my = 0;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = Math.floor(r.width);
      h = Math.floor(r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };

    const buildNodes = () => {
      const cx = w * 0.5,
        cy = h * 0.55;
      const spread = Math.min(w, h) * 0.32;
      nodesRef.current = [
        // EMR Sources (left)
        { id: "admissions", label: "ADMISSIONS", p: { x: cx - spread * 1.1, y: cy - spread * 0.4 }, role: "EMR", stress: 0 },
        { id: "labs", label: "LAB RESULTS", p: { x: cx - spread * 1.15, y: cy + spread * 0.15 }, role: "EMR", stress: 0 },
        { id: "vitals", label: "VITALS", p: { x: cx - spread * 0.95, y: cy + spread * 0.55 }, role: "EMR", stress: 0 },
        // INTEL Core (center)
        { id: "triage", label: "TRIAGE", p: { x: cx - spread * 0.2, y: cy - spread * 0.25 }, role: "INTEL", stress: 0 },
        { id: "policy", label: "POLICY CHECK", p: { x: cx + spread * 0.15, y: cy + spread * 0.3 }, role: "INTEL", stress: 0 },
        { id: "intel", label: "CORE INTEL", p: { x: cx, y: cy + spread * 0.02 }, role: "INTEL", stress: 0 },
        // OPS Outputs (right)
        { id: "audit", label: "AUDIT LOG", p: { x: cx + spread * 1.0, y: cy - spread * 0.35 }, role: "OPS", stress: 0 },
        { id: "ops", label: "CLINICAL OPS", p: { x: cx + spread * 1.1, y: cy + spread * 0.2 }, role: "OPS", stress: 0 },
        { id: "patient", label: "PATIENT ACCESS", p: { x: cx + spread * 0.9, y: cy + spread * 0.6 }, role: "OPS", stress: 0 },
      ];
    };

    resize();

    // Mouse parallax
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
      my = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // --- Pulse management ---
    let pulses: Pulse[] = [];
    let pulseIdCounter = 0;

    const emrIds = ["admissions", "labs", "vitals"];
    const opsIds = ["audit", "ops", "patient"];

    function spawnPulse(now: number) {
      const nodes = nodesRef.current;
      const srcId = emrIds[Math.floor(Math.random() * emrIds.length)];
      const tgtId = opsIds[Math.floor(Math.random() * opsIds.length)];
      const src = nodes.find((n) => n.id === srcId)!;
      const tgt = nodes.find((n) => n.id === tgtId)!;

      // Route through triage first, then policy for high-severity
      const triage = nodes.find((n) => n.id === "triage")!;
      const policy = nodes.find((n) => n.id === "policy")!;
      const intel = nodes.find((n) => n.id === "intel")!;

      const severity = Math.random();
      const policyFirst = severity > 0.7 || srcId === "vitals";
      const pid = pulseIdCounter++;

      const jitter = (base: Vec2): Vec2 => ({
        x: base.x + (hash(pid * 3.7) - 0.5) * 18,
        y: base.y + (hash(pid * 7.1) - 0.5) * 18,
      });

      // Build bezier control points for the path segments
      const path: Vec2[] = [
        { ...src.p },
        jitter(triage.p),
        policyFirst ? jitter(policy.p) : jitter(intel.p),
        policyFirst ? jitter(intel.p) : jitter(policy.p),
        { ...tgt.p },
      ];

      const baseDur = severity > 0.8 ? 0.9 : lerp(2.2, 1.4, loadRef.current);
      const dur = baseDur * (0.9 + hash(pid) * 0.2);

      const event = EVENT_LABELS[Math.floor(hash(pid * 11) * EVENT_LABELS.length)];

      pulses.push({
        id: pid,
        path,
        t0: now,
        dur,
        severity,
        sourceId: srcId,
        targetId: tgtId,
        intelId: policyFirst ? "policy" : "intel",
        event,
      });
    }

    // --- Beat system ---
    function getBeat(tNorm: number) {
      return {
        bA: smoothstep(0.0, 0.18, tNorm) * (1 - smoothstep(0.18, 0.34, tNorm)),
        bB: smoothstep(0.18, 0.34, tNorm),
        bC: smoothstep(0.34, 0.57, tNorm),
        bD: smoothstep(0.57, 0.83, tNorm),
        bE: smoothstep(0.83, 1.0, tNorm),
      };
    }

    // --- HUD metrics ---
    let latency = 42;
    let throughput = 0;
    let compliance = 99.2;
    let spawnAccum = 0;

    // --- Drawing ---
    function drawBackground() {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, C.bg0);
      g.addColorStop(0.5, C.bg1);
      g.addColorStop(1, C.bg0);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Subtle auras
      const a1 = ctx.createRadialGradient(
        w * 0.2 + pmx * 8, h * 0.55 + pmy * 6, 1,
        w * 0.2 + pmx * 8, h * 0.55 + pmy * 6, Math.min(w, h) * 0.7
      );
      a1.addColorStop(0, "rgba(0,217,255,0.06)");
      a1.addColorStop(0.6, "rgba(0,217,255,0.015)");
      a1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = a1;
      ctx.fillRect(0, 0, w, h);

      const a2 = ctx.createRadialGradient(
        w * 0.8 + pmx * 8, h * 0.5 + pmy * 6, 1,
        w * 0.8 + pmx * 8, h * 0.5 + pmy * 6, Math.min(w, h) * 0.75
      );
      a2.addColorStop(0, "rgba(255,0,110,0.05)");
      a2.addColorStop(0.6, "rgba(255,0,110,0.012)");
      a2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = a2;
      ctx.fillRect(0, 0, w, h);

      // Vignette
      const vg = ctx.createRadialGradient(
        w * 0.5, h * 0.5, Math.min(w, h) * 0.15,
        w * 0.5, h * 0.5, Math.max(w, h) * 0.85
      );
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
    }

    function drawGrid() {
      ctx.save();
      ctx.strokeStyle = C.lineCyan;
      ctx.lineWidth = 1;
      const cell = Math.max(40, Math.min(64, Math.floor(Math.min(w, h) / 16)));
      const ox = (pmx * 6) % cell;
      const oy = (pmy * 6) % cell;
      for (let x = -cell; x < w + cell; x += cell) {
        ctx.beginPath();
        ctx.moveTo(x + ox, 0);
        ctx.lineTo(x + ox, h);
        ctx.stroke();
      }
      for (let y = -cell; y < h + cell; y += cell) {
        ctx.beginPath();
        ctx.moveTo(0, y + oy);
        ctx.lineTo(w, y + oy);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawConnections(nodes: NodeDef[]) {
      ctx.save();
      ctx.lineWidth = 1;
      // Draw static connection lines between roles
      const emrs = nodes.filter((n) => n.role === "EMR");
      const intels = nodes.filter((n) => n.role === "INTEL");
      const opses = nodes.filter((n) => n.role === "OPS");

      ctx.strokeStyle = "rgba(0,217,255,0.06)";
      for (const e of emrs) {
        for (const i of intels) {
          ctx.beginPath();
          ctx.moveTo(e.p.x + pmx * 2, e.p.y + pmy * 2);
          ctx.lineTo(i.p.x + pmx * 3, i.p.y + pmy * 3);
          ctx.stroke();
        }
      }
      ctx.strokeStyle = "rgba(255,0,110,0.05)";
      for (const i of intels) {
        for (const o of opses) {
          ctx.beginPath();
          ctx.moveTo(i.p.x + pmx * 3, i.p.y + pmy * 3);
          ctx.lineTo(o.p.x + pmx * 4, o.p.y + pmy * 4);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawNodes(nodes: NodeDef[], now: number) {
      ctx.save();
      for (const n of nodes) {
        const px = n.p.x + pmx * (n.role === "EMR" ? 2 : n.role === "OPS" ? 4 : 3);
        const py = n.p.y + pmy * (n.role === "EMR" ? 2 : n.role === "OPS" ? 4 : 3);
        const heat = n.stress;
        const baseR = n.role === "INTEL" ? 5 : 3.5;
        const r = baseR + heat * 12;

        // Glow
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const glowR = r * 4 + heat * 30;
        const glowCol =
          n.role === "INTEL"
            ? `rgba(255,0,110,${0.08 + heat * 0.2})`
            : n.role === "EMR"
            ? `rgba(0,217,255,${0.06 + heat * 0.15})`
            : `rgba(0,255,157,${0.06 + heat * 0.15})`;
        const gg = ctx.createRadialGradient(px, py, 0, px, py, glowR);
        gg.addColorStop(0, glowCol);
        gg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(px, py, glowR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Core dot
        ctx.fillStyle =
          n.role === "INTEL" ? C.pink : n.role === "EMR" ? C.cyan : C.matrix;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.save();
        ctx.font =
          "600 9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
        ctx.fillStyle = C.whiteDim;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(n.label, px, py + r + 8);

        // Role badge
        ctx.font = "500 7px ui-monospace, monospace";
        ctx.fillStyle =
          n.role === "EMR"
            ? "rgba(0,217,255,0.3)"
            : n.role === "INTEL"
            ? "rgba(255,0,110,0.3)"
            : "rgba(0,255,157,0.3)";
        ctx.fillText(n.role, px, py + r + 20);
        ctx.restore();
      }
      ctx.restore();
    }

    function drawPulses(now: number) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      pulses = pulses.filter((p) => {
        const u = clamp((now - p.t0) / p.dur, 0, 1);
        if (u >= 1) {
          // Pulse arrived — log it
          const msgs =
            EVENT_MESSAGES[p.event] || ["Transaction processed"];
          const msg = msgs[Math.floor(hash(p.id * 5.3) * msgs.length)];
          const fullMsg = `${p.event}: ${msg.replace("%id", String(1000 + (p.id % 9000)))}`;
          addLog(
            fullMsg,
            p.severity > 0.8 ? "WARN" : "SUCCESS"
          );
          return false;
        }

        // Heatmap: stress the intel node midway
        if (u > 0.35 && u < 0.55) {
          const intelNode = nodesRef.current.find(
            (n) => n.id === p.intelId
          );
          if (intelNode) intelNode.stress = Math.min(1, intelNode.stress + 0.03);
        }
        // Stress source on spawn
        if (u < 0.1) {
          const src = nodesRef.current.find((n) => n.id === p.sourceId);
          if (src) src.stress = Math.min(1, src.stress + 0.02);
        }
        // Stress target near arrival
        if (u > 0.85) {
          const tgt = nodesRef.current.find((n) => n.id === p.targetId);
          if (tgt) tgt.stress = Math.min(1, tgt.stress + 0.02);
        }

        // Interpolate position along multi-segment bezier
        const segCount = p.path.length - 1;
        const segF = u * segCount;
        const seg = Math.min(Math.floor(segF), segCount - 1);
        const segT = segF - seg;

        const p0 = p.path[seg];
        const p3 = p.path[Math.min(seg + 1, p.path.length - 1)];
        // Control points for curve
        const dx = (p3.x - p0.x) * 0.4;
        const dy = (p3.y - p0.y) * 0.4;
        const p1 = { x: p0.x + dx, y: p0.y - dy * 0.5 + (hash(p.id + seg) - 0.5) * 20 };
        const p2 = { x: p3.x - dx, y: p3.y + dy * 0.3 + (hash(p.id + seg + 1) - 0.5) * 20 };

        const pos = cubicBezier(p0, p1, p2, p3, segT);

        // Tail trail
        const tailLen = 6;
        for (let ti = tailLen; ti >= 0; ti--) {
          const tu = clamp(u - ti * 0.008, 0, 1);
          const tsegF = tu * segCount;
          const tseg = Math.min(Math.floor(tsegF), segCount - 1);
          const tsegT = tsegF - tseg;
          const tp0 = p.path[tseg];
          const tp3 = p.path[Math.min(tseg + 1, p.path.length - 1)];
          const tdx = (tp3.x - tp0.x) * 0.4;
          const tdy = (tp3.y - tp0.y) * 0.4;
          const tp1 = { x: tp0.x + tdx, y: tp0.y - tdy * 0.5 + (hash(p.id + tseg) - 0.5) * 20 };
          const tp2 = { x: tp3.x - tdx, y: tp3.y + tdy * 0.3 + (hash(p.id + tseg + 1) - 0.5) * 20 };
          const tpos = cubicBezier(tp0, tp1, tp2, tp3, tsegT);

          const alpha = (1 - ti / tailLen) * 0.6;
          const rr = (1 - ti / tailLen) * 3;
          ctx.fillStyle =
            p.severity > 0.8
              ? `rgba(255,0,110,${alpha})`
              : p.severity > 0.5
              ? `rgba(255,191,0,${alpha})`
              : `rgba(0,217,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(tpos.x, tpos.y, rr, 0, Math.PI * 2);
          ctx.fill();
        }

        // Head glow
        const headCol =
          p.severity > 0.8
            ? "rgba(255,0,110,0.9)"
            : p.severity > 0.5
            ? "rgba(255,191,0,0.85)"
            : "rgba(0,217,255,0.85)";
        ctx.fillStyle = headCol;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Event label near midpoint
        if (u > 0.4 && u < 0.6) {
          ctx.save();
          ctx.font = "600 8px ui-monospace, monospace";
          ctx.fillStyle = `rgba(243,239,255,${0.4 * (1 - Math.abs(u - 0.5) * 5)})`;
          ctx.textAlign = "center";
          const action =
            p.severity > 0.8 ? "POLICY CHECK" : p.severity > 0.5 ? "ROUTED" : "VERIFIED";
          ctx.fillText(action, pos.x, pos.y - 12);
          ctx.restore();
        }

        return true;
      });

      ctx.restore();
    }

    function drawHUD(now: number, tNorm: number) {
      const beats = getBeat(tNorm);
      ctx.save();
      ctx.font =
        "600 10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      const hx = 20;
      const hy = h - 88;

      // Latency
      const targetLat = lerp(12, 65, loadRef.current * (0.8 + beats.bC * 0.4));
      latency = lerp(latency, targetLat, 0.04);
      ctx.fillStyle = latency > 50 ? "rgba(255,0,110,0.7)" : "rgba(0,217,255,0.5)";
      ctx.fillText(`LATENCY  ${latency.toFixed(0)}ms`, hx, hy);

      // Throughput
      const targetTp = lerp(120, 890, loadRef.current) * (0.85 + beats.bD * 0.3);
      throughput = lerp(throughput, targetTp, 0.03);
      ctx.fillStyle = "rgba(0,255,157,0.5)";
      ctx.fillText(`THROUGHPUT  ${throughput.toFixed(0)} ops/s`, hx, hy + 16);

      // Compliance
      const targetComp = lerp(99.8, 97.2, loadRef.current * (beats.bC + beats.bD) * 0.3);
      compliance = lerp(compliance, targetComp, 0.02);
      ctx.fillStyle =
        compliance < 98 ? "rgba(255,191,0,0.7)" : "rgba(243,239,255,0.4)";
      ctx.fillText(`COMPLIANCE  ${compliance.toFixed(1)}%`, hx, hy + 32);

      // Coherence bar
      const coherence = clamp(
        0.15 + beats.bB * 0.15 + beats.bC * 0.25 + beats.bD * 0.25 + beats.bE * 0.2,
        0,
        1
      );
      const barW = 160;
      const by = hy + 52;
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(hx, by, barW, 5);
      const bg = ctx.createLinearGradient(hx, 0, hx + barW, 0);
      bg.addColorStop(0, "rgba(0,217,255,0.8)");
      bg.addColorStop(0.5, "rgba(255,0,110,0.7)");
      bg.addColorStop(1, "rgba(0,255,157,0.7)");
      ctx.fillStyle = bg;
      ctx.fillRect(hx, by, barW * coherence, 5);
      ctx.fillStyle = "rgba(243,239,255,0.35)";
      ctx.fillText(
        `COHERENCE ${(coherence * 100).toFixed(0)}%`,
        hx + barW + 10,
        hy + 48
      );

      ctx.restore();
    }

    // --- Main frame loop ---
    let raf = 0;
    let last = performance.now();

    function frame() {
      const now = performance.now() / 1000;
      const dt = Math.min(0.033, now - last);
      last = now;

      const tNorm = (now % LOOP) / LOOP;
      const beats = getBeat(tNorm);
      const currentLoad = loadRef.current;

      // Smooth mouse
      pmx = lerp(pmx, mx, 0.06);
      pmy = lerp(pmy, my, 0.06);

      // Decay node stress
      for (const n of nodesRef.current) {
        n.stress *= 0.96;
      }

      // Spawn pulses based on load + beat
      const desiredPerSec =
        lerp(2.0, 10.0, currentLoad) * (0.7 + (beats.bC + beats.bD * 0.6) * 0.5) * (1 - beats.bE * 0.35);
      spawnAccum += desiredPerSec * dt;
      while (spawnAccum >= 1) {
        spawnPulse(now);
        spawnAccum -= 1;
      }

      // Draw
      drawBackground();
      drawGrid();
      drawConnections(nodesRef.current);
      drawNodes(nodesRef.current, now);
      drawPulses(now);
      drawHUD(now, tNorm);

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, [addLog]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", background: "#020408" }}
    >
      <div ref={wrapRef} className="relative w-full h-full">
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* INTELLIGENCE title */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div
            style={{
              textAlign: "center",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              fontFamily:
                "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(48px, 10vw, 200px)",
              background:
                "linear-gradient(90deg, #00D9FF 0%, #FF006E 55%, #00FF9D 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.7))",
              opacity: 0.25,
              userSelect: "none",
            }}
          >
            INTELLIGENCE
          </div>
          <p
            style={{
              marginTop: 14,
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(243,239,255,0.35)",
              userSelect: "none",
            }}
          >
            INTELLIGENCE BECOMES INFRASTRUCTURE
          </p>
        </div>

        {/* Left sidebar: Audit Log */}
        <div className="absolute left-0 top-0 h-full w-64 z-20 pointer-events-auto hidden md:flex flex-col"
          style={{
            background: "rgba(2,4,8,0.55)",
            backdropFilter: "blur(16px)",
            borderRight: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center gap-2 px-4 pt-5 pb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 9,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(243,239,255,0.35)",
              }}
            >
              SYSTEM AUDIT
            </span>
          </div>

          <div className="flex-1 overflow-hidden px-3 space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="py-1.5 pl-2.5"
                style={{
                  borderLeft: `2px solid ${
                    log.type === "WARN"
                      ? "rgba(255,0,110,0.4)"
                      : log.type === "SUCCESS"
                      ? "rgba(0,217,255,0.3)"
                      : "rgba(255,255,255,0.1)"
                  }`,
                  animation: "fadeIn 0.3s ease-out",
                }}
              >
                <div
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 8,
                    color: "rgba(243,239,255,0.25)",
                    marginBottom: 2,
                  }}
                >
                  [{log.time}]
                </div>
                <div
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 9,
                    lineHeight: 1.3,
                    color:
                      log.type === "WARN"
                        ? "rgba(255,0,110,0.75)"
                        : log.type === "SUCCESS"
                        ? "rgba(0,217,255,0.65)"
                        : "rgba(243,239,255,0.5)",
                  }}
                >
                  {log.text}
                </div>
              </div>
            ))}
          </div>

          {/* Load controller */}
          <div
            className="px-4 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="flex justify-between items-center mb-2">
              <span
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 8,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(243,239,255,0.3)",
                }}
              >
                PROCESSING LOAD
              </span>
              <span
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 10,
                  color: "rgba(0,217,255,0.7)",
                }}
              >
                {Math.round(load * 100)}%
              </span>
            </div>
            <Slider
              value={[load]}
              onValueChange={([v]) => setLoad(v)}
              min={0.1}
              max={1}
              step={0.01}
              className="w-full"
            />
            <div
              className="flex justify-between mt-1.5"
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 7,
                color: "rgba(243,239,255,0.2)",
              }}
            >
              <span>IDLE</span>
              <span>OVERDRIVE</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
