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
  const vbW = isMobile ? 400 : 1200;
  const vbH = isMobile ? 700 : 500;
  const cubeSize = isMobile ? 38 : 62;

  // Cube positions
  const positions = useMemo(() => {
    if (isMobile) {
      // Vertical stack for mobile
      return modules.map((_, i) => ({
        x: 200 + (i % 2 === 0 ? -20 : 20),
        y: 80 + i * 125,
      }));
    }
    // Horizontal pipeline with slight vertical wave
    return modules.map((_, i) => ({
      x: 130 + i * 235,
      y: 250 + Math.sin(i * 0.8) * 30,
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
              <stop offset="0%" stopColor={mod.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={mod.color} stopOpacity="0.08" />
            </linearGradient>
          ))}
          {modules.map((mod, i) => (
            <linearGradient key={`gl-${i}`} id={`cubeLeft${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={mod.color} stopOpacity="0.12" />
              <stop offset="100%" stopColor={mod.color} stopOpacity="0.04" />
            </linearGradient>
          ))}
          {modules.map((mod, i) => (
            <linearGradient key={`gr-${i}`} id={`cubeRight${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={mod.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={mod.color} stopOpacity="0.06" />
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

              {/* Flowing energy pulse */}
              <motion.circle
                r="5"
                fill={mod.color}
                filter="url(#particleGlow)"
                animate={{
                  opacity: [0, 1, 1, 0],
                  offsetDistance: ["0%", "100%"],
                }}
                transition={{
                  duration: 2,
                  delay: 3 + i * 0.8,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
                style={{ offsetPath: `path("${pathD}")` }}
              />

              {/* Trailing smaller pulse */}
              <motion.circle
                r="2.5"
                fill="white"
                filter="url(#particleGlow)"
                animate={{
                  opacity: [0, 0.8, 0.8, 0],
                  offsetDistance: ["0%", "100%"],
                }}
                transition={{
                  duration: 2,
                  delay: 3.2 + i * 0.8,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
                style={{ offsetPath: `path("${pathD}")` }}
              />
            </g>
          );
        })}

        {/* ── GLASS CUBES WITH INNER VISUALIZATIONS ── */}
        {modules.map((mod, i) => {
          const pos = positions[i];
          const faces = cubeFaces(pos.x, pos.y, cubeSize);

          // Inner visualization particles unique to each module
          const innerParticles = Array.from({ length: 12 }, (_, j) => {
            const angle = sr(i * 100 + j * 31) * Math.PI * 2;
            const dist = sr(i * 100 + j * 47) * cubeSize * 0.45;
            return {
              x: pos.x + Math.cos(angle) * dist,
              y: pos.y + Math.sin(angle) * dist - cubeSize * 0.2,
              r: 1 + sr(i * 100 + j * 59) * 2.5,
              dur: 2 + sr(i * 100 + j * 67) * 3,
              delay: sr(i * 100 + j * 71) * 2,
            };
          });

          // Inner neural connections
          const innerConnections = Array.from({ length: 8 }, (_, j) => {
            const a1 = sr(i * 200 + j * 13) * Math.PI * 2;
            const a2 = sr(i * 200 + j * 29) * Math.PI * 2;
            const r1 = sr(i * 200 + j * 37) * cubeSize * 0.4;
            const r2 = sr(i * 200 + j * 43) * cubeSize * 0.4;
            return {
              x1: pos.x + Math.cos(a1) * r1,
              y1: pos.y + Math.sin(a1) * r1 - cubeSize * 0.2,
              x2: pos.x + Math.cos(a2) * r2,
              y2: pos.y + Math.sin(a2) * r2 - cubeSize * 0.2,
            };
          });

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
              {/* Left face */}
              <polygon
                points={faces.left}
                fill={`url(#cubeLeft${i})`}
                stroke={mod.color}
                strokeWidth="0.8"
                strokeOpacity="0.3"
              />
              {/* Right face */}
              <polygon
                points={faces.right}
                fill={`url(#cubeRight${i})`}
                stroke={mod.color}
                strokeWidth="0.8"
                strokeOpacity="0.3"
              />
              {/* Top face */}
              <polygon
                points={faces.top}
                fill={`url(#cubeTop${i})`}
                stroke={mod.color}
                strokeWidth="1"
                strokeOpacity="0.5"
              />

              {/* ── NEON EDGES ── */}
              {/* Top diamond edges */}
              <motion.polygon
                points={faces.top}
                fill="none"
                stroke={mod.color}
                strokeWidth="1.5"
                strokeOpacity="0.6"
                filter="url(#softGlow)"
                animate={{ strokeOpacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* ── INNER VISUALIZATION ── */}
              {/* Central glow sphere */}
              <motion.circle
                cx={pos.x}
                cy={pos.y - cubeSize * 0.15}
                r={cubeSize * 0.25}
                fill={mod.color}
                filter="url(#cubeGlow)"
                animate={{
                  r: [cubeSize * 0.2, cubeSize * 0.3, cubeSize * 0.2],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Inner neural connections */}
              {innerConnections.map((c, j) => (
                <motion.line
                  key={`ic-${i}-${j}`}
                  x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
                  stroke={mod.color}
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.25, 0.1, 0.25] }}
                  transition={{
                    duration: 3 + sr(i * 300 + j) * 2,
                    delay: 1.5 + i * 0.35 + j * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Inner floating particles */}
              {innerParticles.map((p, j) => (
                <motion.circle
                  key={`ip-${i}-${j}`}
                  r={p.r}
                  fill={mod.color}
                  filter="url(#particleGlow)"
                  initial={{ cx: pos.x, cy: pos.y, opacity: 0 }}
                  animate={{
                    cx: [pos.x, p.x, p.x + (sr(i * 400 + j) - 0.5) * 10, p.x],
                    cy: [pos.y, p.y, p.y + (sr(i * 500 + j) - 0.5) * 8, p.y],
                    opacity: [0, 0.8, 0.4, 0.8],
                  }}
                  transition={{
                    duration: p.dur,
                    delay: 0.8 + i * 0.35 + p.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Pulse ring inside cube */}
              <motion.circle
                cx={pos.x}
                cy={pos.y - cubeSize * 0.15}
                fill="none"
                stroke={mod.color}
                strokeWidth="0.8"
                initial={{ r: 5, opacity: 0.4 }}
                animate={{ r: cubeSize * 0.5, opacity: 0, strokeWidth: 0.2 }}
                transition={{
                  duration: 3,
                  delay: 2 + i * 0.7,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </motion.g>
          );
        })}
      </svg>

      {/* ── MODULE LABELS (HTML overlay) ── */}
      {modules.map((mod, i) => {
        const pos = positions[i];
        const leftPct = (pos.x / vbW) * 100;
        const topPct = ((pos.y + cubeSize * 1.3) / vbH) * 100;

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
              className={`font-bold tracking-[0.18em] uppercase whitespace-nowrap ${isMobile ? "text-[8px]" : "text-[11px]"}`}
              style={{ color: mod.color, textShadow: `0 0 20px rgba(${mod.glowColor},0.5)` }}
            >
              {mod.label}
            </span>
            <span
              className={`tracking-[0.12em] uppercase whitespace-nowrap opacity-60 ${isMobile ? "text-[6px]" : "text-[8px]"}`}
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
