import { motion } from "framer-motion";
import { useMemo } from "react";

/* ───── MODULE DATA ───── */
const modules = [
  { label: "AI CORTEX",       icon: "⬡", color: "#A78BFA", angle: -90,  desc: "Neural Engine" },
  { label: "VIRTUAL CARE",    icon: "◈", color: "#60A5FA", angle: -18,  desc: "Telehealth Layer" },
  { label: "CLINIC OS",       icon: "⬢", color: "#818CF8", angle: 54,   desc: "Operations Core" },
  { label: "AUDIT INTEGRITY", icon: "△", color: "#F472B6", angle: 126,  desc: "Compliance Shield" },
  { label: "SOVEREIGN DATA",  icon: "◇", color: "#6366F1", angle: 198,  desc: "Data Vault" },
];

/* ───── SEEDED RANDOM ───── */
function sr(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/* ───── PARTICLE GENERATION ───── */
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const layer = i < count * 0.3 ? 0 : i < count * 0.65 ? 1 : 2;
    const maxR = layer === 0 ? 60 : layer === 1 ? 120 : 180;
    const minR = layer === 0 ? 5 : layer === 1 ? 50 : 110;
    const angle = sr(i * 37) * Math.PI * 2;
    const dist = minR + sr(i * 53) * (maxR - minR);
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      r: layer === 0 ? 1.5 + sr(i * 71) * 1.5 : 0.6 + sr(i * 71) * 1.2,
      layer,
      phase: sr(i * 91) * Math.PI * 2,
      speed: 4 + sr(i * 113) * 6,
      drift: (sr(i * 131) - 0.5) * 40,
    };
  });
}

interface AINetworkHubProps {
  size?: "mobile" | "desktop";
}

