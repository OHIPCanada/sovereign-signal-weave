import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import AINetworkHub from "@/components/hero/AINetworkHub";

const HeroSection = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <section className="hero-bg relative overflow-hidden min-h-[100svh] flex flex-col items-center justify-start pt-[72px]">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hero-title text-center text-[clamp(42px,14vw,80px)] w-full px-4 pointer-events-none select-none"
        >
          INTELLIGENCE
        </motion.h1>

        {/* AI Network Hub — fills remaining space */}
        <div className="flex-1 flex items-center justify-center w-full px-4 -mt-4">
          <AINetworkHub size="mobile" />
        </div>
      </section>
    );
  }

  // ─── DESKTOP LAYOUT ───
  return (
    <section className="hero-bg relative overflow-hidden min-h-screen">
      {/* INTELLIGENCE title */}
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

      {/* AI Network Hub — centered */}
      <div className="absolute inset-0 flex items-center justify-center pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <AINetworkHub size="desktop" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
