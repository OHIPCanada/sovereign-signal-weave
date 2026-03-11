import { motion } from "framer-motion";
import { useMemo } from "react";

/* ───── MODULE DATA ───── */
const modules = [
  { label: "AI CORTEX",       desc: "Neural Engine",       color: "#A78BFA", glowColor: "139,92,246" },
  { label: "SOVEREIGN DATA",  desc: "Data Vault",          color: "#6366F1", glowColor: "99,102,241" },
  { label: "AUDIT INTEGRITY", desc: "Compliance Shield",   color: "#F472B6", glowColor: "244,114,182" },
  { label: "CLINIC OS",       desc: "Operations Core",     color: "#818CF8", glowColor: "129,140,248" },
  { label: "VIRTUAL CARE",    desc: "Telehealth Layer",    color: "#60A5FA", glowColor: "96,165,250" },
];

/* ───── SEEDED RANDOM ───── */
function sr(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

interface AINetworkHubProps {
  size?: "mobile" | "desktop";
}

/* ─── CUBE FACE BUILDER (isometric-ish 3D cube) ─── */
function cubeFaces(cx: number, cy: number, s: number) {
  // s = half-size of cube face
  const top = [
    [cx, cy - s * 1.15],
    [cx + s, cy - s * 0.4],
    [cx, cy + s * 0.35],
    [cx - s, cy - s * 0.4],
  ];
  const left = [
    [cx - s, cy - s * 0.4],
    [cx, cy + s * 0.35],
    [cx, cy + s * 1.1],
    [cx - s, cy + s * 0.35],
  ];
  const right = [
    [cx + s, cy - s * 0.4],
    [cx, cy + s * 0.35],
    [cx, cy + s * 1.1],
    [cx + s, cy + s * 0.35],
  ];
  const toStr = (pts: number[][]) => pts.map(p => p.join(",")).join(" ");
  return { top: toStr(top), left: toStr(left), right: toStr(right) };
}

const AINetworkHub = ({ size = "desktop" }: AINetworkHubProps) => {
  const isMobile = size === "mobile";

  // Layout: horizontal pipeline
  const vbW = isMobile ? 440 : 1400;
  const vbH = isMobile ? 900 : 620;
  const cubeSize = isMobile ? 52 : 95;

  // Cube positions
  const positions = useMemo(() => {
    if (isMobile) {
      return modules.map((_, i) => ({
        x: 220 + (i % 2 === 0 ? -25 : 25),
        y: 100 + i * 160,
      }));
    }
    return modules.map((_, i) => ({
      x: 155 + i * 272,
      y: 310 + Math.sin(i * 0.8) * 35,
    }));
  }, [isMobile]);

  // Background particles
  const bgParticles = useMemo(() =>
    Array.from({ length: isMobile ? 40 : 80 }, (_, i) => ({
      x: sr(i * 13) * vbW,
      y: sr(i * 17) * vbH,
      r: 0.5 + sr(i * 23) * 1.5,
      dur: 3 + sr(i * 31) * 5,
      delay: sr(i * 37) * 4,
      drift: (sr(i * 41) - 0.5) * 30,
    })),
  [isMobile, vbW, vbH]);

  return (
    <div className="relative w-full" style={{ maxWidth: isMobile ? 420 : 1200 }}>
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className="w-full h-auto"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Glow filters */}
          <filter id="cubeGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="12" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b2" />
            <feMerge>
              <feMergeNode in="b1" />
              <feMergeNode in="b2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="particleGlow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="streamGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Cube face gradients per module */}
          {modules.map((mod, i) => (
            <linearGradient key={`gt-${i}`} id={`cubeTop${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={mod.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={mod.color} stopOpacity="0.12" />
            </linearGradient>
          ))}
          {modules.map((mod, i) => (
            <linearGradient key={`gl-${i}`} id={`cubeLeft${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={mod.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={mod.color} stopOpacity="0.06" />
            </linearGradient>
          ))}
          {modules.map((mod, i) => (
            <linearGradient key={`gr-${i}`} id={`cubeRight${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={mod.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={mod.color} stopOpacity="0.08" />
            </linearGradient>
          ))}

          {/* Inner content radial glows */}
          {modules.map((mod, i) => (
            <radialGradient key={`rg-${i}`} id={`innerGlow${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={mod.color} stopOpacity="0.5" />
              <stop offset="60%" stopColor={mod.color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={mod.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* ── AMBIENT BACKGROUND PARTICLES ── */}
        {bgParticles.map((p, i) => (
          <motion.circle
            key={`bg-${i}`}
            r={p.r}
            fill="rgba(167,139,250,0.4)"
            initial={{ cx: p.x, cy: p.y, opacity: 0 }}
            animate={{
              cx: [p.x, p.x + p.drift, p.x - p.drift * 0.5, p.x],
              cy: [p.y, p.y - 15, p.y + 10, p.y],
              opacity: [0, 0.6, 0.3, 0],
            }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* ── ENERGY STREAMS BETWEEN CUBES ── */}
        {positions.slice(0, -1).map((from, i) => {
          const to = positions[i + 1];
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2 - 40;
          const pathD = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
          const mod = modules[i];

          // Sample points along quadratic bezier for dot animation
          const sampleBezier = (t: number) => {
            const mt = 1 - t;
            return {
              x: mt * mt * from.x + 2 * mt * t * midX + t * t * to.x,
              y: mt * mt * from.y + 2 * mt * t * midY + t * t * to.y,
            };
          };
          const steps = 8;
          const cxKeys = Array.from({ length: steps + 1 }, (_, s) => sampleBezier(s / steps).x);
          const cyKeys = Array.from({ length: steps + 1 }, (_, s) => sampleBezier(s / steps).y);

          return (
            <g key={`stream-${i}`}>
              {/* Wide energy field */}
              <motion.path
                d={pathD}
                fill="none"
                stroke={mod.color}
                strokeWidth="8"
                strokeLinecap="round"
                filter="url(#streamGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.06 }}
                transition={{ duration: 1.5, delay: 1.8 + i * 0.5, ease: "easeOut" }}
              />

              {/* Core energy line */}
              <motion.path
                d={pathD}
                fill="none"
                stroke={mod.color}
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#streamGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 1.5, delay: 1.8 + i * 0.5, ease: "easeOut" }}
              />

              {/* Flowing energy pulse — follows bezier via keyframes */}
              <motion.circle
                r="5"
                fill={mod.color}
                filter="url(#particleGlow)"
                animate={{
                  cx: cxKeys,
                  cy: cyKeys,
                  opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 3 + i * 0.8,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
              />

              {/* Trailing smaller pulse */}
              <motion.circle
                r="2.5"
                fill="white"
                filter="url(#particleGlow)"
                animate={{
                  cx: cxKeys,
                  cy: cyKeys,
                  opacity: [0, 0, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 3.15 + i * 0.8,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
              />
            </g>
          );
        })}

        {/* ── GLASS CUBES WITH INNER VISUALIZATIONS ── */}
        {modules.map((mod, i) => {
          const pos = positions[i];
          const faces = cubeFaces(pos.x, pos.y, cubeSize);


          return (
            <motion.g
              key={`cube-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                delay: 0.3 + i * 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Ambient glow behind cube */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={cubeSize * 1.8}
                fill={`url(#innerGlow${i})`}
                animate={{
                  r: [cubeSize * 1.6, cubeSize * 2, cubeSize * 1.6],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* ── CUBE FACES (glass) ── */}
              <polygon points={faces.left} fill={`url(#cubeLeft${i})`}
                stroke={mod.color} strokeWidth="1.2" strokeOpacity="0.4" />
              <polygon points={faces.right} fill={`url(#cubeRight${i})`}
                stroke={mod.color} strokeWidth="1.2" strokeOpacity="0.4" />
              <polygon points={faces.top} fill={`url(#cubeTop${i})`}
                stroke={mod.color} strokeWidth="1.5" strokeOpacity="0.6" />

              {/* ── NEON EDGES ── */}
              <motion.polygon points={faces.top} fill="none"
                stroke={mod.color} strokeWidth="2" strokeOpacity="0.7" filter="url(#softGlow)"
                animate={{ strokeOpacity: [0.4, 0.85, 0.4] }}
                transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }} />
              <motion.polygon points={faces.left} fill="none"
                stroke={mod.color} strokeWidth="1" strokeOpacity="0.3" filter="url(#softGlow)"
                animate={{ strokeOpacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 3.5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }} />
              <motion.polygon points={faces.right} fill="none"
                stroke={mod.color} strokeWidth="1" strokeOpacity="0.3" filter="url(#softGlow)"
                animate={{ strokeOpacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 3.5 + i * 0.3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }} />

              {/* ── UNIQUE INNER VISUALIZATION PER MODULE ── */}
              {i === 0 && /* AI CORTEX — Neural network sphere */
                (() => {
                  const cx0 = pos.x, cy0 = pos.y - cubeSize * 0.15, rr = cubeSize * 0.5;
                  const nodes = Array.from({ length: 14 }, (_, j) => {
                    const a = (j / 14) * Math.PI * 2;
                    const d = rr * (0.4 + sr(j * 73) * 0.6);
                    return { x: cx0 + Math.cos(a) * d, y: cy0 + Math.sin(a) * d * 0.7 };
                  });
                  return (
                    <g>
                      {nodes.map((n, j) => nodes.slice(j + 1).filter((_, k) => sr(j * 11 + k * 7) > 0.35).map((n2, k) => (
                        <motion.line key={`nn-${j}-${k}`} x1={n.x} y1={n.y} x2={n2.x} y2={n2.y}
                          stroke={mod.color} strokeWidth="1" strokeOpacity="0.35"
                          animate={{ strokeOpacity: [0.15, 0.55, 0.15] }}
                          transition={{ duration: 2 + sr(j + k) * 2, repeat: Infinity, ease: "easeInOut" }} />
                      )))}
                      {nodes.map((n, j) => (
                        <motion.circle key={`nnd-${j}`} cx={n.x} cy={n.y} r={2 + sr(j * 19) * 2.5}
                          fill={mod.color} filter="url(#particleGlow)"
                          animate={{ opacity: [0.5, 1, 0.5], r: [2, 3.5, 2] }}
                          transition={{ duration: 2 + sr(j * 23) * 1.5, delay: sr(j * 31) * 2, repeat: Infinity, ease: "easeInOut" }} />
                      ))}
                      <motion.circle cx={cx0} cy={cy0} r={cubeSize * 0.18} fill={mod.color} filter="url(#cubeGlow)"
                        animate={{ opacity: [0.4, 0.8, 0.4], r: [cubeSize * 0.14, cubeSize * 0.22, cubeSize * 0.14] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                    </g>
                  );
                })()
              }

              {i === 1 && /* SOVEREIGN DATA — Lock / encrypted vault */
                (() => {
                  const cx0 = pos.x, cy0 = pos.y - cubeSize * 0.15, s = cubeSize * 0.42;
                  return (
                    <g>
                      <motion.rect x={cx0 - s * 0.7} y={cy0 - s * 0.25} width={s * 1.4} height={s * 1.15}
                        rx={s * 0.12} fill="none" stroke={mod.color} strokeWidth="1.8"
                        animate={{ strokeOpacity: [0.4, 0.85, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.rect x={cx0 - s * 0.7} y={cy0 - s * 0.25} width={s * 1.4} height={s * 1.15}
                        rx={s * 0.12} fill={mod.color} fillOpacity="0.06"
                        animate={{ fillOpacity: [0.04, 0.12, 0.04] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.path d={`M ${cx0 - s * 0.4} ${cy0 - s * 0.25} V ${cy0 - s * 0.75} A ${s * 0.4} ${s * 0.4} 0 0 1 ${cx0 + s * 0.4} ${cy0 - s * 0.75} V ${cy0 - s * 0.25}`}
                        fill="none" stroke={mod.color} strokeWidth="1.8" strokeLinecap="round"
                        animate={{ strokeOpacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.circle cx={cx0} cy={cy0 + s * 0.2} r={s * 0.15} fill={mod.color} filter="url(#particleGlow)"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                      {Array.from({ length: 8 }, (_, j) => {
                        const a = (j / 8) * Math.PI * 2;
                        const r2 = s * 1.4;
                        return (
                          <motion.circle key={`sd-${j}`} r={2} fill={mod.color} filter="url(#particleGlow)"
                            animate={{ cx: [cx0 + Math.cos(a) * r2, cx0 + Math.cos(a + 1) * r2], cy: [cy0 + Math.sin(a) * r2 * 0.6, cy0 + Math.sin(a + 1) * r2 * 0.6], opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 4 + sr(j * 11) * 2, delay: j * 0.3, repeat: Infinity, ease: "easeInOut" }} />
                        );
                      })}
                    </g>
                  );
                })()
              }

              {i === 2 && /* AUDIT INTEGRITY — Shield with checkmark */
                (() => {
                  const cx0 = pos.x, cy0 = pos.y - cubeSize * 0.15, s = cubeSize * 0.5;
                  return (
                    <g>
                      <motion.path
                        d={`M ${cx0} ${cy0 - s} L ${cx0 + s * 0.85} ${cy0 - s * 0.5} L ${cx0 + s * 0.75} ${cy0 + s * 0.45} Q ${cx0} ${cy0 + s * 1.05} ${cx0} ${cy0 + s * 1.05} Q ${cx0} ${cy0 + s * 1.05} ${cx0 - s * 0.75} ${cy0 + s * 0.45} L ${cx0 - s * 0.85} ${cy0 - s * 0.5} Z`}
                        fill="none" stroke={mod.color} strokeWidth="1.8" strokeLinejoin="round"
                        animate={{ strokeOpacity: [0.45, 0.9, 0.45] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.path
                        d={`M ${cx0} ${cy0 - s} L ${cx0 + s * 0.85} ${cy0 - s * 0.5} L ${cx0 + s * 0.75} ${cy0 + s * 0.45} Q ${cx0} ${cy0 + s * 1.05} ${cx0} ${cy0 + s * 1.05} Q ${cx0} ${cy0 + s * 1.05} ${cx0 - s * 0.75} ${cy0 + s * 0.45} L ${cx0 - s * 0.85} ${cy0 - s * 0.5} Z`}
                        fill={mod.color} fillOpacity="0.1"
                        animate={{ fillOpacity: [0.06, 0.18, 0.06] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.path
                        d={`M ${cx0 - s * 0.35} ${cy0} L ${cx0 - s * 0.05} ${cy0 + s * 0.35} L ${cx0 + s * 0.4} ${cy0 - s * 0.25}`}
                        fill="none" stroke={mod.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        filter="url(#particleGlow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: [0, 1, 1, 0] }}
                        transition={{ duration: 4, delay: 1, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.circle cx={cx0} cy={cy0} fill="none" stroke={mod.color} strokeWidth="1"
                        initial={{ r: 4, opacity: 0.6 }} animate={{ r: s * 1.3, opacity: 0 }}
                        transition={{ duration: 3, delay: 2, repeat: Infinity, ease: "easeOut" }} />
                    </g>
                  );
                })()
              }

              {i === 3 && /* CLINIC OS — Dashboard grid */
                (() => {
                  const cx0 = pos.x, cy0 = pos.y - cubeSize * 0.15, s = cubeSize * 0.45;
                  const bars = [0.6, 1, 0.75, 0.9, 0.5];
                  return (
                    <g>
                      <motion.rect x={cx0 - s * 1.1} y={cy0 - s * 0.9} width={s * 2.2} height={s * 1.8}
                        rx={s * 0.1} fill="none" stroke={mod.color} strokeWidth="1.2"
                        animate={{ strokeOpacity: [0.35, 0.7, 0.35] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.rect x={cx0 - s * 1.1} y={cy0 - s * 0.9} width={s * 2.2} height={s * 1.8}
                        rx={s * 0.1} fill={mod.color} fillOpacity="0.04"
                        animate={{ fillOpacity: [0.03, 0.08, 0.03] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                      {bars.map((h, j) => {
                        const bw = (s * 1.8) / bars.length;
                        const bx = cx0 - s * 0.9 + j * bw + bw * 0.15;
                        const maxH = s * 1.3;
                        const bh = maxH * h;
                        return (
                          <motion.rect key={`bar-${j}`} x={bx} width={bw * 0.7} rx={1.5}
                            fill={mod.color} filter="url(#particleGlow)"
                            initial={{ y: cy0 + s * 0.7, height: 0, opacity: 0 }}
                            animate={{ y: cy0 + s * 0.7 - bh, height: bh, opacity: [0.35, 0.75, 0.35] }}
                            transition={{ duration: 2, delay: 1.5 + j * 0.15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} />
                        );
                      })}
                      {[0, 1, 2].map(j => (
                        <motion.circle key={`dot-${j}`} cx={cx0 - s * 0.8 + j * s * 0.3} cy={cy0 - s * 0.65}
                          r={2.5} fill={mod.color}
                          animate={{ opacity: [0.35, 0.85, 0.35] }}
                          transition={{ duration: 1.5, delay: j * 0.3, repeat: Infinity, ease: "easeInOut" }} />
                      ))}
                    </g>
                  );
                })()
              }

              {i === 4 && /* VIRTUAL CARE — Doctor-patient telehealth */
                (() => {
                  const cx0 = pos.x, cy0 = pos.y - cubeSize * 0.15, s = cubeSize * 0.45;
                  return (
                    <g>
                      <motion.circle cx={cx0 - s * 0.75} cy={cy0 - s * 0.35} r={s * 0.3} fill="none" stroke={mod.color} strokeWidth="1.5"
                        animate={{ strokeOpacity: [0.45, 0.9, 0.45] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.path d={`M ${cx0 - s * 1.2} ${cy0 + s * 0.55} Q ${cx0 - s * 0.75} ${cy0 + s * 0.05} ${cx0 - s * 0.3} ${cy0 + s * 0.55}`}
                        fill="none" stroke={mod.color} strokeWidth="1.5" strokeLinecap="round"
                        animate={{ strokeOpacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.circle cx={cx0 + s * 0.75} cy={cy0 - s * 0.35} r={s * 0.3} fill="none" stroke={mod.color} strokeWidth="1.5"
                        animate={{ strokeOpacity: [0.45, 0.9, 0.45] }}
                        transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.path d={`M ${cx0 + s * 0.3} ${cy0 + s * 0.55} Q ${cx0 + s * 0.75} ${cy0 + s * 0.05} ${cx0 + s * 1.2} ${cy0 + s * 0.55}`}
                        fill="none" stroke={mod.color} strokeWidth="1.5" strokeLinecap="round"
                        animate={{ strokeOpacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }} />
                      {[0, 1, 2].map(j => (
                        <motion.path key={`wave-${j}`}
                          d={`M ${cx0 - s * 0.4} ${cy0 + (j - 1) * s * 0.2} Q ${cx0} ${cy0 - s * 0.25 + (j - 1) * s * 0.2} ${cx0 + s * 0.4} ${cy0 + (j - 1) * s * 0.2}`}
                          fill="none" stroke={mod.color} strokeWidth="1.2" strokeLinecap="round"
                          filter="url(#particleGlow)"
                          animate={{ strokeOpacity: [0, 0.7, 0], pathLength: [0, 1, 0] }}
                          transition={{ duration: 2.5, delay: 1.5 + j * 0.4, repeat: Infinity, ease: "easeInOut" }} />
                      ))}
                      <motion.circle cx={cx0} cy={cy0} fill="none" stroke={mod.color} strokeWidth="0.8"
                        initial={{ r: 3, opacity: 0.6 }} animate={{ r: s * 1.4, opacity: 0 }}
                        transition={{ duration: 2.5, delay: 2, repeat: Infinity, ease: "easeOut" }} />
                    </g>
                  );
                })()
              }

              <motion.circle
                cx={pos.x} cy={pos.y - cubeSize * 0.15} fill="none"
                stroke={mod.color} strokeWidth="1.2"
                initial={{ r: 8, opacity: 0.5 }}
                animate={{ r: cubeSize * 0.65, opacity: 0, strokeWidth: 0.3 }}
                transition={{ duration: 3, delay: 2 + i * 0.7, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.g>
          );
        })}
      </svg>

      {/* ── MODULE LABELS (HTML overlay) ── */}
      {modules.map((mod, i) => {
        const pos = positions[i];
        const leftPct = (pos.x / vbW) * 100;
        const topPct = ((pos.y + cubeSize * 1.45) / vbH) * 100;

        return (
          <motion.div
            key={mod.label}
            className="absolute z-10 pointer-events-none flex flex-col items-center gap-0.5"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: "translate(-50%, 0)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 + i * 0.35 }}
          >
            <span
              className={`font-bold tracking-[0.18em] uppercase whitespace-nowrap ${isMobile ? "text-[10px]" : "text-[13px]"}`}
              style={{ color: mod.color, textShadow: `0 0 24px rgba(${mod.glowColor},0.6)` }}
            >
              {mod.label}
            </span>
            <span
              className={`tracking-[0.12em] uppercase whitespace-nowrap opacity-65 ${isMobile ? "text-[7px]" : "text-[10px]"}`}
              style={{ color: mod.color }}
            >
              {mod.desc}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AINetworkHub;
