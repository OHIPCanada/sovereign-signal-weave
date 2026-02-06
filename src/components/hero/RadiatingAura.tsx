import { motion } from "framer-motion";

/**
 * Concentric light rings + radial energy rays emanating from the neural profile's core.
 * Represents "pulses of understanding, trust, and care" flowing outward.
 */
const RadiatingAura = () => {
  const rings = [
    { delay: 0, size: 300, duration: 4 },
    { delay: 1.2, size: 500, duration: 5 },
    { delay: 2.4, size: 700, duration: 6 },
    { delay: 3.6, size: 900, duration: 7 },
  ];

  const rays = Array.from({ length: 12 }, (_, i) => ({
    angle: (i * 30) + 15,
    length: 250 + (i % 3) * 80,
    delay: i * 0.3,
    opacity: 0.08 + (i % 2) * 0.04,
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Concentric expanding rings — "pulses of understanding" */}
      {rings.map((ring, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full"
          style={{
            width: ring.size,
            height: ring.size,
            border: "1px solid rgba(255, 240, 220, 0.15)",
            background: `radial-gradient(circle, transparent 60%, rgba(255, 245, 230, 0.04) 100%)`,
          }}
          animate={{
            scale: [0.3, 1.2],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: ring.duration,
            delay: ring.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Radial light rays — intelligence flowing outward */}
      <svg
        viewBox="-500 -500 1000 1000"
        className="absolute w-[900px] h-[900px] md:w-[1200px] md:h-[1200px]"
        style={{ opacity: 0.6 }}
      >
        <defs>
          <linearGradient id="rayGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 245, 230, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 245, 230, 0)" />
          </linearGradient>
        </defs>
        {rays.map((ray, i) => {
          const rad = (ray.angle * Math.PI) / 180;
          const x2 = Math.cos(rad) * ray.length;
          const y2 = Math.sin(rad) * ray.length;
          return (
            <motion.line
              key={`ray-${i}`}
              x1={0}
              y1={0}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 240, 220, 0.12)"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{
                opacity: [0, ray.opacity, 0],
                strokeWidth: [0.5, 2, 0.5],
              }}
              transition={{
                duration: 3,
                delay: ray.delay,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>

      {/* Central luminous core — "white-hot center of thought" */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          background: `radial-gradient(circle,
            rgba(255, 250, 240, 0.5) 0%,
            rgba(255, 240, 220, 0.25) 30%,
            rgba(235, 200, 170, 0.1) 60%,
            transparent 100%
          )`,
          filter: "blur(20px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Warm empathy halo — the "personal, empathetic" feeling */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background: `radial-gradient(circle,
            rgba(235, 170, 140, 0.12) 0%,
            rgba(220, 160, 140, 0.06) 40%,
            transparent 70%
          )`,
          filter: "blur(30px)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default RadiatingAura;
