import { useMemo } from "react";
import { motion } from "framer-motion";

// Seeded random for deterministic node placement
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

interface Node {
  x: number;
  y: number;
  size: number;
  isBrain: boolean;
  isActive: boolean;
}

interface Filament {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
}

// Right-facing head profile regions (viewBox 0 0 800 900)
const headRegions = [
  { cx: 360, cy: 380, rx: 200, ry: 260, weight: 0.4 }, // back of head
  { cx: 480, cy: 400, rx: 140, ry: 200, weight: 0.25 }, // face front
  { cx: 420, cy: 260, rx: 160, ry: 100, weight: 0.15 }, // forehead
  { cx: 440, cy: 560, rx: 80, ry: 80, weight: 0.1 },   // jaw
  { cx: 390, cy: 660, rx: 60, ry: 100, weight: 0.1 },   // neck
];

const brainRegion = { cx: 380, cy: 310, rx: 130, ry: 110 };

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

  while (nodes.length < count && attempts < count * 10) {
    attempts++;
    seed++;
    const x = seededRandom(seed) * 700 + 50;
    const y = seededRandom(seed + 1000) * 800 + 50;

    if (!isInHead(x, y)) continue;

    const inBrain = isInBrain(x, y);

    // Higher acceptance rate in brain region for density
    if (!inBrain && seededRandom(seed + 2000) > 0.6) continue;

    const isActive = inBrain && seededRandom(seed + 3000) > 0.65;
    const size = inBrain
      ? 1.5 + seededRandom(seed + 4000) * 2.5
      : 0.8 + seededRandom(seed + 4000) * 1.8;

    nodes.push({ x, y, size, isBrain: inBrain, isActive });
  }

  return nodes;
}

function generateFilaments(nodes: Node[], maxDist: number): Filament[] {
  const filaments: Filament[] = [];
  const maxConnections = 400;

  for (let i = 0; i < nodes.length && filaments.length < maxConnections; i++) {
    for (let j = i + 1; j < nodes.length && filaments.length < maxConnections; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > maxDist) continue;

      // Connect more densely in brain region
      const bothBrain = nodes[i].isBrain && nodes[j].isBrain;
      const threshold = bothBrain ? 0.3 : 0.7;

      if (seededRandom(i * 1000 + j) > threshold) continue;

      // Curved midpoint (slight organic bend)
      const mx = (nodes[i].x + nodes[j].x) / 2;
      const my = (nodes[i].y + nodes[j].y) / 2;
      const offset = (seededRandom(i + j * 500) - 0.5) * 30;

      filaments.push({
        x1: nodes[i].x,
        y1: nodes[i].y,
        x2: nodes[j].x,
        y2: nodes[j].y,
        cx: mx + offset,
        cy: my + offset,
      });
    }
  }

  return filaments;
}

interface NeuralPlexusProps {
  mouseX: number;
  mouseY: number;
}

const NeuralPlexus = ({ mouseX, mouseY }: NeuralPlexusProps) => {
  const { nodes, filaments } = useMemo(() => {
    const n = generateNodes(280);
    const f = generateFilaments(n, 80);
    return { nodes: n, filaments: f };
  }, []);

  // Subtle rotation based on mouse (2-6 degrees)
  const rotateY = (mouseX - 0.5) * 6;
  const rotateX = (mouseY - 0.5) * -3;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
        transition: "transform 0.4s ease-out",
      }}
    >
      <motion.svg
        viewBox="0 0 800 900"
        className="w-[500px] md:w-[600px] lg:w-[700px] h-auto"
        animate={{
          scale: [1, 1.015, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Brain core glow */}
          <radialGradient id="brainCoreGlow" cx="48%" cy="35%" r="20%">
            <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#E6E6FA" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#E6E6FA" stopOpacity="0" />
          </radialGradient>

          {/* Fresnel rim glow */}
          <radialGradient id="rimGlow" cx="50%" cy="50%" r="55%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="90%" stopColor="#E6E6FA" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#E6E6FA" stopOpacity="0.06" />
          </radialGradient>

          {/* Filament glow filter */}
          <filter id="filamentGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Active node glow */}
          <filter id="activeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Brain core internal glow */}
        <ellipse
          cx={brainRegion.cx}
          cy={brainRegion.cy}
          rx={brainRegion.rx}
          ry={brainRegion.ry}
          fill="url(#brainCoreGlow)"
        />

        {/* Rim glow for silhouette edge */}
        <ellipse cx="400" cy="400" rx="280" ry="340" fill="url(#rimGlow)" />

        {/* Filaments - ultra-thin curved connections */}
        <g filter="url(#filamentGlow)">
          {filaments.map((f, i) => (
            <motion.path
              key={`f-${i}`}
              d={`M ${f.x1} ${f.y1} Q ${f.cx} ${f.cy} ${f.x2} ${f.y2}`}
              fill="none"
              stroke="#800080"
              strokeWidth="0.6"
              strokeOpacity="0.15"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2 + (i % 3) * 0.5,
                delay: 0.8 + (i % 20) * 0.05,
                ease: "easeOut",
              }}
            />
          ))}
        </g>

        {/* Nodes - tiny glass spheres */}
        {nodes.map((node, i) => (
          <g key={`n-${i}`}>
            {node.isActive ? (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill="#7B61FF"
                filter="url(#activeGlow)"
                animate={{
                  opacity: [0.1, 1, 0.1],
                  r: [node.size * 0.8, node.size * 1.3, node.size * 0.8],
                }}
                transition={{
                  duration: 2 + seededRandom(i * 77) * 3,
                  delay: seededRandom(i * 33) * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ) : (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill="#E6E6FA"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: node.isBrain
                    ? [0.3, 0.7, 0.3]
                    : [0.15, 0.4, 0.15],
                }}
                transition={{
                  duration: 3 + seededRandom(i * 99) * 2,
                  delay: seededRandom(i * 55) * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </g>
        ))}

        {/* Energy arcs between active brain nodes */}
        {nodes
          .filter((n) => n.isActive)
          .slice(0, 15)
          .map((node, i, arr) => {
            const next = arr[(i + 1) % arr.length];
            const mx = (node.x + next.x) / 2 + (seededRandom(i * 777) - 0.5) * 40;
            const my = (node.y + next.y) / 2 + (seededRandom(i * 888) - 0.5) * 40;
            return (
              <motion.path
                key={`arc-${i}`}
                d={`M ${node.x} ${node.y} Q ${mx} ${my} ${next.x} ${next.y}`}
                fill="none"
                stroke="#7B61FF"
                strokeWidth="0.8"
                strokeLinecap="round"
                filter="url(#activeGlow)"
                animate={{
                  opacity: [0, 0.6, 0],
                  pathLength: [0, 1, 1],
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.4,
                  repeat: Infinity,
                  repeatDelay: 3 + seededRandom(i * 444) * 4,
                  ease: "easeInOut",
                }}
              />
            );
          })}
      </motion.svg>
    </motion.div>
  );
};

export default NeuralPlexus;
