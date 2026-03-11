import { motion } from "framer-motion";
import { useMemo } from "react";

const modules = [
  { label: "AI CORTEX", angle: 270, color: "#7B61FF", glyph: "M-3-3h6v6h-6z M-1-1h2v2h-2z" },
  { label: "VIRTUAL CARE", angle: 342, color: "#00BFFF", glyph: "M0-4 L3 0 L0 4 L-3 0Z" },
  { label: "CLINIC OS", angle: 54, color: "#9F7AEA", glyph: "M-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" },
  { label: "AUDIT INTEGRITY", angle: 126, color: "#D4616B", glyph: "M0-4 L4 2 L-4 2Z" },
  { label: "SOVEREIGN DATA", angle: 198, color: "#6366F1", glyph: "M-2-3h4l2 3-2 3h-4l-2-3z" },
];

function sr(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// Dense core nodes in concentric rings
function generateCoreNodes(count: number) {
  const nodes: { x: number; y: number; r: number; ring: number; angle: number; phase: number }[] = [];
  const rings = [
    { count: 8, radius: 12, size: 2.2 },
    { count: 14, radius: 28, size: 1.8 },
    { count: 20, radius: 48, size: 1.5 },
    { count: 26, radius: 72, size: 1.2 },
    { count: 32, radius: 100, size: 1.0 },
    { count: 24, radius: 130, size: 0.8 },
  ];

  let idx = 0;
  rings.forEach((ring, ri) => {
    for (let i = 0; i < ring.count && idx < count; i++) {
      const baseAngle = (i / ring.count) * Math.PI * 2 + ri * 0.3;
      const jitter = (sr(idx * 17) - 0.5) * 0.3;
      const rJitter = (sr(idx * 23) - 0.5) * ring.radius * 0.15;
      const angle = baseAngle + jitter;
      const dist = ring.radius + rJitter;
      nodes.push({
        x: 300 + Math.cos(angle) * dist,
        y: 300 + Math.sin(angle) * dist,
        r: ring.size + sr(idx * 41) * 0.8,
        ring: ri,
        angle,
        phase: sr(idx * 67) * Math.PI * 2,
      });
      idx++;
    }
  });
  return nodes;
}

function generateCoreConnections(nodes: { x: number; y: number; ring: number }[]) {
  const conns: { x1: number; y1: number; x2: number; y2: number; strength: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const ringDiff = Math.abs(nodes[i].ring - nodes[j].ring);
      if (d < 45 && ringDiff <= 1 && sr(i * 100 + j) > 0.3) {
        conns.push({
          x1: nodes[i].x, y1: nodes[i].y,
          x2: nodes[j].x, y2: nodes[j].y,
          strength: 1 - d / 45,
        });
      }
    }
  }
  return conns;
}

interface AINetworkHubProps {
  size?: "mobile" | "desktop";
}

