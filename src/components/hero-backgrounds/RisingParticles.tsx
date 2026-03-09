import { motion } from "framer-motion";

/** Leadership page — gentle rising dots */
const RisingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 22 }).map((_, i) => {
      const left = 5 + (i * 4.3) % 90;
      const size = 2.5 + (i % 3) * 2;
      const duration = 10 + (i % 5) * 3;
      const delay = (i * 1.1) % 8;
      const opacity = 0.35 + (i % 4) * 0.1;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${left}%`,
            bottom: -10,
            width: size,
            height: size,
            background: `rgba(210,190,255,${opacity})`,
          }}
          animate={{ y: [0, -900], opacity: [0, opacity, opacity * 0.8, 0] }}
          transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
        />
      );
    })}
  </div>
);

export default RisingParticles;
