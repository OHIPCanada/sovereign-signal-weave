import { motion } from "framer-motion";

/** Overview page — slow drifting gradient orbs */
const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[
      { x: "15%", y: "20%", size: 320, color: "rgba(123,97,255,0.08)", duration: 18, dx: 40, dy: 30 },
      { x: "70%", y: "60%", size: 260, color: "rgba(212,97,107,0.06)", duration: 22, dx: -35, dy: -25 },
      { x: "45%", y: "35%", size: 200, color: "rgba(255,192,174,0.07)", duration: 25, dx: 25, dy: -40 },
      { x: "80%", y: "15%", size: 180, color: "rgba(143,83,255,0.05)", duration: 20, dx: -30, dy: 35 },
    ].map((orb, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          left: orb.x,
          top: orb.y,
          width: orb.size,
          height: orb.size,
          background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, orb.dx, -orb.dx * 0.5, 0],
          y: [0, orb.dy, -orb.dy * 0.7, 0],
        }}
        transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}
  </div>
);

export default FloatingOrbs;
