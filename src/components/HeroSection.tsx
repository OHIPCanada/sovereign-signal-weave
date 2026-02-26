import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import HeroFilm from "@/components/hero/HeroFilm";

const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="hero-bg relative overflow-hidden min-h-screen">
      {/* Deep cinematic background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0B0F1A 0%, #16002A 40%, #0B0613 100%)",
        }}
      />

      {/* WebGL Particle Film */}
      <HeroFilm />

      {/* INTELLIGENCE headline — mask reveal */}
      <div className="absolute inset-0 flex items-start justify-center pt-[22vh] md:pt-[18vh] pointer-events-none select-none z-20 px-4">
        <motion.h1
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center font-bold tracking-[-0.02em]"
          style={{
            fontSize: "clamp(56px, 12vw, 190px)",
            background:
              "linear-gradient(135deg, #C084FC 0%, #D4616B 50%, #7B61FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
          }}
        >
          INTELLIGENCE
        </motion.h1>
      </div>

      {/* Subhead — monospace */}
      <div className="absolute inset-0 flex items-end justify-center pb-[6vh] pointer-events-none select-none z-20 px-4">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
          className="text-center font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase"
          style={{ color: "#BDA6FF" }}
        >
          Intelligence is not a model — It's a convergence
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
