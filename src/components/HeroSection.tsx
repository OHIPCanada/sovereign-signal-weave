import { motion } from "framer-motion";
import { Suspense } from "react";
import BreathingNebula from "./BreathingNebula";

// Technical annotation with connecting line
const TechAnnotation = ({ 
  label, 
  position,
  lineDirection = "left",
  delay = 0
}: { 
  label: string; 
  position: string;
  lineDirection?: "left" | "right";
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay }}
    className={`absolute ${position} pointer-events-none z-20`}
  >
    <div className={`flex items-center gap-3 ${lineDirection === "right" ? "flex-row-reverse" : ""}`}>
      {/* Connecting line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        className="h-[1px] w-16 md:w-24"
        style={{ 
          background: "linear-gradient(90deg, transparent, #00FFFF, #00FFFF)",
          transformOrigin: lineDirection === "left" ? "right" : "left"
        }}
      />
      {/* Label */}
      <span 
        className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em]"
        style={{ color: "rgba(46, 42, 79, 0.7)" }}
      >
        {label}
      </span>
    </div>
  </motion.div>
);

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "#F2F3F4" }}
    >
      {/* Subtle ambient gradients */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(160, 150, 200, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 70%, rgba(200, 180, 180, 0.1) 0%, transparent 50%)
          `
        }}
      />

      {/* INTELLIGENCE - Massive Architectural Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="text-center font-black uppercase tracking-tight"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(80px, 15vw, 220px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 0.85,
            color: "#2E2A4F",
            /* Cropped effect - text extends beyond viewport */
            marginTop: "-5vh"
          }}
        >
          INTELLIGENCE
        </motion.h1>
      </div>

      {/* 3D Breathing Nebula - Layered in front of typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px]"
          style={{ marginTop: "10vh" }}
        >
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div 
                className="w-48 h-48 rounded-full animate-pulse"
                style={{ background: "radial-gradient(circle, rgba(74, 70, 128, 0.3) 0%, transparent 70%)" }}
              />
            </div>
          }>
            <BreathingNebula />
          </Suspense>
        </motion.div>
      </div>

      {/* Orbital signal paths - abstract flow lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
        <motion.svg
          viewBox="0 0 1000 800"
          className="absolute w-[900px] md:w-[1200px] lg:w-[1500px] h-auto opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 1.5 }}
          style={{ marginTop: "8vh" }}
        >
          <defs>
            <linearGradient id="flowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(100, 140, 200, 0)" />
              <stop offset="50%" stopColor="rgba(100, 140, 200, 0.4)" />
              <stop offset="100%" stopColor="rgba(100, 140, 200, 0)" />
            </linearGradient>
            <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(140, 120, 180, 0)" />
              <stop offset="50%" stopColor="rgba(140, 120, 180, 0.35)" />
              <stop offset="100%" stopColor="rgba(140, 120, 180, 0)" />
            </linearGradient>
          </defs>

          {/* Governance flow - upper arc */}
          <motion.path
            d="M 100 350 Q 300 250 500 300 Q 700 350 900 280"
            fill="none"
            stroke="url(#flowGradient1)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 2, ease: "easeOut" }}
          />

          {/* Data lifecycle - lower sweep */}
          <motion.path
            d="M 50 500 Q 250 420 500 450 Q 750 480 950 400"
            fill="none"
            stroke="url(#flowGradient2)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3.5, delay: 2.3, ease: "easeOut" }}
          />

          {/* Orchestration arc */}
          <motion.path
            d="M 200 600 Q 400 500 600 530 Q 800 560 950 500"
            fill="none"
            stroke="url(#flowGradient1)"
            strokeWidth="0.8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.8, delay: 2.6, ease: "easeOut" }}
          />

          {/* Subtle checkpoint nodes */}
          <motion.circle
            cx="500"
            cy="300"
            r="3"
            fill="rgba(100, 140, 200, 0.5)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, delay: 3, repeat: Infinity }}
          />
          <motion.circle
            cx="500"
            cy="450"
            r="2.5"
            fill="rgba(140, 120, 180, 0.5)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, delay: 3.5, repeat: Infinity }}
          />
        </motion.svg>
      </div>

      {/* Technical Annotations - Minimal Monospace */}
      <TechAnnotation 
        label="CLINICAL SYSTEMS" 
        position="top-[42%] left-[5%] md:left-[8%]"
        lineDirection="left"
        delay={2}
      />
      
      <TechAnnotation 
        label="AI CORTEX" 
        position="top-[35%] right-[5%] md:right-[8%]"
        lineDirection="right"
        delay={2.2}
      />
      
      <TechAnnotation 
        label="PATIENT ACCESS" 
        position="bottom-[28%] right-[8%] md:right-[12%]"
        lineDirection="right"
        delay={2.4}
      />
      
      <TechAnnotation 
        label="EMR INTEGRATION" 
        position="bottom-[35%] left-[5%] md:left-[10%]"
        lineDirection="left"
        delay={2.6}
      />
    </section>
  );
};

export default HeroSection;
