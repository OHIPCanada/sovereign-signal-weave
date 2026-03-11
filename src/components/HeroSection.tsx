import { motion } from "framer-motion";
import { useMouseFollow } from "@/hooks/useMouseFollow";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import neuralProfile from "@/assets/neural-profile.png";
import aiCortexOrb from "@/assets/ai-cortex-orb-new.png";
import clinicOsOrb from "@/assets/clinic-os-orb-new.png";
import virtualCareOrb from "@/assets/virtual-care-orb.png";
import sovereignDataOrb from "@/assets/sovereign-data-orb.png";
import auditIntegrityOrb from "@/assets/audit-integrity-orb.png";
import NeuralPlexus from "@/components/hero/NeuralPlexus";
import MobileNeuralProfile from "@/components/hero/MobileNeuralProfile";

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
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotateY = (mouseX - 0.5) * 5;
  const rotateX = (mouseY - 0.5) * -3;

  // ─── MOBILE LAYOUT ───
  if (isMobile) {
    return (
      <section className="hero-bg relative overflow-hidden min-h-[100svh] flex flex-col items-center justify-start pt-[80px]">
        {/* INTELLIGENCE title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hero-title text-center text-[clamp(42px,14vw,80px)] w-full px-4 pointer-events-none select-none"
        >
          INTELLIGENCE
        </motion.h1>

        {/* SVG Neural Profile — fills space below title */}
        <div className="flex-1 flex items-center justify-center w-full -mt-2">
          <div className="relative">
            <MobileNeuralProfile />

            {/* Orbs arranged around the SVG profile */}
            {orbs.map((orb, i) => {
              // Position orbs in a semicircle below and around the profile
              const positions = [
                { x: -20, y: 30 },   // AI Cortex — left
                { x: -10, y: 65 },   // Sovereign Data — bottom-left
                { x: 50, y: -5 },    // Virtual Care — top center
                { x: 110, y: 65 },   // Audit Integrity — bottom-right
                { x: 120, y: 30 },   // Clinic OS — right
              ];
              const pos = positions[i];

              return (
                <motion.div
                  key={orb.label}
                  className="absolute z-30 flex flex-col items-center"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: orb.delay, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.img
                    src={orb.src}
                    alt={orb.alt}
                    className="w-[34px] h-auto"
                    style={{ filter: "drop-shadow(0 0 20px rgba(123, 97, 255, 0.3))" }}
                    animate={{ y: [0, -5, 0], scale: [1, 1.03, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  />
                  <motion.p
                    className="text-[8px] font-bold tracking-[0.12em] uppercase text-foreground text-center mt-1 whitespace-nowrap leading-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: orb.delay + 0.6 }}
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
  }

  // ─── DESKTOP / TABLET LAYOUT ───
  const containerSize = isTablet ? 850 : 1200;
  const center = containerSize / 2;
  const orbRadiiSet = isTablet ? [340, 340, 340, 280, 280] : [450, 450, 450, 370, 370];
  const bottomMargin = isTablet ? -240 : -320;
  const orbImgSize = isTablet ? "w-[60px]" : "w-[70px] lg:w-[90px]";
  const orbContainerWidth = isTablet ? 90 : 100;

  return (
    <section className={`hero-bg relative overflow-hidden ${isTablet ? 'min-h-[80vh]' : 'min-h-screen'}`}>
      {/* INTELLIGENCE - Large Background Text */}
      <div className="absolute inset-0 flex items-start justify-center pt-24 lg:pt-32 pointer-events-none select-none overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-title text-center text-[clamp(140px,20vw,260px)] w-full"
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
          {/* Human image + neural plexus */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
            transition={{
              opacity: { duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
              transition: "transform 0.4s ease-out",
            }}
          >
            <div
              className="absolute z-20 pointer-events-none"
              style={{ top: "15%", left: "20%", width: "70%", height: "70%" }}
            >
              <NeuralPlexus mouseX={mouseX} mouseY={mouseY} />
            </div>

            <motion.img
              src={neuralProfile}
              alt="Neural Intelligence Profile"
              className={isTablet ? "w-[750px] h-auto relative z-10" : "w-[900px] md:w-[1200px] lg:w-[1600px] h-auto relative z-10"}
              style={{
                filter: "drop-shadow(0 0 120px rgba(123, 97, 255, 0.35)) drop-shadow(0 0 200px rgba(180, 160, 230, 0.3)) drop-shadow(0 0 80px rgba(230, 230, 250, 0.25))",
              }}
            />
          </motion.div>

          {/* Orbs */}
          {orbs.map((orb, i) => {
            const angle = orbAngles[i] * (Math.PI / 180);
            const r = orbRadiiSet[i];
            const cx = center + Math.cos(angle) * r;
            const cy = center + Math.sin(angle) * r;

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
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                />
                <motion.p
                  className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground text-center mt-1 whitespace-nowrap leading-tight"
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
