import { motion } from "framer-motion";

/** Careers page — expanding concentric pulse rings */
const PulseRings = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
    {[0, 2.5, 5, 7.5].map((delay, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border"
        style={{
          borderColor: `rgba(143,83,255,${0.06 - i * 0.01})`,
          width: 80,
          height: 80,
        }}
        animate={{ scale: [1, 8], opacity: [0.15, 0] }}
        transition={{ duration: 10, repeat: Infinity, delay, ease: "easeOut" }}
      />
    ))}
  </div>
);

export default PulseRings;
