import { motion } from "framer-motion";

/** Careers page — expanding concentric pulse rings */
const PulseRings = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
    {[0, 2.3, 4.6, 7, 9.3, 11.6].map((delay, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border"
        style={{
          borderColor: `rgba(180,140,255,${0.5 - i * 0.06})`,
          width: 100,
          height: 100,
        }}
        animate={{ scale: [1, 10], opacity: [0.6, 0] }}
        transition={{ duration: 14, repeat: Infinity, delay, ease: "easeOut" }}
      />
    ))}
  </div>
);

export default PulseRings;
