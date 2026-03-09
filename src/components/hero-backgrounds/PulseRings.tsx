import { motion } from "framer-motion";

/** Careers page — AI radar sweep: rotating conic scan + concentric rings + blips */
const blips = [
  { x: 52, y: 38, delay: 1.4 },
  { x: 34, y: 63, delay: 4.1 },
  { x: 67, y: 55, delay: 7.2 },
  { x: 46, y: 27, delay: 2.6 },
  { x: 72, y: 34, delay: 9.8 },
  { x: 28, y: 48, delay: 5.3 },
  { x: 59, y: 71, delay: 11.0 },
  { x: 82, y: 62, delay: 3.7 },
];

const PulseRings = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
    {/* Concentric range rings */}
    {[140, 260, 380, 500, 620].map((size, i) => (
      <div
        key={i}
        className="absolute rounded-full border"
        style={{
          width: size,
          height: size,
          borderColor: `rgba(160,120,255,${0.25 - i * 0.04})`,
        }}
      />
    ))}

    {/* Rotating sweep arm (conic gradient) */}
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 620,
        height: 620,
        background:
          "conic-gradient(rgba(143,83,255,0.30) 0deg, rgba(143,83,255,0.10) 50deg, transparent 80deg, transparent 360deg)",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />

    {/* Trailing glow behind sweep */}
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 620,
        height: 620,
        background:
          "conic-gradient(transparent 0deg, rgba(143,83,255,0.06) 60deg, rgba(143,83,255,0.18) 80deg, transparent 90deg, transparent 360deg)",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />

    {/* Center crosshair */}
    <div className="absolute" style={{ width: 28, height: 28 }}>
      <div
        className="absolute top-1/2 left-0 right-0 h-px"
        style={{ background: "rgba(190,155,255,0.55)", transform: "translateY(-50%)" }}
      />
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px"
        style={{ background: "rgba(190,155,255,0.55)", transform: "translateX(-50%)" }}
      />
    </div>
    <div
      className="absolute w-2 h-2 rounded-full"
      style={{ background: "rgba(210,180,255,0.95)", boxShadow: "0 0 8px 3px rgba(160,120,255,0.5)" }}
    />

    {/* Radar blip pings */}
    <svg className="absolute inset-0 w-full h-full">
      {blips.map((b, i) => (
        <motion.circle
          key={i}
          cx={`${b.x}%`}
          cy={`${b.y}%`}
          fill="rgba(210,180,255,0.9)"
          initial={{ r: 0, opacity: 0 }}
          animate={{ r: [0, 3.5, 2, 0], opacity: [0, 1, 0.7, 0] }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            delay: b.delay,
            repeatDelay: 13,
          }}
        />
      ))}
    </svg>
  </div>
);

export default PulseRings;
