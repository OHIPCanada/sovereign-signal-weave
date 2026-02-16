import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ── Cluster Network Data ── */
interface NetNode {
  x: number; y: number; r: number; isHub: boolean;
  clusterId: number; phase: number;
}
interface NetLink {
  a: number; b: number; type: "intra" | "inter";
}

function buildNetwork(w: number, h: number) {
  const pad = 0.08;
  const clusterCenters = [
    { cx: 0.20, cy: 0.22 }, // top-left
    { cx: 0.80, cy: 0.18 }, // top-right
    { cx: 0.50, cy: 0.50 }, // center
    { cx: 0.18, cy: 0.78 }, // bottom-left
    { cx: 0.82, cy: 0.80 }, // bottom-right
  ];

  const nodes: NetNode[] = [];
  const links: NetLink[] = [];
  const clusterNodeIndices: number[][] = [[], [], [], [], []];
  const hubIndices: number[] = [];

  const rand = (min: number, max: number) => min + Math.random() * (max - min);

  // Build nodes per cluster
  clusterCenters.forEach((cc, ci) => {
    const count = Math.floor(rand(8, 12));
    const spread = 0.12;
    // Hub node first
    const hubIdx = nodes.length;
    hubIndices.push(hubIdx);
    nodes.push({
      x: cc.cx * w, y: cc.cy * h, r: rand(8, 10),
      isHub: true, clusterId: ci, phase: rand(0, Math.PI * 2),
    });
    clusterNodeIndices[ci].push(hubIdx);

    for (let i = 1; i < count; i++) {
      const idx = nodes.length;
      const angle = rand(0, Math.PI * 2);
      const dist = rand(0.03, spread);
      const nx = Math.max(pad, Math.min(1 - pad, cc.cx + Math.cos(angle) * dist)) * w;
      const ny = Math.max(pad, Math.min(1 - pad, cc.cy + Math.sin(angle) * dist)) * h;
      nodes.push({
        x: nx, y: ny, r: rand(2.5, 5),
        isHub: false, clusterId: ci, phase: rand(0, Math.PI * 2),
      });
      clusterNodeIndices[ci].push(idx);
    }
  });

  // Intra-cluster links – connect each node to hub + 1-2 neighbors
  clusterNodeIndices.forEach((indices) => {
    const hub = indices[0];
    for (let i = 1; i < indices.length; i++) {
      links.push({ a: hub, b: indices[i], type: "intra" });
      // Connect to one random neighbor
      if (i > 1 && Math.random() > 0.4) {
        const neighbor = indices[Math.floor(rand(1, i))];
        if (neighbor !== indices[i]) {
          links.push({ a: indices[i], b: neighbor, type: "intra" });
        }
      }
    }
  });

  // Inter-cluster links – 6-10 intentional long links between hubs + a few non-hubs
  const interPairs: [number, number][] = [
    [0, 2], [1, 2], [2, 3], [2, 4], [0, 1], [3, 4], [0, 3], [1, 4],
  ];
  const interLinks: number[] = [];
  interPairs.forEach(([ca, cb]) => {
    const aIdx = hubIndices[ca];
    const bIdx = hubIndices[cb];
    const li = links.length;
    links.push({ a: aIdx, b: bIdx, type: "inter" });
    interLinks.push(li);
  });

  return { nodes, links, hubIndices, interLinks, clusterNodeIndices };
}

/* ── Signal Pulse along path ── */
interface PulseSignal {
  links: number[];       // link indices to light up
  progress: number;      // 0→1
  warm: boolean;
}

