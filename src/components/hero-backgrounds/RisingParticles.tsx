import { motion } from "framer-motion";

/** Leadership page — ascending data streams: vertical neural signal columns */
const streams = Array.from({ length: 16 }, (_, i) => ({
  x: 2 + i * 6.2,
  duration: 3.2 + (i % 5) * 1.2,
  delay: (i * 0.85) % 7,
  dotCount: 1 + (i % 2),
  lineOpacity: 0.08 + (i % 3) * 0.04,
}));

const RisingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute inset-0 w-full h-full">
      {streams.map((s, i) => (
        <g key={i}>
          {/* Static background column line */}
          <line
            x1={`${s.x}%`} y1="5%"
            x2={`${s.x}%`} y2="92%"
            stroke={`rgba(200,175,255,${s.lineOpacity})`}
            strokeWidth={0.5}
          />
          {/* Ascending pulse dots */}
          {Array.from({ length: s.dotCount }, (_, j) => (
            <motion.circle
              key={j}
              cx={`${s.x}%`}
              r={1.6}
              fill={`rgba(215,195,255,${0.8 + j * 0.1})`}
              initial={{ cy: "92%", opacity: 0 }}
              animate={{
                cy: ["92%", "5%"],
                opacity: [0, 0.85, 0.65, 0],
              }}
              transition={{
                duration: s.duration,
                repeat: Infinity,
                delay: s.delay + j * (s.duration / (s.dotCount + 1)),
                ease: "linear",
              }}
            />
          ))}
        </g>
      ))}
    </svg>
  </div>
);

export default RisingParticles;
