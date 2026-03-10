import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/** Hexagonal Grid — Deployment hero: hex pattern with pulsing nodes and scanning line */
const HexGridBackground = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.5 }}>
        <defs>
          <pattern id="hexGrid" width="60" height="52" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="rgba(123,97,255,0.15)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="hexFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="hexMask">
            <rect width="100%" height="100%" fill="url(#hexFade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexGrid)" mask="url(#hexMask)" />
        {mounted && Array.from({ length: 12 }).map((_, i) => (
          <motion.circle
            key={i}
            cx={`${10 + (i % 4) * 25}%`}
            cy={`${15 + Math.floor(i / 4) * 30}%`}
            r="4"
            fill="rgba(212,97,107,0.6)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 2, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
          />
        ))}
        {mounted && Array.from({ length: 6 }).map((_, i) => {
          const x1 = 10 + (i % 4) * 25;
          const y1 = 15 + Math.floor(i / 4) * 30;
          const x2 = 10 + ((i + 1) % 4) * 25;
          const y2 = 15 + Math.floor((i + 1) / 4) * 30;
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${x1}%`} y1={`${y1}%`}
              x2={`${x2}%`} y2={`${y2}%`}
              stroke="rgba(123,97,255,0.12)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
            />
          );
        })}
      </svg>

      {mounted && (
        <>
          <motion.div className="absolute rounded-full" style={{ width: 300, height: 300, top: "10%", left: "60%", background: "radial-gradient(circle, rgba(91,31,166,0.25) 0%, transparent 70%)", filter: "blur(60px)" }} animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.2, 0.9, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute rounded-full" style={{ width: 200, height: 200, bottom: "15%", left: "15%", background: "radial-gradient(circle, rgba(212,97,107,0.2) 0%, transparent 70%)", filter: "blur(50px)" }} animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0], scale: [1, 0.85, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute rounded-full" style={{ width: 150, height: 150, top: "40%", right: "10%", background: "radial-gradient(circle, rgba(123,97,255,0.2) 0%, transparent 70%)", filter: "blur(40px)" }} animate={{ x: [0, 20, -10, 0], y: [0, -20, 30, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        </>
      )}

      {mounted && (
        <motion.div className="absolute left-0 right-0" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(123,97,255,0.3), rgba(212,97,107,0.3), transparent)", boxShadow: "0 0 20px rgba(123,97,255,0.2)" }} animate={{ top: ["0%", "100%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
      )}
    </div>
  );
};

export default HexGridBackground;
