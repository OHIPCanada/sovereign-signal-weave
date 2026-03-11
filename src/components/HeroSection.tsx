import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import AINetworkHub from "@/components/hero/AINetworkHub";

const HeroSection = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <section className="hero-bg relative overflow-hidden min-h-[100svh] flex flex-col items-center justify-start pt-[72px]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hero-title text-center text-[clamp(42px,14vw,80px)] w-full px-4 pointer-events-none select-none"
        >
          INTELLIGENCE
        </motion.h1>

        <div className="flex-1 flex items-center justify-center w-full px-2 -mt-4">
          <AINetworkHub size="mobile" />
        </div>
      </section>
    );
  }

  return (
    <section className="hero-bg relative overflow-hidden min-h-screen flex flex-col">
      {/* INTELLIGENCE title */}
      <div className="flex items-start justify-center pt-24 lg:pt-28 pointer-events-none select-none">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-title text-center text-[clamp(100px,14vw,200px)] w-full"
        >
          INTELLIGENCE
        </motion.h1>
      </div>

      {/* Pipeline — centered in remaining space */}
      <div className="flex-1 flex items-center justify-center px-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[1300px]"
        >
          <AINetworkHub size="desktop" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
