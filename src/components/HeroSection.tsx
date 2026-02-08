import { motion } from "framer-motion";
import GlowingBrain from "@/components/hero/GlowingBrain";
import aiCortexOrb from "@/assets/ai-cortex-orb-new.png";
import clinicOsOrb from "@/assets/clinic-os-orb-new.png";
import virtualCareOrb from "@/assets/virtual-care-orb.png";
import sovereignDataOrb from "@/assets/sovereign-data-orb.png";
import auditIntegrityOrb from "@/assets/audit-integrity-orb.png";

const orbs = [
  { src: aiCortexOrb, alt: "AI Cortex", label: "AI CORTEX", angle: -72, delay: 1.8 },
  { src: sovereignDataOrb, alt: "Sovereign Data", label: "SOVEREIGN DATA", angle: -18, delay: 2.0 },
  { src: virtualCareOrb, alt: "Virtual Care", label: "VIRTUAL CARE", angle: 36, delay: 2.2 },
  { src: auditIntegrityOrb, alt: "Audit Integrity", label: "AUDIT INTEGRITY", angle: 90, delay: 2.4 },
  { src: clinicOsOrb, alt: "Clinic OS", label: "CLINIC OS", angle: 144, delay: 2.6 },
];

const HeroSection = () => {
  // Orbit radius for orbs around center
  const orbitRadius = { base: 180, md: 240, lg: 280 };

  return (
    <section className="hero-bg min-h-screen relative overflow-hidden flex flex-col items-center justify-center">
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

      {/* Centered brain + orbs constellation */}
      <div className="relative z-10 mt-16 md:mt-24">
        {/* Glowing Brain SVG */}
        <div className="flex items-center justify-center">
          <GlowingBrain />
        </div>

        {/* Orbs positioned in a circle around the brain */}
        {orbs.map((orb, i) => {
          const angleRad = (orb.angle * Math.PI) / 180;
          return (
            <motion.div
              key={orb.alt}
              className="absolute z-20 flex flex-col items-center"
              style={{
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) translate(${Math.cos(angleRad) * orbitRadius.lg}px, ${Math.sin(angleRad) * orbitRadius.lg}px)`,
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: orb.delay, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.img
                src={orb.src}
                alt={orb.alt}
                className="w-[70px] md:w-[80px] lg:w-[90px] h-auto"
                style={{
                  filter:
                    "drop-shadow(0 0 20px rgba(123, 97, 255, 0.3)) drop-shadow(0 0 40px rgba(46, 230, 214, 0.15))",
                }}
                animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
              <motion.p
                className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase text-foreground mt-2 whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: orb.delay + 0.5 }}
              >
                {orb.label}
              </motion.p>
            </motion.div>
          );
        })}
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
