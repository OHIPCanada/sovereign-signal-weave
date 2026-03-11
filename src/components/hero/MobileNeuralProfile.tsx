import { useMemo } from "react";
import { motion } from "framer-motion";

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// Human profile silhouette path (facing right, abstract)
const PROFILE_PATH = `
  M 200 50
  C 220 30, 280 20, 310 40
  C 340 60, 360 90, 365 130
  C 370 170, 360 210, 350 240
  C 345 260, 350 280, 355 300
  C 360 320, 370 340, 375 360
  C 380 380, 385 400, 380 420
  C 375 440, 360 455, 340 465
  C 310 480, 280 490, 250 500
  C 220 510, 190 510, 160 505
  C 130 495, 110 480, 100 460
  C 90 440, 85 420, 90 400
  C 95 380, 105 360, 110 340
  C 115 320, 110 300, 105 280
  C 100 260, 95 240, 100 210
  C 105 180, 115 150, 130 120
  C 145 90, 170 65, 200 50
  Z
`;

// Brain region (upper portion of head)
const brainRegion = { cx: 240, cy: 180, rx: 100, ry: 90 };

// Head region for node placement
const headRegions = [
  { cx: 240, cy: 200, rx: 120, ry: 150, weight: 0.5 },
  { cx: 260, cy: 160, rx: 90, ry: 80, weight: 0.3 },
  { cx: 230, cy: 350, rx: 60, ry: 80, weight: 0.1 },
  { cx: 250, cy: 420, rx: 70, ry: 60, weight: 0.1 },
];

interface Node {
  x: number;
  y: number;
  size: number;
  isBrain: boolean;
  isActive: boolean;
}

interface Filament {
  x1: number; y1: number;
  x2: number; y2: number;
  cx: number; cy: number;
}

function isInRegion(x: number, y: number, r: { cx: number; cy: number; rx: number; ry: number }): boolean {
  const dx = (x - r.cx) / r.rx;
  const dy = (y - r.cy) / r.ry;
  return dx * dx + dy * dy <= 1;
}

function isInHead(x: number, y: number): boolean {
  return headRegions.some(r => isInRegion(x, y, r));
}

function isInBrain(x: number, y: number): boolean {
  return isInRegion(x, y, brainRegion);
}

function generateNodes(count: number): Node[] {
  const nodes: Node[] = [];
  let seed = 42;
  let attempts = 0;
  while (nodes.length < count && attempts < count * 12) {
    attempts++;
    seed++;
    const x = seededRandom(seed) * 380 + 60;
    const y = seededRandom(seed + 1000) * 460 + 40;
    if (!isInHead(x, y)) continue;
    const inBrain = isInBrain(x, y);
    if (!inBrain && seededRandom(seed + 2000) > 0.5) continue;
    const isActive = inBrain && seededRandom(seed + 3000) > 0.7;
    const size = inBrain ? 1.5 + seededRandom(seed + 4000) * 3 : 0.8 + seededRandom(seed + 4000) * 1.8;
    nodes.push({ x, y, size, isBrain: inBrain, isActive });
  }
  return nodes;
}

function generateFilaments(nodes: Node[], maxDist: number): Filament[] {
  const filaments: Filament[] = [];
  for (let i = 0; i < nodes.length && filaments.length < 300; i++) {
    for (let j = i + 1; j < nodes.length && filaments.length < 300; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > maxDist) continue;
      const bothBrain = nodes[i].isBrain && nodes[j].isBrain;
      if (seededRandom(i * 1000 + j) > (bothBrain ? 0.3 : 0.6)) continue;
      const mx = (nodes[i].x + nodes[j].x) / 2;
      const my = (nodes[i].y + nodes[j].y) / 2;
      const offset = (seededRandom(i + j * 500) - 0.5) * dist * 0.35;
      const perpX = -(nodes[j].y - nodes[i].y) / dist;
      const perpY = (nodes[j].x - nodes[i].x) / dist;
      filaments.push({
        x1: nodes[i].x, y1: nodes[i].y,
        x2: nodes[j].x, y2: nodes[j].y,
        cx: mx + perpX * offset, cy: my + perpY * offset,
      });
    }
  }
  return filaments;
}

