import { motion } from "framer-motion";

/** Contact page — slow diagonal drifting grid lines */
const DriftingGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.35 }}>
    <motion.svg
      width="100%"
      height="100%"
      className="absolute inset-0"
      animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <pattern id="drift-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(200,180,255,1)" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="200%" height="200%" x="-50%" y="-50%" fill="url(#drift-grid)" />
    </motion.svg>
  </div>
);

export default DriftingGrid;
