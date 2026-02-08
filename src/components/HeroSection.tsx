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

      {/* Orbs positioned around the brain image */}
      {/* AI Cortex - top right of brain */}
      <motion.div
        className="hidden md:block absolute z-20"
        style={{ top: "22%", left: "28%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img src={aiCortexOrb} alt="AI Cortex" className="w-[80px] lg:w-[100px] h-auto"
          style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3))" }}
          animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.p className="text-xs font-bold tracking-[0.15em] uppercase text-foreground text-center mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>AI CORTEX</motion.p>
      </motion.div>

      {/* Sovereign Data - right of brain */}
      <motion.div
        className="hidden md:block absolute z-20"
        style={{ top: "38%", left: "38%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img src={sovereignDataOrb} alt="Sovereign Data" className="w-[80px] lg:w-[100px] h-auto"
          style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3))" }}
          animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        />
        <motion.p className="text-xs font-bold tracking-[0.15em] uppercase text-foreground text-center mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}>SOVEREIGN DATA</motion.p>
      </motion.div>

      {/* Virtual Care - far right */}
      <motion.div
        className="hidden md:block absolute z-20"
        style={{ top: "55%", left: "40%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img src={virtualCareOrb} alt="Virtual Care" className="w-[80px] lg:w-[100px] h-auto"
          style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3))" }}
          animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.p className="text-xs font-bold tracking-[0.15em] uppercase text-foreground text-center mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.0 }}>VIRTUAL CARE</motion.p>
      </motion.div>

      {/* Audit Integrity - bottom right */}
      <motion.div
        className="hidden md:block absolute z-20"
        style={{ top: "70%", left: "34%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img src={auditIntegrityOrb} alt="Audit Integrity" className="w-[80px] lg:w-[100px] h-auto"
          style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3))" }}
          animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}
        />
        <motion.p className="text-xs font-bold tracking-[0.15em] uppercase text-foreground text-center mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }}>AUDIT INTEGRITY</motion.p>
      </motion.div>

      {/* Clinic OS - bottom */}
      <motion.div
        className="hidden md:block absolute z-20"
        style={{ top: "82%", left: "22%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img src={clinicOsOrb} alt="Clinic OS" className="w-[80px] lg:w-[100px] h-auto"
          style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3))" }}
          animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.p className="text-xs font-bold tracking-[0.15em] uppercase text-foreground text-center mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.4 }}>CLINIC OS</motion.p>
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
