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
      <div className="absolute inset-0 flex items-center justify-center pt-64 md:pt-80 lg:pt-96">
        <div className="relative flex items-center gap-4 md:gap-8 lg:gap-12">
          {/* Neural Profile Image */}
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
            {/* Internal brain glow - positioned at brain area */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                top: "12%",
                left: "30%",
                width: "40%",
                height: "30%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse at center, rgba(123, 97, 255, 0.45) 0%, rgba(180, 140, 255, 0.25) 35%, rgba(230, 230, 250, 0.12) 60%, transparent 85%)",
                mixBlendMode: "screen",
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [0.95, 1.08, 0.95],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Secondary deeper glow core */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                top: "16%",
                left: "36%",
                width: "25%",
                height: "18%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse at center, rgba(123, 97, 255, 0.6) 0%, rgba(160, 130, 255, 0.3) 40%, transparent 75%)",
                mixBlendMode: "screen",
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.12, 1],
              }}
              transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
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
                filter: [
                  "drop-shadow(0 0 120px rgba(123, 97, 255, 0.35)) drop-shadow(0 0 200px rgba(180, 160, 230, 0.3)) drop-shadow(0 0 80px rgba(230, 230, 250, 0.25))",
                  "drop-shadow(0 0 160px rgba(123, 97, 255, 0.5)) drop-shadow(0 0 250px rgba(180, 160, 230, 0.45)) drop-shadow(0 0 120px rgba(230, 230, 250, 0.35))",
                  "drop-shadow(0 0 120px rgba(123, 97, 255, 0.35)) drop-shadow(0 0 200px rgba(180, 160, 230, 0.3)) drop-shadow(0 0 80px rgba(230, 230, 250, 0.25))",
                ],
              }}
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
