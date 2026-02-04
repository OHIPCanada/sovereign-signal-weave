import { motion } from "framer-motion";
import heroBrain from "@/assets/hero-brain.png";

// Signal node component - small glowing checkpoint circles
const SignalNode = ({ 
  cx, 
  cy, 
  delay = 0,
  size = 4 
}: { 
  cx: number; 
  cy: number; 
  delay?: number;
  size?: number;
}) => (
  <motion.circle
    cx={cx}
    cy={cy}
    r={size}
    fill="rgba(180, 170, 220, 0.4)"
    initial={{ opacity: 0.2, scale: 0.8 }}
    animate={{ 
      opacity: [0.2, 0.5, 0.2],
      scale: [0.8, 1.1, 0.8]
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      filter: "blur(0.5px)"
    }}
  />
);

const HeroSection = () => {
  return (
    <section className="hero-bg min-h-screen">

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

      {/* Healthcare Process Signal Lines - Orbital Paths */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-64 md:pt-80 lg:pt-96">
        <motion.svg
          viewBox="0 0 1200 900"
          className="absolute w-[1000px] md:w-[1400px] lg:w-[1800px] h-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Gradient for lines - fades toward edges */}
            <linearGradient id="signalGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(170, 160, 210, 0)" />
              <stop offset="30%" stopColor="rgba(170, 160, 210, 0.25)" />
              <stop offset="70%" stopColor="rgba(170, 160, 210, 0.25)" />
              <stop offset="100%" stopColor="rgba(170, 160, 210, 0)" />
            </linearGradient>
            <linearGradient id="signalGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(160, 180, 220, 0)" />
              <stop offset="40%" stopColor="rgba(160, 180, 220, 0.2)" />
              <stop offset="60%" stopColor="rgba(160, 180, 220, 0.2)" />
              <stop offset="100%" stopColor="rgba(160, 180, 220, 0)" />
            </linearGradient>
            <linearGradient id="signalGradient3" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(180, 165, 215, 0)" />
              <stop offset="35%" stopColor="rgba(180, 165, 215, 0.18)" />
              <stop offset="65%" stopColor="rgba(180, 165, 215, 0.18)" />
              <stop offset="100%" stopColor="rgba(180, 165, 215, 0)" />
            </linearGradient>
            
            {/* Glow filter for paths near brain center */}
            <filter id="signalGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Clinical Workflow Path - Upper left to lower right curve */}
          <motion.path
            d="M 100 320 Q 300 280 450 350 Q 600 420 750 380 Q 900 340 1100 400"
            fill="none"
            stroke="url(#signalGradient1)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 1.5, ease: "easeOut" }}
            filter="url(#signalGlow)"
          />
          
          {/* Patient Data Lifecycle - Sweeping arc through center */}
          <motion.path
            d="M 150 500 Q 350 350 600 380 Q 850 410 1050 280"
            fill="none"
            stroke="url(#signalGradient2)"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3.5, delay: 1.8, ease: "easeOut" }}
            filter="url(#signalGlow)"
          />
          
          {/* AI Governance Path - Lower arc */}
          <motion.path
            d="M 80 580 Q 280 520 480 560 Q 680 600 880 520 Q 1000 470 1120 510"
            fill="none"
            stroke="url(#signalGradient3)"
            strokeWidth="1.3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3.2, delay: 2, ease: "easeOut" }}
            filter="url(#signalGlow)"
          />

          {/* Decision Orchestration - Upper subtle arc */}
          <motion.path
            d="M 200 250 Q 400 200 600 260 Q 800 320 1000 240"
            fill="none"
            stroke="url(#signalGradient1)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.8, delay: 2.2, ease: "easeOut" }}
            style={{ opacity: 0.6 }}
          />

          {/* Secondary governance flow - right side */}
          <motion.path
            d="M 700 200 Q 850 280 900 400 Q 950 520 1100 600"
            fill="none"
            stroke="url(#signalGradient2)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 2.4, ease: "easeOut" }}
            style={{ opacity: 0.5 }}
          />

          {/* Left ascending data flow */}
          <motion.path
            d="M 100 650 Q 200 550 300 480 Q 400 410 500 350"
            fill="none"
            stroke="url(#signalGradient3)"
            strokeWidth="1.1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 2.6, ease: "easeOut" }}
            style={{ opacity: 0.55 }}
          />

          {/* System Checkpoint Nodes */}
          {/* EMR checkpoint */}
          <SignalNode cx={450} cy={350} delay={2} size={5} />
          {/* Telehealth node */}
          <SignalNode cx={750} cy={380} delay={2.5} size={4} />
          {/* Patient access node */}
          <SignalNode cx={600} cy={380} delay={3} size={4.5} />
          {/* Governance checkpoint */}
          <SignalNode cx={480} cy={560} delay={2.8} size={4} />
          {/* Data lifecycle node */}
          <SignalNode cx={850} cy={410} delay={3.2} size={3.5} />
          {/* Upper flow node */}
          <SignalNode cx={600} cy={260} delay={3.5} size={3} />
          {/* Left ascending node */}
          <SignalNode cx={300} cy={480} delay={2.4} size={3.5} />
          {/* Right descending node */}
          <SignalNode cx={900} cy={400} delay={3} size={4} />
        </motion.svg>
      </div>

      {/* Central Brain Image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-64 md:pt-80 lg:pt-96">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <motion.img
            src={heroBrain}
            alt="AI Brain - Clinical Systems and Virtual Care"
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="hero-brain w-[960px] md:w-[1440px] lg:w-[1800px] xl:w-[2100px] h-auto"
          />
        </motion.div>
      </div>

      {/* Floating Labels */}
      {/* AI Cortex - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute top-[35%] right-[8%] md:right-[12%] lg:right-[18%] pointer-events-none"
      >
        <div className="floating-label">
          <span className="floating-label-text">AI Cortex</span>
        </div>
      </motion.div>

      {/* Clinical Systems - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="absolute bottom-[32%] left-[5%] md:left-[10%] lg:left-[15%] pointer-events-none"
      >
        <div className="floating-label">
          <span className="floating-label-text">Clinical Systems</span>
        </div>
      </motion.div>

      {/* Virtual Care & Patient Access - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-[22%] right-[5%] md:right-[8%] lg:right-[12%] pointer-events-none"
      >
        <div className="floating-label text-right">
          <span className="floating-label-text block">Virtual Care</span>
          <span className="floating-label-subtext">& Patient Access</span>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
