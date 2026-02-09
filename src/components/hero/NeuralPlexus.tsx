import { useMemo } from "react";
import { motion } from "framer-motion";

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

const headRegions = [
  { cx: 360, cy: 380, rx: 200, ry: 260, weight: 0.4 },
  { cx: 480, cy: 400, rx: 140, ry: 200, weight: 0.25 },
  { cx: 420, cy: 260, rx: 160, ry: 100, weight: 0.15 },
  { cx: 440, cy: 560, rx: 80, ry: 80, weight: 0.1 },
  { cx: 390, cy: 660, rx: 60, ry: 100, weight: 0.1 },
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
    if (!inBrain && seededRandom(seed + 2000) > 0.55) continue;

    // Sparse thinking sparks — only in brain, rare
    const isActive = inBrain && seededRandom(seed + 3000) > 0.82;
    const size = inBrain
      ? 1.2 + seededRandom(seed + 4000) * 2.8
      : 0.6 + seededRandom(seed + 4000) * 1.6;

    nodes.push({ x, y, size, isBrain: inBrain, isActive });
  }

  return nodes;
}

function generateFilaments(nodes: Node[], maxDist: number): Filament[] {
  const filaments: Filament[] = [];
  const maxConnections = 500;

  for (let i = 0; i < nodes.length && filaments.length < maxConnections; i++) {
    for (let j = i + 1; j < nodes.length && filaments.length < maxConnections; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > maxDist) continue;

      const bothBrain = nodes[i].isBrain && nodes[j].isBrain;
      const threshold = bothBrain ? 0.25 : 0.65;
      if (seededRandom(i * 1000 + j) > threshold) continue;

      // Organic curved midpoint — perpendicular bend like biological axons
      const mx = (nodes[i].x + nodes[j].x) / 2;
      const my = (nodes[i].y + nodes[j].y) / 2;
      const bendStrength = dist * 0.4;
      const offset = (seededRandom(i + j * 500) - 0.5) * bendStrength;
      const perpX = -(nodes[j].y - nodes[i].y) / dist;
      const perpY = (nodes[j].x - nodes[i].x) / dist;

      filaments.push({
        x1: nodes[i].x,
        y1: nodes[i].y,
        x2: nodes[j].x,
        y2: nodes[j].y,
        cx: mx + perpX * offset,
        cy: my + perpY * offset,
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
    const n = generateNodes(320);
    const f = generateFilaments(n, 85);
    return { nodes: n, filaments: f };
  }, []);

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
        className="w-[600px] md:w-[750px] lg:w-[900px] h-auto"
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Warm lavender-coral brain core glow */}
          <radialGradient id="brainCoreGlow" cx="48%" cy="35%" r="22%">
            <stop offset="0%" stopColor="rgba(255,245,230,0.9)" />
            <stop offset="35%" stopColor="rgba(255,235,210,0.4)" />
            <stop offset="70%" stopColor="rgba(255,240,220,0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Outer warm aura */}
          <radialGradient id="warmAura" cx="48%" cy="40%" r="45%">
            <stop offset="0%" stopColor="rgba(255,240,220,0.2)" />
            <stop offset="50%" stopColor="rgba(255,235,210,0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Filament glow */}
          <filter id="filamentGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Thinking spark glow — Bio-Electric Blue */}
          <filter id="sparkGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Coral node glow */}
          <filter id="coralGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Warm outer aura */}
        <ellipse cx="400" cy="400" rx="320" ry="380" fill="url(#warmAura)" />

        {/* Brain core lavender-coral bloom */}
        <ellipse
          cx={brainRegion.cx}
          cy={brainRegion.cy}
          rx={brainRegion.rx * 1.2}
          ry={brainRegion.ry * 1.2}
          fill="url(#brainCoreGlow)"
        />

        {/* Filaments — organic axons in Sovereign Lavender */}
        <g filter="url(#filamentGlow)">
          {filaments.map((f, i) => {
            const isBrainFilament =
              isInBrain(f.x1, f.y1) && isInBrain(f.x2, f.y2);
            return (
              <motion.path
                key={`f-${i}`}
                d={`M ${f.x1} ${f.y1} Q ${f.cx} ${f.cy} ${f.x2} ${f.y2}`}
                fill="none"
                stroke={
                  isBrainFilament
                    ? "rgba(255,240,220,0.5)"
                    : "rgba(255,235,210,0.2)"
                }
                strokeWidth={isBrainFilament ? "0.8" : "0.5"}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2 + (i % 4) * 0.4,
                  delay: 0.5 + (i % 25) * 0.04,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </g>

        {/* Nodes — lavender luminous points with coral accents */}
        {nodes.map((node, i) => {
          if (node.isActive) {
            // Rare "thinking sparks" in Bio-Electric Blue
            return (
              <motion.circle
                key={`n-${i}`}
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill="#FFF5E6"
                filter="url(#sparkGlow)"
                animate={{
                  opacity: [0, 0.9, 0],
                  r: [node.size * 0.5, node.size * 1.6, node.size * 0.5],
                }}
                transition={{
                  duration: 1.5 + seededRandom(i * 77) * 2,
                  delay: seededRandom(i * 33) * 6,
                  repeat: Infinity,
                  repeatDelay: 2 + seededRandom(i * 111) * 5,
                  ease: "easeInOut",
                }}
              />
            );
          }

          // ~30% of brain nodes get coral tint for warmth
          const isCoral = node.isBrain && seededRandom(i * 222) > 0.7;

          return (
            <motion.circle
              key={`n-${i}`}
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill={isCoral ? "rgba(255,225,195,0.9)" : "rgba(255,240,220,0.85)"}
              filter={isCoral && node.isBrain ? "url(#coralGlow)" : undefined}
              initial={{ opacity: 0 }}
              animate={{
                opacity: node.isBrain
                  ? [0.3, 0.8, 0.3]
                  : [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 3 + seededRandom(i * 99) * 2.5,
                delay: seededRandom(i * 55) * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Rare energy arcs between thinking sparks */}
        {nodes
          .filter((n) => n.isActive)
          .slice(0, 8)
          .map((node, i, arr) => {
            const next = arr[(i + 1) % arr.length];
            const mx = (node.x + next.x) / 2 + (seededRandom(i * 777) - 0.5) * 50;
            const my = (node.y + next.y) / 2 + (seededRandom(i * 888) - 0.5) * 50;
            return (
              <motion.path
                key={`arc-${i}`}
                d={`M ${node.x} ${node.y} Q ${mx} ${my} ${next.x} ${next.y}`}
                fill="none"
                stroke="#FFF0D6"
                strokeWidth="0.6"
                strokeLinecap="round"
                filter="url(#sparkGlow)"
                animate={{
                  opacity: [0, 0.5, 0],
                  pathLength: [0, 1, 1],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.6,
                  repeat: Infinity,
                  repeatDelay: 4 + seededRandom(i * 444) * 6,
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
