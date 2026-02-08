import { motion } from "framer-motion";
import { useMouseFollow } from "@/hooks/useMouseFollow";
import neuralProfile from "@/assets/neural-profile.png";
import aiCortexOrb from "@/assets/ai-cortex-orb-new.png";
import clinicOsOrb from "@/assets/clinic-os-orb-new.png";
import virtualCareOrb from "@/assets/virtual-care-orb.png";
import sovereignDataOrb from "@/assets/sovereign-data-orb.png";
import auditIntegrityOrb from "@/assets/audit-integrity-orb.png";
import NeuralPlexus from "@/components/hero/NeuralPlexus";

/* ─── Orb data ─── */
const orbs = [
  { id: "ai-cortex", src: aiCortexOrb, alt: "AI Cortex", label: "AI CORTEX", tagline: "Thought, amplified", top: "30%", left: "73%", delay: 1.8, floatDelay: 0, cx: 73, cy: 32 },
  { id: "sovereign-data", src: sovereignDataOrb, alt: "Sovereign Data", label: "SOVEREIGN DATA", tagline: "Trust, embedded", top: "42%", left: "80%", delay: 2.0, floatDelay: 0.7, cx: 80, cy: 44 },
  { id: "virtual-care", src: virtualCareOrb, alt: "Virtual Care", label: "VIRTUAL CARE", tagline: "Connection, redefined", top: "53%", left: "84%", delay: 2.4, floatDelay: 1, cx: 84, cy: 55 },
  { id: "audit-integrity", src: auditIntegrityOrb, alt: "Audit Integrity", label: "AUDIT INTEGRITY", tagline: "Compliance, assured", top: "64%", left: "80%", delay: 2.5, floatDelay: 1.3, cx: 80, cy: 66 },
  { id: "clinic-os", src: clinicOsOrb, alt: "Clinic OS", label: "CLINIC OS", tagline: "Operations, orchestrated", top: "76%", left: "73%", delay: 2.8, floatDelay: 0.5, cx: 73, cy: 78 },
] as const;

/* Brain center & trunk midpoint in % coordinates (viewBox 0 0 100 100) */
const BRAIN = { x: 33, y: 45 };
const TRUNK_MID = { x: 55, y: 47 };

const HeroSection = () => {
  const { x: mouseX, y: mouseY } = useMouseFollow();
  const rotateY = (mouseX - 0.5) * 5;
  const rotateX = (mouseY - 0.5) * -3;

  return (
    <section className="hero-bg min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* ═══ SINGLE COORDINATE CONTAINER ═══ */}
      <div className="relative w-full aspect-[16/9] max-h-screen">

        {/* Layer 1 — INTELLIGENCE headline */}
        <div className="absolute inset-0 flex items-start justify-center pt-[12%] pointer-events-none select-none z-[1]">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hero-title text-center text-[clamp(110px,16vw,200px)]"
          >
            INTELLIGENCE
          </motion.h1>
        </div>

        {/* Layer 2 — Neural Profile (head) */}
        <div className="absolute z-10" style={{ top: "10%", left: "2%", width: "65%", height: "90%" }}>
          <motion.div
            className="relative w-full h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
              transition: "transform 0.4s ease-out",
            }}
          >
            {/* Neural Plexus overlay */}
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
              style={{ marginTop: "-10%", marginLeft: "-5%" }}
              animate={{ y: [0, -20, 0], scale: [1, 1.025, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <NeuralPlexus mouseX={mouseX} mouseY={mouseY} />
            </motion.div>

            {/* Profile image */}
            <motion.img
              src={neuralProfile}
              alt="Neural Intelligence Profile"
              className="w-full h-full object-contain relative z-10"
              style={{
                filter: "drop-shadow(0 0 120px rgba(123, 97, 255, 0.35)) drop-shadow(0 0 200px rgba(180, 160, 230, 0.3)) drop-shadow(0 0 80px rgba(230, 230, 250, 0.25))",
              }}
              animate={{ y: [0, -20, 0], scale: [1, 1.025, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Layer 3 — SVG connector lines (same coordinate system as orbs) */}
        <svg
          className="hidden md:block absolute inset-0 w-full h-full z-[5] pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="synapse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.9)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.7)" />
            </linearGradient>
            <filter id="dot-glow">
              <feGaussianBlur stdDeviation="0.8" />
            </filter>
            <filter id="line-glow">
              <feGaussianBlur stdDeviation="0.6" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.25" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Trunk from brain center to fan-out midpoint */}
          <motion.path
            d={`M ${BRAIN.x},${BRAIN.y} Q ${(BRAIN.x + TRUNK_MID.x) / 2},${BRAIN.y + 1} ${TRUNK_MID.x},${TRUNK_MID.y}`}
            fill="none"
            stroke="url(#synapse-gradient)"
            strokeWidth="0.45"
            strokeLinecap="round"
            filter="url(#line-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.5, ease: "easeInOut" }}
          />

          {/* Branches to each orb */}
          {orbs.map((orb) => {
            const qx = (TRUNK_MID.x + orb.cx) / 2;
            const qy = (TRUNK_MID.y + orb.cy) / 2 + (orb.cy > TRUNK_MID.y ? 2 : -2);
            const branchPath = `M ${TRUNK_MID.x},${TRUNK_MID.y} Q ${qx},${qy} ${orb.cx},${orb.cy}`;
            const fullPath = `M ${BRAIN.x},${BRAIN.y} Q ${(BRAIN.x + TRUNK_MID.x) / 2},${BRAIN.y + 1} ${TRUNK_MID.x},${TRUNK_MID.y} Q ${qx},${qy} ${orb.cx},${orb.cy}`;
            return (
              <g key={orb.id}>
                <motion.path
                  d={branchPath}
                  fill="none"
                  stroke="url(#synapse-gradient)"
                  strokeWidth="0.3"
                  strokeLinecap="round"
                  filter="url(#line-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 2.7, ease: "easeInOut" }}
                />
                <circle r="0.5" fill="rgba(255, 255, 255, 1)" filter="url(#dot-glow)">
                  <animateMotion dur="5s" repeatCount="indefinite" path={fullPath} />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Layer 4 — Capability Orbs */}
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="hidden md:block absolute z-20"
            style={{ top: orb.top, left: orb.left, transform: "translate(-50%, -50%)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: orb.delay, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src={orb.src}
              alt={orb.alt}
              className="w-[100px] lg:w-[120px] h-auto"
              style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3)) drop-shadow(0 0 60px rgba(46, 230, 214, 0.2))" }}
              animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: orb.floatDelay }}
            />
            <motion.div className="text-center -mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: orb.delay + 0.7 }}>
              <p className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">{orb.label}</p>
              <p className="text-xs font-normal tracking-wide text-foreground/60 mt-0.5">{orb.tagline}</p>
            </motion.div>
          </motion.div>
        ))}

        {/* Narrative sentence — bottom-left of container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="absolute bottom-[8%] left-[4%] pointer-events-none z-20"
        >
          <p className="hero-subhead max-w-md">
            Sovereign AI infrastructure for healthcare systems
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
