import { motion } from "framer-motion";
import { useMemo } from "react";

// ─── Module definitions ───
const modules = [
  { label: "AI CORTEX", icon: "⬡", angle: 270 },
  { label: "VIRTUAL CARE", icon: "◈", angle: 342 },
  { label: "CLINIC OS", icon: "⬢", angle: 54 },
  { label: "AUDIT INTEGRITY", icon: "◇", angle: 126 },
  { label: "SOVEREIGN DATA", icon: "◉", angle: 198 },
];

// Seeded random for deterministic layout
function sr(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// Generate core hub nodes
function generateHubNodes(count: number) {
  const nodes: { x: number; y: number; r: number; layer: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = sr(i * 7) * Math.PI * 2;
    const dist = sr(i * 13) * 80 + (sr(i * 31) > 0.6 ? 20 : 0);
    nodes.push({
      x: 250 + Math.cos(angle) * dist,
      y: 250 + Math.sin(angle) * dist,
      r: 1 + sr(i * 19) * 2.5,
      layer: dist < 40 ? 0 : dist < 65 ? 1 : 2,
    });
  }
  return nodes;
}

// Generate connections between nearby nodes
function generateConnections(nodes: { x: number; y: number }[]) {
  const conns: { x1: number; y1: number; x2: number; y2: number; dist: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 50 && sr(i * 100 + j) > 0.35) {
        conns.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[j].x, y2: nodes[j].y, dist });
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
    const n = generateHubNodes(isMobile ? 60 : 80);
    const c = generateConnections(n);
    return { nodes: n, connections: c };
  }, [isMobile]);

  const viewBox = "0 0 500 500";
  const moduleRadius = isMobile ? 165 : 195;
  const cx = 250;
  const cy = 250;

  return (
    <div className="relative" style={{ width: "100%", maxWidth: isMobile ? 380 : 700 }}>
      <svg viewBox={viewBox} className="w-full h-auto" style={{ overflow: "visible" }}>
        <defs>
          {/* Core glow */}
          <radialGradient id="hubCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(123,97,255,0.4)" />
            <stop offset="40%" stopColor="rgba(123,97,255,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Ambient background */}
          <radialGradient id="hubAmbient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(123,97,255,0.08)" />
            <stop offset="70%" stopColor="rgba(100,80,200,0.03)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Line glow filter */}
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node glow filter */}
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Pulse ring filter */}
          <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle glow */}
          <filter id="particleGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient background glow */}
        <circle cx={cx} cy={cy} r="240" fill="url(#hubAmbient)" />

        {/* Breathing pulse rings */}
        {[60, 90, 120].map((r, i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(123,97,255,0.12)"
            strokeWidth="0.5"
            filter="url(#pulseGlow)"
            animate={{
              r: [r, r + 8, r],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}

        {/* Core glow */}
        <motion.circle
          cx={cx}
          cy={cy}
          r="50"
          fill="url(#hubCoreGlow)"
          animate={{ r: [50, 58, 50], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Internal connections */}
        <g filter="url(#lineGlow)">
          {connections.map((c, i) => (
            <motion.line
              key={`conn-${i}`}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke="rgba(180,160,255,0.35)"
              strokeWidth="0.6"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.5 + (i % 15) * 0.08,
                ease: "easeOut",
              }}
            />
          ))}
        </g>

        {/* Hub nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={node.layer === 0 ? "#FFFFFF" : node.layer === 1 ? "rgba(200,180,255,0.9)" : "rgba(160,140,220,0.6)"}
            filter={node.layer === 0 ? "url(#nodeGlow)" : undefined}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: node.layer === 0 ? [0.6, 1, 0.6] : [0.3, 0.7, 0.3],
              scale: 1,
            }}
            transition={{
              opacity: { duration: 3 + sr(i * 77) * 2, repeat: Infinity, ease: "easeInOut", delay: sr(i * 33) * 2 },
              scale: { duration: 0.8, delay: 0.3 + sr(i * 11) * 1.5, ease: "easeOut" },
            }}
          />
        ))}

        {/* Connection lines from hub to modules */}
        {modules.map((mod, i) => {
          const angle = mod.angle * (Math.PI / 180);
          const endX = cx + Math.cos(angle) * moduleRadius;
          const endY = cy + Math.sin(angle) * moduleRadius;
          // Slightly curved path
          const midX = cx + Math.cos(angle) * (moduleRadius * 0.55) + (sr(i * 444) - 0.5) * 15;
          const midY = cy + Math.sin(angle) * (moduleRadius * 0.55) + (sr(i * 555) - 0.5) * 15;

          return (
            <g key={`mod-line-${i}`}>
              {/* Connection line */}
              <motion.path
                d={`M ${cx} ${cy} Q ${midX} ${midY} ${endX} ${endY}`}
                fill="none"
                stroke="rgba(123,97,255,0.3)"
                strokeWidth="1"
                strokeLinecap="round"
                filter="url(#lineGlow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 1.2 + i * 0.2, ease: "easeOut" }}
              />

              {/* Traveling particle */}
              <motion.circle
                r="2"
                fill="#FFFFFF"
                filter="url(#particleGlow)"
                animate={{
                  opacity: [0, 1, 1, 0],
                  offsetDistance: ["0%", "100%"],
                }}
                transition={{
                  duration: 2.5,
                  delay: 2.5 + i * 0.6,
                  repeat: Infinity,
                  repeatDelay: 3 + sr(i * 999) * 4,
                  ease: "easeInOut",
                }}
                style={{
                  offsetPath: `path("M ${cx} ${cy} Q ${midX} ${midY} ${endX} ${endY}")`,
                }}
              />

              {/* Endpoint dot */}
              <motion.circle
                cx={endX}
                cy={endY}
                r="3"
                fill="rgba(123,97,255,0.8)"
                filter="url(#nodeGlow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 2.0 + i * 0.2, ease: "easeOut" }}
              />
            </g>
          );
        })}

        {/* Center bright core node */}
        <motion.circle
          cx={cx}
          cy={cy}
          r="5"
          fill="#FFFFFF"
          filter="url(#nodeGlow)"
          animate={{ r: [4, 6, 4], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Module cards - positioned absolutely around the SVG */}
      {modules.map((mod, i) => {
        const angle = mod.angle * (Math.PI / 180);
        const cardDist = isMobile ? 46 : 48; // percentage from center
        const left = 50 + Math.cos(angle) * cardDist;
        const top = 50 + Math.sin(angle) * cardDist;

        return (
          <motion.div
            key={mod.label}
            className="absolute z-10 flex flex-col items-center pointer-events-none"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 2.2 + i * 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Glass card */}
            <div
              className={`
                flex flex-col items-center gap-1 rounded-xl border
                ${isMobile ? "px-2.5 py-2" : "px-4 py-3"}
              `}
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderColor: "rgba(255,255,255,0.15)",
                boxShadow: "0 4px 20px rgba(123,97,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <span className={`${isMobile ? "text-base" : "text-lg"} leading-none`}>
                {mod.icon}
              </span>
              <span
                className={`font-bold tracking-[0.14em] uppercase text-foreground whitespace-nowrap leading-tight ${
                  isMobile ? "text-[8px]" : "text-[10px]"
                }`}
              >
                {mod.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AINetworkHub;
