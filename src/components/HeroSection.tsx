import { motion } from "framer-motion";
import { useMouseFollow } from "@/hooks/useMouseFollow";
import neuralProfile from "@/assets/neural-profile.png";
import aiCortexOrb from "@/assets/ai-cortex-orb-new.png";
import clinicOsOrb from "@/assets/clinic-os-orb-new.png";
import virtualCareOrb from "@/assets/virtual-care-orb.png";
import sovereignDataOrb from "@/assets/sovereign-data-orb.png";
import auditIntegrityOrb from "@/assets/audit-integrity-orb.png";
import NeuralPlexus from "@/components/hero/NeuralPlexus";

const orbs = [
  { src: aiCortexOrb, alt: "AI Cortex", label: "AI CORTEX", delay: 2.0 },
  { src: sovereignDataOrb, alt: "Sovereign Data", label: "SOVEREIGN DATA", delay: 2.2 },
  { src: virtualCareOrb, alt: "Virtual Care", label: "VIRTUAL CARE", delay: 2.4 },
  { src: auditIntegrityOrb, alt: "Audit Integrity", label: "AUDIT INTEGRITY", delay: 2.6 },
  { src: clinicOsOrb, alt: "Clinic OS", label: "CLINIC OS", delay: 2.8 },
];

const HeroSection = () => {
  const { x: mouseX, y: mouseY } = useMouseFollow();

  const rotateY = (mouseX - 0.5) * 4;
  const rotateX = (mouseY - 0.5) * -2;

  return (
    <section className="hero-bg min-h-screen relative overflow-hidden flex flex-col">
      {/* ===== TIER 1: INTELLIGENCE headline — top, dominant, unobstructed ===== */}
      <div className="relative z-30 pt-28 md:pt-32 lg:pt-36 px-8 md:px-16 lg:px-24">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-title text-center"
        >
          INTELLIGENCE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="hero-subhead mt-6 text-center mx-auto max-w-lg"
        >
          Sovereign AI infrastructure for healthcare systems
        </motion.p>
      </div>

      {/* ===== TIER 2: Brain — centered below headline, calm, contained ===== */}
      <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none mt-8 md:mt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
          style={{
            transform: `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
            transition: "transform 0.4s ease-out",
          }}
        >
          {/* Neural Plexus overlay — contained within brain boundary */}
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{ marginTop: "-15%", marginLeft: "-5%" }}
            animate={{ y: [0, -10, 0], scale: [1, 1.01, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <NeuralPlexus mouseX={mouseX} mouseY={mouseY} />
          </motion.div>

          {/* Brain image — supportive scale, soft presence */}
          <motion.img
            src={neuralProfile}
            alt="Neural Intelligence Profile"
            className="w-[350px] md:w-[450px] lg:w-[550px] h-auto relative z-10 opacity-80"
            style={{
              filter: "drop-shadow(0 0 60px rgba(123, 97, 255, 0.15)) drop-shadow(0 0 120px rgba(180, 160, 230, 0.1))",
            }}
            animate={{ y: [0, -10, 0], scale: [1, 1.01, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* ===== TIER 3: Orbs — quiet vertical column, far right ===== */}
      <div className="hidden lg:flex absolute right-8 xl:right-12 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-8 pointer-events-none">
        {orbs.map((orb, i) => (
          <motion.div
            key={orb.alt}
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ duration: 0.8, delay: orb.delay, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src={orb.src}
              alt={orb.alt}
              className="w-[48px] h-auto"
              style={{
                filter: "drop-shadow(0 0 12px rgba(123, 97, 255, 0.1))",
              }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            />
            <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-foreground/50 mt-1.5">
              {orb.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