const AINetworkHub = ({ size = "desktop" }: AINetworkHubProps) => {
  const isMobile = size === "mobile";
  const { nodes, connections } = useMemo(() => {
    const n = generateCoreNodes(isMobile ? 90 : 124);
    const c = generateCoreConnections(n);
    return { nodes: n, connections: c };
  }, [isMobile]);

  const vb = "0 0 600 600";
  const cx = 300, cy = 300;
  const moduleRadius = isMobile ? 200 : 220;

  return (
    <div className="relative" style={{ width: "100%", maxWidth: isMobile ? 420 : 750 }}>
      <svg viewBox={vb} className="w-full h-auto" style={{ overflow: "visible" }}>
        <defs>
          {/* Multi-layer core glow */}
          <radialGradient id="coreDeep" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(123,97,255,0.6)" />
            <stop offset="30%" stopColor="rgba(99,102,241,0.25)" />
            <stop offset="60%" stopColor="rgba(123,97,255,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="coreHot" cx="50%" cy="50%" r="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="40%" stopColor="rgba(200,180,255,0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="ambientField" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(123,97,255,0.06)" />
            <stop offset="50%" stopColor="rgba(99,102,241,0.03)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Glow filters */}
          <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="lineGlow2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="nodeGlow2" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="moduleGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="particleSoft" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ambient field */}
        <circle cx={cx} cy={cy} r="290" fill="url(#ambientField)" />

        {/* Orbital rings */}
        {[140, 180, 225].map((r, i) => (
          <motion.circle
            key={`orbit-${i}`}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="rgba(123,97,255,0.06)"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60 + i * 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}

        {/* Deep core glow */}
        <motion.circle
          cx={cx} cy={cy} r="130"
          fill="url(#coreDeep)"
          animate={{ r: [125, 140, 125], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Hot inner core */}
        <motion.circle
          cx={cx} cy={cy} r="45"
          fill="url(#coreHot)"
          filter="url(#coreGlow)"
          animate={{ r: [40, 50, 40], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Pulse waves emanating from center */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`wave-${i}`}
            cx={cx} cy={cy}
            fill="none"
            stroke="rgba(123,97,255,0.15)"
            strokeWidth="1"
            initial={{ r: 20, opacity: 0.4 }}
            animate={{ r: 160, opacity: 0 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 1.3,
            }}
          />
        ))}

        {/* Neural connections */}
        <g filter="url(#lineGlow2)">
          {connections.map((c, i) => (
            <motion.line
              key={`c-${i}`}
              x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke={`rgba(180,170,255,${0.15 + c.strength * 0.25})`}
              strokeWidth={0.4 + c.strength * 0.4}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 + (i % 20) * 0.04, ease: "easeOut" }}
            />
          ))}
        </g>

        {/* Core nodes */}
        {nodes.map((node, i) => {
          const brightness = node.ring <= 1 ? 1 : node.ring <= 3 ? 0.7 : 0.4;
          const isInner = node.ring <= 1;
          return (
            <motion.circle
              key={`n-${i}`}
              cx={node.x} cy={node.y} r={node.r}
              fill={isInner ? `rgba(255,255,255,${brightness})` : `rgba(180,170,255,${brightness})`}
              filter={isInner ? "url(#nodeGlow2)" : undefined}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [brightness * 0.5, brightness, brightness * 0.5],
                scale: 1,
              }}
              transition={{
                opacity: { duration: 2 + sr(i * 77) * 2, repeat: Infinity, ease: "easeInOut", delay: sr(i * 33) * 3 },
                scale: { duration: 0.6, delay: 0.2 + sr(i * 11) * 1, ease: "easeOut" },
              }}
            />
          );
        })}

        {/* Center bright star */}
        <motion.circle
          cx={cx} cy={cy} r="4"
          fill="#FFFFFF"
          filter="url(#coreGlow)"
          animate={{ r: [3, 5.5, 3], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx={cx} cy={cy} r="8"
          fill="rgba(200,180,255,0.4)"
          filter="url(#coreGlow)"
          animate={{ r: [6, 10, 6], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Module connection paths */}
        {modules.map((mod, i) => {
          const angle = mod.angle * (Math.PI / 180);
          const startR = 130;
          const sx = cx + Math.cos(angle) * startR;
          const sy = cy + Math.sin(angle) * startR;
          const ex = cx + Math.cos(angle) * moduleRadius;
          const ey = cy + Math.sin(angle) * moduleRadius;
          const ctrl1x = cx + Math.cos(angle) * (startR + 30) + (sr(i * 444) - 0.5) * 20;
          const ctrl1y = cy + Math.sin(angle) * (startR + 30) + (sr(i * 555) - 0.5) * 20;
          const pathD = `M ${sx} ${sy} Q ${ctrl1x} ${ctrl1y} ${ex} ${ey}`;
          const pathId = `modPath-${i}`;

          return (
            <g key={`mp-${i}`}>
              {/* Glowing connection line */}
              <motion.path
                id={pathId}
                d={pathD}
                fill="none"
                stroke={mod.color}
                strokeWidth="1.2"
                strokeLinecap="round"
                filter="url(#lineGlow2)"
                style={{ opacity: 0.4 }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 1.2, delay: 1.5 + i * 0.15, ease: "easeOut" }}
              />

              {/* Traveling pulse */}
              <motion.circle
                r="2.5"
                fill={mod.color}
                filter="url(#particleSoft)"
                animate={{
                  opacity: [0, 0.9, 0.9, 0],
                  offsetDistance: ["0%", "100%"],
                }}
                transition={{
                  duration: 2,
                  delay: 2.5 + i * 0.5,
                  repeat: Infinity,
                  repeatDelay: 2 + sr(i * 777) * 3,
                  ease: "easeInOut",
                }}
                style={{ offsetPath: `path("${pathD}")` }}
              />

              {/* Module node */}
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 2.0 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Outer glow ring */}
                <motion.circle
                  cx={ex} cy={ey} r="22"
                  fill="none"
                  stroke={mod.color}
                  strokeWidth="0.8"
                  style={{ opacity: 0.2 }}
                  filter="url(#moduleGlow)"
                  animate={{ r: [20, 24, 20], opacity: [0.15, 0.3, 0.15] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Glass circle background */}
                <circle
                  cx={ex} cy={ey} r="16"
                  fill="rgba(20,10,40,0.6)"
                  stroke={mod.color}
                  strokeWidth="0.6"
                  style={{ opacity: 0.8 }}
                />

                {/* Module icon */}
                <g transform={`translate(${ex},${ey}) scale(1.2)`}>
                  <path d={mod.glyph} fill={mod.color} style={{ opacity: 0.9 }} />
                </g>

                {/* Inner dot */}
                <circle cx={ex} cy={ey} r="2" fill={mod.color} style={{ opacity: 0.6 }} />
              </motion.g>
            </g>
          );
        })}

        {/* Floating ambient particles */}
        {Array.from({ length: isMobile ? 10 : 18 }).map((_, i) => {
          const angle = sr(i * 37) * Math.PI * 2;
          const dist = 80 + sr(i * 53) * 140;
          const px = cx + Math.cos(angle) * dist;
          const py = cy + Math.sin(angle) * dist;
          return (
            <motion.circle
              key={`fp-${i}`}
              cx={px} cy={py}
              r={0.8 + sr(i * 71) * 1.2}
              fill="rgba(200,190,255,0.5)"
              filter="url(#particleSoft)"
              animate={{
                cx: [px, px + (sr(i * 91) - 0.5) * 30, px],
                cy: [py, py + (sr(i * 113) - 0.5) * 30, py],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 6 + sr(i * 131) * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: sr(i * 151) * 3,
              }}
            />
          );
        })}
      </svg>

      {/* Module labels — positioned over SVG */}
      {modules.map((mod, i) => {
        const angle = mod.angle * (Math.PI / 180);
        const labelDist = isMobile ? 42 : 44;
        const left = 50 + Math.cos(angle) * labelDist;
        const top = 50 + Math.sin(angle) * labelDist;

        // Offset label away from center
        const nudgeX = Math.cos(angle) * (isMobile ? 14 : 18);
        const nudgeY = Math.sin(angle) * (isMobile ? 10 : 14);

        return (
          <motion.div
            key={mod.label}
            className="absolute z-10 pointer-events-none"
            style={{
              left: `calc(${left}% + ${nudgeX}px)`,
              top: `calc(${top}% + ${nudgeY}px)`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 + i * 0.15 }}
          >
            <span
              className={`font-bold tracking-[0.18em] uppercase whitespace-nowrap ${
                isMobile ? "text-[7px]" : "text-[10px]"
              }`}
              style={{ color: mod.color, textShadow: `0 0 12px ${mod.color}40` }}
            >
              {mod.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AINetworkHub;
