import { motion } from "framer-motion";
import heroBrain from "@/assets/hero-brain.png";
import heroBackground from "@/assets/hero-background-clean.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Premium Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroBackground})`,
        }}
      />
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10" />

      {/* INTELLIGENCE - Large Background Text */}
      <div className="absolute inset-0 flex items-start justify-center pt-20 md:pt-24 lg:pt-28 pointer-events-none select-none overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="super-graphic text-center"
        >
          INTELLIGENCE
        </motion.h1>
      </div>

      {/* Central Brain Image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <motion.img
            src={heroBrain}
            alt="AI Brain - Clinical Systems and Virtual Care"
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[320px] md:w-[480px] lg:w-[600px] xl:w-[700px] h-auto"
            style={{
              filter: "drop-shadow(0 30px 60px rgba(100, 80, 150, 0.3))",
            }}
          />
        </motion.div>
      </div>

      {/* Floating Labels */}
      {/* AI Cortex - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute top-[35%] right-[8%] md:right-[12%] lg:right-[18%] pointer-events-none"
      >
        <div className="floating-label">
          <span className="floating-label-text">AI Cortex</span>
        </div>
      </motion.div>

      {/* Clinical Systems - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="absolute bottom-[32%] left-[5%] md:left-[10%] lg:left-[15%] pointer-events-none"
      >
        <div className="floating-label">
          <span className="floating-label-text">Clinical Systems</span>
        </div>
      </motion.div>

      {/* Virtual Care & Patient Access - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-[22%] right-[5%] md:right-[8%] lg:right-[12%] pointer-events-none"
      >
        <div className="floating-label text-right">
          <span className="floating-label-text block">Virtual Care</span>
          <span className="floating-label-subtext">& Patient Access</span>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
