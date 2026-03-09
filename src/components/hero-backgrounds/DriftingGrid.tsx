import { motion } from "framer-motion";

/** Contact page — signal graph: network nodes with animated packet routing */
const nodes = [
  { x: 18, y: 22 }, { x: 50, y: 16 }, { x: 82, y: 22 },
  { x: 10, y: 56 }, { x: 42, y: 50 }, { x: 74, y: 56 },
  { x: 26, y: 84 }, { x: 65, y: 84 },
];

const connections: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 5],
  [3, 4], [4, 5], [3, 6], [5, 7], [4, 6], [4, 7],
];

const DriftingGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.6 }}>
    <svg className="absolute inset-0 w-full h-full">
      {/* Connection lines */}
      {connections.map(([a, b], i) => (
        <line
          key={`e${i}`}
          x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
          x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
          stroke="rgba(180,150,255,0.22)"
          strokeWidth={0.7}
        />
      ))}

      {/* Signal packet pulses */}
      {connections.map(([a, b], i) => (
        <motion.circle
          key={`p${i}`}
          r={2.2}
          fill="rgba(215,190,255,0.95)"
          initial={{ cx: `${nodes[a].x}%`, cy: `${nodes[a].y}%`, opacity: 0 }}
          animate={{
            cx: [`${nodes[a].x}%`, `${nodes[b].x}%`],
            cy: [`${nodes[a].y}%`, `${nodes[b].y}%`],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.42 + (i % 4) * 0.65,
            ease: "easeInOut",
            repeatDelay: 3.8,
          }}
        />
      ))}

      {/* Nodes — outer pulse ring + inner dot */}
      {nodes.map((n, i) => (
        <g key={`n${i}`}>
          <motion.circle
            cx={`${n.x}%`}
            cy={`${n.y}%`}
            r={5}
            fill="none"
            stroke="rgba(175,145,255,0.35)"
            strokeWidth={1}
            animate={{ r: [5, 8, 5], opacity: [0.35, 0.65, 0.35] }}
            transition={{
              duration: 2.6 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.38,
              ease: "easeInOut",
            }}
          />
          <circle
            cx={`${n.x}%`}
            cy={`${n.y}%`}
            r={2.5}
            fill="rgba(190,160,255,0.85)"
          />
        </g>
      ))}
    </svg>
  </div>
);

export default DriftingGrid;
