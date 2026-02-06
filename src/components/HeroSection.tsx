import { motion } from "framer-motion";
import { useMouseFollow } from "@/hooks/useMouseFollow";
import neuralProfile from "@/assets/neural-profile.png";
import aiCortexOrb from "@/assets/ai-cortex-orb.png";
import NeuralPlexus from "@/components/hero/NeuralPlexus";

const capabilityOrbs = [
  {
    label: "CLINICAL OS",
    tagline: "Care, orchestrated",
    top: "58%",
    left: "76%",
    path: "M 1020,520 C 1150,560 1350,600 1470,630",
    delay: 2.0,
  },
  {
    label: "VIRTUAL CARE",
    tagline: "Presence, redefined",
    top: "20%",
    left: "18%",
    path: "M 900,420 C 780,380 600,330 400,280",
    delay: 2.2,
  },
  {
    label: "SOVEREIGN DATA",
    tagline: "Trust, encoded",
    top: "62%",
    left: "15%",
    path: "M 880,520 C 750,560 550,610 370,670",
    delay: 2.4,
  },
  {
    label: "AUDIT INTEGRITY",
    tagline: "Truth, immutable",
    top: "15%",
    left: "74%",
    path: "M 1040,400 C 1150,350 1300,280 1450,220",
    delay: 2.6,
  },
];

const HeroSection = () => {
  const { x: mouseX, y: mouseY } = useMouseFollow();

  const rotateY = (mouseX - 0.5) * 5;
  const rotateX = (mouseY - 0.5) * -3;

  return (
    <section className="hero-bg min-h-screen relative overflow-hidden">
      {/* INTELLIGENCE - Large Background Text */}
      <div className="absolute inset-0 flex items-start justify-center pt-32 md:pt-40 lg:pt-48 pointer-events-none select-none overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-title text-center text-[clamp(110px,16vw,200px)]"
        >
          INTELLIGENCE
        </motion.h1>
      </div>

      {/* Main Composition: Neural Profile + Connected Orb */}
      <div className="absolute inset-0 flex items-center justify-center pt-64 md:pt-80 lg:pt-96">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
            style={{
              transform: `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
              transition: "transform 0.4s ease-out",
            }}
          >
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
              style={{ marginTop: "-15%", marginLeft: "-5%" }}
              animate={{ y: [0, -20, 0], scale: [1, 1.025, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <NeuralPlexus mouseX={mouseX} mouseY={mouseY} />
            </motion.div>

            <motion.img
              src={neuralProfile}
              alt="Neural Intelligence Profile"
              className="w-[900px] md:w-[1200px] lg:w-[1600px] h-auto relative z-10"
              style={{
                filter: "drop-shadow(0 0 120px rgba(123, 97, 255, 0.35)) drop-shadow(0 0 200px rgba(180, 160, 230, 0.3)) drop-shadow(0 0 80px rgba(230, 230, 250, 0.25))",
              }}
              animate={{ y: [0, -20, 0], scale: [1, 1.025, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Full-viewport SVG overlay for all connection lines */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full z-30 pointer-events-none"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="synapse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(180, 160, 255, 0.8)" />
            <stop offset="50%" stopColor="rgba(200, 190, 255, 0.5)" />
            <stop offset="100%" stopColor="rgba(180, 160, 255, 0.4)" />
          </linearGradient>
          <linearGradient id="synapse-gradient-reverse" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(180, 160, 255, 0.8)" />
            <stop offset="50%" stopColor="rgba(200, 190, 255, 0.5)" />
            <stop offset="100%" stopColor="rgba(180, 160, 255, 0.4)" />
          </linearGradient>
          <filter id="dot-glow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* AI Cortex connection line */}
        <motion.path
          d="M 1060,450 C 1150,420 1300,370 1440,380"
          fill="none"
          stroke="url(#synapse-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
        />
        <circle r="4" fill="rgba(200, 180, 255, 0.9)" filter="url(#dot-glow)">
          <animateMotion dur="4s" repeatCount="indefinite" path="M 1060,450 C 1150,420 1300,370 1440,380" />
        </circle>

        {/* Capability orb connection lines */}
        {capabilityOrbs.map((orb, i) => (
          <g key={i}>
            <motion.path
              d={orb.path}
              fill="none"
              stroke={orb.left < "50%" ? "url(#synapse-gradient-reverse)" : "url(#synapse-gradient)"}
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 2, delay: orb.delay, ease: "easeInOut" }}
            />
            <circle r="3" fill="rgba(200, 180, 255, 0.7)" filter="url(#dot-glow)">
              <animateMotion dur={`${5 + i}s`} repeatCount="indefinite" path={orb.path} />
            </circle>
          </g>
        ))}
      </svg>

      {/* AI Cortex Orb (primary - with image) */}
      <motion.div
        className="hidden md:block absolute z-20"
        style={{ top: "32%", left: "72%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={aiCortexOrb}
          alt="AI Cortex"
          className="w-[220px] lg:w-[280px] h-auto"
          style={{
            filter: "drop-shadow(0 0 40px rgba(123, 97, 255, 0.3)) drop-shadow(0 0 80px rgba(46, 230, 214, 0.2))",
          }}
          animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="text-center -mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <p className="text-base font-bold tracking-[0.2em] uppercase text-foreground">
            AI CORTEX
          </p>
          <p className="text-sm font-normal tracking-wide text-foreground/60 mt-0.5">
            Thought, amplified
          </p>
        </motion.div>
      </motion.div>

      {/* Capability Orbs (secondary - node style) */}
      {capabilityOrbs.map((orb, i) => (
        <motion.div
          key={i}
          className="hidden md:block absolute z-20"
          style={{ top: orb.top, left: orb.left }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: orb.delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Outer glow ring */}
            <div
              className="absolute w-16 h-16 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(180, 160, 255, 0.15) 0%, transparent 70%)",
              }}
            />
            {/* Core node */}
            <div
              className="w-8 h-8 rounded-full border border-foreground/10"
              style={{
                background: "radial-gradient(circle at 35% 35%, rgba(220, 210, 255, 0.9), rgba(180, 160, 255, 0.4))",
                boxShadow: "0 0 20px rgba(180, 160, 255, 0.3), 0 0 40px rgba(123, 97, 255, 0.15)",
              }}
            />
          </motion.div>
          <motion.div
            className="text-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: orb.delay + 0.8 }}
          >
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground/80">
              {orb.label}
            </p>
            <p className="text-[11px] font-normal tracking-wide text-foreground/45 mt-0.5">
              {orb.tagline}
            </p>
          </motion.div>
        </motion.div>
      ))}

      {/* Narrative sentence - lower left */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-12 left-8 md:left-16 lg:left-24 pointer-events-none"
      >
        <p className="hero-subhead max-w-md">
          Sovereign AI infrastructure for healthcare systems
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
