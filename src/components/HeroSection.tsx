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
  { src: aiCortexOrb, alt: "AI Cortex", label: "AI CORTEX", delay: 1.8 },
  { src: sovereignDataOrb, alt: "Sovereign Data", label: "SOVEREIGN DATA", delay: 2.0 },
  { src: virtualCareOrb, alt: "Virtual Care", label: "VIRTUAL CARE", delay: 2.2 },
  { src: auditIntegrityOrb, alt: "Audit Integrity", label: "AUDIT INTEGRITY", delay: 2.4 },
  { src: clinicOsOrb, alt: "Clinic OS", label: "CLINIC OS", delay: 2.6 },
];

// Place orbs in an arc from ~200° to ~340° (left arc around brain)
const orbAngles = [-130, -80, -30, 20, 70]; // degrees, spread evenly in arc
const orbRadius = 550; // distance from center — at glow edge

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
          className="hero-title text-center text-[clamp(140px,20vw,260px)]"
        >
          INTELLIGENCE
        </motion.h1>
      </div>

      {/* Centered Brain Composition + Orbs */}
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="relative mb-[-450px]" style={{ width: 1200, height: 1200 }}>
          {/* Human image + neural plexus — centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
              transition: "transform 0.4s ease-out",
            }}
          >
            {/* Neural Plexus SVG — overlaid on brain area */}
            <motion.div
              className="absolute z-20 pointer-events-none"
              style={{ top: "5%", left: "5%", width: "90%", height: "90%" }}
              animate={{ y: [0, -12, 0], scale: [1, 1.015, 1] }}
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
              animate={{ y: [0, -12, 0], scale: [1, 1.015, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Orbs — equidistant around the glow edge */}
          {orbs.map((orb, i) => {
            const angle = orbAngles[i] * (Math.PI / 180);
            const cx = 600 + Math.cos(angle) * orbRadius;
            const cy = 600 + Math.sin(angle) * orbRadius;
            const floatDelay = i * 0.5;

            return (
              <motion.div
                key={orb.label}
                className="absolute z-30 flex flex-col items-center"
                style={{
                  left: cx - 50,
                  top: cy - 50,
                  width: 100,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: orb.delay, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.img
                  src={orb.src}
                  alt={orb.alt}
                  className="w-[70px] lg:w-[90px] h-auto"
                  style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3))" }}
                  animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
                />
                <motion.p
                  className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground text-center mt-1 whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: orb.delay + 0.7 }}
                >
                  {orb.label}
                </motion.p>
              </motion.div>
            );
          })}
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