export default function Section4SystemTransformation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    let net = buildNetwork(1, 1);

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      net = buildNetwork(w, h);
    }

    // Animation state
    let t = 0;
    const activePulses: PulseSignal[] = [];
    let lastPulseTime = 0;
    let lastWarmTime = 0;
    const pulseInterval = 180; // ~3s at 60fps
    const warmInterval = 720;  // ~12s at 60fps
    const pulseDuration = 65;  // ~1.1s at 60fps

    function findPath(startHub: number): number[] {
      // Find 2-4 inter links from startHub outward
      const path: number[] = [];
      let current = startHub;
      const visited = new Set<number>([current]);
      const hops = 2 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < hops; i++) {
        const candidates = net.interLinks.filter(li => {
          const link = net.links[li];
          const other = link.a === net.hubIndices[current] ? 
            net.hubIndices.indexOf(link.b === net.hubIndices[current] ? link.a : link.b) :
            (link.b === net.hubIndices[current] ? net.hubIndices.indexOf(link.a) : -1);
          // Check if either end matches current hub
          const aHub = net.hubIndices.indexOf(link.a);
          const bHub = net.hubIndices.indexOf(link.b);
          if (aHub === current && !visited.has(bHub)) return true;
          if (bHub === current && !visited.has(aHub)) return true;
          return false;
        });
        if (candidates.length === 0) break;
        const li = candidates[Math.floor(Math.random() * candidates.length)];
        path.push(li);
        const link = net.links[li];
        const aHub = net.hubIndices.indexOf(link.a);
        const bHub = net.hubIndices.indexOf(link.b);
        const next = aHub === current ? bHub : aHub;
        visited.add(next);
        current = next;
      }
      return path;
    }

    function drawBackground() {
      ctx!.clearRect(0, 0, w, h);
      // No card-level background fill — transparent canvas on glass card
    }

    function drawLinks() {
      for (let i = 0; i < net.links.length; i++) {
        const link = net.links[i];
        const a = net.nodes[link.a];
        const b = net.nodes[link.b];

        // Check if this link is in any active pulse
        let lit = false;
        let warm = false;
        let litIntensity = 0;
        for (const pulse of activePulses) {
          const idx = pulse.links.indexOf(i);
          if (idx !== -1) {
            lit = true;
            warm = pulse.warm;
            // Intensity based on progress reaching this link
            const linkProgress = idx / pulse.links.length;
            const dist = pulse.progress - linkProgress;
            if (dist > 0 && dist < 0.5) {
              litIntensity = Math.max(litIntensity, 1 - dist * 2);
            }
          }
        }

        if (warm && litIntensity > 0) {
          ctx!.strokeStyle = `rgba(232,150,124,${0.15 + litIntensity * 0.55})`;
          ctx!.lineWidth = link.type === "inter" ? 2 : 1.2;
          ctx!.shadowColor = "rgba(232,150,124,0.4)";
          ctx!.shadowBlur = 12 * litIntensity;
        } else if (lit && litIntensity > 0) {
          ctx!.strokeStyle = `rgba(210,180,255,${0.22 + litIntensity * 0.55})`;
          ctx!.lineWidth = link.type === "inter" ? 2 : 1.2;
          ctx!.shadowColor = "rgba(123,97,255,0.3)";
          ctx!.shadowBlur = 10 * litIntensity;
        } else {
          ctx!.strokeStyle = link.type === "inter"
            ? "rgba(210,180,255,0.28)"
            : "rgba(210,180,255,0.18)";
          ctx!.lineWidth = link.type === "inter" ? 1.5 : 1;
          ctx!.shadowBlur = 0;
        }

        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
        ctx!.shadowBlur = 0;
      }
    }

    function drawNodes() {
      for (const n of net.nodes) {
        // Check if node is near an active pulse
        let lit = false;
        let warm = false;
        let litIntensity = 0;

        for (const pulse of activePulses) {
          for (const li of pulse.links) {
            const link = net.links[li];
            if (link.a === net.nodes.indexOf(n) || link.b === net.nodes.indexOf(n)) {
              const linkIdx = pulse.links.indexOf(li);
              const linkProgress = linkIdx / pulse.links.length;
              const dist = pulse.progress - linkProgress;
              if (dist > -0.1 && dist < 0.5) {
                lit = true;
                warm = pulse.warm;
                litIntensity = Math.max(litIntensity, Math.max(0, 1 - Math.abs(dist) * 2.5));
              }
            }
          }
        }

        const breathe = 0.65 + 0.15 * Math.sin(t * 0.008 + n.phase);
        const alpha = Math.min(1, breathe + litIntensity * 0.35);

        // Glow
        if (n.isHub || (lit && litIntensity > 0.3)) {
          const glowR = n.r + (lit ? 14 : 10);
          if (warm && lit) {
            ctx!.fillStyle = `rgba(232,150,124,${(lit ? 0.25 : 0.08) * litIntensity})`;
          } else {
            ctx!.fillStyle = `rgba(123,97,255,${n.isHub ? 0.15 : 0.08 + litIntensity * 0.15})`;
          }
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, glowR, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Node dot
        if (warm && lit && litIntensity > 0.3) {
          ctx!.fillStyle = `rgba(242,193,174,${alpha})`;
        } else {
          ctx!.fillStyle = `rgba(235,225,255,${alpha})`;
        }
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r + (lit ? litIntensity * 1.5 : 0), 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    // Pre-compute node indices for fast lookup
    let nodeIndexMap: Map<NetNode, number>;
    function buildIndexMap() {
      nodeIndexMap = new Map();
      net.nodes.forEach((n, i) => nodeIndexMap.set(n, i));
    }

    function step() {
      t++;

      // Ambient breathing via subtle scale is handled by transform below

      // Trigger signal pulses
      if (t - lastPulseTime > pulseInterval) {
        lastPulseTime = t;
        const startHub = Math.floor(Math.random() * 5);
        const path = findPath(startHub);
        if (path.length > 0) {
          activePulses.push({ links: path, progress: 0, warm: false });
        }
      }

      // Trigger warm governance event
      if (t - lastWarmTime > warmInterval) {
        lastWarmTime = t;
        if (net.interLinks.length > 0) {
          const li = net.interLinks[Math.floor(Math.random() * net.interLinks.length)];
          activePulses.push({ links: [li], progress: 0, warm: true });
        }
      }

      // Update pulses
      for (let i = activePulses.length - 1; i >= 0; i--) {
        activePulses[i].progress += 1 / pulseDuration;
        if (activePulses[i].progress > 1.5) {
          activePulses.splice(i, 1);
        }
      }

      drawBackground();
      drawLinks();
      drawNodes();

      raf = requestAnimationFrame(step);
    }

    let raf: number;
    resize();
    buildIndexMap();
    raf = requestAnimationFrame(step);

    const onResize = () => { resize(); buildIndexMap(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <motion.section
      className="relative overflow-hidden flex items-center"
      style={{
        padding: "clamp(64px, 7vw, 110px) 0",
        minHeight: "100vh",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 lg:gap-20 items-center w-full">
          {/* Left content */}
          <div className="flex flex-col gap-7">
            <motion.p
              className="mono-label"
              style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.22em" }}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              [ SYSTEM TRANSFORMATION ]
            </motion.p>

            <motion.h2
              style={{
                color: "rgba(255,255,255,0.95)",
                fontWeight: 800,
                fontSize: "clamp(44px, 5.2vw, 84px)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textShadow: "0 10px 40px rgba(0,0,0,0.22)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              When intelligence becomes infrastructure.
            </motion.h2>

            <motion.p
              style={{
                color: "rgba(255,255,255,0.72)",
                fontWeight: 400,
                fontSize: "clamp(15px, 1.25vw, 18px)",
                lineHeight: 1.55,
                maxWidth: "46ch",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Signals stop fragmenting. Workflows coordinate. Governance becomes automatic.
              Care becomes continuous — across the entire system.
            </motion.p>

            <motion.p
              style={{
                color: "rgba(255,255,255,0.42)",
                fontSize: 13,
                letterSpacing: "0.01em",
                lineHeight: 1.5,
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Coordination at national scale — routing + governance in the same loop.
            </motion.p>
          </div>

          {/* Right visual – glass card */}
          <div>
            <motion.div
              ref={wrapRef}
              className="relative overflow-hidden"
              style={{
                aspectRatio: "11/8",
                borderRadius: 28,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                boxShadow: "0 20px 80px rgba(0,0,0,0.45)",
                padding: "28px",
              }}
              animate={{
                scale: [1, 1.008, 1],
              }}
              transition={{
                duration: 11,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <canvas ref={canvasRef} className="absolute inset-0 z-[2]" />

              <div
                className="absolute left-7 top-7 z-[3] uppercase"
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 12,
                  letterSpacing: "0.22em",
                }}
              >
                National-scale coordination layer
              </div>

              <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none">
                <div
                  style={{
                    color: "rgba(255,255,255,0.04)",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    fontSize: 88,
                  }}
                >
                  DOCG AI
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section background with system glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle at 70% 50%, rgba(123,97,255,0.22), rgba(0,0,0,0) 55%),
            radial-gradient(circle at 85% 75%, rgba(232,150,124,0.10), rgba(0,0,0,0) 60%),
            linear-gradient(135deg, #1A062D 0%, #3A0B66 55%, #22063A 100%)
          `,
        }}
      />
    </motion.section>
  );
}
