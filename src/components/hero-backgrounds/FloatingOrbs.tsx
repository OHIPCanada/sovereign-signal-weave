import { motion } from "framer-motion";

/**
 * Overview page — Neural Pathways
 * Flowing Bézier curves that "draw" themselves across the background like
 * signals propagating through a cortex. Nodes slowly drift/float.
 */

const pathways = [
  { d: "M 80 280 C 280 100, 520 420, 760 200 S 1120 340, 1360 160", duration: 6, delay: 0, opacity: 0.55 },
  { d: "M 60 430 C 260 320, 500 510, 720 390 S 1020 470, 1380 410", duration: 7.5, delay: 2.4, opacity: 0.45 },
  { d: "M 180 100 C 380 220, 600 60, 820 150 S 1080 80, 1260 190", duration: 8, delay: 1.2, opacity: 0.4 },
  { d: "M 60 510 C 300 450, 560 560, 800 490 S 1060 555, 1380 510", duration: 6.5, delay: 3.8, opacity: 0.38 },
  { d: "M 320 40 C 520 160, 720 30, 940 120 S 1180 55, 1360 90", duration: 9, delay: 0.6, opacity: 0.32 },
  { d: "M 680 580 C 820 460, 980 560, 1140 430 S 1280 510, 1440 460", duration: 5.5, delay: 4.8, opacity: 0.4 },
  { d: "M 200 350 C 380 280, 580 400, 780 310 S 1000 390, 1180 310", duration: 7, delay: 1.9, opacity: 0.3 },
];

const hotspots = [
  { x: 760, y: 200, r: 4, delay: 0.2,  dx: 18, dy: -22 },
  { x: 1120, y: 340, r: 5, delay: 2.0, dx: -24, dy: 16 },
  { x: 500, y: 390, r: 3.5, delay: 1.0, dx: 20, dy: 24 },
  { x: 820, y: 150, r: 4, delay: 3.2,  dx: -18, dy: 20 },
  { x: 280, y: 280, r: 3, delay: 4.5,  dx: 22, dy: -18 },
  { x: 1260, y: 190, r: 5, delay: 1.6, dx: -20, dy: 22 },
  { x: 560, y: 490, r: 3.5, delay: 5.1, dx: 16, dy: -20 },
  { x: 1040, y: 80,  r: 4, delay: 2.8, dx: -22, dy: 18 },
  { x: 940, y: 460,  r: 3, delay: 0.9, dx: 20, dy: -16 },
];

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Flowing neural pathways */}
      {pathways.map((p, i) => (
        <motion.path
          key={`p${i}`}
          d={p.d}
          stroke={`rgba(195,165,255,${p.opacity})`}
          strokeWidth={0.9}
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 1],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            times: [0, 0.45, 0.7, 1],
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
            repeatDelay: 1.8,
          }}
        />
      ))}

      {/* Drifting node hotspots */}
      {hotspots.map((h, i) => (
        <motion.g
          key={`h${i}`}
          animate={{
            x: [0, h.dx, -h.dx * 0.6, h.dx * 0.4, 0],
            y: [0, h.dy, h.dy * 0.5, -h.dy * 0.4, 0],
          }}
          transition={{
            duration: 14 + i * 2.1,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut",
          }}
        >
          {/* Outer pulse ring */}
          <motion.circle
            cx={h.x}
            cy={h.y}
            r={h.r + 5}
            fill="none"
            stroke="rgba(185,155,255,0.35)"
            strokeWidth={0.8}
            animate={{ r: [h.r + 5, h.r + 13, h.r + 5], opacity: [0.35, 0.65, 0.35] }}
            transition={{
              duration: 3.2 + i * 0.45,
              repeat: Infinity,
              delay: h.delay,
              ease: "easeInOut",
            }}
          />
          {/* Core dot */}
          <motion.circle
            cx={h.x}
            cy={h.y}
            r={h.r}
            fill="rgba(210,185,255,0.75)"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2.5 + (i % 3) * 0.6,
              repeat: Infinity,
              delay: h.delay + 0.3,
              ease: "easeInOut",
            }}
          />
        </motion.g>
      ))}
    </svg>
  </div>
);

export default FloatingOrbs;
