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

      {/* SVG lines from brain center to each orb — subtle, infrastructural */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full z-[5] pointer-events-none"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="synapse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
          </linearGradient>
          <filter id="dot-glow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Brain origin: 630, 480 — all lines radiate from here */}
        {/* Orb column at x=1500, evenly spaced: y = 270, 410, 550, 690, 830 */}

        {[270, 410, 550, 690, 830].map((y, i) => (
          <g key={i}>
            <motion.path
              d={`M 630,480 Q ${1060 + i * 10},${380 + (y - 550) * 0.3} 1500,${y}`}
              fill="none"
              stroke="url(#synapse-gradient)"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 1.5, delay: 1.8 + i * 0.15, ease: "easeInOut" }}
            />
            <circle r="2.5" fill="rgba(255, 255, 255, 0.5)" filter="url(#dot-glow)">
              <animateMotion
                dur={`${6 + i}s`}
                repeatCount="indefinite"
                path={`M 630,480 Q ${1060 + i * 10},${380 + (y - 550) * 0.3} 1500,${y}`}
              />
            </circle>
          </g>
        ))}
      </svg>

      {/* Orb column — single vertical axis at right: 78%, evenly spaced */}
      {[
        { src: aiCortexOrb, alt: "AI Cortex", label: "AI CORTEX", tag: "Thought, amplified", top: "22%" },
        { src: sovereignDataOrb, alt: "Sovereign Data", label: "SOVEREIGN DATA", tag: "Trust, embedded", top: "35%" },
        { src: virtualCareOrb, alt: "Virtual Care", label: "VIRTUAL CARE", tag: "Connection, redefined", top: "48%" },
        { src: auditIntegrityOrb, alt: "Audit Integrity", label: "AUDIT INTEGRITY", tag: "Compliance, assured", top: "61%" },
        { src: clinicOsOrb, alt: "Clinic OS", label: "CLINIC OS", tag: "Operations, orchestrated", top: "74%" },
      ].map((orb, i) => (
        <motion.div
          key={orb.label}
          className="hidden md:block absolute z-20"
          style={{ top: orb.top, left: "78%" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={orb.src}
            alt={orb.alt}
            className="w-[80px] lg:w-[100px] h-auto mx-auto"
            style={{ filter: "drop-shadow(0 0 20px rgba(123, 97, 255, 0.15))" }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
          <motion.div className="text-center mt-1" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 2.5 + i * 0.15 }}>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-foreground/70">{orb.label}</p>
            <p className="text-[10px] tracking-wide text-foreground/40 mt-0.5">{orb.tag}</p>
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
