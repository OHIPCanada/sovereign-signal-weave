import { motion } from "framer-motion";
import { useMouseFollow } from "@/hooks/useMouseFollow";
import neuralProfile from "@/assets/neural-profile.png";
import aiCortexOrb from "@/assets/ai-cortex-orb.png";
import NeuralPlexus from "@/components/hero/NeuralPlexus";
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

      {/* Main Composition: Neural Profile Image + HUD */}
      <div className="absolute inset-0 flex items-center justify-center pt-64 md:pt-80 lg:pt-96">
        <div className="relative flex items-center gap-4 md:gap-8 lg:gap-12">
          {/* Human image + organic neural plexus overlay */}
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
            {/* Neural Plexus SVG — overlaid on the head */}
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
              style={{ marginTop: "-15%", marginLeft: "-5%" }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.025, 1],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <NeuralPlexus mouseX={mouseX} mouseY={mouseY} />
            </motion.div>

            {/* Human profile image */}
            <motion.img
              src={neuralProfile}
              alt="Neural Intelligence Profile"
              className="w-[900px] md:w-[1200px] lg:w-[1600px] h-auto relative z-10"
              style={{
                filter: "drop-shadow(0 0 120px rgba(123, 97, 255, 0.35)) drop-shadow(0 0 200px rgba(180, 160, 230, 0.3)) drop-shadow(0 0 80px rgba(230, 230, 250, 0.25))",
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.025, 1],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Gradient Connection Line */}
          <svg
            className="hidden md:block absolute z-30 pointer-events-none"
            style={{
              top: "38%",
              left: "52%",
              width: "160px",
              height: "6px",
            }}
          >
            <defs>
              <linearGradient id="brain-link-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(123, 97, 255, 0.9)" />
                <stop offset="50%" stopColor="rgba(46, 230, 214, 1)" />
                <stop offset="100%" stopColor="rgba(180, 160, 255, 0.7)" />
              </linearGradient>
            </defs>
            <motion.line
              x1="0" y1="3" x2="160" y2="3"
              stroke="url(#brain-link-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }}
            />
            <motion.circle
              r="5"
              fill="rgba(46, 230, 214, 1)"
              filter="blur(2px)"
              animate={{ cx: [0, 160, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              cy="3"
            />
          </svg>

          {/* AI Cortex Orb */}
          <motion.div
            className="hidden md:block relative z-20 -ml-16 lg:-ml-20"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src={aiCortexOrb}
              alt="AI Cortex"
              className="w-[180px] lg:w-[240px] h-auto"
              style={{
                filter: "drop-shadow(0 0 40px rgba(123, 97, 255, 0.3)) drop-shadow(0 0 80px rgba(46, 230, 214, 0.2))",
              }}
              animate={{
                y: [0, -12, 0],
                scale: [1, 1.03, 1],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.p
              className="text-center mt-3 text-xs font-mono tracking-widest uppercase text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              AI Cortex
            </motion.p>
          </motion.div>

        </div>
      </div>

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
