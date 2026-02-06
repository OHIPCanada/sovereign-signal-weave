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
            {/* Wide ambient brain glow - lavender/coral cycle */}
            <motion.div
              className="absolute pointer-events-none z-0"
              style={{
                top: "5%",
                left: "20%",
                width: "45%",
                height: "32%",
                borderRadius: "50%",
                mixBlendMode: "screen",
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [0.95, 1.1, 0.95],
                background: [
                  "radial-gradient(ellipse at center, rgba(200, 170, 255, 0.7) 0%, rgba(160, 130, 255, 0.4) 30%, rgba(230, 230, 250, 0.2) 55%, transparent 80%)",
                  "radial-gradient(ellipse at center, rgba(229, 115, 111, 0.6) 0%, rgba(227, 154, 150, 0.35) 30%, rgba(235, 198, 196, 0.18) 55%, transparent 80%)",
                  "radial-gradient(ellipse at center, rgba(200, 170, 255, 0.7) 0%, rgba(160, 130, 255, 0.4) 30%, rgba(230, 230, 250, 0.2) 55%, transparent 80%)",
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Hot brain core - intense with color shift */}
            <motion.div
              className="absolute pointer-events-none z-0"
              style={{
                top: "9%",
                left: "28%",
                width: "28%",
                height: "20%",
                borderRadius: "50%",
                mixBlendMode: "screen",
              }}
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [0.97, 1.15, 0.97],
                background: [
                  "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.8) 0%, rgba(220, 180, 255, 0.7) 20%, rgba(180, 140, 255, 0.5) 40%, rgba(123, 97, 255, 0.3) 60%, transparent 80%)",
                  "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.8) 0%, rgba(229, 155, 150, 0.65) 20%, rgba(229, 115, 111, 0.4) 40%, rgba(200, 100, 95, 0.25) 60%, transparent 80%)",
                  "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.8) 0%, rgba(220, 180, 255, 0.7) 20%, rgba(180, 140, 255, 0.5) 40%, rgba(123, 97, 255, 0.3) 60%, transparent 80%)",
                ]
              }}
              transition={{ duration: 4, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Tight white-hot nucleus */}
            <motion.div
              className="absolute pointer-events-none z-0"
              style={{
                top: "13%",
                left: "33%",
                width: "16%",
                height: "12%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(230, 200, 255, 0.7) 30%, rgba(180, 150, 255, 0.4) 55%, transparent 75%)",
                mixBlendMode: "screen",
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2.5, delay: 0.7, repeat: Infinity, ease: "easeInOut" }}
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
