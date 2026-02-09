import { motion } from "framer-motion";
import { useMouseFollow } from "@/hooks/useMouseFollow";
import { useIsMobile } from "@/hooks/use-mobile";
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

const orbAngles = [180, 225, 270, 315, 0];

const HeroSection = () => {
  const { x: mouseX, y: mouseY } = useMouseFollow();
  const isMobile = useIsMobile();

  const rotateY = (mouseX - 0.5) * 5;
  const rotateX = (mouseY - 0.5) * -3;

  // Responsive dimensions
  const containerSize = isMobile ? 380 : 1200;
  const center = containerSize / 2;
  const orbRadiiSet = isMobile ? [155, 155, 155, 135, 135] : [450, 450, 450, 370, 370];
  const bottomMargin = isMobile ? -100 : -320;
  const orbImgSize = isMobile ? "w-[32px]" : "w-[70px] lg:w-[90px]";
  const orbContainerWidth = isMobile ? 55 : 100;

  return (
    <section className="hero-bg min-h-[50vh] md:min-h-screen relative overflow-hidden">
      {/* INTELLIGENCE - Large Background Text */}
      <div className="absolute inset-0 flex items-start justify-center pt-[88px] md:pt-24 lg:pt-32 pointer-events-none select-none overflow-hidden px-3 md:px-0">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-title text-center text-[clamp(38px,12vw,260px)] md:text-[clamp(140px,20vw,260px)] w-full"
        >
          INTELLIGENCE
        </motion.h1>
      </div>

      {/* Centered Brain Composition + Orbs */}
      <div className="absolute inset-0 flex items-end justify-center">
        <div
          className="relative"
          style={{ width: containerSize, height: containerSize, marginBottom: bottomMargin }}
        >
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
              style={isMobile
                ? { top: "-8%", left: "18%", width: "65%", height: "65%" }
                : { top: "15%", left: "20%", width: "70%", height: "70%" }
              }
              animate={{ y: [0, -12, 0], scale: [1, 1.015, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <NeuralPlexus mouseX={mouseX} mouseY={mouseY} />
            </motion.div>

            {/* Human profile image */}
            <motion.img
              src={neuralProfile}
              alt="Neural Intelligence Profile"
              className={isMobile ? "w-[320px] h-auto relative z-10" : "w-[900px] md:w-[1200px] lg:w-[1600px] h-auto relative z-10"}
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
            const r = orbRadiiSet[i];
            const cx = center + Math.cos(angle) * r;
            const cy = center + Math.sin(angle) * r;
            const floatDelay = i * 0.5;

            return (
              <motion.div
                key={orb.label}
                className="absolute z-30 flex flex-col items-center"
                style={{
                  left: cx - orbContainerWidth / 2,
                  top: cy - orbContainerWidth / 2,
                  width: orbContainerWidth,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: orb.delay, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.img
                  src={orb.src}
                  alt={orb.alt}
                  className={`${orbImgSize} h-auto`}
                  style={{ filter: "drop-shadow(0 0 30px rgba(123, 97, 255, 0.3))" }}
                  animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
                />
                <motion.p
                  className={`${isMobile ? "text-[8px]" : "text-[10px]"} font-bold tracking-[0.15em] uppercase text-foreground text-center mt-1 whitespace-nowrap`}
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

    </section>
  );
};

export default HeroSection;
