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
  { src: aiCortexOrb, alt: "AI Cortex", label: "AI CORTEX", tagline: "Thought, amplified", delay: 1.8 },
  { src: sovereignDataOrb, alt: "Sovereign Data", label: "SOVEREIGN DATA", tagline: "Trust, embedded", delay: 2.0 },
  { src: virtualCareOrb, alt: "Virtual Care", label: "VIRTUAL CARE", tagline: "Connection, redefined", delay: 2.2 },
  { src: auditIntegrityOrb, alt: "Audit Integrity", label: "AUDIT INTEGRITY", tagline: "Compliance, assured", delay: 2.4 },
  { src: clinicOsOrb, alt: "Clinic OS", label: "CLINIC OS", tagline: "Operations, orchestrated", delay: 2.6 },
];

const HeroSection = () => {
  const { x: mouseX, y: mouseY } = useMouseFollow();

  const rotateY = (mouseX - 0.5) * 4;
  const rotateX = (mouseY - 0.5) * -2;

  return (
    <section className="hero-bg min-h-screen relative overflow-hidden">
      {/* ===== ZONE 1: Left — INTELLIGENCE headline ===== */}
      <div className="absolute inset-0 z-30 flex items-center pointer-events-none">
        <div className="w-full max-w-[60%] pl-8 md:pl-16 lg:pl-24">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hero-title text-left"
            style={{ fontSize: "clamp(48px, 10vw, 160px)" }}
          >
            INTELLIGENCE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="hero-subhead mt-6 max-w-md"
          >
            Sovereign AI infrastructure for healthcare systems
          </motion.p>
        </div>
      </div>

      {/* ===== ZONE 2: Right — Brain + contained orbs ===== */}
      <div className="absolute inset-y-0 right-0 w-[55%] md:w-[50%] z-10 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Neural profile — scaled down, "behind the page" feel */}
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
            {/* Neural Plexus overlay — stays within brain boundary */}
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
              style={{ marginTop: "-15%", marginLeft: "-5%" }}
              animate={{ y: [0, -14, 0], scale: [1, 1.015, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <NeuralPlexus mouseX={mouseX} mouseY={mouseY} />
            </motion.div>

            {/* Brain image — reduced size, muted glow */}
            <motion.img
              src={neuralProfile}
              alt="Neural Intelligence Profile"
              className="w-[500px] md:w-[650px] lg:w-[800px] h-auto relative z-10 opacity-85"
              style={{
                filter: "drop-shadow(0 0 80px rgba(123, 97, 255, 0.2)) drop-shadow(0 0 140px rgba(180, 160, 230, 0.15))",
              }}
              animate={{ y: [0, -14, 0], scale: [1, 1.015, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Orbs — tightly clustered around the brain, small and restrained */}
          {orbs.map((orb, i) => {
            // Positions in a tight arc around the brain's right edge
            const positions = [
              { top: "18%", right: "8%" },   // AI Cortex — top right
              { top: "32%", right: "2%" },   // Sovereign Data
              { top: "48%", right: "0%" },   // Virtual Care — mid right
              { top: "64%", right: "2%" },   // Audit Integrity
              { top: "78%", right: "8%" },   // Clinic OS — bottom right
            ];
            return (
              <motion.div
                key={orb.alt}
                className="hidden lg:block absolute z-20"
                style={positions[i]}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: orb.delay, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.img
                  src={orb.src}
                  alt={orb.alt}
                  className="w-[64px] lg:w-[80px] h-auto"
                  style={{
                    filter: "drop-shadow(0 0 20px rgba(123, 97, 255, 0.15))",
                  }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                />
                <motion.div
                  className="text-center mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: orb.delay + 0.8 }}
                >
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/80">
                    {orb.label}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
