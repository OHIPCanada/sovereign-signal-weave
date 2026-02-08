import { motion } from "framer-motion";
import { useMouseFollow } from "@/hooks/useMouseFollow";
import neuralProfile from "@/assets/neural-profile.png";
import aiCortexOrb from "@/assets/ai-cortex-orb-new.png";
import clinicOsOrb from "@/assets/clinic-os-orb-new.png";
import virtualCareOrb from "@/assets/virtual-care-orb.png";
import sovereignDataOrb from "@/assets/sovereign-data-orb.png";
import auditIntegrityOrb from "@/assets/audit-integrity-orb.png";
import NeuralPlexus from "@/components/hero/NeuralPlexus";
const HeroSection = () => {
  const { x: mouseX, y: mouseY } = useMouseFollow();

  const rotateY = (mouseX - 0.5) * 5;
  const rotateX = (mouseY - 0.5) * -3;

  return (
    <section className="hero-bg min-h-screen relative overflow-hidden">
      {/* INTELLIGENCE - Large Background Text */}
      <div className="absolute inset-0 flex items-start justify-center pt-20 md:pt-24 lg:pt-32 pointer-events-none select-none overflow-hidden">
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
      <div className="absolute inset-0 flex items-center justify-center pt-64 md:pt-80 lg:pt-96 -ml-48 md:-ml-72 lg:-ml-96">
        <div className="relative">
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
        </div>
      </div>

      {/* Full-viewport SVG overlay for precise line from brain to orb */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full z-[5] pointer-events-none"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="synapse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.7)" />
          </linearGradient>
          <filter id="dot-glow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* All branches radiate from brain center (350, 420) */}

        {/* Branch to AI Cortex */}
        <motion.path
          d="M 350,420 C 550,400 900,350 1200,340 C 1320,336 1400,350 1440,360"
          fill="none" stroke="url(#synapse-gradient)" strokeWidth="1.8" strokeLinecap="round" filter="url(#line-glow)"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.8, ease: "easeInOut" }}
        />
        <circle r="4" fill="rgba(255, 255, 255, 1)" filter="url(#dot-glow)">
          <animateMotion dur="5s" repeatCount="indefinite" path="M 350,420 C 550,400 900,350 1200,340 C 1320,336 1400,350 1440,360" />
        </circle>

        {/* Branch to Sovereign Data */}
        <motion.path
          d="M 350,420 C 600,425 950,450 1300,470 C 1450,478 1550,485 1600,490"
          fill="none" stroke="url(#synapse-gradient)" strokeWidth="1.8" strokeLinecap="round" filter="url(#line-glow)"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.0, ease: "easeInOut" }}
        />
        <circle r="4" fill="rgba(255, 255, 255, 1)" filter="url(#dot-glow)">
          <animateMotion dur="5s" repeatCount="indefinite" path="M 350,420 C 600,425 950,450 1300,470 C 1450,478 1550,485 1600,490" />
        </circle>

        {/* Branch to Virtual Care */}
        <motion.path
          d="M 350,420 C 580,450 950,530 1300,580 C 1450,600 1570,615 1640,620"
          fill="none" stroke="url(#synapse-gradient)" strokeWidth="1.8" strokeLinecap="round" filter="url(#line-glow)"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.2, ease: "easeInOut" }}
        />
        <circle r="4" fill="rgba(255, 255, 255, 1)" filter="url(#dot-glow)">
          <animateMotion dur="5s" repeatCount="indefinite" path="M 350,420 C 580,450 950,530 1300,580 C 1450,600 1570,615 1640,620" />
        </circle>

        {/* Branch to Audit Integrity */}
        <motion.path
          d="M 350,420 C 550,470 900,620 1200,700 C 1380,740 1520,748 1600,750"
          fill="none" stroke="url(#synapse-gradient)" strokeWidth="1.8" strokeLinecap="round" filter="url(#line-glow)"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.4, ease: "easeInOut" }}
        />
        <circle r="4" fill="rgba(255, 255, 255, 1)" filter="url(#dot-glow)">
          <animateMotion dur="5s" repeatCount="indefinite" path="M 350,420 C 550,470 900,620 1200,700 C 1380,740 1520,748 1600,750" />
        </circle>

        {/* Branch to Clinic OS */}
        <motion.path
          d="M 350,420 C 500,500 850,720 1100,810 C 1260,860 1370,878 1440,880"
          fill="none" stroke="url(#synapse-gradient)" strokeWidth="1.8" strokeLinecap="round" filter="url(#line-glow)"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.6, ease: "easeInOut" }}
        />
        <circle r="4" fill="rgba(255, 255, 255, 1)" filter="url(#dot-glow)">
          <animateMotion dur="5s" repeatCount="indefinite" path="M 350,420 C 500,500 850,720 1100,810 C 1260,860 1370,878 1440,880" />
        </circle>
      </svg>

      {/* AI Cortex Orb (top) */}
      <motion.div
        className="hidden md:block absolute z-20"
        style={{ top: "28%", left: "72%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={aiCortexOrb}
          alt="AI Cortex"
          className="w-[100px] lg:w-[120px] h-auto"
          style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3)) drop-shadow(0 0 60px rgba(46, 230, 214, 0.2))" }}
          animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div className="text-center -mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
          <p className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">AI CORTEX</p>
          <p className="text-xs font-normal tracking-wide text-foreground/60 mt-0.5">Thought, amplified</p>
        </motion.div>
      </motion.div>

      {/* Sovereign Data Orb (upper-right) */}
      <motion.div
        className="hidden md:block absolute z-20"
        style={{ top: "40%", left: "80%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={sovereignDataOrb}
          alt="Sovereign Data"
          className="w-[100px] lg:w-[120px] h-auto"
          style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3)) drop-shadow(0 0 60px rgba(46, 230, 214, 0.2))" }}
          animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        />
        <motion.div className="text-center -mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}>
          <p className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">SOVEREIGN DATA</p>
          <p className="text-xs font-normal tracking-wide text-foreground/60 mt-0.5">Trust, embedded</p>
        </motion.div>
      </motion.div>

      {/* Virtual Care Orb (middle-right) */}
      <motion.div
        className="hidden md:block absolute z-20"
        style={{ top: "52%", left: "82%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={virtualCareOrb}
          alt="Virtual Care"
          className="w-[100px] lg:w-[120px] h-auto"
          style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3)) drop-shadow(0 0 60px rgba(46, 230, 214, 0.2))" }}
          animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div className="text-center -mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }}>
          <p className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">VIRTUAL CARE</p>
          <p className="text-xs font-normal tracking-wide text-foreground/60 mt-0.5">Connection, redefined</p>
        </motion.div>
      </motion.div>

      {/* Audit Integrity Orb (lower-right) */}
      <motion.div
        className="hidden md:block absolute z-20"
        style={{ top: "64%", left: "80%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={auditIntegrityOrb}
          alt="Audit Integrity"
          className="w-[100px] lg:w-[120px] h-auto"
          style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3)) drop-shadow(0 0 60px rgba(46, 230, 214, 0.2))" }}
          animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}
        />
        <motion.div className="text-center -mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.3 }}>
          <p className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">AUDIT INTEGRITY</p>
          <p className="text-xs font-normal tracking-wide text-foreground/60 mt-0.5">Compliance, assured</p>
        </motion.div>
      </motion.div>

      {/* Clinic OS Orb (bottom) */}
      <motion.div
        className="hidden md:block absolute z-20"
        style={{ top: "76%", left: "72%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={clinicOsOrb}
          alt="Clinic OS"
          className="w-[100px] lg:w-[120px] h-auto"
          style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3)) drop-shadow(0 0 60px rgba(46, 230, 214, 0.2))" }}
          animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div className="text-center -mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.6 }}>
          <p className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">CLINIC OS</p>
          <p className="text-xs font-normal tracking-wide text-foreground/60 mt-0.5">Operations, orchestrated</p>
        </motion.div>
      </motion.div>

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
