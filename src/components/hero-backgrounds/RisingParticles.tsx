import { motion } from "framer-motion";

/** Leadership page — gentle rising dots */
const RisingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 18 }).map((_, i) => {
      const left = 5 + (i * 5.3) % 90;
      const size = 2 + (i % 3) * 1.5;
      const duration = 12 + (i % 5) * 4;
      const delay = (i * 1.3) % 8;
      const opacity = 0.12 + (i % 4) * 0.04;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${left}%`,
            bottom: -10,
            width: size,
            height: size,
            background: `rgba(200,180,255,${opacity})`,
          }}
          animate={{ y: [0, -800], opacity: [0, opacity, opacity, 0] }}
          transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
        />
      );
    })}
  </div>
);

export default RisingParticles;