const MobileNeuralProfile = () => {
  const { nodes, filaments } = useMemo(() => {
    const n = generateNodes(200);
    const f = generateFilaments(n, 70);
    return { nodes: n, filaments: f };
  }, []);

  return (
    <motion.svg
      viewBox="0 0 480 550"
      className="w-full max-w-[340px] h-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Clip to profile silhouette */}
        <clipPath id="profileClip">
          <path d={PROFILE_PATH} />
        </clipPath>

        {/* Brain glow */}
        <radialGradient id="mBrainGlow" cx="50%" cy="35%" r="30%">
          <stop offset="0%" stopColor="rgba(123,97,255,0.6)" />
          <stop offset="50%" stopColor="rgba(123,97,255,0.2)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Outer aura */}
        <radialGradient id="mOuterAura" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="rgba(123,97,255,0.12)" />
          <stop offset="60%" stopColor="rgba(200,200,255,0.04)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        <filter id="mFilamentGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        <filter id="mSparkGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        <filter id="mNodeGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Silhouette outer glow */}
        <filter id="profileGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="20" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer aura behind everything */}
      <ellipse cx="240" cy="270" rx="220" ry="260" fill="url(#mOuterAura)" />

      {/* Profile silhouette outline — subtle glow */}
      <motion.path
        d={PROFILE_PATH}
        fill="none"
        stroke="rgba(123,97,255,0.25)"
        strokeWidth="1.5"
        filter="url(#profileGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
      />

      {/* Clipped content inside profile */}
      <g clipPath="url(#profileClip)">
        {/* Brain core glow */}
        <ellipse
          cx={brainRegion.cx}
          cy={brainRegion.cy}
          rx={brainRegion.rx * 1.3}
          ry={brainRegion.ry * 1.3}
          fill="url(#mBrainGlow)"
        />

        {/* Filaments */}
        <g filter="url(#mFilamentGlow)">
          {filaments.map((f, i) => {
            const inBrain = isInBrain(f.x1, f.y1) && isInBrain(f.x2, f.y2);
            return (
              <motion.path
                key={`f-${i}`}
                d={`M ${f.x1} ${f.y1} Q ${f.cx} ${f.cy} ${f.x2} ${f.y2}`}
                fill="none"
                stroke={inBrain ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.25)"}
                strokeWidth={inBrain ? "0.8" : "0.5"}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.8 + (i % 4) * 0.3,
                  delay: 0.8 + (i % 20) * 0.05,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        {nodes.map((node, i) => {
          if (node.isActive) {
            return (
              <motion.circle
                key={`n-${i}`}
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill="#FFFFFF"
                filter="url(#mSparkGlow)"
                animate={{
                  opacity: [0, 1, 0],
                  r: [node.size * 0.5, node.size * 2, node.size * 0.5],
                }}
                transition={{
                  duration: 0.8 + seededRandom(i * 77) * 1,
                  delay: seededRandom(i * 33) * 3,
                  repeat: Infinity,
                  repeatDelay: 0.5 + seededRandom(i * 111) * 2,
                  ease: "easeInOut",
                }}
              />
            );
          }

          const isAccent = node.isBrain && seededRandom(i * 222) > 0.7;
          return (
            <motion.circle
              key={`n-${i}`}
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill={isAccent ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)"}
              filter={isAccent ? "url(#mNodeGlow)" : undefined}
              initial={{ opacity: 0 }}
              animate={{
                opacity: node.isBrain ? [0.3, 0.8, 0.3] : [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 3 + seededRandom(i * 99) * 2,
                delay: seededRandom(i * 55) * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Energy arcs between sparks */}
        {nodes
          .filter(n => n.isActive)
          .slice(0, 6)
          .map((node, i, arr) => {
            const next = arr[(i + 1) % arr.length];
            const mx = (node.x + next.x) / 2 + (seededRandom(i * 777) - 0.5) * 40;
            const my = (node.y + next.y) / 2 + (seededRandom(i * 888) - 0.5) * 40;
            return (
              <motion.path
                key={`arc-${i}`}
                d={`M ${node.x} ${node.y} Q ${mx} ${my} ${next.x} ${next.y}`}
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="0.6"
                filter="url(#mSparkGlow)"
                animate={{ opacity: [0, 0.5, 0], pathLength: [0, 1, 1] }}
                transition={{
                  duration: 2,
                  delay: i * 0.6,
                  repeat: Infinity,
                  repeatDelay: 3 + seededRandom(i * 444) * 5,
                  ease: "easeInOut",
                }}
              />
            );
          })}
      </g>

      {/* Floating breathing animation on whole SVG */}
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0 0; 0 -8; 0 0"
        dur="7s"
        repeatCount="indefinite"
      />
    </motion.svg>
  );
};

export default MobileNeuralProfile;