const AINetworkHub = ({ size = "desktop" }: AINetworkHubProps) => {
  const isMobile = size === "mobile";
  const particles = useMemo(() => generateParticles(isMobile ? 80 : 160), [isMobile]);

  const containerSize = isMobile ? 380 : 700;
  const cx = 350, cy = 350;
  const moduleRadius = isMobile ? 240 : 260;
  const vb = "0 0 700 700";

  return (
    <div className="relative" style={{ width: "100%", maxWidth: containerSize }}>
      <svg viewBox={vb} className="w-full h-auto" style={{ overflow: "visible" }}>
        <defs>
          {/* ── CORE GRADIENTS ── */}
          <radialGradient id="coreAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(139,92,246,0.35)" />
            <stop offset="35%" stopColor="rgba(99,102,241,0.15)" />
            <stop offset="70%" stopColor="rgba(96,165,250,0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="coreInner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="25%" stopColor="rgba(196,181,253,0.6)" />
            <stop offset="50%" stopColor="rgba(139,92,246,0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="coreMid" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(167,139,250,0.5)" />
            <stop offset="40%" stopColor="rgba(129,140,248,0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="ambientBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(139,92,246,0.08)" />
            <stop offset="60%" stopColor="rgba(99,102,241,0.03)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* ── FILTERS ── */}
          <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feComposite in="b" in2="SourceGraphic" operator="over" />
          </filter>
          <filter id="intenseGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="15" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b2" />
            <feMerge><feMergeNode in="b1" /><feMergeNode in="b2" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="particleGlow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="connectionGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── AMBIENT BACKGROUND ── */}
        <circle cx={cx} cy={cy} r="340" fill="url(#ambientBg)" />

        {/* ── OUTER ENERGY AURA ── */}
        <motion.circle
          cx={cx} cy={cy} r="180"
          fill="url(#coreAura)"
          animate={{ r: [170, 195, 170], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── MIDDLE LAYER ── */}
        <motion.circle
          cx={cx} cy={cy} r="110"
          fill="url(#coreMid)"
          filter="url(#softGlow)"
          animate={{ r: [100, 120, 100], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── PARTICLES (NEURAL FIELD) ── */}
        {particles.map((p, i) => (
          <motion.circle
            key={`p-${i}`}
            r={p.r}
            fill={p.layer === 0 ? "rgba(255,255,255,0.9)" : p.layer === 1 ? "rgba(196,181,253,0.7)" : "rgba(139,92,246,0.5)"}
            filter={p.layer === 0 ? "url(#particleGlow)" : undefined}
            initial={{ cx: cx, cy: cy, opacity: 0 }}
            animate={{
              cx: [cx, cx + p.x + p.drift, cx + p.x - p.drift * 0.5, cx + p.x + p.drift * 0.3, cx + p.x],
              cy: [cy, cy + p.y + p.drift * 0.7, cy + p.y - p.drift * 0.4, cy + p.y + p.drift * 0.6, cy + p.y],
              opacity: [0, p.layer === 0 ? 0.95 : 0.6, p.layer === 0 ? 0.7 : 0.4, p.layer === 0 ? 0.95 : 0.6],
            }}
            transition={{
              cx: { duration: p.speed * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.015 },
              cy: { duration: p.speed * 1.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.015 },
              opacity: { duration: 1.5, delay: i * 0.01, ease: "easeOut" },
            }}
          />
        ))}

        {/* ── INNER NEURAL WEB (organic curves, not straight lines) ── */}
        {Array.from({ length: isMobile ? 12 : 24 }).map((_, i) => {
          const a1 = sr(i * 17) * Math.PI * 2;
          const a2 = a1 + (sr(i * 29) - 0.3) * 1.5;
          const r1 = 20 + sr(i * 37) * 80;
          const r2 = 30 + sr(i * 43) * 90;
          const x1 = cx + Math.cos(a1) * r1;
          const y1 = cy + Math.sin(a1) * r1;
          const x2 = cx + Math.cos(a2) * r2;
          const y2 = cy + Math.sin(a2) * r2;
          const ctrlAngle = (a1 + a2) / 2 + (sr(i * 53) - 0.5) * 0.8;
          const ctrlR = (r1 + r2) / 2 + sr(i * 67) * 30;
          const ctrlX = cx + Math.cos(ctrlAngle) * ctrlR;
          const ctrlY = cy + Math.sin(ctrlAngle) * ctrlR;
          return (
            <motion.path
              key={`web-${i}`}
              d={`M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`}
              fill="none"
              stroke="rgba(196,181,253,0.15)"
              strokeWidth={0.5 + sr(i * 71) * 0.8}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.3, 0.15] }}
              transition={{
                pathLength: { duration: 2, delay: 0.5 + i * 0.08, ease: "easeOut" },
                opacity: { duration: 4, delay: 0.5 + i * 0.08, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          );
        })}

        {/* ── BRIGHT INNER CORE ── */}
        <motion.circle
          cx={cx} cy={cy} r="55"
          fill="url(#coreInner)"
          filter="url(#intenseGlow)"
          animate={{ r: [50, 62, 50], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── CENTER STAR ── */}
        <motion.circle
          cx={cx} cy={cy} r="8"
          fill="white"
          filter="url(#intenseGlow)"
          animate={{ r: [6, 10, 6], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── PULSE RINGS ── */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx={cx} cy={cy}
            fill="none"
            stroke="rgba(167,139,250,0.2)"
            strokeWidth="1.5"
            initial={{ r: 30, opacity: 0.5 }}
            animate={{ r: 200, opacity: 0, strokeWidth: 0.3 }}
            transition={{ duration: 5, delay: i * 1.7, repeat: Infinity, ease: "easeOut" }}
          />
        ))}

        {/* ── ENERGY PATHS TO MODULES ── */}
        {modules.map((mod, i) => {
          const angle = mod.angle * (Math.PI / 180);
          const startR = 90;
          const sx = cx + Math.cos(angle) * startR;
          const sy = cy + Math.sin(angle) * startR;
          const ex = cx + Math.cos(angle) * moduleRadius;
          const ey = cy + Math.sin(angle) * moduleRadius;

          // Organic curved path with two control points
          const perpAngle = angle + Math.PI / 2;
          const spread = 25 + sr(i * 333) * 20;
          const mid1R = startR + (moduleRadius - startR) * 0.35;
          const mid2R = startR + (moduleRadius - startR) * 0.65;
          const c1x = cx + Math.cos(angle) * mid1R + Math.cos(perpAngle) * spread * (sr(i * 77) > 0.5 ? 1 : -1);
          const c1y = cy + Math.sin(angle) * mid1R + Math.sin(perpAngle) * spread * (sr(i * 77) > 0.5 ? 1 : -1);
          const c2x = cx + Math.cos(angle) * mid2R + Math.cos(perpAngle) * spread * 0.5 * (sr(i * 99) > 0.5 ? -1 : 1);
          const c2y = cy + Math.sin(angle) * mid2R + Math.sin(perpAngle) * spread * 0.5 * (sr(i * 99) > 0.5 ? -1 : 1);
          const pathD = `M ${sx} ${sy} C ${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`;

          return (
            <g key={`energy-${i}`}>
              {/* Flowing energy path */}
              <motion.path
                d={pathD}
                fill="none"
                stroke={mod.color}
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#connectionGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.35 }}
                transition={{ duration: 1.8, delay: 1.5 + i * 0.25, ease: "easeOut" }}
              />

              {/* Secondary faint trail */}
              <motion.path
                d={pathD}
                fill="none"
                stroke={mod.color}
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#connectionGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.08 }}
                transition={{ duration: 2, delay: 1.7 + i * 0.25, ease: "easeOut" }}
              />

              {/* Traveling energy pulse */}
              <motion.circle
                r="4"
                fill={mod.color}
                filter="url(#particleGlow)"
                animate={{
                  opacity: [0, 1, 1, 0],
                  offsetDistance: ["0%", "100%"],
                }}
                transition={{
                  duration: 2.5,
                  delay: 3 + i * 0.6,
                  repeat: Infinity,
                  repeatDelay: 3 + sr(i * 777) * 2,
                  ease: "easeInOut",
                }}
                style={{ offsetPath: `path("${pathD}")` }}
              />

              {/* Second trailing pulse */}
              <motion.circle
                r="2"
                fill="white"
                filter="url(#particleGlow)"
                animate={{
                  opacity: [0, 0.7, 0.7, 0],
                  offsetDistance: ["0%", "100%"],
                }}
                transition={{
                  duration: 2.5,
                  delay: 3.3 + i * 0.6,
                  repeat: Infinity,
                  repeatDelay: 3 + sr(i * 777) * 2,
                  ease: "easeInOut",
                }}
                style={{ offsetPath: `path("${pathD}")` }}
              />
            </g>
          );
        })}

        {/* ── MODULE HEXAGON NODES ── */}
        {modules.map((mod, i) => {
          const angle = mod.angle * (Math.PI / 180);
          const mx = cx + Math.cos(angle) * moduleRadius;
          const my = cy + Math.sin(angle) * moduleRadius;
          // Hexagon path (pointy-top)
          const hexR = isMobile ? 26 : 30;
          const hex = Array.from({ length: 6 }, (_, j) => {
            const a = (Math.PI / 3) * j - Math.PI / 6;
            return `${mx + hexR * Math.cos(a)},${my + hexR * Math.sin(a)}`;
          }).join(" ");

          return (
            <motion.g
              key={`mod-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 2.5 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Outer glow hex */}
              <motion.polygon
                points={hex}
                fill="none"
                stroke={mod.color}
                strokeWidth="1"
                filter="url(#connectionGlow)"
                style={{ opacity: 0.25 }}
                animate={{ opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Glass fill hex */}
              <polygon
                points={hex}
                fill="rgba(15,8,30,0.65)"
                stroke={mod.color}
                strokeWidth="0.8"
                style={{ opacity: 0.9 }}
              />

              {/* Inner icon glow */}
              <motion.circle
                cx={mx} cy={my} r="10"
                fill={mod.color}
                style={{ opacity: 0.08 }}
                animate={{ r: [8, 12, 8], opacity: [0.05, 0.12, 0.05] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.g>
          );
        })}
      </svg>

      {/* ── MODULE LABELS (HTML overlay) ── */}
      {modules.map((mod, i) => {
        const angle = mod.angle * (Math.PI / 180);
        const labelDist = isMobile ? 40 : 42;
        const nudge = isMobile ? 20 : 28;
        const left = 50 + Math.cos(angle) * labelDist;
        const top = 50 + Math.sin(angle) * labelDist;
        const nx = Math.cos(angle) * nudge;
        const ny = Math.sin(angle) * nudge;

        return (
          <motion.div
            key={mod.label}
            className="absolute z-10 pointer-events-none flex flex-col items-center gap-0.5"
            style={{
              left: `calc(${left}% + ${nx}px)`,
              top: `calc(${top}% + ${ny}px)`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3 + i * 0.2 }}
          >
            <span
              className={`font-bold tracking-[0.2em] uppercase whitespace-nowrap ${isMobile ? "text-[7px]" : "text-[10px]"}`}
              style={{ color: mod.color, textShadow: `0 0 20px ${mod.color}50` }}
            >
              {mod.label}
            </span>
            <span
              className={`tracking-[0.15em] uppercase whitespace-nowrap ${isMobile ? "text-[5px]" : "text-[7px]"}`}
              style={{ color: `${mod.color}80` }}
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
