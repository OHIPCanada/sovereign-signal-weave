import { motion } from "framer-motion";
import { useMouseFollow } from "@/hooks/useMouseFollow";
import neuralProfile from "@/assets/neural-profile.png";
import HexHUD from "@/components/hero/HexHUD";

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

      {/* Main Composition: Neural Profile Image + HUD */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center gap-4 md:gap-8 lg:gap-12">
          {/* Neural Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
              transition: "transform 0.4s ease-out",
            }}
          >
            <motion.img
              src={neuralProfile}
              alt="Neural Intelligence Profile"
              className="w-[420px] md:w-[520px] lg:w-[620px] h-auto drop-shadow-[0_0_80px_rgba(123,97,255,0.15)]"
              animate={{ y: [0, -12, 0], scale: [1, 1.015, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Services HUD - Hexagon Stack */}
          <div className="hidden md:block">
            <HexHUD mouseX={mouseX} mouseY={mouseY} />
          </div>
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
