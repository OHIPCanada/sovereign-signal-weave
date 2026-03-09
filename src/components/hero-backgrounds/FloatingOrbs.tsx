import { motion } from "framer-motion";

/** Overview page — neural network topology with signal propagation */
const nodes = [
  { x: 12, y: 18 }, { x: 28, y: 44 }, { x: 18, y: 70 },
  { x: 48, y: 12 }, { x: 52, y: 50 }, { x: 42, y: 80 },
  { x: 74, y: 22 }, { x: 80, y: 54 }, { x: 68, y: 76 },
  { x: 90, y: 34 }, { x: 36, y: 32 }, { x: 63, y: 42 },
];

const edges: [number, number][] = [
  [0, 1], [1, 2], [1, 10], [10, 3], [10, 4],
  [3, 6], [4, 11], [4, 5], [6, 9], [6, 11],
  [7, 9], [7, 8], [11, 7], [2, 4],
];

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute inset-0 w-full h-full">
      {/* Static edges */}
      {edges.map(([a, b], i) => (
        <line
          key={`e${i}`}
          x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
          x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
          stroke="rgba(180,150,255,0.22)"
          strokeWidth={0.7}
        />
      ))}

      {/* Signal dots traveling along edges */}
      {edges.map(([a, b], i) => (
        <motion.circle
          key={`s${i}`}
          r={2}
          fill="rgba(215,190,255,0.95)"
          initial={{ cx: `${nodes[a].x}%`, cy: `${nodes[a].y}%`, opacity: 0 }}
          animate={{
            cx: [`${nodes[a].x}%`, `${nodes[b].x}%`],
            cy: [`${nodes[a].y}%`, `${nodes[b].y}%`],
            opacity: [0, 1, 0.9, 0],
          }}
          transition={{
            duration: 2.0,
            repeat: Infinity,
            delay: (i * 0.38 + (i % 5) * 0.55) % 5,
            ease: "easeInOut",
            repeatDelay: 2.8,
          }}
        />
      ))}

      {/* Pulsing nodes */}
      {nodes.map((n, i) => (
        <motion.circle
          key={`n${i}`}
          cx={`${n.x}%`}
          cy={`${n.y}%`}
          r={2.5}
          fill="rgba(170,140,255,0.75)"
          animate={{ r: [2.5, 4.2, 2.5], opacity: [0.55, 1, 0.55] }}
          transition={{
            duration: 2.2 + (i % 4) * 0.55,
            repeat: Infinity,
            delay: i * 0.28,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  </div>
);

export default FloatingOrbs;
